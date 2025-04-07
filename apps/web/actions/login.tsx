"use server";

import { z } from "zod";
import { loginSchema } from "@repo/ui/schemas";
import { auth } from "@/lib/auth";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      onSuccess: (ctx: any) => {
        const authToken = ctx.response.headers.get("set-auth-token"); // get the token from the response headers
        // Store the token securely (e.g., in localStorage)
        localStorage.setItem("bearer_token", authToken);
      },
    });
    return { success: true };
  } catch (error) {
    return { error: "Invalid email or password" };
  }
};
