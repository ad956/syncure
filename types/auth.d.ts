import type { Session } from "@lib/auth";

declare global {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}