import { useEffect, useState } from 'react'

// Minimal hash router. Routes are plain tokens (#water, #projects) so links
// also work inside hosts that only pass simple anchors through.

export const routes = ['home', 'water', 'commercial', 'projects', 'technology', 'process', 'about', 'careers', 'contact'] as const
export type Route = (typeof routes)[number]

const parse = (): Route => {
  const h = window.location.hash.replace(/^#\/?/, '') as Route
  return routes.includes(h) ? h : 'home'
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}
