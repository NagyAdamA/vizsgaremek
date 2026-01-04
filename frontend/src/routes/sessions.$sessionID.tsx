import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Target, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScoreEntry } from '@/components/score-entry'
import { ProtectedRoute } from '@/components/protected-route'

type Session = {
  ID: number
  name: string
  distance: number
  targetSize: number
  arrowsPerEnd: number
  notes?: string
  createdAt: string
  scores?: Array<{
    ID: number
    endNumber: number
    arrowNumber: number
    score: number
    isX: boolean
  }>
}

const getSession = async (sessionID: string) => {
  const response = await axiosClient.get<Session>(`/api/sessions/${sessionID}`)
  return response.data
}

const deleteSession = async (sessionID: string) => {
  await axiosClient.delete(`/api/sessions/${sessionID}`)
}

export const Route = createFileRoute('/sessions/$sessionID')({
  component: SessionDetailPage,
})

function SessionDetailPage() {
  return (
    <ProtectedRoute>
      <SessionDetailContent />
    </ProtectedRoute>
  )
}

function SessionDetailContent() {
  const { sessionID } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['session', sessionID],
    queryFn: () => getSession(sessionID),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteSession(sessionID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      navigate({ to: '/sessions' })
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Beírólap betöltése...</div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">Hiba a beírólap betöltésekor</div>
        <Link to="/sessions">
          <Button className="mt-4">Vissza a beírólapokhoz</Button>
        </Link>
      </div>
    )
  }

  const calculateStats = () => {
    const scores = session.scores || []
    const totalArrows = scores.length
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
    const avgScore = totalArrows > 0 ? (totalScore / totalArrows).toFixed(2) : '0.00'
    const xCount = scores.filter(s => s.isX).length
    const xPercentage = totalArrows > 0 ? ((xCount / totalArrows) * 100).toFixed(1) : '0.0'
    return { totalArrows, totalScore, avgScore, xCount, xPercentage }
  }

  const stats = calculateStats()

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/sessions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vissza
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex-1">{session.name}</h1>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm('Are you sure you want to delete this session?')) {
              deleteMutation.mutate()
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Törlés
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Részletek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Távolság:</span>
                <span className="text-sm font-medium">{session.distance}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Lőlap mérete:</span>
                <span className="text-sm font-medium">{session.targetSize}cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Vesszők száma:</span>
                <span className="text-sm font-medium">{session.arrowsPerEnd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Dátum:</span>
                <span className="text-sm font-medium">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Összes vessző:</span>
                <span className="text-sm font-medium">{stats.totalArrows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Össz pontszám:</span>
                <span className="text-sm font-medium">{stats.totalScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Átlag:</span>
                <span className="text-sm font-medium">{stats.avgScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">X Count:</span>
                <span className="text-sm font-medium">{stats.xCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">X Százalék:</span>
                <span className="text-sm font-medium">{stats.xPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {session.notes && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Megjegyzések</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{session.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Eredmények</CardTitle>
          <CardDescription>Add meg a pontszámodat</CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreEntry sessionID={session.ID} arrowsPerEnd={session.arrowsPerEnd} />
        </CardContent>
      </Card>
    </div>
  )
}

