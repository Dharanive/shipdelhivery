'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import WarehouseFloor from './WarehouseFloor'
import Conveyor from './Conveyor'
import Parcel from './Parcel'
import SortingStation from './SortingStation'
import ScannerTunnel from './ScannerTunnel'
import RoboticArm from './RoboticArm'
import MezzaninePlatform from './MezzaninePlatform'
import Forklift from './Forklift'
import SceneFallback from './SceneFallback'
import WarehouseRack from './WarehouseRack'
import DeliveryTruck from './DeliveryTruck'
import WarehouseControls from './WarehouseControls'
import type { WarehouseZoneId } from './WarehouseCamera'

interface WarehouseSceneProps {
  reducedMotion?: boolean
  activeZone?: WarehouseZoneId
  autoRotate?: boolean
}

function WarehouseContent({
  reducedMotion = false,
  activeZone = 'all',
  autoRotate = false,
}: {
  reducedMotion: boolean
  activeZone: WarehouseZoneId
  autoRotate: boolean
}) {
  return (
    <>
      {/* Cinematic Default Camera */}
      <PerspectiveCamera
        makeDefault
        fov={35}
        position={[20, 18, 20]}
        near={0.2}
        far={200}
      />

      {/* Full Interactive Mouse Orbit Controls */}
      <WarehouseControls
        activeZone={activeZone}
        autoRotate={autoRotate}
        reducedMotion={reducedMotion}
      />

      {/* Lighting Architecture */}
      <ambientLight intensity={0.8} color="#E0EDFB" />
      <directionalLight
        position={[16, 24, 16]}
        intensity={1.4}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0003}
      />
      <directionalLight position={[-12, 14, -8]} intensity={0.5} color="#93C5FD" />
      <hemisphereLight args={['#DBEAFE', '#0B1220', 0.6]} />

      {/* Architectural warehouse floor with zones */}
      <WarehouseFloor activeZone={activeZone} />

      {/* Elevated Mezzanine Deck with Upper Storage */}
      <MezzaninePlatform />

      {/* ───────────────────────────────────────────────────────────
          Ground Floor Conveyor Belt Network
      ──────────────────────────────────────────────────────────── */}
      {/* Primary Intake Conveyor from Loading Dock */}
      <Conveyor
        start={[-8.5, 0, 2]}
        end={[-2.5, 0, 2]}
        color="#142238"
        rollerColor="#38BDF8"
        reducedMotion={reducedMotion}
      />
      {/* Central Induction Conveyor through Optical Scanner */}
      <Conveyor
        start={[-2.5, 0, 2]}
        end={[3.5, 0, 2]}
        color="#142238"
        rollerColor="#38BDF8"
        reducedMotion={reducedMotion}
      />
      {/* Turn section heading south to sorting lane */}
      <Conveyor
        start={[3.5, 0, 2]}
        end={[3.5, 0, -2.8]}
        color="#142238"
        rollerColor="#38BDF8"
        reducedMotion={reducedMotion}
      />
      {/* High-speed sorting transfer loop */}
      <Conveyor
        start={[3.5, 0, -2.8]}
        end={[-2.5, 0, -2.8]}
        color="#142238"
        rollerColor="#38BDF8"
        reducedMotion={reducedMotion}
      />
      {/* Outbound dispatch staging lane */}
      <Conveyor
        start={[-2.5, 0, -2.8]}
        end={[-2.5, 0, -6.5]}
        color="#142238"
        rollerColor="#38BDF8"
        reducedMotion={reducedMotion}
      />

      {/* ───────────────────────────────────────────────────────────
          Mezzanine Upper Level Conveyor Line
      ──────────────────────────────────────────────────────────── */}
      <Conveyor
        start={[2, 2.9, -4.5]}
        end={[7, 2.9, -4.5]}
        color="#0F172A"
        rollerColor="#38BDF8"
        reducedMotion={reducedMotion}
      />

      {/* ───────────────────────────────────────────────────────────
          Automated Equipment & Robotics
      ──────────────────────────────────────────────────────────── */}
      {/* Optical Scanner Tunnel on Central Induction Line (Image 2) */}
      <ScannerTunnel
        position={[0.5, 0.02, 2]}
        rotation={[0, Math.PI / 2, 0]}
        reducedMotion={reducedMotion}
      />

      {/* Articulated KUKA-style Robot Sorting Arm (Image 1) */}
      <RoboticArm position={[1.4, 0, 0.35]} reducedMotion={reducedMotion} />

      {/* Secondary Automated Barcode Station */}
      <SortingStation position={[-1.2, 0, 2.7]} />
      <SortingStation position={[4.2, 0, -0.8]} />

      {/* ───────────────────────────────────────────────────────────
          Moving Cardboard Parcels
      ──────────────────────────────────────────────────────────── */}
      {[0, 0.16, 0.32, 0.48, 0.64, 0.8, 0.92].map((offset, i) => (
        <Parcel
          key={`parcel-main-${i}`}
          pathOffset={offset}
          size={[
            0.52 + (i % 3) * 0.08,
            0.38 + (i % 2) * 0.08,
            0.46 + (i % 2) * 0.08,
          ]}
          color={i % 3 === 0 ? '#D4A574' : i % 3 === 1 ? '#C8956A' : '#BF8D61'}
          reducedMotion={reducedMotion}
        />
      ))}

      {/* ───────────────────────────────────────────────────────────
          High-Bay Storage Racks & Inventory
      ──────────────────────────────────────────────────────────── */}
      <WarehouseRack position={[-7.5, 0, -2]} />
      <WarehouseRack position={[-7.5, 0, -5.2]} />
      <WarehouseRack position={[-4.2, 0, -6.8]} />

      {/* ───────────────────────────────────────────────────────────
          Loading Docks Fleet & Material Handling
      ──────────────────────────────────────────────────────────── */}
      {/* Inbound Heavy Freight Truck at Dock A */}
      <DeliveryTruck position={[-9.2, 0, 4.4]} rotation={[0, 0.28, 0]} />
      {/* Outbound Distribution Van at Dock B */}
      <DeliveryTruck position={[5.8, 0, 5.2]} rotation={[0, Math.PI + 0.15, 0]} />

      {/* Heavy Electric Forklift Staging Area */}
      <Forklift position={[-2.5, 0, 4.8]} rotation={[0, -0.6, 0]} />
    </>
  )
}

export default function WarehouseScene({
  reducedMotion = false,
  activeZone = 'all',
  autoRotate = false,
}: WarehouseSceneProps) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      setWebglAvailable(!!gl)
    } catch {
      setWebglAvailable(false)
    }
  }, [])

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
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
      aria-label="3D Interactive Warehouse Visualization. Click and drag to rotate, scroll to zoom."
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ background: 'transparent' }}
        frameloop={!isVisible || reducedMotion ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <WarehouseContent
            reducedMotion={reducedMotion}
            activeZone={activeZone}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
