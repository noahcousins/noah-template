import { LoginForm } from "@/components/auth/login-form";
import { login } from "@/actions/login";
import { signInEmail } from "better-auth/api";

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
