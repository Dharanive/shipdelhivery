'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ScrollCameraControllerProps {
  reducedMotion?: boolean
}

/**
 * Scroll-Reactive Camera Director:
 * Smoothly interpolates the isometric camera position and target
 * along the logistics campus narrative as the user scrolls, with
 * tailored framing for mobile and desktop viewports.
 */
export default function ScrollCameraController({
  reducedMotion = false,
}: ScrollCameraControllerProps) {
  const { camera } = useThree()
  const scrollProgress = useRef(0)
  const isMobile = useRef(false)
  const currentPos = useRef(new THREE.Vector3(26, 20, 26))
  const currentTarget = useRef(new THREE.Vector3(4.8, 0.5, -0.5))

  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = typeof window !== 'undefined' && window.innerWidth < 768
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      )
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
      scrollProgress.current = progress
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reducedMotion])

  useFrame((_, delta) => {
    const mobile = isMobile.current

    if (reducedMotion) {
      // Static scenic framing tailored for mobile or desktop
      const staticPos = mobile ? new THREE.Vector3(30, 24, 30) : new THREE.Vector3(26, 20, 26)
      const staticLook = mobile ? new THREE.Vector3(1.2, 0.5, -0.8) : new THREE.Vector3(4.8, 0.5, -0.5)
      camera.position.copy(staticPos)
      camera.lookAt(staticLook)
      return
    }

    const p = scrollProgress.current

    // Base default targets
    let targetX = mobile ? 30 : 26
    let targetY = mobile ? 24 : 20
    let targetZ = mobile ? 30 : 26
    let lookX = mobile ? 1.2 : 4.8
    let lookY = 0.5
    let lookZ = mobile ? -0.8 : -0.5

    if (p < 0.25) {
      // Stage 1: Inbound Overview & Arriving Trucks
      const t = p / 0.25
      const ease = THREE.MathUtils.smoothstep(t, 0, 1)
      const startX = mobile ? 30 : 26
      const endX = mobile ? 22 : 20
      targetX = THREE.MathUtils.lerp(startX, endX, ease)
      targetY = THREE.MathUtils.lerp(mobile ? 24 : 20, mobile ? 18 : 15, ease)
      targetZ = THREE.MathUtils.lerp(mobile ? 30 : 26, mobile ? 23 : 21, ease)
      lookX = THREE.MathUtils.lerp(mobile ? 1.2 : 4.8, 1.0, ease)
      lookY = THREE.MathUtils.lerp(0.5, 0.8, ease)
      lookZ = THREE.MathUtils.lerp(mobile ? -0.8 : -0.5, 1.5, ease)
    } else if (p < 0.50) {
      // Stage 2: Sorting Facility & Active Conveyors
      const t = (p - 0.25) / 0.25
      const ease = THREE.MathUtils.smoothstep(t, 0, 1)
      targetX = THREE.MathUtils.lerp(mobile ? 22 : 20, mobile ? 14 : 10, ease)
      targetY = THREE.MathUtils.lerp(mobile ? 18 : 15, mobile ? 14 : 11, ease)
      targetZ = THREE.MathUtils.lerp(mobile ? 23 : 21, mobile ? 18 : 14, ease)
      lookX = THREE.MathUtils.lerp(1.0, mobile ? -1.0 : -2.5, ease)
      lookY = THREE.MathUtils.lerp(0.8, 1.2, ease)
      lookZ = THREE.MathUtils.lerp(1.5, 0.0, ease)
    } else if (p < 0.75) {
      // Stage 3: Outbound Loading Bays at Super-Hub
      const t = (p - 0.50) / 0.25
      const ease = THREE.MathUtils.smoothstep(t, 0, 1)
      targetX = THREE.MathUtils.lerp(mobile ? 14 : 10, mobile ? 22 : 18, ease)
      targetY = THREE.MathUtils.lerp(mobile ? 14 : 11, mobile ? 16 : 13, ease)
      targetZ = THREE.MathUtils.lerp(mobile ? 18 : 14, mobile ? 14 : 10, ease)
      lookX = THREE.MathUtils.lerp(mobile ? -1.0 : -2.5, 4.6, ease)
      lookY = THREE.MathUtils.lerp(1.2, 1.4, ease)
      lookZ = THREE.MathUtils.lerp(0.0, -2.5, ease)
    } else {
      // Stage 4: Network Departure & High-Angle Overview
      const t = (p - 0.75) / 0.25
      const ease = THREE.MathUtils.smoothstep(t, 0, 1)
      targetX = THREE.MathUtils.lerp(mobile ? 22 : 18, mobile ? 28 : 25, ease)
      targetY = THREE.MathUtils.lerp(mobile ? 16 : 13, mobile ? 25 : 23, ease)
      targetZ = THREE.MathUtils.lerp(mobile ? 14 : 10, mobile ? 26 : 23, ease)
      lookX = THREE.MathUtils.lerp(4.6, 2.5, ease)
      lookY = THREE.MathUtils.lerp(1.4, 0.5, ease)
      lookZ = THREE.MathUtils.lerp(-2.5, -1.0, ease)
    }

    const dampSpeed = Math.min(delta * 4.0, 0.16)
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetX, dampSpeed)
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetY, dampSpeed)
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetZ, dampSpeed)

    currentTarget.current.x = THREE.MathUtils.lerp(currentTarget.current.x, lookX, dampSpeed)
    currentTarget.current.y = THREE.MathUtils.lerp(currentTarget.current.y, lookY, dampSpeed)
    currentTarget.current.z = THREE.MathUtils.lerp(currentTarget.current.z, lookZ, dampSpeed)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTarget.current)
  })

  return null
}
