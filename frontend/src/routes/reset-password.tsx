import { ResetPasswordForm } from '@/components/reset-password-form'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const resetSearchSchema = z.object({
    token: z.string().catch(''),
})

export const Route = createFileRoute('/reset-password')({
    validateSearch: (search) => resetSearchSchema.parse(search),
    component: RouteComponent,
})

function RouteComponent() {
    const { token } = Route.useSearch()

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ResetPasswordForm token={token} />
            </div>
        </div>
    )
}
