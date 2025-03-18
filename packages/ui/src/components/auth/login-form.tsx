"use client";

import { AuthFormWrapper } from "./auth-form-wrapper";
import { LoginSchema, loginSchema } from "../../schemas/index";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Button } from "../button";
import { FormError } from "../forms/form-error";
import { FormSuccess } from "../forms/form-success";
import { useState, useTransition } from "react";

interface LoginFormProps {
  login: (values: z.infer<typeof loginSchema>) => Promise<{
    success?: string;
    error?: string;
  }>;
}

export const LoginForm = ({ login }: LoginFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    startTransition(() => {
      login(values).then((data) => {
        setSuccess(data.success);
        setError(data.error);
      });
    });
  };

  return (
    <AuthFormWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account? Sign up"
      backButtonHref="/signup"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    type="email"
                    disabled={isPending}
                  />
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
                  <Input
                    {...field}
                    placeholder="********"
                    type="password"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {success && <FormSuccess message={success} />}
          {error && <FormError message={error} />}
          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};
