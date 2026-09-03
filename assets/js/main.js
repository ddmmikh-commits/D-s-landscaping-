(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ */
  /* Loader                                                              */
  /* ------------------------------------------------------------------ */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (loader) loader.classList.add("loaded");
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Header scroll state + mobile nav                                   */
  /* ------------------------------------------------------------------ */
  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ------------------------------------------------------------------ */
  /* Reveal-on-scroll                                                    */
  /* ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ------------------------------------------------------------------ */
  /* 3D tilt on cards / gallery                                          */
  /* ------------------------------------------------------------------ */
  if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      var bounds;
      el.addEventListener("mouseenter", function () {
        bounds = el.getBoundingClientRect();
      });
      el.addEventListener("mousemove", function (e) {
        if (!bounds) bounds = el.getBoundingClientRect();
        var x = (e.clientX - bounds.left) / bounds.width - 0.5;
        var y = (e.clientY - bounds.top) / bounds.height - 0.5;
        el.style.transform =
          "rotateX(" + (-y * 10).toFixed(2) + "deg) rotateY(" + (x * 10).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll parallax — transform-based, layered depths                  */
  /* ------------------------------------------------------------------ */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !prefersReducedMotion) {
    var parallaxTicking = false;
    var updateParallax = function () {
      var viewportH = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        var rect = el.getBoundingClientRect();
        var centerOffset = rect.top + rect.height / 2 - viewportH / 2;
        var y = (-centerOffset * speed).toFixed(2);
        el.style.transform = "translateY(" + y + "px)";
      });
      parallaxTicking = false;
    };
    var requestParallax = function () {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    };
    document.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax);
    updateParallax();
  }

  /* ------------------------------------------------------------------ */
  /* Hero 3D scene (Three.js)                                            */
  /* ------------------------------------------------------------------ */
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var heroSection = document.querySelector(".hero");
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 3.2, 11);

  var goldColor = new THREE.Color(0xcda35b);
  var greenColor = new THREE.Color(0x4c7a5e);

  // Ambient + directional light so wireframe edges pick up subtle depth
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  var dirLight = new THREE.DirectionalLight(0xe8c07d, 0.8);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  // Undulating wireframe terrain
  var terrainSize = 40;
  var terrainSeg = 48;
  var terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSeg, terrainSeg);
  terrainGeo.rotateX(-Math.PI / 2.3);
  var terrainPos = terrainGeo.attributes.position;
  var basePositions = new Float32Array(terrainPos.array.length);
  basePositions.set(terrainPos.array);

  var terrainMat = new THREE.MeshBasicMaterial({
    color: greenColor,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  var terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.position.y = -2.4;
  terrain.position.z = -2;
  scene.add(terrain);

  // Floating particles (leaves)
  var particleCount = 220;
  var particleGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(particleCount * 3);
  var speeds = new Float32Array(particleCount);
  for (var i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = Math.random() * 14 - 3;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
    speeds[i] = 0.15 + Math.random() * 0.35;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  var particleMat = new THREE.PointsMaterial({
    color: goldColor,
    size: 0.09,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // A slowly rotating low-poly "topiary" cluster as focal geometry
  var focalGroup = new THREE.Group();
  var focalMat = new THREE.MeshStandardMaterial({
    color: greenColor,
    roughness: 0.6,
    metalness: 0.15,
    wireframe: false,
    transparent: true,
    opacity: 0.9
  });
  var focalEdgeMat = new THREE.LineBasicMaterial({ color: goldColor, transparent: true, opacity: 0.5 });
  [1.6, 1.15, 0.75].forEach(function (radius, idx) {
    var geo = new THREE.IcosahedronGeometry(radius, 0);
    var mesh = new THREE.Mesh(geo, focalMat);
    mesh.position.y = idx * 1.35;
    focalGroup.add(mesh);
    var edges = new THREE.EdgesGeometry(geo);
    var line = new THREE.LineSegments(edges, focalEdgeMat);
    line.position.y = idx * 1.35;
    focalGroup.add(line);
  });
  focalGroup.position.set(3.4, -1, -1);
  focalGroup.scale.setScalar(0.85);
  scene.add(focalGroup);

  var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener("mousemove", function (e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function resize() {
    var w = heroSection.clientWidth;
    var h = heroSection.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  var clock = new THREE.Clock();

  function animate() {
    var t = clock.getElapsedTime();

    // Terrain undulation
    var arr = terrainPos.array;
    for (var v = 0; v < arr.length; v += 3) {
      var bx = basePositions[v];
      var bz = basePositions[v + 2];
      arr[v + 1] = Math.sin(bx * 0.25 + t * 0.5) * 0.5 + Math.cos(bz * 0.2 + t * 0.4) * 0.5;
    }
    terrainPos.needsUpdate = true;

    // Particle drift
    var pArr = particleGeo.attributes.position.array;
    for (var p = 0; p < particleCount; p++) {
      pArr[p * 3 + 1] += speeds[p] * 0.01;
      if (pArr[p * 3 + 1] > 11) pArr[p * 3 + 1] = -3;
      pArr[p * 3] += Math.sin(t * 0.3 + p) * 0.002;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Focal cluster rotation
    focalGroup.rotation.y = t * 0.25;
    focalGroup.rotation.x = Math.sin(t * 0.3) * 0.08;

    // Mouse parallax on camera
    targetX += (mouseX * 0.6 - targetX) * 0.03;
    targetY += (mouseY * 0.3 - targetY) * 0.03;
    camera.position.x = targetX;
    camera.position.y = 3.2 + targetY;
    camera.lookAt(0, 0.5, 0);

    renderer.render(scene, camera);
    if (!prefersReducedMotion) requestAnimationFrame(animate);
  }

  animate();
})();
