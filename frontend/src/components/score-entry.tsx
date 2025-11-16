import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Score = {
  ID: number
  endNumber: number
  arrowNumber: number
  score: number
  isX: boolean
}

type ScoreEntryProps = {
  sessionID: number
  arrowsPerEnd: number
}

const getScores = async (sessionID: number) => {
  const response = await axiosClient.get<Score[]>(`/api/scores/session/${sessionID}`)
  return response.data
}

const createScore = async (score: {
  sessionID: number
  endNumber: number
  arrowNumber: number
  score: number
  isX: boolean
}) => {
  const response = await axiosClient.post('/api/scores', score)
  return response.data
}

const updateScore = async (scoreID: number, score: { score: number; isX: boolean }) => {
  const response = await axiosClient.put(`/api/scores/${scoreID}`, score)
  return response.data
}

const deleteScore = async (scoreID: number) => {
  await axiosClient.delete(`/api/scores/${scoreID}`)
}

export function ScoreEntry({ sessionID, arrowsPerEnd }: ScoreEntryProps) {
  const queryClient = useQueryClient()
  const [currentEnd, setCurrentEnd] = useState(1)
  const [currentArrow, setCurrentArrow] = useState(1)

  const { data: scores = [], isLoading } = useQuery({
    queryKey: ['scores', sessionID],
    queryFn: () => getScores(sessionID),
  })

  const createMutation = useMutation({
    mutationFn: createScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores', sessionID] })
      queryClient.invalidateQueries({ queryKey: ['session', sessionID.toString()] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ scoreID, score }: { scoreID: number; score: { score: number; isX: boolean } }) =>
      updateScore(scoreID, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores', sessionID] })
      queryClient.invalidateQueries({ queryKey: ['session', sessionID.toString()] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores', sessionID] })
      queryClient.invalidateQueries({ queryKey: ['session', sessionID.toString()] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
  })

  useEffect(() => {
    if (scores.length > 0) {
      const maxEnd = Math.max(...scores.map((s) => s.endNumber))
      const endScores = scores.filter((s) => s.endNumber === maxEnd)
      const maxArrow = Math.max(...endScores.map((s) => s.arrowNumber))
      
      if (maxArrow >= arrowsPerEnd) {
        setCurrentEnd(maxEnd + 1)
        setCurrentArrow(1)
      } else {
        setCurrentEnd(maxEnd)
        setCurrentArrow(maxArrow + 1)
      }
    }
  }, [scores, arrowsPerEnd])

  const handleScoreClick = (scoreValue: number, isX: boolean = false) => {
    const existingScore = scores.find(
      (s) => s.endNumber === currentEnd && s.arrowNumber === currentArrow
    )

    if (existingScore) {
      updateMutation.mutate({
        scoreID: existingScore.ID,
        score: { score: scoreValue, isX },
      })
    } else {
      createMutation.mutate({
        sessionID,
        endNumber: currentEnd,
        arrowNumber: currentArrow,
        score: scoreValue,
        isX,
      })
    }

    if (currentArrow < arrowsPerEnd) {
      setCurrentArrow(currentArrow + 1)
    } else {
      setCurrentEnd(currentEnd + 1)
      setCurrentArrow(1)
    }
  }

  const handleDelete = (scoreID: number) => {
    if (confirm('Are you sure you want to delete this score?')) {
      deleteMutation.mutate(scoreID)
    }
  }

  const getScoreForPosition = (end: number, arrow: number) => {
    return scores.find((s) => s.endNumber === end && s.arrowNumber === arrow)
  }

  const getEndTotal = (end: number) => {
    const endScores = scores.filter((s) => s.endNumber === end)
    return endScores.reduce((sum, s) => sum + s.score, 0)
  }

  const getAllEnds = () => {
    if (scores.length === 0) return [1]
    const maxEnd = Math.max(...scores.map((s) => s.endNumber))
    const ends = []
    for (let i = 1; i <= Math.max(maxEnd, currentEnd); i++) {
      ends.push(i)
    }
    return ends
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading scores...</div>
  }

  const allEnds = getAllEnds()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="font-medium">Current: </span>
          <span>
            End {currentEnd}, Arrow {currentArrow}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((scoreValue) => (
          <Button
            key={scoreValue}
            variant="outline"
            className="h-12 text-lg"
            onClick={() => handleScoreClick(scoreValue, scoreValue === 10)}
          >
            {scoreValue === 10 ? 'X' : scoreValue}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {allEnds.map((end) => (
          <Card key={end}>
            <CardHeader>
              <CardTitle className="text-lg">
                End {end} - Total: {getEndTotal(end)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: arrowsPerEnd }, (_, i) => i + 1).map((arrow) => {
                  const score = getScoreForPosition(end, arrow)
                  return (
                    <div key={arrow} className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-1">Arrow {arrow}</div>
                      {score ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-12"
                            onClick={() => handleScoreClick(score.score, score.isX)}
                          >
                            {score.isX && score.score === 10 ? 'X' : score.score}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDelete(score.ID)}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <div className="w-12 h-8 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">
                          -
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

