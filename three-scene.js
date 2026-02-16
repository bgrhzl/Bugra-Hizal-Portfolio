import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

function fitRenderer(renderer, camera, element) {
  const { clientWidth, clientHeight } = element;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

function createCommonScene(canvas, host) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 2, 8);
  const renderer = createRenderer(canvas);

  const hemi = new THREE.HemisphereLight(0xaec7ff, 0x0d1733, 0.9);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(3, 5, 6);
  scene.add(key);

  return { scene, camera, renderer, host };
}

function initLaptopScene() {
  const host = document.getElementById('laptopStage');
  const canvas = document.getElementById('threeCanvas');
  const terminal = document.getElementById('laptopTerminal');
  if (!host || !canvas) return null;

  const ctx = createCommonScene(canvas, host);
  const { scene, camera, renderer } = ctx;
  camera.position.set(0, 2.1, 8);

  const rimLight = new THREE.PointLight(0x53c4ff, 2.4, 30, 2);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  const laptop = new THREE.Group();
  scene.add(laptop);

  const shellMat = new THREE.MeshStandardMaterial({ color: 0x6b748a, metalness: 0.85, roughness: 0.25 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172b, metalness: 0.45, roughness: 0.6 });
  const emissiveMat = new THREE.MeshStandardMaterial({
    color: 0x162347,
    emissive: 0x396dff,
    emissiveIntensity: 0.35,
    metalness: 0.2,
    roughness: 0.55,
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.32, 3.7), shellMat);
  laptop.add(base);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.03, 2.6), darkMat);
  keyboard.position.set(0, 0.18, -0.2);
  laptop.add(keyboard);

  const trackpad = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.025, 1), darkMat);
  trackpad.position.set(0, 0.18, 1.1);
  laptop.add(trackpad);

  const hinge = new THREE.Group();
  hinge.position.set(0, 0.17, -1.83);
  laptop.add(hinge);

  const lid = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.6, 0.2), shellMat);
  lid.position.set(0, 1.8, 0);
  hinge.add(lid);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.05), emissiveMat);
  screen.position.set(0, 1.8, 0.108);
  hinge.add(screen);

  const floaters = new THREE.Group();
  scene.add(floaters);

  for (let i = 0; i < 12; i += 1) {
    const geo = i % 2 === 0 ? new THREE.IcosahedronGeometry(0.07, 0) : new THREE.TorusGeometry(0.06, 0.02, 10, 18);
    const mat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x59a6ff : 0x6fe8c8,
      emissive: 0x1e3f9a,
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.6,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.set((Math.random() - 0.5) * 8, 0.4 + Math.random() * 3.2, (Math.random() - 0.5) * 5);
    m.userData.speed = 0.3 + Math.random() * 0.9;
    m.userData.phase = Math.random() * Math.PI * 2;
    floaters.add(m);
  }

  const lines = [
    '> three.js module loaded',
    '> Initializing 3D laptop showcase...',
    '> Candidate: Bugra Hizal',
    '> Location: Vancouver, Canada',
    '> Focus: Full-Stack, Automation, Trading Systems',
    '> Status: Open to Co-op Software Developer role',
  ];
  const fullText = lines.join('\n');

  const getProgress = () => {
    const rect = host.getBoundingClientRect();
    const viewport = window.innerHeight;
    const start = viewport * 0.9;
    const end = viewport * 0.2;
    const raw = (start - rect.top) / (start - end);
    return Math.max(0, Math.min(1, raw));
  };

  ctx.onScroll = () => {
    const progress = getProgress();
    hinge.rotation.x = -1.95 + progress * 1.55;
    laptop.rotation.y = -0.35 + progress * 0.6;
    laptop.position.y = -0.35 + progress * 0.4;

    if (terminal) {
      const count = Math.floor(fullText.length * progress);
      terminal.textContent = fullText.slice(0, count);
    }
  };

  ctx.animate = (t) => {
    floaters.children.forEach((item, index) => {
      const speed = item.userData.speed;
      const phase = item.userData.phase;
      item.position.y += Math.sin(t * speed + phase) * 0.0014;
      item.rotation.x += 0.006 + index * 0.00007;
      item.rotation.y += 0.009 + index * 0.00008;
    });

    screen.material.emissiveIntensity = 0.22 + Math.sin(t * 2.2) * 0.12;
    renderer.render(scene, camera);
  };

  return ctx;
}

function initCoreScene() {
  const host = document.getElementById('coreCanvas');
  if (!host) return null;

  const ctx = createCommonScene(host, host);
  const { scene, camera, renderer } = ctx;
  camera.position.set(0, 1.8, 7);

  const core = new THREE.Group();
  scene.add(core);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.1, 0.28, 220, 30),
    new THREE.MeshStandardMaterial({ color: 0x6e8fff, emissive: 0x243f8f, emissiveIntensity: 0.4, metalness: 0.65, roughness: 0.25 })
  );
  core.add(knot);

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2, 1),
    new THREE.MeshBasicMaterial({ color: 0x59d8bf, wireframe: true, transparent: true, opacity: 0.28 })
  );
  core.add(shell);

  ctx.animate = (t) => {
    knot.rotation.x += 0.008;
    knot.rotation.y += 0.01;
    shell.rotation.y -= 0.002;
    shell.rotation.x += 0.0012;
    core.position.y = Math.sin(t * 1.8) * 0.18;
    renderer.render(scene, camera);
  };

  return ctx;
}

function initNetworkScene() {
  const host = document.getElementById('networkCanvas');
  if (!host) return null;

  const ctx = createCommonScene(host, host);
  const { scene, camera, renderer } = ctx;
  camera.position.set(0, 1.6, 7.5);

  const globe = new THREE.Group();
  scene.add(globe);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.85, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x6fa0ff, wireframe: true, transparent: true, opacity: 0.3 })
  );
  globe.add(sphere);

  const nodes = [];
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x6ff2cf, emissive: 0x1a7a64, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.45 });
  const nodeGeo = new THREE.SphereGeometry(0.07, 12, 12);

  for (let i = 0; i < 28; i += 1) {
    const phi = Math.acos(1 - 2 * Math.random());
    const theta = 2 * Math.PI * Math.random();
    const r = 1.85;
    const n = new THREE.Mesh(nodeGeo, nodeMat);
    n.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    n.userData.phase = Math.random() * Math.PI * 2;
    globe.add(n);
    nodes.push(n);
  }

  const lineMat = new THREE.LineBasicMaterial({ color: 0x6f8fff, transparent: true, opacity: 0.3 });
  const linePoints = [];
  for (let i = 0; i < nodes.length - 1; i += 3) {
    linePoints.push(nodes[i].position, nodes[(i + 5) % nodes.length].position);
  }
  const lines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(linePoints), lineMat);
  globe.add(lines);

  ctx.animate = (t) => {
    globe.rotation.y += 0.0035;
    globe.rotation.x = Math.sin(t * 0.6) * 0.16;
    nodes.forEach((n) => {
      n.material.emissiveIntensity = 0.35 + Math.sin(t * 2.8 + n.userData.phase) * 0.2;
    });
    renderer.render(scene, camera);
  };

  return ctx;
}

const scenes = [initLaptopScene(), initCoreScene(), initNetworkScene()].filter(Boolean);

if (scenes.length) {
  const clock = new THREE.Clock();

  const updateAllScroll = () => {
    scenes.forEach((s) => {
      if (s.onScroll) s.onScroll();
    });
  };

  const resizeAll = () => {
    scenes.forEach((s) => fitRenderer(s.renderer, s.camera, s.host));
    updateAllScroll();
  };

  window.addEventListener('scroll', updateAllScroll, { passive: true });
  window.addEventListener('resize', resizeAll);

  const animate = () => {
    const t = clock.getElapsedTime();
    scenes.forEach((s) => s.animate(t));
    requestAnimationFrame(animate);
  };

  resizeAll();
  animate();
}
