'use client'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { KlondikeSolitaire } from '../components/KlondikeSolitaire'

export default function Home() {
  React.useEffect(() => {
    const container = document.getElementById('app')
    if (container) {
      const root = createRoot(container)
      root.render(<KlondikeSolitaire />)
    }
  }, [])

  return <div id="app" className="min-h-screen bg-gradient-to-b from-green-800 to-green-600 p-8" />
}

