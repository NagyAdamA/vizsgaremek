import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/protected-route'
import { Info } from 'lucide-react'
import { useState } from 'react'

// Standard archery round presets
const ARCHERY_PRESETS = {
  none: { name: 'Custom', distance: 0, targetSize: 0, arrowsPerEnd: 6 },
  indoor18: { name: 'Indoor 18m (WA 18)', distance: 18, targetSize: 40, arrowsPerEnd: 6 },
  indoor25: { name: 'Indoor 25m', distance: 25, targetSize: 60, arrowsPerEnd: 6 },
  outdoor30: { name: 'Outdoor 30m', distance: 30, targetSize: 60, arrowsPerEnd: 6 },
  outdoor50: { name: 'Outdoor 50m', distance: 50, targetSize: 80, arrowsPerEnd: 6 },
  outdoor70: { name: 'Outdoor 70m (Olympic)', distance: 70, targetSize: 122, arrowsPerEnd: 6 },
  outdoor90: { name: 'Outdoor 90m (Recurve)', distance: 90, targetSize: 122, arrowsPerEnd: 6 },
} as const

// Standard distances for dropdown
const STANDARD_DISTANCES = [18, 25, 30, 50, 70, 90]

// Standard target sizes for dropdown
const STANDARD_TARGET_SIZES = [40, 60, 80, 122]

const sessionSchema = z.object({
  name: z.string().min(1, 'Session name is required'),
  distance: z.number().min(1, 'Distance must be at least 1 meter').max(200, 'Distance cannot exceed 200 meters'),
  targetSize: z.number().min(1, 'Target size must be at least 1 cm').max(200, 'Target size cannot exceed 200 cm'),
  arrowsPerEnd: z.number().min(1, 'Must have at least 1 arrow per end').max(12, 'Cannot exceed 12 arrows per end'),
  notes: z.string().optional(),
})

type SessionSchemaType = z.infer<typeof sessionSchema>

type CreateSessionResponse = {
  ID: number
  name: string
  distance: number
  targetSize: number
  arrowsPerEnd: number
}

const createSession = async (data: SessionSchemaType) => {
  const response = await axiosClient.post<CreateSessionResponse>('/api/sessions', data)
  return response.data
}

export const Route = createFileRoute('/sessions/create')({
  component: CreateSessionPage,
  beforeLoad: () => {
    console.log('Navigating to /sessions/create')
  },
})

function CreateSessionPage() {
  return (
    <ProtectedRoute>
      <CreateSessionContent />
    </ProtectedRoute>
  )
}

function CreateSessionContent() {
  const navigate = useNavigate()
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof ARCHERY_PRESETS>('indoor18')
  const [error, setError] = useState<string | null>(null)
  
  // Debug: Log when component renders
  console.log('CreateSessionContent rendered')
  const { mutate: createSessionMutation, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      navigate({ to: '/sessions/$sessionID', params: { sessionID: data.ID.toString() } })
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create session. Please try again.'
      setError(errorMessage)
      console.error('Create session error:', err)
    },
  })

  const form = useForm<SessionSchemaType>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      distance: 18,
      targetSize: 40,
      arrowsPerEnd: 6,
      notes: '',
    },
  })

  const handlePresetChange = (presetKey: keyof typeof ARCHERY_PRESETS) => {
    setSelectedPreset(presetKey)
    const preset = ARCHERY_PRESETS[presetKey]
    if (preset.distance > 0) {
      form.setValue('distance', preset.distance)
      form.setValue('targetSize', preset.targetSize)
      form.setValue('arrowsPerEnd', preset.arrowsPerEnd)
    }
  }

  function onSubmit(values: SessionSchemaType) {
    setError(null)
    console.log('Submitting form with values:', values)
    createSessionMutation(values)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Session</h1>
        <p className="text-gray-500">Set up your archery practice session with standard competition settings</p>
      </div>
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Session Details</CardTitle>
          <CardDescription>
            Enter the details for your archery practice session following standard archery rules
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Preset Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Preset</label>
                <Select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value as keyof typeof ARCHERY_PRESETS)}
                >
                  {Object.entries(ARCHERY_PRESETS).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.name}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500">
                  Select a standard archery round to auto-fill distance, target size, and arrows per end
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Morning Practice, WA 18 Round" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your session a descriptive name to easily identify it later
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (meters)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={200}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {STANDARD_DISTANCES.map((dist) => (
                        <Button
                          key={dist}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            form.setValue('distance', dist, { shouldValidate: true })
                            setSelectedPreset('none')
                          }}
                          className={field.value === dist ? 'bg-cyan-100 dark:bg-cyan-900' : ''}
                        >
                          {dist}m
                        </Button>
                      ))}
                    </div>
                    <FormDescription>
                      Standard distances: 18m (indoor), 25m (indoor), 30m, 50m, 70m (Olympic), 90m (recurve)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Face Size (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={200}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {STANDARD_TARGET_SIZES.map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            form.setValue('targetSize', size, { shouldValidate: true })
                            setSelectedPreset('none')
                          }}
                          className={field.value === size ? 'bg-cyan-100 dark:bg-cyan-900' : ''}
                        >
                          {size}cm
                        </Button>
                      ))}
                    </div>
                    <FormDescription>
                      Standard sizes: 40cm (18m indoor), 60cm (25m/30m), 80cm (50m), 122cm (70m/90m outdoor)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrowsPerEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrows Per End</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 6)}
                      />
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[3, 6].map((count) => (
                        <Button
                          key={count}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            form.setValue('arrowsPerEnd', count, { shouldValidate: true })
                            setSelectedPreset('none')
                          }}
                          className={field.value === count ? 'bg-cyan-100 dark:bg-cyan-900' : ''}
                        >
                          {count} arrows
                        </Button>
                      ))}
                    </div>
                    <FormDescription>
                      Standard: 6 arrows per end (most common). Some formats use 3 arrows per end.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Archery Rules Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold mb-1">Archery Standards Reference:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Indoor 18m: 40cm target, 6 arrows/end</li>
                      <li>Indoor 25m: 60cm target, 6 arrows/end</li>
                      <li>Outdoor 30m: 60cm target, 6 arrows/end</li>
                      <li>Outdoor 50m: 80cm target, 6 arrows/end</li>
                      <li>Outdoor 70m (Olympic): 122cm target, 6 arrows/end</li>
                      <li>Outdoor 90m (Recurve): 122cm target, 6 arrows/end</li>
                    </ul>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Weather conditions, equipment used, training focus, etc..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Add any additional information about this practice session
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}
              {Object.keys(form.formState.errors).length > 0 && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  Please fix the form errors above before submitting.
                </div>
              )}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isPending}
                >
                  {isPending ? 'Creating...' : 'Create Session'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/sessions' })}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

