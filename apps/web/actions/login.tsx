"use server";

import { z } from "zod";
import { loginSchema } from "@repo/ui/schemas";
import { signInEmail } from "better-auth/api";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    // await signInEmail({
    //   email,
    //   password,
    // });
    console.log(email, password);
  } catch (error) {
    return { error: "Invalid email or password" };
  }
};
