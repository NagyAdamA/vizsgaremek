import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { axiosClientWithoutAuth } from "@/lib/axios-client"

const forgotPasswordSchema = z.object({
    email: z.string().email("Érvénytelen email cím"),
})

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const form = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: ForgotPasswordSchemaType) {
        setMessage(null)
        setError(null)
        setIsPending(true)
        try {
            await axiosClientWithoutAuth.post('/api/auth/forgot-password', { email: values.email })
            setMessage("Ha létezik fiók ezzel az email címmel, küldtünk egy emlékeztetőt.")
        } catch (err: any) {
            setError(err.response?.data?.message || "Hiba történt a kérés feldolgozása során.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Elfelejtett jelszó</CardTitle>
                    <CardDescription>
                        Adja meg email címét, és küldünk egy linket a jelszó visszaállításához.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email cím</FormLabel>
                                            <FormControl>
                                                <Input placeholder="pelda@email.hu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {message && (
                                <div className="text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Küldés..." : "Link küldése"}
                            </Button>

                            <div className="text-center text-sm">
                                <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                                    Vissza a bejelentkezéshez
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
