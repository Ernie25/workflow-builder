'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Rocket, Database, Server, GitBranch, Package } from 'lucide-react'

export default function BadgeDemoPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-heading-xl text-[rgb(var(--text-primary))]">
            Status Badge Component
          </h1>
          <p className="text-body text-[rgb(var(--text-secondary))] mt-2">
            Pill-shaped status badges for workflow states
          </p>
        </div>

        {/* All States - Medium Size */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>All States (Medium)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Badge status="success" text="Success" />
              <Badge status="error" text="Error" />
              <Badge status="warning" text="Warning" />
              <Badge status="pending" text="Pending" />
              <Badge status="running" text="Running" />
            </div>
          </CardContent>
        </Card>

        {/* All States - Small Size */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>All States (Small)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Badge status="success" text="Success" size="sm" />
              <Badge status="error" text="Error" size="sm" />
              <Badge status="warning" text="Warning" size="sm" />
              <Badge status="pending" text="Pending" size="sm" />
              <Badge status="running" text="Running" size="sm" />
            </div>
          </CardContent>
        </Card>

        {/* Icon Only */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Icon Only (No Text)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Badge status="success" />
              <Badge status="error" />
              <Badge status="warning" />
              <Badge status="pending" />
              <Badge status="running" />
            </div>
          </CardContent>
        </Card>

        {/* Custom Icons */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Custom Icons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Badge status="success" text="Deployed" icon={<Rocket />} />
              <Badge status="running" text="Building" icon={<Package />} />
              <Badge status="pending" text="Queued" icon={<Database />} />
              <Badge status="error" text="Failed" icon={<Server />} />
              <Badge status="warning" text="Branch" icon={<GitBranch />} size="sm" />
            </div>
          </CardContent>
        </Card>

        {/* No Icon */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Text Only (No Icon)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Badge status="success" text="Completed" icon={null} />
              <Badge status="error" text="Failed" icon={null} />
              <Badge status="warning" text="Alert" icon={null} size="sm" />
            </div>
          </CardContent>
        </Card>

        {/* Realistic Workflow Example */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Workflow Status Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Workflow Item */}
              <div className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-4">
                <div>
                  <div className="text-body font-medium text-[rgb(var(--text-primary))]">
                    Production Deployment
                  </div>
                  <div className="text-body-small text-[rgb(var(--text-secondary))]">
                    main branch • 2 minutes ago
                  </div>
                </div>
                <Badge status="success" text="Deployed" />
              </div>

              {/* Workflow Item */}
              <div className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-4">
                <div>
                  <div className="text-body font-medium text-[rgb(var(--text-primary))]">
                    Build Pipeline
                  </div>
                  <div className="text-body-small text-[rgb(var(--text-secondary))]">
                    feature/new-ui • In progress
                  </div>
                </div>
                <Badge status="running" text="Building" />
              </div>

              {/* Workflow Item */}
              <div className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-4">
                <div>
                  <div className="text-body font-medium text-[rgb(var(--text-primary))]">
                    Test Suite
                  </div>
                  <div className="text-body-small text-[rgb(var(--text-secondary))]">
                    develop branch • Failed checks
                  </div>
                </div>
                <Badge status="error" text="Failed" />
              </div>

              {/* Workflow Item */}
              <div className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-4">
                <div>
                  <div className="text-body font-medium text-[rgb(var(--text-primary))]">
                    Staging Deployment
                  </div>
                  <div className="text-body-small text-[rgb(var(--text-secondary))]">
                    staging branch • Waiting for approval
                  </div>
                </div>
                <Badge status="pending" text="Pending" size="sm" />
              </div>

              {/* Workflow Item */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-body font-medium text-[rgb(var(--text-primary))]">
                    Security Scan
                  </div>
                  <div className="text-body-small text-[rgb(var(--text-secondary))]">
                    3 vulnerabilities found
                  </div>
                </div>
                <Badge status="warning" text="Warning" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
