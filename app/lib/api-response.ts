import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
}

export function createSuccessResponse<T>(data: T): NextResponse {
  console.log('API Success Response:', { success: true, dataType: typeof data });
  return NextResponse.json({
    success: true,
    data,
  });
}

export function createErrorResponse(error: string, status: number = 500): NextResponse {
  console.error('API Error Response:', { error, status });
  return NextResponse.json({
    success: false,
    data: error,
  }, { status });
}

export function createValidationErrorResponse(errors: any): NextResponse {
  const errorMessages = errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
  console.error('Validation Error:', { errors, errorMessages });
  return NextResponse.json({
    success: false,
    data: `Validation failed: ${errorMessages}`,
  }, { status: 400 });
}