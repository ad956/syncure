import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const handleDemoUserLogin = async (
  role: string,
  redirectDemoUser: (role: string) => void
) => {
  const endpoint = "/api/demo-user";

  try {
    toast.loading("Logging in...", { id: "demoLogin" });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
      cache: "no-cache",
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error while demo user login:", result.error);
      toast.error(`${result.error?.message || "Login failed"}`);
      return;
    }

    const isLoggedIn = await signIn("credentials", {
      usernameOrEmail: result.user.email,
      role: role,
      otp: result.user.otp,
      action: "demo-login",
      redirect: false,
    });

    if (isLoggedIn) {
      toast.success("Login successful, redirecting...", { id: "demoLogin" });
      redirectDemoUser(role);
      return;
    } else {
      throw new Error("Error while logging in as demo user");
    }
  } catch (error) {
    console.error("Demo login error:", error);
    toast.error("An unexpected error occurred. Please try again.", {
      id: "demoLogin",
    });
  }
};

export default handleDemoUserLogin;
