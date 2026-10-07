import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, N8AO, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import { BuildContext, Ground, palette } from './kit'
import { Plant } from './Plant'
import { School } from './School'
import { Civic } from './Civic'
import { Venue } from './Venue'
import { Site } from './Site'

export type SceneKey = 'plant' | 'school' | 'civic' | 'venue' | 'site'

export type View = { pos: [number, number, number]; target: [number, number, number]; fov?: number }

export const views: Record<string, View & { scene: SceneKey }> = {
  hero: { scene: 'plant', pos: [104, 60, 116], target: [8, 0, -6], fov: 26 },
  'plant-aerial': { scene: 'plant', pos: [10, 130, 60], target: [8, 0, -2], fov: 30 },
  'plant-low': { scene: 'plant', pos: [38, 7, 30], target: [8, 2, -6], fov: 30 },
  'plant-side': { scene: 'plant', pos: [-80, 30, 60], target: [0, 0, 0], fov: 28 },
  'school-a': { scene: 'school', pos: [100, 62, 96], target: [4, 0, 0], fov: 28 },
  'school-b': { scene: 'school', pos: [-60, 22, 46], target: [-6, 3, 0], fov: 30 },
  'civic-a': { scene: 'civic', pos: [92, 58, 96], target: [2, 4, -2], fov: 28 },
  'site-hero': { scene: 'site', pos: [96, 52, 104], target: [6, 6, -4], fov: 28 },
  'site-low': { scene: 'site', pos: [60, 9, 46], target: [10, 10, -4], fov: 34 },
  'site-4d': { scene: 'site', pos: [110, 80, 110], target: [6, 0, -2], fov: 28 },
  'venue-a': { scene: 'venue', pos: [96, 70, 104], target: [0, 4, 0], fov: 28 },
  'civic-b': { scene: 'civic', pos: [-30, 9, 48], target: [0, 9, 0], fov: 32 },
}

function Lights({ sun = [-85, 40, 34] as [number, number, number], hq = true }) {
  return (
    <>
      <hemisphereLight args={['#f3f5f7', '#a89e8f', 1.0]} />
      <directionalLight
        position={sun}
        intensity={3.6}
        color="#ffe7cc"
        castShadow
        shadow-mapSize={hq ? [4096, 4096] : [2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-camera-near={1}
        shadow-camera-far={300}
      />
    </>
  )
}

/** Moves the camera between its base view and a scroll/pointer-driven offset. */
function Rig({ view, interactive }: { view: View; interactive: boolean }) {
  const { camera, pointer } = useThree()
  const target = useMemo(() => new THREE.Vector3(...view.target), [view])
  const base = useMemo(() => new THREE.Vector3(...view.pos), [view])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock }) => {
    if (!interactive) {
      camera.position.copy(base)
      camera.lookAt(target)
      return
    }
    const scroll = Math.min(1, window.scrollY / window.innerHeight)
    const t = clock.elapsedTime
    // slow orbit drift, dolly in on scroll, gentle pointer parallax
    const ang = Math.sin(t * 0.05) * 0.06 + pointer.x * 0.04
    tmp.copy(base).sub(target)
    tmp.applyAxisAngle(new THREE.Vector3(0, 1, 0), ang)
    tmp.multiplyScalar(1 - scroll * 0.28)
    tmp.y += pointer.y * 3 - scroll * 6
    tmp.add(target)
    camera.position.lerp(tmp, 0.06)
    camera.lookAt(target)
  })
  return null
}

function Ready({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0)
  useFrame(() => {
    frames.current++
    if (frames.current === 30) onReady?.()
  })
  return null
}

function SceneContent({ scene }: { scene: SceneKey }) {
  if (scene === 'school') return <School />
  if (scene === 'civic') return <Civic />
  if (scene === 'venue') return <Venue />
  if (scene === 'site') return <Site />
  return <Plant />
}

export function Stage({
  view: viewKey,
  instant = false,
  interactive = false,
  active = true,
  onReady,
  className,
  dpr = [1, 1.5],
  manual,
}: {
  view: keyof typeof views | string
  instant?: boolean
  interactive?: boolean
  active?: boolean
  onReady?: () => void
  className?: string
  dpr?: number | [number, number]
  manual?: { current: number }
}) {
  const view = views[viewKey] ?? views.hero
  const sky = view.scene === 'site' ? '#dde2e4' : palette.sky
  const [start, setStart] = useState(0)
  useEffect(() => setStart(0.3), [])

  return (
    <Canvas
      className={className}
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance', toneMapping: THREE.NoToneMapping }}
      camera={{ position: view.pos, fov: view.fov ?? 28, near: 1, far: 600 }}
    >
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 190, 460]} />
      <BuildContext.Provider value={{ instant, start, manual }}>
        <Suspense fallback={null}>
          <Lights hq={instant} />
          <Ground />
          <SceneContent scene={view.scene} />
        </Suspense>
      </BuildContext.Provider>
      <Rig view={view} interactive={interactive} />
      <Ready onReady={onReady} />
      <EffectComposer multisampling={instant ? 4 : 2}>
        <N8AO aoRadius={5} intensity={3} distanceFalloff={1.4} quality={instant ? 'high' : 'medium'} halfRes={!instant} />
        <Vignette offset={0.35} darkness={0.35} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  )
}
