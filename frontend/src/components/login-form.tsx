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
import { axiosClientWithoutAuth } from "@/lib/axios-client"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, Link } from "@tanstack/react-router"

const loginSchema = z.object({
  userID: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginSchemaType = z.infer<typeof loginSchema>

type LoginResponse = {
  token: string
}

const postLogin = ({ data }: { data: LoginSchemaType }) => {
  return axiosClientWithoutAuth.post<LoginResponse>("/api/auth/login", data)
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ data }: { data: LoginSchemaType }) => postLogin({ data }),
    onSuccess() {
      navigate({ to: "/" })
    },
  })

  const form = useForm<LoginSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userID: "",
      password: ""
    },
  })

  function onSubmit(values: LoginSchemaType) {
    login({ data: values })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/registration" className="underline underline-offset-4 hover:text-primary">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

