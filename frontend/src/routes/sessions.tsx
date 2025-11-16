import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { Link } from '@tanstack/react-router'
import { Plus, Target, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/protected-route'

type Session = {
  ID: number
  name: string
  distance: number
  targetSize: number
  arrowsPerEnd: number
  createdAt: string
  scores?: Array<{ score: number }>
}

const getSessions = async () => {
  const response = await axiosClient.get<Session[]>('/api/sessions')
  return response.data
}

export const Route = createFileRoute('/sessions')({
  component: SessionsPage,
})

function SessionsPage() {
  return (
    <ProtectedRoute>
      <SessionsContent />
    </ProtectedRoute>
  )
}

function SessionsContent() {
  const navigate = useNavigate()
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading sessions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">Error loading sessions</div>
      </div>
    )
  }

  const calculateSessionStats = (session: Session) => {
    const scores = session.scores || []
    const totalArrows = scores.length
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
    const avgScore = totalArrows > 0 ? (totalScore / totalArrows).toFixed(2) : '0.00'
    return { totalArrows, totalScore, avgScore }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Archery Sessions</h1>
        <Button onClick={() => navigate({ to: '/sessions/create' })}>
          <Plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      {sessions && sessions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No sessions yet</p>
              <Button onClick={() => navigate({ to: '/sessions/create' })}>
                Create Your First Session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions?.map((session) => {
            const stats = calculateSessionStats(session)
            return (
              <Link key={session.ID} to="/sessions/$sessionID" params={{ sessionID: session.ID.toString() }}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{session.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Distance:</span>
                        <span className="text-sm font-medium">{session.distance}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Target Size:</span>
                        <span className="text-sm font-medium">{session.targetSize}cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Arrows:</span>
                        <span className="text-sm font-medium">{stats.totalArrows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Average:</span>
                        <span className="text-sm font-medium">{stats.avgScore}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

