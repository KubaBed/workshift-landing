import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SPHERE_RADIUS = 12;
const PARTICLE_COUNT = 3500;
const REPULSION_STRENGTH = 2.5;
const LERP_SPEED = 0.03;

const NAVY = new THREE.Color(0x0A2540);
const ACCENT_COL = new THREE.Color(0xee703d);
const VIOLET = new THREE.Color(0x8530d1);
const LINE_DEFAULT = new THREE.Color(0x0A2540);
const LINE_HOVER = new THREE.Color(0xee703d);

export function ParticleSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      50, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    camera.position.z = 32;

    const group = new THREE.Group();
    scene.add(group);

    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const offsetsArr = new Float32Array(PARTICLE_COUNT * 3);
    const targetOffsetsArr = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const lerpFactors = new Float32Array(PARTICLE_COUNT);
    const avoidFlags = new Uint8Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const scatter = 0.9 + Math.random() * 0.2;
      basePositions[i * 3] = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta) * scatter;
      basePositions[i * 3 + 1] = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta) * scatter;
      basePositions[i * 3 + 2] = SPHERE_RADIUS * Math.cos(phi) * scatter;
      const r = Math.random();
      const c = r < 0.7 ? NAVY : r < 0.85 ? ACCENT_COL : VIOLET;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    currentPositions.set(basePositions);

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
    });
    group.add(new THREE.Points(pointsGeo, pointsMat));

    const lineIdx: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i += 3) {
      for (let j = i + 1; j < Math.min(i + 10, PARTICLE_COUNT); j += 3) {
        const dx = basePositions[i * 3] - basePositions[j * 3];
        const dy = basePositions[i * 3 + 1] - basePositions[j * 3 + 1];
        const dz = basePositions[i * 3 + 2] - basePositions[j * 3 + 2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2.5) lineIdx.push(i, j);
      }
    }

    const linesMat = new THREE.LineBasicMaterial({
      color: LINE_DEFAULT, transparent: true, opacity: 0.06,
    });
    const linesGeo = new THREE.BufferGeometry();
    const linesPos = new Float32Array(lineIdx.length * 3);
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linesPos, 3));
    group.add(new THREE.LineSegments(linesGeo, linesMat));

    let cursorNDC = { x: 9999, y: 9999 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      cursorNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      cursorNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const t = e.touches[0];
      cursorNDC.x = ((t.clientX - rect.left) / rect.width) * 2 - 1;
      cursorNDC.y = -((t.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onMouseLeave = () => {
      cursorNDC = { x: 9999, y: 9999 };
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave);

    let autoRotY = 0;
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      autoRotY += 0.0015;
      group.rotation.y = autoRotY;
      group.rotation.x = Math.sin(autoRotY * 0.4) * 0.1;
      group.updateMatrixWorld();

      const cDist = Math.sqrt(cursorNDC.x * cursorNDC.x + cursorNDC.y * cursorNDC.y);
      const logoHovered = cDist < 0.25;

      linesMat.color.lerp(logoHovered ? LINE_HOVER : LINE_DEFAULT, 0.05);
      linesMat.opacity += ((logoHovered ? 0.12 : 0.06) - linesMat.opacity) * 0.05;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        if (logoHovered) {
          const distFromCenter = Math.sqrt(bx * bx + by * by + bz * bz);
          const inv = 1 / (distFromCenter || 0.001);
          targetOffsetsArr[i3] = bx * inv * REPULSION_STRENGTH;
          targetOffsetsArr[i3 + 1] = by * inv * REPULSION_STRENGTH;
          targetOffsetsArr[i3 + 2] = bz * inv * REPULSION_STRENGTH;
          if (!avoidFlags[i]) { lerpFactors[i] = 0; avoidFlags[i] = 1; }
        } else {
          targetOffsetsArr[i3] = 0;
          targetOffsetsArr[i3 + 1] = 0;
          targetOffsetsArr[i3 + 2] = 0;
          if (avoidFlags[i]) { avoidFlags[i] = 0; lerpFactors[i] = 0; }
        }

        const lf = lerpFactors[i];
        offsetsArr[i3] += (targetOffsetsArr[i3] - offsetsArr[i3]) * lf;
        offsetsArr[i3 + 1] += (targetOffsetsArr[i3 + 1] - offsetsArr[i3 + 1]) * lf;
        offsetsArr[i3 + 2] += (targetOffsetsArr[i3 + 2] - offsetsArr[i3 + 2]) * lf;
        if (lf < 1) lerpFactors[i] = Math.min(lf + LERP_SPEED, 1);

        currentPositions[i3] = bx + offsetsArr[i3];
        currentPositions[i3 + 1] = by + offsetsArr[i3 + 1];
        currentPositions[i3 + 2] = bz + offsetsArr[i3 + 2];
      }
      pointsGeo.attributes.position.needsUpdate = true;

      const lp = linesGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < lineIdx.length; i += 2) {
        const a = lineIdx[i] * 3;
        const b = lineIdx[i + 1] * 3;
        lp[i * 3] = currentPositions[a];
        lp[i * 3 + 1] = currentPositions[a + 1];
        lp[i * 3 + 2] = currentPositions[a + 2];
        lp[(i + 1) * 3] = currentPositions[b];
        lp[(i + 1) * 3 + 1] = currentPositions[b + 1];
        lp[(i + 1) * 3 + 2] = currentPositions[b + 2];
      }
      linesGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      pointsGeo.dispose();
      pointsMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 92 92"
        fill="none"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 0 16px rgba(238,112,61,0.35))',
          zIndex: 1,
        }}
      >
        <rect x="18" y="20" width="40" height="10" rx="3" fill="#F0F0F2" opacity="0.15" />
        <rect x="34" y="41" width="40" height="10" rx="3" fill="url(#sphere-logo-grad)" />
        <rect x="18" y="62" width="40" height="10" rx="3" fill="#F0F0F2" opacity="0.15" />
        <defs>
          <linearGradient id="sphere-logo-grad" x1="34" y1="46" x2="74" y2="46">
            <stop offset="0%" stopColor="#ee703d" />
            <stop offset="50%" stopColor="#cc7cab" />
            <stop offset="100%" stopColor="#8530d1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
