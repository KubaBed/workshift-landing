/* eslint-disable react-hooks/purity */
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLSupported } from '../utils/webgl';

const SPHERE_RADIUS = 9.6;
const SURFACE_COUNT = 1800;
const INTERIOR_COUNT = 400;
// Kursor przyciąga kropki w promieniu 4 jednostek o 0,3 jednostki (jak w wersji z meshami).
const PULL_RADIUS = 4;
const PULL_DISTANCE = 0.3;
// 0,0015 rad na klatkę przy 60 fps, liczone od czasu, nie od liczby klatek.
const ROTATION_SPEED = 0.09;
const FOV = 50;
// Dawna kropka to sześciokąt o promieniu `size`; koło o tym samym polu ma średnicę 2 * size * 0,909.
const HEX_TO_CIRCLE = Math.sqrt((3 * Math.sqrt(3)) / (2 * Math.PI));

const PALETTE = [
  new THREE.Color(0x000000), // Black
  new THREE.Color(0x000000),
  new THREE.Color(0x000000),
  new THREE.Color(0x9CE069), // Lime
  new THREE.Color(0x9CE069),
  new THREE.Color(0x595959), // Muted Dark
];

/**
 * Wszystkie kropki to jeden THREE.Points z własnym shaderem: jedno wywołanie rysowania
 * zamiast 2 200 meshy z osobną geometrią i materiałem, bez lookAt i Vector3 na kropkę
 * w każdej klatce. Wersja z meshami dawała TBT ok. 12 s w PSI desktop strony głównej.
 * Kropka to koło o polu dawnego sześciokąta; na ekranie ma 1-4 px, więc wygląda tak samo
 * (pomiar 15.10: pokrycie i nasycenie w granicach kilku procent wersji z meshami).
 */
function buildParticles() {
  const total = SURFACE_COUNT + INTERIOR_COUNT;
  const positions = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  const alphas = new Float32Array(total);
  const sizes = new Float32Array(total);

  const put = (i, x, y, z, size, alpha) => {
    positions.set([x, y, z], i * 3);
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    colors.set([c.r, c.g, c.b], i * 3);
    alphas[i] = alpha;
    sizes[i] = size * 2 * HEX_TO_CIRCLE;
  };

  for (let i = 0; i < SURFACE_COUNT; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / SURFACE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const scatter = 0.9 + Math.random() * 0.2;
    put(
      i,
      SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta) * scatter,
      SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta) * scatter,
      SPHERE_RADIUS * Math.cos(phi) * scatter,
      0.018 + Math.random() * 0.041,
      0.25 + Math.random() * 0.55,
    );
  }

  for (let k = 0; k < INTERIOR_COUNT; k++) {
    const r = Math.random() * SPHERE_RADIUS * 0.75;
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * Math.PI;
    put(
      SURFACE_COUNT + k,
      r * Math.sin(theta) * Math.cos(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(theta),
      0.012 + Math.random() * 0.033,
      0.08 + Math.random() * 0.2,
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  return geometry;
}

const VERTEX_SHADER = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  uniform vec2 uMouse;
  uniform float uPull;
  uniform float uScale;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vPx;
  varying float vCore;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec2 toMouse = uMouse - world.xy;
    float dist = length(toMouse);
    float strength = uPull * (1.0 - smoothstep(${(PULL_RADIUS - 1).toFixed(1)}, ${PULL_RADIUS.toFixed(1)}, dist));
    world.xy += toMouse / max(dist, 1e-4) * ${PULL_DISTANCE.toFixed(2)} * strength;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    float px = aSize * uScale / -mv.z;
    // Kropka mniejsza niż piksel: rysujemy 1 px i ściszamy ją proporcjonalnie (jak pokrycie MSAA).
    vCore = max(px, 1.0);
    // +1 px zapasu na wygładzoną krawędź, żeby nie zjadała promienia kropki.
    gl_PointSize = vCore + 1.0;
    vPx = gl_PointSize;
    vColor = color;
    vAlpha = aAlpha * clamp(px, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vPx;
  varying float vCore;

  void main() {
    // Odległość od środka w pikselach; krawędź wygładzona na 1 px wokół prawdziwego promienia.
    float d = length(gl_PointCoord - 0.5) * vPx;
    float mask = clamp(vCore * 0.5 - d + 0.5, 0.0, 1.0);
    if (mask <= 0.0) discard;
    gl_FragColor = vec4(vColor, vAlpha * mask);
    #include <colorspace_fragment>
  }
`;

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

      const camera = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 1000);
      camera.position.z = 32;

      const geometry = buildParticles();
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uMouse: { value: new THREE.Vector2(9999, 9999) },
          uPull: { value: 0 },
          uScale: { value: 1 },
        },
        vertexColors: true,
        transparent: true,
        depthWrite: false,
      });
      const points = new THREE.Points(geometry, material);
      points.position.x = 8;
      scene.add(points);

      // Piksele na jednostkę świata w odległości 1 od kamery (wysokość bufora / wysokość kadru).
      const size = new THREE.Vector2();
      const updateScale = () => {
        renderer.getDrawingBufferSize(size);
        material.uniforms.uScale.value = size.y / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
      };
      updateScale();

      // Kursor rzutowany na płaszczyznę z = 0. Pozycję i siłę przyciągania wygładzamy w czasie,
      // więc kropki wchodzą i wracają płynnie, jak przy dawnym lerpie na każdej kropce.
      const mouseTarget = new THREE.Vector2(9999, 9999);
      let pullTarget = 0;
      const ray = new THREE.Vector3();
      const setPointer = (clientX, clientY) => {
        const rect = container.getBoundingClientRect();
        ray.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1, 0.5);
        ray.unproject(camera).sub(camera.position).normalize();
        const t = -camera.position.z / ray.z;
        const x = camera.position.x + ray.x * t;
        const y = camera.position.y + ray.y * t;
        if (pullTarget === 0) material.uniforms.uMouse.value.set(x, y);
        mouseTarget.set(x, y);
        pullTarget = 1;
      };
      const onMouseMove = (event) => setPointer(event.clientX, event.clientY);
      const onTouchMove = (event) => setPointer(event.touches[0].clientX, event.touches[0].clientY);
      const onMouseLeave = () => { pullTarget = 0; };

      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('touchmove', onTouchMove, { passive: true });
      container.addEventListener('mouseleave', onMouseLeave);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let rotY = 0;
      let last = performance.now();

      const frame = (time) => {
        const dt = Math.min((time - last) / 1000, 0.1);
        last = time;
        rotY += ROTATION_SPEED * dt;
        points.rotation.y = rotY;
        points.rotation.x = Math.sin(rotY * 0.4) * 0.1;

        const ease = 1 - Math.exp(-dt * 6);
        const u = material.uniforms;
        u.uPull.value += (pullTarget - u.uPull.value) * ease;
        u.uMouse.value.lerp(mouseTarget, 1 - Math.exp(-dt * 12));

        renderer.render(scene, camera);
      };

      // Pętla działa tylko, gdy sfera jest na ekranie; prefers-reduced-motion: jedna klatka bez ruchu.
      let running = false;
      const setRunning = (on) => {
        if (reducedMotion || on === running) return;
        running = on;
        if (on) last = performance.now();
        renderer.setAnimationLoop(on ? frame : null);
      };
      const io = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
      io.observe(container);
      renderer.render(scene, camera);

      const resizeObserver = new ResizeObserver(() => {
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        if (cw === 0 || ch === 0) return;
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
        renderer.setSize(cw, ch);
        updateScale();
        if (!running) renderer.render(scene, camera);
      });
      resizeObserver.observe(container);

      cleanupFns.push(() => {
        io.disconnect();
        resizeObserver.disconnect();
        renderer.setAnimationLoop(null);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('mouseleave', onMouseLeave);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
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
