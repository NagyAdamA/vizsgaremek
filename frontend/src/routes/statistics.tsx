import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { Link } from '@tanstack/react-router'
import { Target, TrendingUp, Award, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProtectedRoute } from '@/components/protected-route'

type Statistics = {
  totalSessions: number
  totalArrows: number
  totalScore: number
  totalXCount: number
  totalEnds: number
  overallAverage: number
  xPercentage: number
  sessionStats: Array<{
    sessionID: number
    sessionName: string
    date: string
    arrows: number
    totalScore: number
    averageScore: number
    xCount: number
    ends: number
  }>
}

const getStatistics = async () => {
  const response = await axiosClient.get<Statistics>('/api/statistics')
  return response.data
}

export const Route = createFileRoute('/statistics')({
  component: StatisticsPage,
})

function StatisticsPage() {
  return (
    <ProtectedRoute>
      <StatisticsContent />
    </ProtectedRoute>
  )
}

function StatisticsContent() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['statistics'],
    queryFn: getStatistics,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading statistics...</div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">Error loading statistics</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Performance Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Arrows</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArrows}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overallAverage.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">X Percentage</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.xPercentage.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>Your recent archery sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.sessionStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sessions recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {stats.sessionStats.map((session) => (
                <Link
                  key={session.sessionID}
                  to="/sessions/$sessionID"
                  params={{ sessionID: session.sessionID.toString() }}
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.sessionName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Arrows: </span>
                        <span className="font-medium">{session.arrows}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Average: </span>
                        <span className="font-medium">{session.averageScore.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">X: </span>
                        <span className="font-medium">{session.xCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

