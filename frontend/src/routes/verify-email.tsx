import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { axiosClientWithoutAuth } from '@/lib/axios-client'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const verifySearchSchema = z.object({
    token: z.string().catch(''),
})

export const Route = createFileRoute('/verify-email')({
    validateSearch: (search) => verifySearchSchema.parse(search),
    component: RouteComponent,
})

function RouteComponent() {
    const { token } = Route.useSearch()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Érvénytelen link (hiányzó token).')
            return
        }

        const verify = async () => {
            try {
                await axiosClientWithoutAuth.post('/api/auth/verify-email', { token })
                setStatus('success')
            } catch (err: any) {
                setStatus('error')
                setMessage(err.response?.data?.message || 'Hiba történt az email megerősítése során.')
            }
        }

        verify()
    }, [token])

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className={status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : ''}>
                        {status === 'loading' && 'Ellenőrzés...'}
                        {status === 'success' && 'Sikeres megerősítés!'}
                        {status === 'error' && 'Hiba történt'}
                    </CardTitle>
                    <CardDescription>
                        Email cím megerősítése
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === 'loading' && <p className="text-muted-foreground">Kérjük várjon, amíg ellenőrizzük a megerősítő linket.</p>}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Az email címet sikeresen megerősítettük! Most már bejelentkezhet a fiókjába.
                            </p>
                            <Link to="/login" className="block">
                                <Button className="w-full">Tovább a bejelentkezéshez</Button>
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <p className="text-sm text-red-500">{message}</p>
                            <Link to="/login" className="block">
                                <Button variant="outline" className="w-full">Vissza a bejelentkezéshez</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
