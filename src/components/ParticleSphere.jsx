import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { isWebGLSupported } from '../utils/webgl'

const SPHERE_RADIUS = 12
const AVOIDANCE_DISTANCE = 4
const AVOIDANCE_FACTOR = -0.3
const LERP_SPEED = 0.02
const DOT_COLOR = new THREE.Color(0x6366F1)
const LINE_COLOR = new THREE.Color(0x818CF8)

function createDot(pivot, size, opacity) {
    const material = new THREE.MeshBasicMaterial({
        color: DOT_COLOR,
        transparent: true,
        opacity,
    })
    const geometry = new THREE.CircleGeometry(size, 6)
    const mesh = new THREE.Mesh(geometry, material)
    return {
        mesh, pivot, radius: SPHERE_RADIUS,
        isAvoiding: false, lerpFactor: 0,
        targetPos: new THREE.Vector3(),
    }
}

function avoidMouse(dot, mousePos) {
    const pivotGlobalPos = new THREE.Vector3()
    dot.pivot.getWorldPosition(pivotGlobalPos)
    pivotGlobalPos.setZ(0)
    const mouseFlat = new THREE.Vector3(mousePos.x, mousePos.y, 0)
    const distance = pivotGlobalPos.distanceTo(mouseFlat)

    if (distance < AVOIDANCE_DISTANCE) {
        const dir = new THREE.Vector3(
            pivotGlobalPos.x - mousePos.x,
            pivotGlobalPos.y - mousePos.y,
            pivotGlobalPos.z
        ).normalize()
        dot.targetPos.x = dir.x * AVOIDANCE_FACTOR
        dot.targetPos.y = dir.y * AVOIDANCE_FACTOR
        if (!dot.isAvoiding) { dot.lerpFactor = 0; dot.isAvoiding = true }
    } else {
        if (dot.isAvoiding) { dot.isAvoiding = false; dot.lerpFactor = 0 }
        dot.targetPos.set(0, 0, 0)
    }
}

function controlMovement(dot) {
    dot.mesh.position.lerp(dot.targetPos, dot.lerpFactor)
    if (dot.lerpFactor < 1) dot.lerpFactor += LERP_SPEED
}

function SphereFallback() {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* A static CSS representation of a particle sphere */}
            <div className="relative w-72 h-72 border border-indigo-500/10 rounded-full flex items-center justify-center">
                <div className="absolute inset-4 border border-indigo-500/5 rounded-full" />
                <div className="absolute inset-12 border border-indigo-500/5 rounded-full" />
                <div className="absolute inset-24 border border-indigo-500/5 rounded-full" />
                
                {/* Simple floating particles */}
                {[...Array(16)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-2 h-2 bg-indigo-500/20 rounded-full blur-[1px]"
                        style={{
                            top: `${50 + 40 * Math.sin(i * Math.PI / 8)}%`,
                            left: `${50 + 40 * Math.cos(i * Math.PI / 8)}%`,
                            animation: `float-particle ${Math.random() * 5 + 5}s infinite ease-in-out`,
                            animationDelay: `${Math.random() * -5}s`
                        }}
                    />
                ))}
                
                <style>{`
                    @keyframes float-particle {
                        0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.2; }
                        50% { transform: scale(1.5) translate(10px, -10px); opacity: 0.4; }
                    }
                `}</style>
            </div>
        </div>
    )
}

export function ParticleSphere() {
    const [supported, setSupported] = useState(true)
    const containerRef = useRef(null)

    useEffect(() => {
        if (!isWebGLSupported()) {
            setSupported(false)
            return
        }

        const container = containerRef.current
        if (!container) return

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
            if (!renderer.getContext()) {
                renderer.dispose();
                setSupported(false);
                return;
            }
        } catch {
            setSupported(false);
            return;
        }

        const scene = new THREE.Scene()
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setClearColor(0x000000, 0)
        container.appendChild(renderer.domElement)

        const camera = new THREE.PerspectiveCamera(
            50, container.clientWidth / container.clientHeight, 0.1, 1000
        )
        camera.position.z = 32

        const dots = []
        const pivotsGroup = new THREE.Group()
        const PARTICLE_COUNT = 1800 

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT)
            const theta = Math.PI * (1 + Math.sqrt(5)) * i
            const scatter = 0.9 + Math.random() * 0.2
            const x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta) * scatter
            const y = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta) * scatter
            const z = SPHERE_RADIUS * Math.cos(phi) * scatter

            const pivot = new THREE.Group()
            pivot.position.set(x, y, z)
            const size = 0.018 + Math.random() * 0.041
            const opacity = 0.15 + Math.random() * 0.4
            const dot = createDot(pivot, size, opacity)
            dots.push(dot)
            pivot.add(dot.mesh)
            pivotsGroup.add(pivot)
        }

        for (let i = 0; i < 400; i++) { 
            const r = Math.random() * SPHERE_RADIUS * 0.75
            const phi = Math.random() * Math.PI * 2
            const theta = Math.random() * Math.PI
            const x = r * Math.sin(theta) * Math.cos(phi)
            const y = r * Math.sin(theta) * Math.sin(phi)
            const z = r * Math.cos(theta)

            const pivot = new THREE.Group()
            pivot.position.set(x, y, z)
            const size = 0.012 + Math.random() * 0.033
            const opacity = 0.06 + Math.random() * 0.18
            const dot = createDot(pivot, size, opacity)
            dots.push(dot)
            pivot.add(dot.mesh)
            pivotsGroup.add(pivot)
        }

        scene.add(pivotsGroup)

        const linesMaterial = new THREE.LineBasicMaterial({
            color: LINE_COLOR, transparent: true, opacity: 0.08,
        })
        const lineSegments = []
        const surfaceDots = dots.slice(0, PARTICLE_COUNT)
        for (let i = 0; i < surfaceDots.length; i += 4) { 
            for (let j = i + 1; j < Math.min(i + 12, surfaceDots.length); j += 4) {
                const dist = surfaceDots[i].pivot.position.distanceTo(surfaceDots[j].pivot.position)
                if (dist < 3.0) lineSegments.push(i, j) 
            }
        }
        const linesGeometry = new THREE.BufferGeometry()
        const linesPositions = new Float32Array(lineSegments.length * 3)
        for (let i = 0; i < lineSegments.length; i += 2) {
            const idxA = lineSegments[i]
            const idxB = lineSegments[i + 1]
            const posA = surfaceDots[idxA].pivot.position
            const posB = surfaceDots[idxB].pivot.position
            linesPositions[i * 3] = posA.x
            linesPositions[i * 3 + 1] = posA.y
            linesPositions[i * 3 + 2] = posA.z
            linesPositions[(i + 1) * 3] = posB.x
            linesPositions[(i + 1) * 3 + 1] = posB.y
            linesPositions[(i + 1) * 3 + 2] = posB.z
        }
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3))
        const lines = new THREE.LineSegments(linesGeometry, linesMaterial)
        
        pivotsGroup.add(lines)

        let cursorPos = new THREE.Vector3(9999, 9999, 0)

        const onMouseMove = (event) => {
            const rect = container.getBoundingClientRect()
            const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1
            const ndcY = -((event.clientY - rect.top) / rect.height) * 2 + 1
            const vector = new THREE.Vector3(ndcX, ndcY, 0.5)
            vector.unproject(camera)
            const dir = vector.sub(camera.position).normalize()
            const distance = -camera.position.z / dir.z
            cursorPos = camera.position.clone().add(dir.multiplyScalar(distance))
        }

        const onTouchMove = (event) => {
            const rect = container.getBoundingClientRect()
            const touch = event.touches[0]
            const ndcX = ((touch.clientX - rect.left) / rect.width) * 2 - 1
            const ndcY = -((touch.clientY - rect.top) / rect.height) * 2 + 1
            const vector = new THREE.Vector3(ndcX, ndcY, 0.5)
            vector.unproject(camera)
            const dir = vector.sub(camera.position).normalize()
            const distance = -camera.position.z / dir.z
            cursorPos = camera.position.clone().add(dir.multiplyScalar(distance))
        }

        const onMouseLeave = () => {
            cursorPos = new THREE.Vector3(9999, 9999, 0)
        }

        container.addEventListener('mousemove', onMouseMove)
        container.addEventListener('touchmove', onTouchMove, { passive: true })
        container.addEventListener('mouseleave', onMouseLeave)

        let autoRotY = 0
        let frameId

        const animate = () => {
            frameId = requestAnimationFrame(animate)
            autoRotY += 0.0015
            pivotsGroup.rotation.y = autoRotY
            pivotsGroup.rotation.x = Math.sin(autoRotY * 0.4) * 0.1

            for (const dot of dots) {
                avoidMouse(dot, cursorPos)
                controlMovement(dot)
                dot.mesh.lookAt(camera.position)
            }
            
            renderer.render(scene, camera)
        }

        animate()

        const onResize = () => {
            const w = container.clientWidth
            const h = container.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', onResize)

        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener('resize', onResize)
            container.removeEventListener('mousemove', onMouseMove)
            container.removeEventListener('touchmove', onTouchMove)
            container.removeEventListener('mouseleave', onMouseLeave)
            renderer.dispose()
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
        }
    }, [])

    if (!supported) return <SphereFallback />

    return (
        <div
            ref={containerRef}
            className="absolute inset-0"
            style={{ pointerEvents: 'auto' }}
        />
    )
}
