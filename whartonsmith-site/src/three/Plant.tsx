import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Block, Box, Building, Flat, Pipe, Rise, TreeBand, mats } from './kit'

// Massing model of a water reclamation facility: headworks, aeration basins,
// secondary clarifiers, filters, chlorine contact, storage and operations.

function Clarifier({ x, z, r = 6, h = 1.8, speed = 0.12 }: { x: number; z: number; r?: number; h?: number; speed?: number }) {
  const arm = useRef<THREE.Group>(null)
  const wall = useMemo(() => {
    const t = 0.45
    const pts = [
      new THREE.Vector2(r - t, 0),
      new THREE.Vector2(r, 0),
      new THREE.Vector2(r, h),
      new THREE.Vector2(r - t, h),
      new THREE.Vector2(r - t, 0),
    ]
    return new THREE.LatheGeometry(pts, 72)
  }, [r, h])
  useFrame((_, dt) => {
    if (arm.current) arm.current.rotation.y += dt * speed
  })
  return (
    <group position={[x, 0, z]}>
      <mesh geometry={wall} material={mats.clay} castShadow receiveShadow />
      <mesh position={[0, h - 0.4, 0]} material={mats.water} receiveShadow>
        <cylinderGeometry args={[r - 0.45, r - 0.45, 0.1, 72]} />
      </mesh>
      <mesh position={[0, h - 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.clay} castShadow>
        <torusGeometry args={[r - 1.3, 0.14, 8, 72]} />
      </mesh>
      <mesh position={[0, (h + 0.7) / 2, 0]} material={mats.clay} castShadow>
        <cylinderGeometry args={[0.9, 0.9, h + 0.7, 24]} />
      </mesh>
      <group ref={arm} position={[0, h + 0.25, 0]}>
        <Box size={[r, 0.32, 1]} position={[r / 2, 0, 0]} mat={mats.corten} />
        <Box size={[r, 0.5, 0.06]} position={[r / 2, 0.4, 0.5]} mat={mats.corten} />
        <Box size={[r, 0.5, 0.06]} position={[r / 2, 0.4, -0.5]} mat={mats.corten} />
      </group>
    </group>
  )
}

/** Open-top rectangular tank with lane dividers and a water surface. */
function Basin({ x, z, w, d, h = 2.2, lanes = 4, baffles = 0 }: { x: number; z: number; w: number; d: number; h?: number; lanes?: number; baffles?: number }) {
  const t = 0.4
  return (
    <group position={[x, 0, z]}>
      <Block w={w} h={t} d={d} y={-t + 0.02} />
      <Block w={w} h={h} d={t} z={-d / 2 + t / 2} />
      <Block w={w} h={h} d={t} z={d / 2 - t / 2} />
      <Block w={t} h={h} d={d} x={-w / 2 + t / 2} />
      <Block w={t} h={h} d={d} x={w / 2 - t / 2} />
      {Array.from({ length: lanes - 1 }, (_, k) => (
        <Block key={k} w={t * 0.8} h={h} d={d - t} x={-w / 2 + (w / lanes) * (k + 1)} />
      ))}
      {Array.from({ length: baffles }, (_, k) => (
        <Block key={`b${k}`} w={w - t} h={h * 0.9} d={0.18} z={-d / 2 + (d / (baffles + 1)) * (k + 1)} x={k % 2 ? 1.2 : -1.2} />
      ))}
      <mesh position={[0, h - 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.water} receiveShadow>
        <planeGeometry args={[w - t, d - t]} />
      </mesh>
    </group>
  )
}

function StorageTank({ x, z, r = 6.5, h = 6 }: { x: number; z: number; r?: number; h?: number }) {
  const theta = 0.33
  const R = r / Math.sin(theta)
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} material={mats.clay} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, h, 72]} />
      </mesh>
      <mesh position={[0, h - R * Math.cos(theta), 0]} material={mats.clay} castShadow receiveShadow>
        <sphereGeometry args={[R, 72, 12, 0, Math.PI * 2, 0, theta]} />
      </mesh>
      <mesh position={[0, h * 0.5, 0]} material={mats.clayShade}>
        <cylinderGeometry args={[r + 0.03, r + 0.03, 0.2, 72]} />
      </mesh>
    </group>
  )
}

export function Plant() {
  return (
    <group position={[-8, 0, 0]}>
      {/* site paving and access road */}
      <Flat w={104} d={56} x={6} z={0} y={0.015} mat={mats.paving} />
      <Flat w={180} d={7} x={6} z={33} y={0.02} mat={mats.road} />
      <Flat w={7} d={30} x={-40} z={14} y={0.025} mat={mats.road} />

      {/* headworks */}
      <Rise delay={0}>
        <group position={[-38, 0, -14]}>
          <Block w={9} h={6.5} d={7} />
          <Box size={[9.04, 1.6, 7.04]} position={[0, 4.4, 0]} mat={mats.glass} />
          <Box size={[9.4, 0.5, 7.4]} position={[0, 6.75, 0]} />
          <Basin x={9} z={0} w={8} d={4} h={1.6} lanes={2} />
        </group>
      </Rise>

      {/* aeration basins */}
      <Rise delay={0.25}>
        <Basin x={-14} z={-4} w={22} d={26} h={2.4} lanes={4} />
      </Rise>

      {/* blower building + operations */}
      <Rise delay={0.4}>
        <Building w={12} d={7} floors={1} floorH={5.5} x={-14} z={16} />
      </Rise>
      <Rise delay={0.5}>
        <Building w={16} d={10} floors={2} floorH={4} x={-36} z={8} />
        <group position={[-36, 0, 15.5]}>
          <Box size={[10, 0.3, 3]} position={[0, 3.6, 0]} />
          <Box size={[0.25, 3.6, 0.25]} position={[-4.6, 1.8, 1.3]} />
          <Box size={[0.25, 3.6, 0.25]} position={[4.6, 1.8, 1.3]} />
        </group>
      </Rise>

      {/* secondary clarifiers */}
      <Rise delay={0.55}>
        <Clarifier x={9} z={-10} speed={0.1} />
      </Rise>
      <Rise delay={0.65}>
        <Clarifier x={24} z={-10} speed={0.13} />
      </Rise>
      <Rise delay={0.75}>
        <Clarifier x={9} z={6} speed={0.11} />
      </Rise>
      <Rise delay={0.85}>
        <Clarifier x={24} z={6} speed={0.09} />
      </Rise>

      {/* filters + chlorine contact */}
      <Rise delay={0.95}>
        <group position={[40, 0, -10]}>
          <Basin x={0} z={0} w={10} d={12} h={2.6} lanes={3} />
          <Block w={10} h={4.5} d={4} z={8} />
          <Box size={[10.04, 1.2, 4.04]} position={[0, 3, 8]} mat={mats.glass} />
        </group>
      </Rise>
      <Rise delay={1.05}>
        <Basin x={40} z={10} w={10} d={12} h={2} lanes={1} baffles={4} />
      </Rise>

      {/* storage tank */}
      <Rise delay={1.15}>
        <StorageTank x={60} z={0} />
      </Rise>

      {/* yard piping */}
      <Rise delay={1.25} duration={1}>
        <Pipe from={[-29, -14]} to={[-25, -14]} />
        <Pipe from={[-3, -4]} to={[3, -4]} />
        <Pipe from={[3, -10]} to={[3, 6]} />
        <Pipe from={[16, -10]} to={[16, 6]} r={0.25} />
        <Pipe from={[30, -2]} to={[35, -2]} />
        <Pipe from={[45, 10]} to={[53.5, 10]} />
        <Pipe from={[45, -10]} to={[53.5, -4]} r={0.25} />
      </Rise>

      <TreeBand seed={7} count={420} inner={[-50, -30, 70, 38]} outer={[-95, -75, 110, 70]} />
    </group>
  )
}
