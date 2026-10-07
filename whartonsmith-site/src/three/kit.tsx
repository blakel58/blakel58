import { createContext, useContext, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Shared materials and building blocks for the architectural model scenes.

export const palette = {
  sky: '#e8e5df',
  ground: '#d6d1c7',
  paving: '#eeece7',
  road: '#d5ccbf',
  clay: '#f3f0ea',
  clayShade: '#e4dfd6',
  glass: '#9097a0',
  water: '#8fa8a8',
  tree: '#a7ad97',
  treeDark: '#919985',
  grass: '#c3c8ac',
  track: '#c4937a',
  corten: '#a4502b',
  line: '#f7f4ef',
}

export const mats = {
  clay: new THREE.MeshStandardMaterial({ color: palette.clay, roughness: 0.95 }),
  clayShade: new THREE.MeshStandardMaterial({ color: palette.clayShade, roughness: 0.95 }),
  glass: new THREE.MeshStandardMaterial({ color: palette.glass, roughness: 0.35, metalness: 0.1 }),
  water: new THREE.MeshStandardMaterial({ color: palette.water, roughness: 0.12, metalness: 0.05 }),
  ground: new THREE.MeshStandardMaterial({ color: palette.ground, roughness: 1 }),
  paving: new THREE.MeshStandardMaterial({ color: palette.paving, roughness: 1 }),
  road: new THREE.MeshStandardMaterial({ color: palette.road, roughness: 1 }),
  tree: new THREE.MeshStandardMaterial({ color: palette.tree, roughness: 0.9 }),
  treeDark: new THREE.MeshStandardMaterial({ color: palette.treeDark, roughness: 0.9 }),
  grass: new THREE.MeshStandardMaterial({ color: palette.grass, roughness: 1 }),
  track: new THREE.MeshStandardMaterial({ color: palette.track, roughness: 1 }),
  corten: new THREE.MeshStandardMaterial({ color: palette.corten, roughness: 0.7 }),
  line: new THREE.MeshStandardMaterial({ color: palette.line, roughness: 1 }),
}

/** Build-in timing. `instant` renders everything finished (used for stills). */
export const BuildContext = createContext<{ instant: boolean; start: number }>({ instant: true, start: 0 })

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

/** Grows its children up out of the ground after `delay` seconds. */
export function Rise({ delay = 0, duration = 1.4, children, position }: {
  delay?: number
  duration?: number
  children: ReactNode
  position?: [number, number, number]
}) {
  const ref = useRef<THREE.Group>(null)
  const { instant, start } = useContext(BuildContext)
  useFrame(({ clock }) => {
    if (!ref.current) return
    if (instant) {
      ref.current.scale.y = 1
      ref.current.visible = true
      return
    }
    const t = Math.min(1, Math.max(0, (clock.elapsedTime - start - delay) / duration))
    ref.current.visible = t > 0
    ref.current.scale.y = Math.max(0.0001, easeOut(t))
  })
  return (
    <group ref={ref} position={position} scale={[1, instant ? 1 : 0.0001, 1]}>
      {children}
    </group>
  )
}

type V3 = [number, number, number]

export function Box({ size, position, mat = mats.clay, rotation }: { size: V3; position: V3; mat?: THREE.Material; rotation?: V3 }) {
  return (
    <mesh position={position} rotation={rotation} material={mat} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  )
}

/** Box sitting on y=0 (position is its footprint centre). */
export function Block({ w, h, d, x = 0, z = 0, y = 0, mat = mats.clay }: { w: number; h: number; d: number; x?: number; z?: number; y?: number; mat?: THREE.Material }) {
  return <Box size={[w, h, d]} position={[x, y + h / 2, z]} mat={mat} />
}

/** A simple building with glazing bands and a roof parapet. */
export function Building({ w, d, floors = 1, floorH = 4, x = 0, z = 0, fins = 0, rot = 0 }: {
  w: number
  d: number
  floors?: number
  floorH?: number
  x?: number
  z?: number
  fins?: number
  rot?: number
}) {
  const h = floors * floorH
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <Block w={w} h={h} d={d} />
      {Array.from({ length: floors }, (_, f) => (
        <Box key={f} size={[w + 0.04, floorH * 0.42, d + 0.04]} position={[0, f * floorH + floorH * 0.5, 0]} mat={mats.glass} />
      ))}
      {/* slab edges between floors */}
      {Array.from({ length: floors }, (_, f) => (
        <Box key={`s${f}`} size={[w + 0.25, 0.28, d + 0.25]} position={[0, (f + 1) * floorH - 0.14, 0]} />
      ))}
      {/* vertical fins on the long faces */}
      {fins > 0 &&
        Array.from({ length: fins }, (_, k) => {
          const fx = -w / 2 + (w / (fins - 1)) * k
          return (
            <group key={`f${k}`}>
              <Box size={[0.22, h, 0.7]} position={[fx, h / 2, d / 2 + 0.35]} />
              <Box size={[0.22, h, 0.7]} position={[fx, h / 2, -d / 2 - 0.35]} />
            </group>
          )
        })}
      {/* parapet + rooftop units */}
      <Box size={[w + 0.3, 0.6, d + 0.3]} position={[0, h + 0.3, 0]} />
      <Block w={Math.min(4, w * 0.25)} h={1.1} d={Math.min(3, d * 0.3)} x={w * 0.18} z={-d * 0.1} y={h} mat={mats.clayShade} />
      <Block w={Math.min(2.4, w * 0.15)} h={0.9} d={Math.min(2.4, d * 0.2)} x={-w * 0.22} z={d * 0.15} y={h} mat={mats.clayShade} />
    </group>
  )
}

export function Pipe({ from, to, y = 0.9, r = 0.3, mat = mats.clayShade }: { from: [number, number]; to: [number, number]; y?: number; r?: number; mat?: THREE.Material }) {
  const [x1, z1] = from
  const [x2, z2] = to
  const len = Math.hypot(x2 - x1, z2 - z1)
  const angle = Math.atan2(z2 - z1, x2 - x1)
  return (
    <group position={[(x1 + x2) / 2, y, (z1 + z2) / 2]} rotation={[0, -angle, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} material={mat} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, len, 16]} />
      </mesh>
      {Array.from({ length: Math.max(1, Math.floor(len / 4)) }, (_, k) => (
        <Box key={k} size={[0.3, y, 0.6]} position={[-len / 2 + 2 + k * 4, -y / 2, 0]} mat={mats.clay} />
      ))}
    </group>
  )
}

/** Deterministic pseudo-random generator so scenes look the same every load. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const canopyGeo = new THREE.IcosahedronGeometry(1, 4)
const trunkGeo = new THREE.CylinderGeometry(0.12, 0.16, 1, 6)

export function Tree({ x, z, s = 1, dark = false }: { x: number; z: number; s?: number; dark?: boolean }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh geometry={trunkGeo} material={mats.clayShade} position={[0, 0.6, 0]} scale={[1, 1.2, 1]} castShadow />
      <mesh geometry={canopyGeo} material={dark ? mats.treeDark : mats.tree} position={[0, 2.1, 0]} scale={[1.25, 1.35, 1.25]} castShadow receiveShadow />
    </group>
  )
}

/** Trees scattered in a band around a rectangle, avoiding its interior. */
export function TreeBand({ seed, inner, outer, count }: {
  seed: number
  inner: [number, number, number, number] // minX, minZ, maxX, maxZ to keep clear
  outer: [number, number, number, number]
  count: number
}) {
  const trees = useMemo(() => {
    const r = rng(seed)
    const out: { x: number; z: number; s: number; dark: boolean }[] = []
    let guard = 0
    while (out.length < count && guard++ < count * 50) {
      const x = outer[0] + r() * (outer[2] - outer[0])
      const z = outer[1] + r() * (outer[3] - outer[1])
      if (x > inner[0] && x < inner[2] && z > inner[1] && z < inner[3]) continue
      if (out.some((t) => Math.hypot(t.x - x, t.z - z) < 2.2)) continue
      out.push({ x, z, s: 0.8 + r() * 0.8, dark: r() > 0.6 })
    }
    return out
  }, [seed, inner, outer, count])
  return (
    <>
      {trees.map((t, i) => (
        <Tree key={i} {...t} />
      ))}
    </>
  )
}

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats.ground} receiveShadow>
      <planeGeometry args={[800, 800]} />
    </mesh>
  )
}

export function Flat({ w, d, x = 0, z = 0, y = 0.02, mat, rot = 0 }: { w: number; d: number; x?: number; z?: number; y?: number; mat: THREE.Material; rot?: number }) {
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, rot]} material={mat} receiveShadow>
      <planeGeometry args={[w, d]} />
    </mesh>
  )
}
