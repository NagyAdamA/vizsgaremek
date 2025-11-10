import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
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
import { useMutation } from "@tanstack/react-query"
import { useNavigate, Link } from "@tanstack/react-router"

const registrationSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegistrationSchemaType = z.infer<typeof registrationSchema>

type RegistrationResponse = {
  message?: string
  user?: unknown
}

const postRegistration = ({ data }: { data: RegistrationSchemaType }) => {
  return axiosClientWithoutAuth.post<RegistrationResponse>("/api/users/", data)
}

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { mutate: registration, isPending } = useMutation({
    mutationFn: ({ data }: { data: RegistrationSchemaType }) => postRegistration({ data }),
    onSuccess() {
      navigate({ to: "/login" })
    },
  })
  const form = useForm<RegistrationSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      username: "",
      password: ""
    },
  })

  function onSubmit(values: RegistrationSchemaType) {
    registration({ data: values })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                      <Input type="email" placeholder="Enter your email" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? "Registering..." : "Register"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

