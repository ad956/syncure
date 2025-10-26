import { NextResponse } from 'next/server';
import LabResult from '@models/lab-results';
import dbConfig from '@utils/db';
import { getSession } from '@lib/auth/get-session';
import { createSuccessResponse, createErrorResponse } from '@lib/api-response';

export async function GET() {
  try {
    await dbConfig();
    const session = await getSession();
    
    if (!session?.user?.id) {
      return createErrorResponse('Unauthorized access', 401);
    }

    const labResults = await LabResult
      .find({ patient_id: (session as any).user.id })
      .sort({ test_date: -1 })
      .limit(3);

    const response = createSuccessResponse({ labResults, count: labResults.length });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error: any) {
    console.error('Error fetching recent lab results:', error);
    return createErrorResponse('Failed to fetch lab results', 500, process.env.NODE_ENV === 'development' ? error.message : undefined);
  }
}