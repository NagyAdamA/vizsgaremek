import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forgot-password')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
