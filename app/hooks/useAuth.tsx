import { ApiResponse } from '@lib/api-response';

export async function loginUser(usernameOrEmail: string, password: string, role: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password, role })
  });
  
  const result = await response.json();
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.data };
  }
}

export async function signupUser(userData: any) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const result = await response.json();
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.data };
  }
}