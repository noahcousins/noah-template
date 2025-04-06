"use server";

import { z } from "zod";
import { signUpSchema } from "@repo/ui/schemas";
import { auth } from "@/lib/auth";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
  const validatedFields = signUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name: "",
        email,
        password,
      },
    });
    return { success: "Account created successfully" };
  } catch (error) {
    return { error: "Invalid email or password" };
  }
};
