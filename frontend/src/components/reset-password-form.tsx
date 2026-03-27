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
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { axiosClientWithoutAuth } from "@/lib/axios-client"

const resetPasswordSchema = z.object({
    password: z.string().min(6, "A jelszónak legalább 6 karakternek kell lennie"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "A jelszavak nem egyeznek",
    path: ["confirmPassword"],
})

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
    token: string
}

export function ResetPasswordForm({
    className,
    token,
    ...props
}: ResetPasswordFormProps) {
    const navigate = useNavigate()
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [success, setSuccess] = useState(false);

    const form = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })

    async function onSubmit(values: ResetPasswordSchemaType) {
        if (!token) {
            setError("Érvénytelen visszaállító link.")
            return
        }

        setMessage(null)
        setError(null)
        setIsPending(true)
        try {
            await axiosClientWithoutAuth.post('/api/auth/reset-password', {
                token,
                password: values.password
            })
            setMessage("Jelszó sikeresen megváltoztatva! Átirányítás a bejelentkezéshez...")
            setSuccess(true)
            setTimeout(() => {
                navigate({ to: "/login" })
            }, 3000)
        } catch (err: any) {
            setError(err.response?.data?.message || "Hiba történt a jelszó visszaállítása során.")
        } finally {
            setIsPending(false)
        }
    }

    if (!token) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="text-xl text-red-600">Hiba</CardTitle>
                    <CardDescription>Érvénytelen vagy hiányzó token.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <Link to="/forgot-password" className="text-primary underline">Új link kérése</Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Új jelszó beállítása</CardTitle>
                    <CardDescription>
                        Adja meg az új jelszavát.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!success ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Új jelszó</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="******" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Jelszó megerősítése</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="******" {...field} />
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
                                    {isPending ? "Mentés..." : "Jelszó mentése"}
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="text-green-600 text-lg">
                                {message}
                            </div>
                            <Button onClick={() => navigate({ to: "/login" })} className="w-full">
                                Bejelentkezés
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
