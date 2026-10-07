import { Box, Building, Flat, Rise, Tree, TreeBand, mats } from './kit'

// Massing model of a justice campus: a five-storey annex with vertical fins
// next to an open-deck precast parking garage, around a planted plaza.

function Garage({ x, z, w = 34, d = 26, levels = 5, lh = 3.2 }: { x: number; z: number; w?: number; d?: number; levels?: number; lh?: number }) {
  const cols: [number, number][] = []
  for (let i = 0; i <= 5; i++) for (let j = 0; j <= 3; j++) cols.push([-w / 2 + 1 + (i * (w - 2)) / 5, -d / 2 + 1 + (j * (d - 2)) / 3])
  return (
    <group position={[x, 0, z]}>
      {Array.from({ length: levels }, (_, l) => (
        <group key={l}>
          <Box size={[w, 0.45, d]} position={[0, (l + 1) * lh, 0]} />
          {/* spandrel panels */}
          <Box size={[w + 0.1, 1.1, 0.3]} position={[0, (l + 1) * lh + 0.75, d / 2]} />
          <Box size={[w + 0.1, 1.1, 0.3]} position={[0, (l + 1) * lh + 0.75, -d / 2]} />
          <Box size={[0.3, 1.1, d]} position={[w / 2, (l + 1) * lh + 0.75, 0]} />
          <Box size={[0.3, 1.1, d]} position={[-w / 2, (l + 1) * lh + 0.75, 0]} />
        </group>
      ))}
      {cols.map(([cx, cz]) => (
        <Box key={`${cx}${cz}`} size={[0.6, levels * lh, 0.6]} position={[cx, (levels * lh) / 2, cz]} />
      ))}
      {/* stair / elevator core */}
      <Box size={[4, levels * lh + 3, 5]} position={[w / 2 - 2, (levels * lh + 3) / 2, -d / 2 + 2.5]} mat={mats.clayShade} />
    </group>
  )
}

export function Civic() {
  return (
    <group position={[-4, 0, 0]}>
      <Flat w={100} d={64} y={0.015} mat={mats.paving} />
      <Flat w={200} d={7} z={38} y={0.02} mat={mats.road} />
      <Flat w={7} d={200} x={52} y={0.02} mat={mats.road} />

      {/* existing courthouse, lower */}
      <Rise delay={0}>
        <Building w={30} d={22} floors={2} floorH={4.5} x={-28} z={-10} />
      </Rise>
      {/* justice center annex */}
      <Rise delay={0.25} duration={1.8}>
        <Building w={26} d={16} floors={5} floorH={4} x={4} z={-12} fins={14} />
      </Rise>
      {/* connector */}
      <Rise delay={0.45}>
        <Box size={[8, 4, 6]} position={[-11, 2, -12]} />
      </Rise>
      {/* parking garage */}
      <Rise delay={0.6} duration={1.8}>
        <Garage x={30} z={6} />
      </Rise>

      {/* plaza */}
      <Flat w={30} d={14} x={-6} z={12} y={0.03} mat={mats.grass} />
      {[
        [-16, 9],
        [-10, 15],
        [-2, 9],
        [4, 15],
        [-20, 16],
      ].map(([x, z]) => (
        <Tree key={`${x}${z}`} x={x} z={z} s={1.1} />
      ))}
      {Array.from({ length: 10 }, (_, k) => (
        <Tree key={`r${k}`} x={-44 + k * 9} z={33} s={0.95} dark={k % 2 === 1} />
      ))}
      <TreeBand seed={33} count={360} inner={[-50, -34, 58, 42]} outer={[-100, -80, 110, 75]} />
    </group>
  )
}
