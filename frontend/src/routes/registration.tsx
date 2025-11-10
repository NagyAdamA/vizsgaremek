import { RegistrationForm } from '@/components/registration-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/registration')({
    component: RouteComponent,
})

function RouteComponent() {
    return (<RegistrationForm />)
}

