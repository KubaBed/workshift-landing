import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLSupported } from '../utils/webgl';

/**
 * Interactive Three.js data visualization — ported from user's Gemini Pro build.
 * Features: 400 curved lines from a central point, mouse repulsion via raycasting,
 * organic swaying via custom shaders, endpoint dots, and a CSS glow overlay.
 * Color: #635BFF (Stripe purple). White/transparent background.
 */
export function StripeDataViz() {
    const [supported, setSupported] = useState(true);
    const containerRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        if (!isWebGLSupported()) {
            setSupported(false);
            return;
        }

        if (!containerRef.current) return;
        const container = containerRef.current;

        // --- CONFIG ---
        const config = {
            lineCount: 400,
            pointsPerLine: 25,
            baseRadius: 55,
            baseHeight: -60,
            colors: {
                darkLine: 0x635BFF,
                lightPoint: 0x635BFF,
            },
        };

        // --- GLOBALS ---
        let animationFrameId;
        const mouseVec = new THREE.Vector2(-9999, -9999);
        const mouse3D = new THREE.Vector3(9999, 9999, 9999);
        const currentMouse3D = new THREE.Vector3(9999, 9999, 9999);

        const sharedUniforms = {
            uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
            uTime: { value: 0 },
            uLogoHover: { value: 0 },
        };

        // --- SCENE & CAMERA ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            60,
            container.clientWidth / container.clientHeight,
            1,
            1000
        );
        camera.position.set(0, 0, 110);

        // Invisible plane for mouse raycasting
        const invisiblePlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        scene.add(invisiblePlane);
        const raycaster = new THREE.Raycaster();

        // Group for easy transforms
        const animationGroup = new THREE.Group();
        scene.add(animationGroup);

        // --- RENDERER ---
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            if (!renderer.getContext()) {
                renderer.dispose();
                setSupported(false);
                return;
            }
        } catch {
            setSupported(false);
            return;
        }

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- GENERATE LINES & SPLINES ---
        const segmentsCount = config.pointsPerLine - 1;
        const totalVertices = config.lineCount * segmentsCount * 2;

        const positions = new Float32Array(totalVertices * 3);
        const lineProgress = new Float32Array(totalVertices);
        const endPoints = new Float32Array(config.lineCount * 3);

        let vertexIndex = 0;

        for (let i = 0; i < config.lineCount; i++) {
            const radius = 20 + Math.random() * config.baseRadius;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() * 0.45 + 0.05) * Math.PI;

            const startY = config.baseHeight;

            const endX = radius * Math.sin(phi) * Math.cos(theta);
            const endY = startY + radius * Math.cos(phi) * 0.75;
            const endZ = radius * Math.sin(phi) * Math.sin(theta);

            endPoints[i * 3] = endX;
            endPoints[i * 3 + 1] = endY;
            endPoints[i * 3 + 2] = endZ;

            const cpX = endX * 0.3;
            const cpY = startY + (endY - startY) * 0.2;
            const cpZ = endZ * 0.3;

            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(0, startY, 0),
                new THREE.Vector3(cpX, cpY, cpZ),
                new THREE.Vector3(endX, endY, endZ)
            );

            const curvePoints = curve.getPoints(segmentsCount);

            for (let j = 0; j < segmentsCount; j++) {
                const p1 = curvePoints[j];
                const p2 = curvePoints[j + 1];

                positions[vertexIndex * 3] = p1.x;
                positions[vertexIndex * 3 + 1] = p1.y;
                positions[vertexIndex * 3 + 2] = p1.z;
                lineProgress[vertexIndex] = j / segmentsCount;

                positions[(vertexIndex + 1) * 3] = p2.x;
                positions[(vertexIndex + 1) * 3 + 1] = p2.y;
                positions[(vertexIndex + 1) * 3 + 2] = p2.z;
                lineProgress[vertexIndex + 1] = (j + 1) / segmentsCount;

                vertexIndex += 2;
            }
        }

        // --- LINE MATERIAL (Custom Shader: repulsion + sway) ---
        const linesGeometry = new THREE.BufferGeometry();
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        linesGeometry.setAttribute('lineProgress', new THREE.BufferAttribute(lineProgress, 1));

        const linesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uMouse: sharedUniforms.uMouse,
                uTime: sharedUniforms.uTime,
                uLogoHover: sharedUniforms.uLogoHover,
            },
            vertexShader: `
                uniform vec3 uMouse;
                uniform float uTime;
                uniform float uLogoHover;
                attribute float lineProgress;
                varying float vProgress;
                void main() {
                    vProgress = lineProgress;
                    vec3 pos = position;
                    
                    // Organic sway effect
                    float swayPhase = position.x * 0.05 + position.z * 0.05 + uTime * 0.8;
                    float swayForce = vProgress * 1.5;
                    pos.x += sin(swayPhase) * swayForce;
                    pos.z += cos(swayPhase * 0.8) * swayForce;
                    
                    // Mouse repulsion
                    float dist = distance(pos, uMouse);
                    float maxDist = 30.0;
                    if (dist < maxDist) {
                        float force = smoothstep(0.0, 1.0, 1.0 - (dist / maxDist));
                        vec3 dir = normalize(pos - uMouse);
                        pos += dir * force * 3.0;
                    }

                    // Logo hover repulsion from center
                    float centerDist = distance(pos, vec3(0.0, 0.0, 0.0));
                    float centerMaxDist = 35.0; 
                    if (centerDist < centerMaxDist && uLogoHover > 0.0) {
                        float force = smoothstep(0.0, 1.0, 1.0 - (centerDist / centerMaxDist));
                        vec3 dir = normalize(pos - vec3(0.0, -10.0, 0.0));
                        pos += dir * force * 15.0 * uLogoHover;
                    }
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying float vProgress;
                void main() {
                    float alpha = pow(vProgress, 2.5);
                    gl_FragColor = vec4(0.388, 0.357, 1.0, alpha * 0.6);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending,
        });

        const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
        animationGroup.add(linesMesh);

        // --- Repulsion modifier for Points shader ---
        const addRepulsionToPoints = function (shader) {
            shader.uniforms.uMouse = sharedUniforms.uMouse;
            shader.uniforms.uTime = sharedUniforms.uTime;
            shader.uniforms.uLogoHover = sharedUniforms.uLogoHover;
            shader.vertexShader =
                `
                uniform vec3 uMouse;
                uniform float uTime;
                uniform float uLogoHover;
            \n` + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                `#include <begin_vertex>`,
                `
                vec3 transformed = vec3( position );
                
                // Sway effect (same as lines so dots stick to line tips)
                float swayPhase = position.x * 0.05 + position.z * 0.05 + uTime * 0.8;
                float swayForce = 1.5;
                transformed.x += sin(swayPhase) * swayForce;
                transformed.z += cos(swayPhase * 0.8) * swayForce;
                
                // Mouse repulsion
                float dist = distance(transformed, uMouse);
                float maxDist = 30.0;
                if (dist < maxDist) {
                    float force = smoothstep(0.0, 1.0, 1.0 - (dist / maxDist));
                    vec3 dir = normalize(transformed - uMouse);
                    transformed += dir * force * 3.0;
                }

                // Logo hover repulsion from center
                float centerDist = distance(transformed, vec3(0.0, 0.0, 0.0));
                float centerMaxDist = 35.0; 
                if (centerDist < centerMaxDist && uLogoHover > 0.0) {
                    float force = smoothstep(0.0, 1.0, 1.0 - (centerDist / centerMaxDist));
                    vec3 dir = normalize(transformed - vec3(0.0, -10.0, 0.0));
                    transformed += dir * force * 15.0 * uLogoHover;
                }
                `
            );
        };

        // --- ENDPOINT DOTS ---
        const endPointsGeometry = new THREE.BufferGeometry();
        endPointsGeometry.setAttribute('position', new THREE.BufferAttribute(endPoints, 3));

        // Circle texture for dots
        const circleCanvas = document.createElement('canvas');
        circleCanvas.width = 32;
        circleCanvas.height = 32;
        const ctx = circleCanvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        const circleTexture = new THREE.CanvasTexture(circleCanvas);

        const endPointsMaterial = new THREE.PointsMaterial({
            color: 0x635BFF,
            size: 1.5,
            map: circleTexture,
            transparent: true,
            opacity: 0.6,
            blending: THREE.NormalBlending,
            depthWrite: false,
        });
        endPointsMaterial.onBeforeCompile = addRepulsionToPoints;

        const endPointsMesh = new THREE.Points(endPointsGeometry, endPointsMaterial);
        animationGroup.add(endPointsMesh);

        let targetLogoHover = 0;
        
        function onLogoEnter() { targetLogoHover = 1; }
        function onLogoLeave() { targetLogoHover = 0; }

        function onMouseMove(event) {
            const rect = container.getBoundingClientRect();
            mouseVec.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseVec.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

        function onResize() {
            if (!containerRef.current) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }

        window.addEventListener('resize', onResize);
        container.addEventListener('mousemove', onMouseMove);
        
        if (logoRef.current) {
            logoRef.current.addEventListener('mouseenter', onLogoEnter);
            logoRef.current.addEventListener('mouseleave', onLogoLeave);
        }

        // --- ANIMATION LOOP ---
        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            // Update time uniform
            sharedUniforms.uTime.value = performance.now() * 0.001;

            // Raycast mouse onto invisible plane
            raycaster.setFromCamera(mouseVec, camera);
            const intersects = raycaster.intersectObject(invisiblePlane);

            if (intersects.length > 0) {
                const point = intersects[0].point.clone();
                animationGroup.worldToLocal(point);
                mouse3D.copy(point);
            } else {
                mouse3D.set(9999, 9999, 9999);
            }

            // Smooth lerp toward mouse
            currentMouse3D.lerp(mouse3D, 0.15);
            sharedUniforms.uMouse.value.copy(currentMouse3D);

            // Smooth lerp logo hover state
            sharedUniforms.uLogoHover.value = THREE.MathUtils.lerp(sharedUniforms.uLogoHover.value, targetLogoHover, 0.1);

            renderer.render(scene, camera);
        }
        animate();

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', onResize);
            container.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (logoRef.current) {
                logoRef.current.removeEventListener('mouseenter', onLogoEnter);
                logoRef.current.removeEventListener('mouseleave', onLogoLeave);
            }
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            linesGeometry.dispose();
            linesMaterial.dispose();
            endPointsGeometry.dispose();
            endPointsMaterial.dispose();
            circleTexture.dispose();
        };
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Fallback glow when WebGL is not supported */}
            {!supported && (
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <div 
                        className="w-64 h-64 bg-[#635BFF]/10 rounded-full blur-[60px]"
                        style={{
                            animation: 'pulse-glow 4s infinite ease-in-out'
                        }}
                    />
                    <style>{`
                        @keyframes pulse-glow {
                            0%, 100% { transform: scale(1); opacity: 0.5; }
                            50% { transform: scale(1.2); opacity: 0.8; }
                        }
                    `}</style>
                </div>
            )}
            
            {/* Three.js canvas container — fills entire hero */}
            {supported && (
                <div
                    ref={containerRef}
                    className="absolute inset-0 z-0"
                />
            )}
            
            {/* Interactive Logo Center */}
            <div 
                ref={logoRef}
                className="relative z-10 p-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl cursor-default transition-transform duration-500 hover:scale-105 pointer-events-auto"
            >
                {/* SVG implementation of the "Stack Shift" motif - tailored for StripeDataViz */}
                <svg width={72} height={72} viewBox="0 0 92 92" fill="none" className="shrink-0 drop-shadow-md">
                    {/* Top Layer */}
                    <rect x="18" y="20" width="40" height="10" rx="3" fill="#635BFF" opacity="0.8" />
                    {/* Middle Layer (Shifted right + Orange) */}
                    <rect x="34" y="41" width="40" height="10" rx="3" fill="#ee703d" />
                    {/* Bottom Layer */}
                    <rect x="18" y="62" width="40" height="10" rx="3" fill="#635BFF" opacity="0.8" />
                </svg>
            </div>
        </div>
    );
}
