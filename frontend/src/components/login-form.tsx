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
import { useNavigate, Link } from "@tanstack/react-router"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

const loginSchema = z.object({
  userID: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginSchemaType = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<LoginSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userID: "",
      password: ""
    },
  })

  async function onSubmit(values: LoginSchemaType) {
    setError(null)
    setIsPending(true)
    try {
      await login(values.userID, values.password)
      navigate({ to: "/" })
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Bejelentkezés</CardTitle>
          <CardDescription>
            Adja meg a felhasználónevét és jelszavát a bejelentkezéshez.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="userID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Felhaszálónév</FormLabel>
                    <FormControl>
                      <Input placeholder="Adja meg a felhasználónevét" {...field} />
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
                    <div className="flex items-center">
                      <FormLabel>Jelszó</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="Adja meg a jelszavát" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Bejelentkezés..." : "Bejelentkezés"}
              </Button>
              <div className="text-center text-sm">
                Nincs még fiókja?{" "}
                <Link to="/registration" className="underline underline-offset-4 hover:text-primary">
                  Regisztráció
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

