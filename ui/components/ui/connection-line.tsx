'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface ConnectionLineProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  type?: 'standard' | 'success' | 'error' | 'conditional'
  label?: string // Added label prop for decision branches
  onDelete?: () => void
  isHovered?: boolean
  animated?: boolean
}

export function ConnectionLine({
  from,
  to,
  type = 'standard',
  label, // Added label parameter
  onDelete,
  isHovered = false,
  animated = false,
}: ConnectionLineProps) {
  const [isLocalHovered, setIsLocalHovered] = useState(false)
  const showHover = isHovered || isLocalHovered

  // Calculate the cubic Bezier curve path
  const dx = to.x - from.x
  const dy = to.y - from.y
  
  // Control points at 40% horizontal distance for natural flow
  const controlPointOffset = Math.abs(dx) * 0.4
  const cp1x = from.x + controlPointOffset
  const cp1y = from.y
  const cp2x = to.x - controlPointOffset
  const cp2y = to.y

  const path = `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`

  // Calculate midpoint for delete button
  const t = 0.5 // Midpoint of the curve
  const mt = 1 - t
  const midX = mt * mt * mt * from.x + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * to.x
  const midY = mt * mt * mt * from.y + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * to.y

  const labelT = 0.3
  const labelMt = 1 - labelT
  const labelX = labelMt * labelMt * labelMt * from.x + 3 * labelMt * labelMt * labelT * cp1x + 3 * labelMt * labelT * labelT * cp2x + labelT * labelT * labelT * to.x
  const labelY = labelMt * labelMt * labelMt * from.y + 3 * labelMt * labelMt * labelT * cp1y + 3 * labelMt * labelT * labelT * cp2y + labelT * labelT * labelT * to.y

  // Get stroke color based on type
  const getStrokeColor = () => {
    if (showHover) return '#14B8A6' // Brand teal
    switch (type) {
      case 'success':
        return '#10B981' // Green
      case 'error':
        return '#EF4444' // Red
      case 'conditional':
        return '#F59E0B' // Yellow
      default:
        return '#9CA3AF' // Gray
    }
  }

  const getLabelColor = () => {
    if (label === 'True') return '#10B981' // Green
    if (label === 'False') return '#EF4444' // Red
    return '#6B7280' // Gray
  }

  const strokeWidth = showHover ? 3 : 2
  const strokeDasharray = type === 'conditional' ? '8 4' : undefined

  // Calculate path length for animation
  const pathLength = Math.sqrt(dx * dx + dy * dy) * 1.5

  return (
    <g
      onMouseEnter={() => setIsLocalHovered(true)}
      onMouseLeave={() => setIsLocalHovered(false)}
      style={{ pointerEvents: 'all' }}
    >
      {/* Invisible wider path for easier hover detection */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: onDelete ? 'pointer' : 'default' }}
      />

      {/* Visible connection line */}
      <path
        d={path}
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        style={{
          transition: 'stroke 0.15s ease, stroke-width 0.15s ease, opacity 0.3s ease',
          opacity: animated ? 0 : 1,
          animation: animated ? 'fadeIn 0.3s ease forwards' : undefined,
        }}
      />

      {/* Arrow head at the end */}
      <defs>
        <marker
          id={`arrowhead-${type}-${showHover ? 'hover' : 'normal'}`}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill={getStrokeColor()}
            style={{ transition: 'fill 0.15s ease' }}
          />
        </marker>
      </defs>

      <path
        d={path}
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        markerEnd={`url(#arrowhead-${type}-${showHover ? 'hover' : 'normal'})`}
        style={{
          transition: 'stroke 0.15s ease, stroke-width 0.15s ease, opacity 0.3s ease',
          opacity: animated ? 0 : 1,
          animation: animated ? 'fadeIn 0.3s ease forwards' : undefined,
        }}
      />

      {/* Drawing animation overlay */}
      {animated && (
        <path
          d={path}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={`${pathLength} ${pathLength}`}
          strokeDashoffset={pathLength}
          strokeLinecap="round"
          markerEnd={`url(#arrowhead-${type}-${showHover ? 'hover' : 'normal'})`}
          style={{
            animation: 'drawLine 0.6s ease forwards',
          }}
        />
      )}

      {label && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          {/* Badge background */}
          <rect
            x={-20}
            y={-10}
            width={40}
            height={20}
            rx={10}
            fill="white"
            stroke={getLabelColor()}
            strokeWidth={2}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
          {/* Label text */}
          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={600}
            fill={getLabelColor()}
            style={{ userSelect: 'none' }}
          >
            {label}
          </text>
        </g>
      )}

      {/* Delete button on hover */}
      {showHover && onDelete && (
        <g
          transform={`translate(${midX}, ${midY})`}
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          {/* Button background */}
          <circle
            cx={0}
            cy={0}
            r={12}
            fill="#EF4444"
            stroke="#FEE2E2"
            strokeWidth={2}
            style={{
              transition: 'transform 0.15s ease',
              animation: 'scaleIn 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          />
          {/* X icon */}
          <line
            x1={-4}
            y1={-4}
            x2={4}
            y2={4}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={4}
            y1={-4}
            x2={-4}
            y2={4}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </g>
  )
}
