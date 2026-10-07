import { useMemo } from 'react'
import * as THREE from 'three'
import { Box, Flat, Rise, Tree, TreeBand, mats } from './kit'

// Massing model of a sports and entertainment venue: a stepped seating bowl
// with a floating roof ring, on a landscaped plaza.

export function Venue() {
  const bowl = useMemo(() => {
    const pts: THREE.Vector2[] = [new THREE.Vector2(12, 0)]
    for (let i = 0; i < 9; i++) {
      pts.push(new THREE.Vector2(12 + i * 1.6, 0.6 + i * 1.1))
      pts.push(new THREE.Vector2(12 + (i + 1) * 1.6, 0.6 + i * 1.1))
    }
    pts.push(new THREE.Vector2(28.6, 10.5), new THREE.Vector2(29.2, 10.5), new THREE.Vector2(29.2, 0), new THREE.Vector2(12, 0))
    return new THREE.LatheGeometry(pts, 96)
  }, [])
  return (
    <group>
      <Flat w={110} d={90} y={0.015} mat={mats.paving} />
      <Flat w={220} d={8} z={52} y={0.02} mat={mats.road} />
      <Rise delay={0} duration={1.8}>
        <group scale={[1.35, 1, 1]}>
          <mesh geometry={bowl} material={mats.clay} castShadow receiveShadow />
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.grass} receiveShadow>
            <circleGeometry args={[12, 64]} />
          </mesh>
          {/* roof ring */}
          {Array.from({ length: 24 }, (_, k) => {
            const a = (k / 24) * Math.PI * 2
            return <Box key={k} size={[0.5, 6, 0.5]} position={[Math.cos(a) * 28.9, 13.5, Math.sin(a) * 28.9]} />
          })}
          <mesh position={[0, 16.6, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.clay} castShadow receiveShadow>
            <ringGeometry args={[20, 30.5, 96]} />
          </mesh>
          <mesh position={[0, 16.6, 0]} material={mats.clay} castShadow>
            <cylinderGeometry args={[30.5, 30.5, 0.9, 96, 1, true]} />
          </mesh>
        </group>
      </Rise>
      {/* plaza lawns and allées */}
      <Flat w={22} d={12} x={-34} z={36} y={0.03} mat={mats.grass} />
      <Flat w={22} d={12} x={34} z={36} y={0.03} mat={mats.grass} />
      {Array.from({ length: 12 }, (_, k) => (
        <Tree key={k} x={-50 + k * 9} z={44} s={0.95} dark={k % 2 === 0} />
      ))}
      <TreeBand seed={44} count={360} inner={[-58, -48, 58, 56]} outer={[-110, -90, 110, 85]} />
    </group>
  )
}
