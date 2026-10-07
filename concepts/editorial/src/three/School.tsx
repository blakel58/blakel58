import { useMemo } from 'react'
import * as THREE from 'three'
import { Box, Building, Flat, Rise, Tree, TreeBand, mats } from './kit'

// Massing model of a high school campus: classroom wings around a courtyard,
// gymnasium, entry canopy, and an athletic field with running track.

function roundedRect(w: number, d: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -d / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + d - r)
  s.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + d)
  s.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

function Field({ x, z }: { x: number; z: number }) {
  const geo = useMemo(() => {
    const outer = roundedRect(30, 58, 15)
    const inner = roundedRect(22, 50, 11)
    outer.holes.push(inner as unknown as THREE.Path)
    return new THREE.ShapeGeometry(outer, 48)
  }, [])
  const infield = useMemo(() => new THREE.ShapeGeometry(roundedRect(22, 50, 11), 48), [])
  return (
    <group position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geo} material={mats.track} receiveShadow />
      <mesh geometry={infield} material={mats.grass} receiveShadow position={[0, 0, 0.005]} />
      {[-12, 0, 12].map((y) => (
        <mesh key={y} position={[0, y, 0.01]} material={mats.line}>
          <planeGeometry args={[16, 0.15]} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.01]} material={mats.line}>
        <ringGeometry args={[2.6, 2.8, 48]} />
      </mesh>
    </group>
  )
}

export function School() {
  return (
    <group position={[-6, 0, 0]}>
      <Flat w={96} d={64} x={0} z={0} y={0.015} mat={mats.paving} />
      <Flat w={200} d={7} x={0} z={38} y={0.02} mat={mats.road} />

      {/* courtyard lawn */}
      <Flat w={22} d={20} x={-14} z={0} y={0.03} mat={mats.grass} />

      <Rise delay={0}>
        <Building w={44} d={10} floors={2} floorH={4.2} x={-14} z={-15} />
      </Rise>
      <Rise delay={0.2}>
        <Building w={44} d={10} floors={2} floorH={4.2} x={-14} z={15} />
      </Rise>
      <Rise delay={0.35}>
        <Building w={10} d={20} floors={2} floorH={4.2} x={-31} z={0} />
      </Rise>
      {/* gymnasium */}
      <Rise delay={0.5}>
        <group position={[16, 0, -6]}>
          <Building w={20} d={26} floors={1} floorH={10} />
          <Box size={[20.6, 1, 0.6]} position={[0, 10.5, 13]} />
        </group>
      </Rise>
      {/* entry canopy */}
      <Rise delay={0.65}>
        <group position={[-14, 0, 24]}>
          <Box size={[18, 0.35, 6]} position={[0, 4.2, 0]} />
          {[-8, -2.7, 2.7, 8].map((x) => (
            <Box key={x} size={[0.3, 4.2, 0.3]} position={[x, 2.1, 2.6]} />
          ))}
        </group>
      </Rise>
      <Rise delay={0.8} duration={1.6}>
        <Field x={48} z={2} />
      </Rise>

      {/* courtyard trees */}
      {[
        [-22, -4],
        [-8, 4],
        [-16, 6],
        [-6, -5],
      ].map(([x, z]) => (
        <Tree key={`${x}${z}`} x={x} z={z} s={1.1} />
      ))}
      {Array.from({ length: 9 }, (_, k) => (
        <Tree key={`r${k}`} x={-44 + k * 8} z={33} s={0.9} dark={k % 2 === 0} />
      ))}
      <TreeBand seed={21} count={380} inner={[-50, -34, 72, 42]} outer={[-100, -80, 110, 75]} />
    </group>
  )
}
