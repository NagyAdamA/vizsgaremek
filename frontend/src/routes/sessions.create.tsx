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

const ARCHERY_PRESETS = {
  none: { name: 'Egyéni', distance: 0, targetSize: 0, arrowsPerEnd: 3 },
  indoor18: { name: 'Terem 18m (WA)', distance: 18, targetSize: 40, arrowsPerEnd: 3 },
  outdoor28: { name: 'Szabadtéri 20m', distance: 20, targetSize: 60, arrowsPerEnd: 3 },
  outdoor30: { name: 'Szabadtéri 30m', distance: 30, targetSize: 80, arrowsPerEnd: 3 },
  outdoor50: { name: 'Szabadtéri 50m', distance: 50, targetSize: 80, arrowsPerEnd: 3 },
  outdoor60: { name: 'Szabadtéri 60m (Olimpiai)', distance: 60, targetSize: 122, arrowsPerEnd: 6 },
  outdoor70: { name: 'Szabadtéri 70m (Olimpiai)', distance: 70, targetSize: 122, arrowsPerEnd: 6 },
} as const

const STANDARD_DISTANCES = [18, 20, 30, 50, 60, 70]

const STANDARD_TARGET_SIZES = [40, 60, 80, 122]

const sessionSchema = z.object({
  name: z.string().min(1, 'Kötelező elnevezni a beírólapot'),
  distance: z.number().min(1, 'A távolságnak legalább 2 méternek kell lennie').max(300, 'A távolság nem haladhatja meg a 300 métert'),
  targetSize: z.number().min(1, 'A célméretnek legalább 1 cm-nek kell lennie').max(200, 'A célméret nem haladhatja meg a 200 cm-t'),
  arrowsPerEnd: z.number().min(1, 'Legalább 1 vesszőnek kell lennie sorozatonként').max(15, 'Nem haladhatja meg a 15 vesszőt sorozatonként'),
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

  const { mutate: createSessionMutation, isPending } = useMutation({
    mutationFn: createSession,
    onSuccess: (data) => {
      navigate({ to: '/sessions/$sessionID', params: { sessionID: data.ID.toString() } })
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Sikertelen beírólap létrehozás. Próbáld újra.'
      setError(errorMessage)
      console.error('Sikertelen beírólap létrehozás:', err)
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
    createSessionMutation(values)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Új beírólap létrehozása</h1>
      </div>
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Beírólap adatai</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Preset Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Előre beállított</label>
                <Select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value as keyof typeof ARCHERY_PRESETS)}
                >
                  {Object.entries(ARCHERY_PRESETS).map(([key, preset]) => (
                    <option key={key} value={key} className="bg-background text-foreground dark:bg-slate-900 dark:text-gray-100">
                      {preset.name}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500">
                  Válassz előre beállított versenyfajták közül, vagy adj hozzá egyéni értékeket
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beírólap neve</FormLabel>
                    <FormControl>
                      <Input placeholder="Pl.: WA szabadtéri 30m 80cm. IFAA terem 18m 40cm" {...field} />
                    </FormControl>
                    <FormDescription>
                      Adj meg egy nevet a beírólapnak, hogy könnyen azonosíthasd később
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
                    <FormLabel>Távolság (méter)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={2}
                        max={300}
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
                          className={field.value === dist ? 'bg-primary/20 dark:bg-primary/20' : ''}
                        >
                          {dist}m
                        </Button>
                      ))}
                    </div>
                    <FormDescription>
                      Alap távolságok: 18m (terem), 20m, 30m, 50m (csigás), 60m (olimpiai) 70m (olimpiai)
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
                    <FormLabel>Cél méret (cm)</FormLabel>
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
                          className={field.value === size ? 'bg-primary/20 dark:bg-primary/20' : ''}
                        >
                          {size}cm
                        </Button>
                      ))}
                    </div>
                    <FormDescription>
                      Alap méretek: 40cm, 60cm, 80cm, 122cm
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
                    <FormLabel>Vesszők száma sorozatonként</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={15}
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
                          className={field.value === count ? 'bg-primary/20 dark:bg-primary/20' : ''}
                        >
                          {count} vessző
                        </Button>
                      ))}
                    </div>
                    <FormDescription>
                      Alap: 3 vessző / sorozat (leggyakoribb)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="font-semibold mb-1">Íjász Versenyszámok:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Terem 18m: 40cm lőlap, 3 vessző/sor</li>
                      <li>Szabadtéri 20m: 60cm lőlap, 3 vessző/sor</li>
                      <li>Szabadtéri 30m: 80cm lőlap, 3 vessző/sor</li>
                      <li>Szabadtéri 50m: 80cm lőlap, 3 vessző/sor</li>
                      <li>Szabadtéri 60m (Olimpiai): 122cm lőlap, 6 vessző/sor</li>
                      <li>Szabadtéri 70m (Olimpiai): 122cm lőlap, 6 vessző/sor</li>
                    </ul>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Megjegyzések (opcionális)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Időjárási körülmények, használt felszerelés, edzés fókusz, stb..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      További információk az edzésről
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
                  Kérlek javítsd ki a fenti űrlap hibáit a beküldés előtt.
                </div>
              )}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? 'Létrehozás...' : 'Létrehozás'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: '/sessions' })}
                >
                  Mégse
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

