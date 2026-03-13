import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SPHERE_RADIUS = 12;
const AVOIDANCE_DISTANCE = 4;
const AVOIDANCE_FACTOR = -0.3;
const LERP_SPEED = 0.02;

const PALETTE = [
  new THREE.Color(0x0A2540),
  new THREE.Color(0x0A2540),
  new THREE.Color(0x0A2540),
  new THREE.Color(0x0A2540),
  new THREE.Color(0x0A2540),
  new THREE.Color(0xee703d),
  new THREE.Color(0xee703d),
  new THREE.Color(0x8530d1),
  new THREE.Color(0xcc7cab),
];
const LINE_COLOR = new THREE.Color(0x0A2540);

interface Dot {
  mesh: THREE.Mesh;
  pivot: THREE.Group;
  isAvoiding: boolean;
  lerpFactor: number;
  targetPos: THREE.Vector3;
}

function createDot(pivot: THREE.Group, size: number, opacity: number): Dot {
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  const geometry = new THREE.CircleGeometry(size, 6);
  const mesh = new THREE.Mesh(geometry, material);
  return { mesh, pivot, isAvoiding: false, lerpFactor: 0, targetPos: new THREE.Vector3() };
}

function avoidMouse(dot: Dot, mousePos: THREE.Vector3): void {
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

function controlMovement(dot: Dot): void {
  dot.mesh.position.lerp(dot.targetPos, dot.lerpFactor);
  if (dot.lerpFactor < 1) dot.lerpFactor += LERP_SPEED;
}

export function ParticleSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frameId: number;
    let initialized = false;
    let ro: ResizeObserver | null = null;
    const cleanupFns: Array<() => void> = [];

    const init = (w: number, h: number) => {
      if (initialized || w === 0 || h === 0) return;
      initialized = true;

      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      renderer.setClearColor(0xFAFAFA, 1);
      const canvas = renderer.domElement;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      container.appendChild(canvas);

      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
      camera.position.z = 32;

      const dots: Dot[] = [];
      const pivotsGroup = new THREE.Group();
      const PARTICLE_COUNT = 3500;

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

      for (let i = 0; i < 800; i++) {
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

      scene.add(pivotsGroup);

      const linesMaterial = new THREE.LineBasicMaterial({
        color: LINE_COLOR, transparent: true, opacity: 0.08,
      });
      const lineSegments: number[] = [];
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
      scene.add(lines);

      let cursorPos = new THREE.Vector3(9999, 9999, 0);
      const worldPos = new THREE.Vector3();

      const onMouseMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        cursorPos = camera.position.clone().add(dir.multiplyScalar(distance));
      };

      const onTouchMove = (event: TouchEvent) => {
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

      const onMouseLeave = () => {
        cursorPos = new THREE.Vector3(9999, 9999, 0);
      };

      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('touchmove', onTouchMove, { passive: true });
      container.addEventListener('mouseleave', onMouseLeave);

      let autoRotY = 0;

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        autoRotY += 0.0003;
        pivotsGroup.rotation.y = autoRotY;
        pivotsGroup.rotation.x = Math.sin(autoRotY * 0.4) * 0.1;

        for (const dot of dots) {
          avoidMouse(dot, cursorPos);
          controlMovement(dot);
          dot.mesh.lookAt(camera.position);
        }

        const posArray = linesGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < lineSegments.length; i += 2) {
          const idxA = lineSegments[i];
          const idxB = lineSegments[i + 1];
          surfaceDots[idxA].mesh.getWorldPosition(worldPos);
          posArray[i * 3] = worldPos.x;
          posArray[i * 3 + 1] = worldPos.y;
          posArray[i * 3 + 2] = worldPos.z;
          surfaceDots[idxB].mesh.getWorldPosition(worldPos);
          posArray[(i + 1) * 3] = worldPos.x;
          posArray[(i + 1) * 3 + 1] = worldPos.y;
          posArray[(i + 1) * 3 + 2] = worldPos.z;
        }
        linesGeometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      };

      animate();

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
      ro = new ResizeObserver(() => {
        if (tryInit()) ro?.disconnect();
      });
      ro.observe(container);
    }

    return () => {
      ro?.disconnect();
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
    />
  );
}
