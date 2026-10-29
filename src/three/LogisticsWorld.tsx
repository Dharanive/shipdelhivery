'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import RoadNetwork, { MAIN_ROAD_LOOP, INNER_DELIVERY_LOOP } from './RoadNetwork'
import WarehouseComplex from './WarehouseComplex'
import {
  ArticulatedSemiTruck,
  MediumBoxTruck,
  UrbanDeliveryVan,
} from './LogisticsFleet'
import Conveyor from './Conveyor'
import Parcel from './Parcel'
import ScannerTunnel from './ScannerTunnel'
import RoboticArm from './RoboticArm'
import WarehouseRack from './WarehouseRack'
import Forklift from './Forklift'

interface LogisticsWorldProps {
  reducedMotion?: boolean
}

/**
 * Master Connected 3D Logistics City Diorama
 * Faithfully re-creates the composition, depth, and fleet of Reference Images 1 & 2.
 */
export default function LogisticsWorld({ reducedMotion = false }: LogisticsWorldProps) {
  // Road circuit spline for Main Highway traffic
  const highwaySpline = useMemo(() => {
    const pts = MAIN_ROAD_LOOP.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    return new THREE.CatmullRomCurve3(pts, true)
  }, [])

  // Road circuit spline for Inner Campus delivery loop
  const innerSpline = useMemo(() => {
    const pts = INNER_DELIVERY_LOOP.map(([x, y, z]) => new THREE.Vector3(x, y, z))
    return new THREE.CatmullRomCurve3(pts, true)
  }, [])

  // Vehicle motion refs
  const semiRef = useRef<THREE.Group>(null)
  const vanRef = useRef<THREE.Group>(null)
  const medTruckRef = useRef<THREE.Group>(null)

  const semiProgress = useRef(0.12)
  const vanProgress = useRef(0.62)
  const medProgress = useRef(0.35)

  useFrame((_, delta) => {
    if (reducedMotion) return

    // 1. Move Class 8 Semi-Truck along highway circuit
    semiProgress.current = (semiProgress.current + delta * 0.028) % 1
    if (semiRef.current) {
      const pos = highwaySpline.getPoint(semiProgress.current)
      const tangent = highwaySpline.getTangent(semiProgress.current)
      semiRef.current.position.set(pos.x, pos.y, pos.z)
      semiRef.current.rotation.y = Math.atan2(tangent.x, tangent.z)
    }

    // 2. Move Urban Delivery Van along highway circuit
    vanProgress.current = (vanProgress.current + delta * 0.038) % 1
    if (vanRef.current) {
      const pos = highwaySpline.getPoint(vanProgress.current)
      const tangent = highwaySpline.getTangent(vanProgress.current)
      vanRef.current.position.set(pos.x, pos.y, pos.z)
      vanRef.current.rotation.y = Math.atan2(tangent.x, tangent.z)
    }

    // 3. Move Medium Box Truck along inner campus loop
    medProgress.current = (medProgress.current + delta * 0.032) % 1
    if (medTruckRef.current) {
      const pos = innerSpline.getPoint(medProgress.current)
      const tangent = innerSpline.getTangent(medProgress.current)
      medTruckRef.current.position.set(pos.x, pos.y, pos.z)
      medTruckRef.current.rotation.y = Math.atan2(tangent.x, tangent.z)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* ─────────────────────────────────────────────────────────────
          1. Continuous Ground Diorama Slab (Pristine Light Clay)
      ────────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[56, 56]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.75} metalness={0.02} />
      </mesh>

      {/* ─────────────────────────────────────────────────────────────
          2. Connected Road Network with Curbs & Guidance Markings
      ────────────────────────────────────────────────────────────── */}
      <RoadNetwork />

      {/* ─────────────────────────────────────────────────────────────
          3. Complete Architectural Warehouse Complex & Gatehouse
      ────────────────────────────────────────────────────────────── */}
      <WarehouseComplex />

      {/* ─────────────────────────────────────────────────────────────
          4. Moving Fleet in Transit along Connected Roadways
      ────────────────────────────────────────────────────────────── */}
      {/* Heavy Semi-Trailer Truck on Highway */}
      <group ref={semiRef}>
        <ArticulatedSemiTruck isMoving={!reducedMotion} wheelSpeed={1.0} />
      </group>

      {/* Urban Delivery Van cruising along Boulevard */}
      <group ref={vanRef}>
        <UrbanDeliveryVan isMoving={!reducedMotion} wheelSpeed={1.2} />
      </group>

      {/* Medium Box Delivery Truck navigating Inner Campus */}
      <group ref={medTruckRef}>
        <MediumBoxTruck isMoving={!reducedMotion} wheelSpeed={1.0} color="#0284C7" />
      </group>

      {/* ─────────────────────────────────────────────────────────────
          5. Staged Fleet (Loading Bays & Parking Slots, Image 2 style)
      ────────────────────────────────────────────────────────────── */}
      {/* Backed into Dock Bay 01 of Main Super-Hub */}
      <ArticulatedSemiTruck
        position={[3.7, 0, -0.6]}
        rotation={[0, 0, 0]}
        isMoving={false}
      />
      {/* Backed into Dock Bay 03 of Main Super-Hub */}
      <ArticulatedSemiTruck
        position={[7.7, 0, -0.6]}
        rotation={[0, 0, 0]}
        isMoving={false}
      />

      {/* Trucks parked in Diagonal Apron Staging Slots */}
      <MediumBoxTruck position={[-4.5, 0, 0]} rotation={[0, 0, 0]} isMoving={false} />
      <MediumBoxTruck position={[-2.5, 0, 0]} rotation={[0, 0, 0]} isMoving={false} color="#1D4ED8" />
      <UrbanDeliveryVan position={[1.5, 0, 0]} rotation={[0, 0, 0]} isMoving={false} />

      {/* Parked at Inbound Cross-Dock Terminal */}
      <MediumBoxTruck position={[-4.5, 0, 2.2]} rotation={[0, Math.PI / 2, 0]} isMoving={false} color="#EA580C" />

      {/* ─────────────────────────────────────────────────────────────
          6. Sorting Equipment, Conveyor Flow & Storage Racks
      ────────────────────────────────────────────────────────────── */}
      {/* Sorting Conveyor Line */}
      <Conveyor
        start={[-2, 0, -3.5]}
        end={[3.5, 0, -3.5]}
        color="#0F172A"
        rollerColor="#38BDF8"
        reducedMotion={reducedMotion}
      />

      {/* High-Speed Optical Scanner Tunnel (beeVision style) */}
      <ScannerTunnel
        position={[0.8, 0.02, -3.5]}
        rotation={[0, Math.PI / 2, 0]}
        reducedMotion={reducedMotion}
      />

      {/* Articulated KUKA Sorting Robot Arm */}
      <RoboticArm position={[1.8, 0, -4.6]} reducedMotion={reducedMotion} />

      {/* Storage Pallet Racking in Outdoor Yard */}
      <WarehouseRack position={[-1, 0, -6.5]} />
      <WarehouseRack position={[-4, 0, -6.5]} />

      {/* Electric Staged Forklift moving cargo */}
      <Forklift position={[-2.2, 0, -1.8]} rotation={[0, 0.5, 0]} />

      {/* Cardboard Parcels on conveyor line */}
      {[0, 0.25, 0.5, 0.75].map((offset, i) => (
        <Parcel
          key={`main-box-${i}`}
          pathOffset={offset}
          size={[0.48, 0.36, 0.42]}
          color={i % 2 === 0 ? '#D4A574' : '#C8956A'}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  )
}

