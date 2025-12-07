import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { axiosClientWithoutAuth } from "@/lib/axios-client"
import { useNavigate, Link } from "@tanstack/react-router"
import { useState } from "react"

const registrationSchema = z.object({
  username: z.string().min(1, "Felhasználónév kötelező"),
  email: z.string().email("Érvénytelen email cím"),
  password: z.string().min(6, "Jelszó legalább 6 karakter hosszúnak kell lennie"),
})

type RegistrationSchemaType = z.infer<typeof registrationSchema>

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<RegistrationSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      username: "",
      password: ""
    },
  })

  async function onSubmit(values: RegistrationSchemaType) {
    setError(null)
    setSuccess(false)
    setIsPending(true)
    try {
      await axiosClientWithoutAuth.post("/api/users/", values)
      setSuccess(true)
      setTimeout(() => {
        navigate({ to: "/login" })
      }, 1500)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Sikertelen regisztráció. Próbáld újra."
      setError(errorMessage)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Regisztráció</CardTitle>
          <CardDescription>
            Adja meg adatait a regisztrációhoz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Felhasználónév</FormLabel>
                      <FormControl>
                        <Input placeholder="Adjon meg egy felhasználónevet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Adja meg az email címét" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jelszó</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Adjon meg egy jelszót" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  Sikeres regisztráció! Átirányítás a bejelentkezéshez...
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isPending || success}>
                {isPending ? "Regisztráció..." : success ? "Siker!" : "Regisztráció"}
              </Button>
              <div className="text-center text-sm">
                Már van fiókja?{" "}
                <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                  Bejelentkezés
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

