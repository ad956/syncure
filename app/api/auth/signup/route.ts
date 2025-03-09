import { NextResponse } from "next/server";
import { OtpTemplate, sendEmail } from "@lib/emails";
import { render } from "@react-email/render";
import {
  allowedRoles,
  doctoradditionalDetails,
  hospitaladditionalDetails,
  patientadditionalDetails,
  receptionistadditionalDetails,
} from "@constants/index";

import dbConfig from "@utils/db";

import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import { generateSecureOTP } from "@utils/generate-otp";

import getModelByRole from "@utils/get-model-by-role";
import hashPassword from "@utils/hash-password";

type SignupBody = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  role: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const body: SignupBody = await req.json();

    if (checkMissingElements(body)) {
      return errorHandler(
        "Missing required fields in the request body",
        STATUS_CODES.BAD_REQUEST
      );
    }

    if (!allowedRoles.includes(body.role)) {
      return errorHandler("User role isn't valid.", STATUS_CODES.BAD_REQUEST);
    }

    const result = await createAccount(body);
    return result;
  } catch (error: any) {
    console.error("Error during signup:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}

async function createAccount(signupBody: SignupBody) {
  await dbConfig();

  const UserModel = getModelByRole(signupBody.role);

  const existingUser = await UserModel.findOne({
    $or: [{ email: signupBody.email }, { username: signupBody.username }],
  });

  if (existingUser) {
    if (existingUser.email === signupBody.email) {
      return errorHandler("Email already exists", STATUS_CODES.CONFLICT);
    }

    if (existingUser.username === signupBody.username) {
      return errorHandler("Username already exists", STATUS_CODES.CONFLICT);
    }
  }

  const additionalDetails = getAdditionalDetails(signupBody.role);
  const hashedPassword = await hashPassword(signupBody.password);

  const newUser = new UserModel({
    ...signupBody,
    password: hashedPassword,
    ...additionalDetails,
  });

  const savedUser = await newUser.save();
  const generatedOTP = generateSecureOTP();

  await savedUser.updateOne(
    { email: savedUser.email },
    { $set: { otp: generatedOTP } }
  );

  const mailSent = await sendEmail({
    to: savedUser.email,
    subject: "Verification of OTP for Account Creation",
    html: render(OtpTemplate(savedUser.firstname, generatedOTP)),
    from: {
      name: "Syncure",
      address: "support@patientfitnesstracker.com",
    },
  });

  if (!mailSent) {
    return errorHandler(
      "Signup email sending failed",
      STATUS_CODES.SERVER_ERROR
    );
  }

  return NextResponse.json(
    { message: "Account created successfully" },
    { status: 201 }
  );
}

// checks for missing elements in body
function checkMissingElements(body: SignupBody) {
  const requiredFields = [
    "firstname",
    "lastname",
    "username",
    "email",
    "password",
    "role",
  ];
  return requiredFields.some((field) => !(field in body));
}

// returns additional details based on the user's role
function getAdditionalDetails(role: string) {
  switch (role) {
    case "patient":
      return patientadditionalDetails;
    case "receptionist":
      return receptionistadditionalDetails;
    case "doctor":
      return doctoradditionalDetails;
    case "hospital":
      return hospitaladditionalDetails;
    default:
      return {};
  }
}
