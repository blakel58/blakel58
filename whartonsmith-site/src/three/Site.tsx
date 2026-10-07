import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Block, Box, Flat, Rise, Tree, TreeBand, mats } from './kit'

// A water reclamation facility mid-construction: tower cranes, formwork,
// rebar, structural frames, equipment and laydown yards.

function TowerCrane({ x, z, h = 34, jib = 30, rot = 0, speed = 0.05 }: { x: number; z: number; h?: number; jib?: number; rot?: number; speed?: number }) {
  const top = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (top.current) top.current.rotation.y = rot + Math.sin(clock.elapsedTime * speed) * 0.6
  })
  const lattice = useMemo(() => {
    const out: { p: [number, number, number]; r: number; face: number }[] = []
    for (let i = 0; i < h / 2.4; i++) for (let f = 0; f < 4; f++) out.push({ p: [0, i * 2.4 + 1.2, 0], r: i % 2 ? 0.75 : -0.75, face: f })
    return out
  }, [h])
  return (
    <group position={[x, 0, z]}>
      <Block w={4} h={1} d={4} mat={mats.concrete} />
      {[
        [-0.8, -0.8],
        [0.8, -0.8],
        [-0.8, 0.8],
        [0.8, 0.8],
      ].map(([cx, cz]) => (
        <Box key={`${cx}${cz}`} size={[0.18, h, 0.18]} position={[cx, h / 2, cz]} mat={mats.yellow} />
      ))}
      {lattice.map((l, i) => (
        <group key={i} position={l.p} rotation={[0, (l.face * Math.PI) / 2, 0]}>
          <Box size={[0.08, 2.9, 0.08]} position={[0, 0, 0.8]} rotation={[0, 0, l.r]} mat={mats.yellow} />
        </group>
      ))}
      <group ref={top} position={[0, h, 0]} rotation={[0, rot, 0]}>
        <Box size={[2.2, 2.2, 2.2]} position={[0, 0.6, 0]} mat={mats.yellow} />
        <Box size={[1.6, 1.4, 1.4]} position={[1.4, 0.2, 1.2]} mat={mats.white} />
        {/* jib */}
        <Box size={[jib, 0.9, 0.9]} position={[jib / 2 + 1, 1.4, 0]} mat={mats.yellow} />
        {/* counter jib + counterweights */}
        <Box size={[9, 0.7, 1.2]} position={[-5.5, 1.4, 0]} mat={mats.yellow} />
        <Box size={[2.4, 2.2, 1.8]} position={[-8.6, 0.4, 0]} mat={mats.concrete} />
        {/* apex and pendant lines */}
        <Box size={[0.5, 5, 0.5]} position={[0, 4.4, 0]} mat={mats.yellow} />
        <Box size={[jib * 0.75, 0.08, 0.08]} position={[jib * 0.37, 4.3, 0]} rotation={[0, 0, -0.17]} mat={mats.steel} />
        <Box size={[9.5, 0.08, 0.08]} position={[-4.6, 4.3, 0]} rotation={[0, 0, 0.42]} mat={mats.steel} />
        {/* trolley, hook and load */}
        <Box size={[1.2, 0.5, 1.2]} position={[jib * 0.6, 0.8, 0]} mat={mats.steel} />
        <Box size={[0.05, h * 0.55, 0.05]} position={[jib * 0.6, 0.8 - (h * 0.55) / 2, 0]} mat={mats.steel} />
        <Box size={[3.6, 0.6, 1.2]} position={[jib * 0.6, 0.6 - h * 0.55, 0]} mat={mats.rebar} />
      </group>
    </group>
  )
}

function Excavator({ x, z, rot = 0 }: { x: number; z: number; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Box size={[4.4, 0.9, 1] } position={[0, 0.45, 1.3]} mat={mats.steel} />
      <Box size={[4.4, 0.9, 1]} position={[0, 0.45, -1.3]} mat={mats.steel} />
      <Box size={[3.6, 1.4, 3]} position={[-0.3, 1.6, 0]} mat={mats.yellow} />
      <Box size={[1.4, 1.5, 1.3]} position={[0.6, 2.9, 0.8]} mat={mats.yellow} />
      <Box size={[1.42, 0.9, 1.1]} position={[0.6, 3.1, 0.8]} mat={mats.steel} />
      <Box size={[4.2, 0.6, 0.6]} position={[2.8, 3.4, 0]} rotation={[0, 0, 0.45]} mat={mats.yellow} />
      <Box size={[3.2, 0.5, 0.5]} position={[5.2, 2.6, 0]} rotation={[0, 0, -0.9]} mat={mats.yellow} />
      <Box size={[1.1, 1, 1.4]} position={[6.1, 0.9, 0]} mat={mats.steel} />
    </group>
  )
}

function DumpTruck({ x, z, rot = 0 }: { x: number; z: number; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Box size={[7, 0.6, 2.4]} position={[0, 1, 0]} mat={mats.steel} />
      <Box size={[2, 2, 2.4]} position={[2.6, 2.2, 0]} mat={mats.yellow} />
      <Box size={[4.6, 1.8, 2.6]} position={[-1.1, 2.3, 0]} mat={mats.yellow} />
      <mesh position={[-1.1, 3.1, 0]} scale={[2, 0.6, 1.1]} material={mats.dirtDark} castShadow>
        <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {[2.6, -0.4, -2.4].map((wx) =>
        [1.25, -1.25].map((wz) => (
          <mesh key={`${wx}${wz}`} position={[wx, 0.7, wz]} rotation={[Math.PI / 2, 0, 0]} material={mats.rebar} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 0.5, 16]} />
          </mesh>
        )),
      )}
    </group>
  )
}

function Trailer({ x, z, rot = 0 }: { x: number; z: number; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Block w={12} h={3} d={3.4} y={0.6} mat={mats.white} />
      <Box size={[12.04, 0.6, 3.44]} position={[0, 2.6, 0]} mat={mats.glass} />
      <Box size={[1.6, 0.3, 1.6]} position={[3, 0.75, 2.5]} mat={mats.plywood} />
    </group>
  )
}

function PipeStack({ x, z, n = 4, r = 0.6, len = 9 }: { x: number; z: number; n?: number; r?: number; len?: number }) {
  const pipes: [number, number][] = []
  for (let row = 0; row < 3; row++) for (let i = 0; i < n - row; i++) pipes.push([(i - (n - row - 1) / 2) * r * 2.05, r + row * r * 1.75])
  return (
    <group position={[x, 0, z]}>
      {pipes.map(([px, py], i) => (
        <mesh key={i} position={[px, py, 0]} rotation={[Math.PI / 2, 0, 0]} material={i % 3 ? mats.steel : mats.white} castShadow receiveShadow>
          <cylinderGeometry args={[r, r, len, 20]} />
        </mesh>
      ))}
    </group>
  )
}

function DirtPile({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return (
    <mesh position={[x, 0, z]} scale={[5 * s, 2.4 * s, 4 * s]} material={mats.dirtDark} castShadow receiveShadow>
      <sphereGeometry args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
    </mesh>
  )
}

/** Circular tank wall, optionally only partly poured with rebar standing above. */
function TankWall({ x, z, r = 6, h = 1.8, poured = 1 }: { x: number; z: number; r?: number; h?: number; poured?: number }) {
  const wall = useMemo(() => {
    const t = 0.45
    const ph = Math.max(0.2, h * poured)
    const pts = [new THREE.Vector2(r - t, 0), new THREE.Vector2(r, 0), new THREE.Vector2(r, ph), new THREE.Vector2(r - t, ph), new THREE.Vector2(r - t, 0)]
    return new THREE.LatheGeometry(pts, 64)
  }, [r, h, poured])
  const bars = Math.round(r * 9)
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.1, 0]} material={mats.concrete} receiveShadow>
        <cylinderGeometry args={[r + 0.4, r + 0.4, 0.2, 64]} />
      </mesh>
      <mesh geometry={wall} material={mats.concrete} castShadow receiveShadow />
      {poured < 1 &&
        Array.from({ length: bars }, (_, k) => {
          const a = (k / bars) * Math.PI * 2
          return (
            <mesh key={k} position={[Math.cos(a) * (r - 0.22), h * poured + 1.6, Math.sin(a) * (r - 0.22)]} material={mats.rebar} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 3.2, 4]} />
            </mesh>
          )
        })}
      {poured < 1 && (
        <>
          {/* formwork panels on part of the ring */}
          {Array.from({ length: 10 }, (_, k) => {
            const a = (k / 10) * Math.PI * 0.9
            return (
              <mesh key={`f${k}`} position={[Math.cos(a) * (r + 0.35), h * poured + 1.5, Math.sin(a) * (r + 0.35)]} rotation={[0, -a, 0]} material={mats.plywood} castShadow>
                <boxGeometry args={[0.15, 3, (r * Math.PI * 0.9) / 10]} />
              </mesh>
            )
          })}
        </>
      )}
    </group>
  )
}

/** Steel or concrete frame: columns, beams and floor slabs, no cladding yet. */
function Frame({ x, z, w, d, floors, fh = 4, bays = 4, rot = 0 }: { x: number; z: number; w: number; d: number; floors: number; fh?: number; bays?: number; rot?: number }) {
  const cols: [number, number][] = []
  for (let i = 0; i <= bays; i++) for (let j = 0; j <= 2; j++) cols.push([-w / 2 + (w / bays) * i, -d / 2 + (d / 2) * j])
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Block w={w + 1} h={0.4} d={d + 1} mat={mats.concrete} />
      {cols.map(([cx, cz]) => (
        <Box key={`${cx}${cz}`} size={[0.4, floors * fh, 0.4]} position={[cx, (floors * fh) / 2, cz]} mat={mats.steel} />
      ))}
      {Array.from({ length: floors }, (_, f) => (
        <Box key={f} size={[w + 0.4, 0.35, d + 0.4]} position={[0, (f + 1) * fh, 0]} mat={f === floors - 1 ? mats.steel : mats.concrete} />
      ))}
    </group>
  )
}

const fenceMat = new THREE.MeshStandardMaterial({ color: '#8f969c', transparent: true, opacity: 0.35, roughness: 0.6 })

function Fence({ x1, z1, x2, z2 }: { x1: number; z1: number; x2: number; z2: number }) {
  const len = Math.hypot(x2 - x1, z2 - z1)
  const a = Math.atan2(z2 - z1, x2 - x1)
  return (
    <group position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]} rotation={[0, -a, 0]}>
      <Box size={[len, 1.8, 0.05]} position={[0, 0.9, 0]} mat={fenceMat} />
    </group>
  )
}

export function Site() {
  return (
    <group position={[-8, 0, 0]}>
      <Flat w={124} d={70} x={8} z={0} y={0.015} mat={mats.dirt} />
      <Flat w={180} d={7} x={6} z={40} y={0.02} mat={mats.road} />
      <Flat w={8} d={34} x={-46} z={22} y={0.025} mat={mats.dirtDark} />

      {/* aeration basins: walls complete */}
      <Rise delay={0.2}>
        <group position={[-14, 0, -4]}>
          <Block w={22} h={0.4} d={26} mat={mats.concrete} />
          <Block w={22} h={2.4} d={0.4} z={-12.8} mat={mats.concrete} />
          <Block w={22} h={2.4} d={0.4} z={12.8} mat={mats.concrete} />
          <Block w={0.4} h={2.4} d={26} x={-10.8} mat={mats.concrete} />
          <Block w={0.4} h={2.4} d={26} x={10.8} mat={mats.concrete} />
          {[-5.5, 0, 5.5].map((lx) => (
            <Block key={lx} w={0.35} h={2.4} d={25} x={lx} mat={mats.concrete} />
          ))}
        </group>
      </Rise>

      {/* clarifiers in various stages */}
      <Rise delay={0.4}>
        <TankWall x={9} z={-10} />
      </Rise>
      <Rise delay={0.55}>
        <TankWall x={24} z={-10} />
      </Rise>
      <Rise delay={0.7}>
        <TankWall x={9} z={6} poured={0.35} />
      </Rise>
      <Rise delay={0.85}>
        <TankWall x={24} z={6} poured={0.12} />
      </Rise>

      {/* headworks + operations as structural frames */}
      <Rise delay={0.3}>
        <Frame x={-38} z={-14} w={9} d={7} floors={2} fh={3.3} bays={3} />
      </Rise>
      <Rise delay={0.5} duration={1.6}>
        <Frame x={-36} z={9} w={16} d={10} floors={2} bays={4} />
      </Rise>

      {/* filters: walls, half-built storage tank */}
      <Rise delay={1}>
        <group position={[40, 0, -10]}>
          <Block w={10} h={0.4} d={12} mat={mats.concrete} />
          <Block w={10} h={2.6} d={0.4} z={-5.8} mat={mats.concrete} />
          <Block w={10} h={2.6} d={0.4} z={5.8} mat={mats.concrete} />
          <Block w={0.4} h={2.6} d={12} x={-4.8} mat={mats.concrete} />
          <Block w={0.4} h={1.2} d={12} x={4.8} mat={mats.concrete} />
        </group>
      </Rise>
      <Rise delay={1.1}>
        <TankWall x={60} z={0} r={6.5} h={6} poured={0.45} />
      </Rise>

      {/* cranes */}
      <Rise delay={0} duration={1.8}>
        <TowerCrane x={16} z={-1} h={36} jib={32} rot={0.6} speed={0.06} />
      </Rise>
      <Rise delay={0.25} duration={1.8}>
        <TowerCrane x={-24} z={18} h={30} jib={26} rot={-2.2} speed={0.045} />
      </Rise>

      {/* equipment, laydown, trailers */}
      <Rise delay={1.2} duration={0.9}>
        <Excavator x={42} z={14} rot={2.4} />
        <DumpTruck x={52} z={24} rot={0.3} />
        <DumpTruck x={-46} z={32} rot={1.57} />
        <DirtPile x={48} z={-26} s={1.4} />
        <DirtPile x={58} z={-20} s={0.9} />
        <PipeStack x={28} z={24} />
        <PipeStack x={18} z={26} n={5} r={0.4} len={7} />
        <Trailer x={-34} z={30} />
        <Trailer x={-18} z={30} />
        <Box size={[6, 0.5, 6]} position={[2, 0.25, 26]} mat={mats.plywood} />
        <Box size={[6, 0.5, 6]} position={[2, 0.75, 26]} mat={mats.plywood} />
      </Rise>

      {/* site fence */}
      <Fence x1={-54} z1={-35} x2={72} z2={-35} />
      <Fence x1={72} z1={-35} x2={72} z2={35} />
      <Fence x1={-54} z1={-35} x2={-54} z2={12} />

      {Array.from({ length: 12 }, (_, k) => (
        <Tree key={k} x={-56 + k * 11} z={46} s={0.9} dark={k % 2 === 0} />
      ))}
      <TreeBand seed={11} count={320} inner={[-58, -38, 76, 50]} outer={[-110, -90, 120, 85]} />
    </group>
  )
}
