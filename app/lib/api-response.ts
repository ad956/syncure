import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export function createSuccessResponse<T>(data: T, message?: string): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
}

export function createErrorResponse(error: string, status: number = 500, details?: any): NextResponse {
  return NextResponse.json({
    success: false,
    error,
    details,
    timestamp: new Date().toISOString(),
  }, { status });
}

export function createValidationErrorResponse(errors: any): NextResponse {
  const errorMessages = errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
  return NextResponse.json({
    success: false,
    error: `Validation failed: ${errorMessages}`,
    details: errors,
    timestamp: new Date().toISOString(),
  }, { status: 400 });
}