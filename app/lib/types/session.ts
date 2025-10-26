export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

export interface Session {
  user: SessionUser;
}