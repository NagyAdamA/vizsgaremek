import { RegistrationForm } from '@/components/registration-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/registration')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegistrationForm />
            </div>
        </div>
    )
}

