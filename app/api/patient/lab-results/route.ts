import { NextRequest } from 'next/server';
import LabResult from "@models/lab-results";
import dbConfig from "@utils/db";
import { requireAuth } from "@lib/auth/api-auth";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const { error, session } = requireAuth();
    
    if (error) {
      return error;
    }

    const labResults = await LabResult
      .find({ patient_id: (session as any).user.id })
      .sort({ test_date: -1 })
      .limit(10);

    return createSuccessResponse({
      labResults,
      count: labResults.length
    });
  } catch (error) {
    console.error('Error fetching lab results:', error);
    return createErrorResponse('Failed to fetch lab results', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConfig();
    const { error, session } = requireAuth();
    
    if (error) {
      return error;
    }

    const body = await request.json();
    const { 
      test_name, 
      test_type, 
      result_value, 
      reference_range, 
      status, 
      test_date, 
      lab_name, 
      doctor_notes,
      report_url 
    } = body;

    const newLabResult = new LabResult({
      patient_id: (session as any).user.id,
      test_name,
      test_type,
      result_value,
      reference_range,
      status,
      test_date: new Date(test_date),
      lab_name,
      doctor_notes,
      report_url,
    });

    await newLabResult.save();

    return createSuccessResponse({ labResult: newLabResult }, 'Lab result created successfully');
  } catch (error) {
    console.error('Error creating lab result:', error);
    return createErrorResponse('Failed to create lab result', 500);
  }
}