/* eslint-disable react-hooks/purity */
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLSupported } from '../utils/webgl';

const SPHERE_RADIUS = 9.6;
const AVOIDANCE_DISTANCE = 4;
const AVOIDANCE_FACTOR = -0.3;
const LERP_SPEED = 0.02;

const PALETTE = [
  new THREE.Color(0x000000), // Black
  new THREE.Color(0x000000),
  new THREE.Color(0x000000),
  new THREE.Color(0x9CE069), // Lime
  new THREE.Color(0x9CE069),
  new THREE.Color(0x595959), // Muted Dark
];
const LINE_COLOR = new THREE.Color(0x000000);

function createDot(pivot, size, opacity) {
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  const geometry = new THREE.CircleGeometry(size, 6);
  const mesh = new THREE.Mesh(geometry, material);
  return { mesh, pivot, isAvoiding: false, lerpFactor: 0, targetPos: new THREE.Vector3() };
}

function avoidMouse(dot, mousePos) {
  const pivotGlobalPos = new THREE.Vector3();
  dot.pivot.getWorldPosition(pivotGlobalPos);
  pivotGlobalPos.setZ(0);
  const mouseFlat = new THREE.Vector3(mousePos.x, mousePos.y, 0);
  const distance = pivotGlobalPos.distanceTo(mouseFlat);
  if (distance < AVOIDANCE_DISTANCE) {
    const dir = new THREE.Vector3(
      pivotGlobalPos.x - mousePos.x,
      pivotGlobalPos.y - mousePos.y,
      pivotGlobalPos.z
    ).normalize();
    dot.targetPos.x = dir.x * AVOIDANCE_FACTOR;
    dot.targetPos.y = dir.y * AVOIDANCE_FACTOR;
    if (!dot.isAvoiding) { dot.lerpFactor = 0; dot.isAvoiding = true; }
  } else {
    if (dot.isAvoiding) { dot.isAvoiding = false; dot.lerpFactor = 0; }
    dot.targetPos.set(0, 0, 0);
  }
}

function controlMovement(dot) {
  dot.mesh.position.lerp(dot.targetPos, dot.lerpFactor);
  if (dot.lerpFactor < 1) dot.lerpFactor += LERP_SPEED;
}

function HeroFallback() {
  const particles = React.useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      width: Math.random() * 12 + 6,
      height: Math.random() * 12 + 6,
      background: i % 3 === 0 ? '#9CE069' : i % 3 === 1 ? '#000000' : '#595959',
      left: `${50 + Math.random() * 45}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 15 + 15}s`,
      animationDelay: `${Math.random() * -20}s`
    }));
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at 75% 50%, #FAFAFA 0%, #F5F5F7 100%)',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {/* Subtle floating particles using CSS to maintain visual continuity */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: p.width,
            height: p.height,
            background: p.background,
            borderRadius: '50%',
            opacity: 0.08,
            left: p.left, // Cluster near the right where the sphere would be
            top: p.top,
            filter: 'blur(3px)',
            animation: `float-hero ${p.animationDuration} infinite ease-in-out`,
            animationDelay: p.animationDelay
          }}
        />
      ))}
      <style>{`
        @keyframes float-hero {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-60px) translateX(30px); }
          66% { transform: translateY(20px) translateX(-40px); }
        }
      `}</style>
    </div>
  );
}

export function HeroParticleSphere() {
  const [supported, setSupported] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setTimeout(() => setSupported(false), 0);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let frameId;
    let initialized = false;
    let ro = null;
    const cleanupFns = [];

    const init = (w, h) => {
      if (initialized || w === 0 || h === 0) return;
      initialized = true;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        if (!renderer.getContext()) { 
          renderer.dispose(); 
          setTimeout(() => setSupported(false), 0);
          return; 
        }
      } catch {
        setTimeout(() => setSupported(false), 0);
        return;
      }

      const scene = new THREE.Scene();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      renderer.setClearColor(0xE6E8DD, 1); // Sage background
      const canvas = renderer.domElement;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      container.appendChild(canvas);

      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
      camera.position.z = 32;

      const dots = [];
      const pivotsGroup = new THREE.Group();
      const PARTICLE_COUNT = 1800;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const scatter = 0.9 + Math.random() * 0.2;
        const x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta) * scatter;
        const y = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta) * scatter;
        const z = SPHERE_RADIUS * Math.cos(phi) * scatter;
        const pivot = new THREE.Group();
        pivot.position.set(x, y, z);
        const size = 0.018 + Math.random() * 0.041;
        const opacity = 0.25 + Math.random() * 0.55;
        const dot = createDot(pivot, size, opacity);
        dots.push(dot);
        pivot.add(dot.mesh);
        pivotsGroup.add(pivot);
      }

      for (let i = 0; i < 400; i++) {
        const r = Math.random() * SPHERE_RADIUS * 0.75;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        const pivot = new THREE.Group();
        pivot.position.set(x, y, z);
        const size = 0.012 + Math.random() * 0.033;
        const opacity = 0.08 + Math.random() * 0.2;
        const dot = createDot(pivot, size, opacity);
        dots.push(dot);
        pivot.add(dot.mesh);
        pivotsGroup.add(pivot);
      }

      pivotsGroup.position.x = 8;
      scene.add(pivotsGroup);

      const linesMaterial = new THREE.LineBasicMaterial({
        color: LINE_COLOR, transparent: true, opacity: 0.08,
      });
      const lineSegments = [];
      const surfaceDots = dots.slice(0, PARTICLE_COUNT);
      for (let i = 0; i < surfaceDots.length; i += 3) {
        for (let j = i + 1; j < Math.min(i + 10, surfaceDots.length); j += 3) {
          const dist = surfaceDots[i].pivot.position.distanceTo(surfaceDots[j].pivot.position);
          if (dist < 2.5) lineSegments.push(i, j);
        }
      }
      const linesGeometry = new THREE.BufferGeometry();
      const linesPositions = new Float32Array(lineSegments.length * 3);
      linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));
      const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
      pivotsGroup.add(lines);

      let cursorPos = new THREE.Vector3(9999, 9999, 0);

      const onMouseMove = (event) => {
        const rect = container.getBoundingClientRect();
        const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        cursorPos = camera.position.clone().add(dir.multiplyScalar(distance));
      };
      const onTouchMove = (event) => {
        const rect = container.getBoundingClientRect();
        const touch = event.touches[0];
        const ndcX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        cursorPos = camera.position.clone().add(dir.multiplyScalar(distance));
      };
      const onMouseLeave = () => { cursorPos = new THREE.Vector3(9999, 9999, 0); };

      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('touchmove', onTouchMove, { passive: true });
      container.addEventListener('mouseleave', onMouseLeave);

      let autoRotY = 0;
      renderer.setAnimationLoop(() => {
        autoRotY += 0.0015;
        pivotsGroup.rotation.y = autoRotY;
        pivotsGroup.rotation.x = Math.sin(autoRotY * 0.4) * 0.1;

        for (const dot of dots) {
          avoidMouse(dot, cursorPos);
          controlMovement(dot);
          dot.mesh.lookAt(camera.position);
        }

        renderer.render(scene, camera);
      });

      const onResize = () => {
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        if (cw === 0 || ch === 0) return;
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
        renderer.setSize(cw, ch);
      };
      window.addEventListener('resize', onResize);

      cleanupFns.push(() => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', onResize);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('mouseleave', onMouseLeave);
        renderer.dispose();
        if (container.contains(canvas)) container.removeChild(canvas);
      });
    };

    const tryInit = () => {
      init(container.clientWidth, container.clientHeight);
      return initialized;
    };

    if (!tryInit()) {
      ro = new ResizeObserver(() => { if (tryInit()) ro.disconnect(); });
      ro.observe(container);
    }

    return () => {
      if (ro) ro.disconnect();
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  if (!supported) return <HeroFallback />;

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
    />
  );
}
