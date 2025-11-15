'use client'

import { useState } from 'react'
import { ConnectionLine } from '@/components/ui/connection-line'
import { Badge } from '@/components/ui/badge'

export default function ConnectionDemo() {
  const [connections, setConnections] = useState([
    {
      id: 1,
      from: { x: 200, y: 100 },
      to: { x: 500, y: 150 },
      type: 'standard' as const,
      animated: false,
    },
    {
      id: 2,
      from: { x: 200, y: 200 },
      to: { x: 500, y: 250 },
      type: 'success' as const,
      animated: false,
    },
    {
      id: 3,
      from: { x: 200, y: 300 },
      to: { x: 500, y: 350 },
      type: 'error' as const,
      animated: false,
    },
    {
      id: 4,
      from: { x: 200, y: 400 },
      to: { x: 500, y: 450 },
      type: 'conditional' as const,
      animated: false,
    },
  ])

  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const handleDelete = (id: number) => {
    setConnections(connections.filter((c) => c.id !== id))
  }

  const handleAddAnimated = () => {
    const newConnection = {
      id: Date.now(),
      from: { x: 200, y: 500 },
      to: { x: 500, y: 550 },
      type: 'standard' as const,
      animated: true,
    }
    setConnections([...connections, newConnection])

    // Remove animated flag after animation completes
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) => (c.id === newConnection.id ? { ...c, animated: false } : c))
      )
    }, 600)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-heading-xl text-text-primary">Connection Lines</h1>
          <p className="text-body text-text-secondary">
            SVG connection lines for workflow nodes with hover effects and animations
          </p>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddAnimated}
            className="rounded-lg bg-primary-500 px-4 py-2 text-body-medium text-white transition-colors hover:bg-primary-600"
          >
            Add Animated Connection
          </button>
          <p className="text-body-small text-text-secondary">
            Hover over lines to see delete button
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface p-4">
          <span className="text-label text-text-secondary">CONNECTION TYPES:</span>
          <Badge status="pending" text="Standard" size="sm" />
          <Badge status="success" text="Success" size="sm" />
          <Badge status="error" text="Error" size="sm" />
          <Badge status="warning" text="Conditional (Dashed)" size="sm" />
        </div>

        {/* Canvas */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
          <svg
            width="100%"
            height="600"
            viewBox="0 0 700 600"
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
          >
            {/* Grid pattern */}
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="1"
                  cy="1"
                  r="1"
                  fill="currentColor"
                  className="text-gray-300 dark:text-gray-700"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Start nodes (outputs) */}
            {connections.map((conn) => (
              <g key={`start-${conn.id}`}>
                <rect
                  x={conn.from.x - 80}
                  y={conn.from.y - 20}
                  width="80"
                  height="40"
                  rx="6"
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  className="dark:fill-[#252525] dark:stroke-gray-700"
                />
                <text
                  x={conn.from.x - 40}
                  y={conn.from.y + 5}
                  textAnchor="middle"
                  className="text-label fill-gray-900 dark:fill-gray-100"
                >
                  Output
                </text>
                <circle
                  cx={conn.from.x}
                  cy={conn.from.y}
                  r="4"
                  fill="#14B8A6"
                />
              </g>
            ))}

            {/* End nodes (inputs) */}
            {connections.map((conn) => (
              <g key={`end-${conn.id}`}>
                <circle cx={conn.to.x} cy={conn.to.y} r="4" fill="#14B8A6" />
                <rect
                  x={conn.to.x}
                  y={conn.to.y - 20}
                  width="80"
                  height="40"
                  rx="6"
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  className="dark:fill-[#252525] dark:stroke-gray-700"
                />
                <text
                  x={conn.to.x + 40}
                  y={conn.to.y + 5}
                  textAnchor="middle"
                  className="text-label fill-gray-900 dark:fill-gray-100"
                >
                  Input
                </text>
              </g>
            ))}

            {/* Connection lines */}
            {connections.map((conn) => (
              <ConnectionLine
                key={conn.id}
                from={conn.from}
                to={conn.to}
                type={conn.type}
                onDelete={() => handleDelete(conn.id)}
                isHovered={hoveredId === conn.id}
                animated={conn.animated}
              />
            ))}
          </svg>
        </div>

        {/* Feature List */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-border bg-surface p-6">
            <h3 className="text-heading-s text-text-primary">Visual Features</h3>
            <ul className="space-y-2 text-body-small text-text-secondary">
              <li>• Cubic Bezier curves with 40% control points</li>
              <li>• 2px stroke width (3px on hover)</li>
              <li>• Gray default, brand color on hover</li>
              <li>• Arrow heads automatically oriented</li>
              <li>• Dashed lines for conditional connections</li>
            </ul>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-surface p-6">
            <h3 className="text-heading-s text-text-primary">Interactions</h3>
            <ul className="space-y-2 text-body-small text-text-secondary">
              <li>• Hover detection with 20px invisible path</li>
              <li>• Delete button appears at curve midpoint</li>
              <li>• 0.15s smooth transitions</li>
              <li>• 0.3s fade-in animation</li>
              <li>• Stroke-dasharray drawing effect</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
