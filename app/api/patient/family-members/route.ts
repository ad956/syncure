import { NextRequest } from "next/server";
import FamilyMember from "@models/family-member";
import { Types } from "mongoose";
import dbConfig from "@utils/db";
import { requireAuth } from "@lib/auth/api-auth";
import { createSuccessResponse, createErrorResponse, createValidationErrorResponse } from "@lib/api-response";
import { familyMemberSchema } from "@lib/validations/patient";
import type { Session } from "@lib/types/session";

export async function GET() {
  try {
    await dbConfig();
    const { error, session } = requireAuth();
    
    if (error) {
      return error;
    }

    const patientId = new Types.ObjectId(session.user.id);
    
    const familyMembers = await FamilyMember.find({
      patient_id: patientId,
      is_active: true
    }).sort({ createdAt: -1 });

    return createSuccessResponse({
      family_members: familyMembers,
      count: familyMembers.length
    });

  } catch (error: any) {
    console.error("Error fetching family members:", error);
    return createErrorResponse(
      "Failed to fetch family members", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
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
    
    // Validate request body with Zod
    const validation = familyMemberSchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error.errors);
    }

    const data = validation.data;
    const patientId = new Types.ObjectId(session.user.id);

    // Create family member
    const familyMember = new FamilyMember({
      patient_id: patientId,
      name: `${data.firstname} ${data.lastname}`,
      relation: data.relation,
      age: new Date().getFullYear() - new Date(data.dob).getFullYear(),
      gender: data.gender,
      contact: data.contact,
      is_active: true
    });

    const savedMember = await familyMember.save();

    return createSuccessResponse({
      family_member: savedMember
    }, "Family member added successfully");

  } catch (error: any) {
    console.error("Error adding family member:", error);
    return createErrorResponse(
      "Failed to add family member", 
      500, 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}