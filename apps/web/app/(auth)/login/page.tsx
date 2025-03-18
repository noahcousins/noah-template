import { LoginForm } from "@repo/ui/components/auth/login-form";
import { login } from "@/actions/login";
import { signInEmail } from "better-auth/api";

const LoginPage = () => {
  return <LoginForm login={login as any} />;
};

export default LoginPage;
