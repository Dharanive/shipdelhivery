'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import MiniatureLogisticsCampus from './MiniatureLogisticsCampus'
import SceneFallback from './SceneFallback'
import ScrollCameraController from './ScrollCameraController'
import type { WarehouseZoneId } from './WarehouseCamera'

interface WarehouseSceneProps {
  reducedMotion?: boolean
  activeZone?: WarehouseZoneId
  autoRotate?: boolean
  useScrollCamera?: boolean
}

function SceneCanvasContent({
  reducedMotion = false,
  autoRotate = false,
  useScrollCamera = true,
}: {
  reducedMotion: boolean
  activeZone: WarehouseZoneId
  autoRotate: boolean
  useScrollCamera: boolean
}) {
  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. Cinematic Isometric Camera Rig (Elevated Isometric Framing)
      ────────────────────────────────────────────────────────────── */}
      <PerspectiveCamera
        makeDefault
        fov={29}
        position={[26, 20, 26]}
        near={0.2}
        far={300}
      />

      {/* Camera Mode: Scroll-driven Director or Constrained Orbit Controls */}
      {useScrollCamera ? (
        <ScrollCameraController reducedMotion={reducedMotion} />
      ) : (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.7}
          zoomSpeed={0.8}
          panSpeed={0.7}
          minDistance={14}
          maxDistance={45}
          maxPolarAngle={Math.PI / 2.15} // Never dips beneath ground
          minPolarAngle={Math.PI / 4.2}  // Never disorients straight top-down
          autoRotate={autoRotate && !reducedMotion}
          autoRotateSpeed={0.5}
          target={[4.8, 0.5, -0.5]}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Architectural Studio Daylight & Soft Blue Ambient Shadows
      ────────────────────────────────────────────────────────────── */}
      <ambientLight intensity={0.85} color="#F8FAFC" />

      {/* Primary Sunlight (Warm Daylight casting delicate contact shadows) */}
      <directionalLight
        position={[24, 34, 20]}
        intensity={1.35}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0002}
      />

      {/* Secondary Soft Sky Fill Light (Prevents harsh black shadows) */}
      <directionalLight position={[-18, 20, -14]} intensity={0.55} color="#DBEAFE" />
      <hemisphereLight args={['#FFFFFF', '#E2E8F0', 0.65]} />

      {/* ─────────────────────────────────────────────────────────────
          3. Complete Master Logistics World Diorama
      ────────────────────────────────────────────────────────────── */}
      <MiniatureLogisticsCampus reducedMotion={reducedMotion} />
    </>
  )
}

export default function WarehouseScene({
  reducedMotion = false,
  activeZone = 'all',
  autoRotate = false,
  useScrollCamera = true,
}: WarehouseSceneProps) {
  const [webglAvailable] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      const canvas = document.createElement('canvas')
      return !!(
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      )
    } catch {
      return false
    }
  })
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Suspend rendering when hero is scrolled out of viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (webglAvailable === false) {
    return <SceneFallback />
  }

  if (webglAvailable === null) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing bg-[#F8FAFC]"
      aria-label="3D Interactive Logistics World. Scroll to animate camera, or switch to Free Orbit mode."
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        style={{ background: '#F8FAFC' }}
        frameloop={!isVisible || reducedMotion ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <SceneCanvasContent
            reducedMotion={reducedMotion}
            activeZone={activeZone}
            autoRotate={autoRotate}
            useScrollCamera={useScrollCamera}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
