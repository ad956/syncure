import { NextResponse } from 'next/server';
import VitalSigns from '@models/vital-signs';
import dbConfig from '@utils/db';
import { requireAuth } from '@lib/auth/api-auth';
import { createSuccessResponse, createErrorResponse } from '@lib/api-response';



export async function GET() {
  try {
    await dbConfig();
    const { error, session } = requireAuth();
    
    if (error) {
      return error;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const vitalSigns = await VitalSigns
      .find({
        patient_id: (session as any).user.id,
        recorded_at: { $gte: thirtyDaysAgo }
      })
      .sort({ recorded_at: -1 })
      .limit(30);

    const response = createSuccessResponse({ vitalSigns, count: vitalSigns.length });
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    return response;
  } catch (error: any) {
    console.error('Error fetching health trends:', error);
    return createErrorResponse('Failed to fetch health trends', 500, process.env.NODE_ENV === 'development' ? error.message : undefined);
  }
}