/**
 * Modern 3D Portfolio Interactive Scripts
 * Handles Three.js 3D Background, Theme Toggling, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THREE.JS 3D BACKGROUND INITIALIZATION
  // ==========================================
  const canvas = document.getElementById('hero-3d-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create 3D Object (Abstract Icosahedron Wireframe)
    const geometry = new THREE.IcosahedronGeometry(2.5, 1);
    
    // Determine wireframe color based on theme
    const getWireframeColor = () => {
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark' || 
                          (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      return isDarkTheme ? 0x3b82f6 : 0x8b5cf6;
    };

    const material = new THREE.MeshBasicMaterial({ 
      color: getWireframeColor(), 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: getWireframeColor(),
      transparent: true,
      opacity: 0.5
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse tracking for interactive 3D rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Slowly rotate object
      sphere.rotation.y = .1 * elapsedTime;
      sphere.rotation.x = .1 * elapsedTime;
      
      particlesMesh.rotation.y = -0.05 * elapsedTime;

      // Add interactivity based on mouse
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      
      sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
      sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();

    // Handle Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Listen for Theme Change to update 3D color
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newColor = getWireframeColor();
          material.color.setHex(newColor);
          particlesMaterial.color.setHex(newColor);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  // ==========================================
  // 2. THEME TOGGLE LOGIC
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme-preference');
  const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = htmlElement.getAttribute('data-theme') === 'dark' || 
                    (!htmlElement.hasAttribute('data-theme') && darkMediaQuery.matches);
      
      const newTheme = isDark ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme-preference', newTheme);
    });
  }

  // ==========================================
  // 3. MISC INTERACTIVITY
  // ==========================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
