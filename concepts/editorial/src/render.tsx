// Dev-only page used to render still images of the 3D scenes:
//   /render.html?view=plant-aerial
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Stage } from './three/Stage'

const view = new URLSearchParams(location.search).get('view') ?? 'hero'

function Render() {
  const [active, setActive] = useState(true)
  return (
    <Stage
      view={view}
      instant
      dpr={1}
      active={active}
      onReady={() => {
        setActive(false)
        setTimeout(() => {
          ;(window as unknown as { __ready: boolean }).__ready = true
        }, 100)
      }}
    />
  )
}

createRoot(document.getElementById('root')!).render(<Render />)
