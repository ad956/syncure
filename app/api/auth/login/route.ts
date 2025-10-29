import { OtpTemplate, sendEmail } from "@lib/emails";
import { render } from "@react-email/render";
import dbConfig from "@utils/db";
import { generateSecureOTP } from "@utils/generate-otp";
import getModelByRole from "@utils/get-model-by-role";
import { allowedRoles } from "@utils/constants";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";
import bcrypt from "bcryptjs";

interface LoginBody {
  usernameOrEmail: string;
  password: string;
  role: string;
}

export async function POST(req: Request) {
  const body: LoginBody = await req.json();

  if (!body || !body.usernameOrEmail || !body.password || !body.role) {
    return createErrorResponse("Invalid request body. Please provide username or email, password, and role.", 400);
  }

  if (!allowedRoles.includes(body.role)) {
    return createErrorResponse("User role isn't valid.", 400);
  }

  try {
    await dbConfig();

    const UserModel = getModelByRole(body.role);

    const user = await UserModel.findOne(
      {
        $or: [
          { email: body.usernameOrEmail },
          { username: body.usernameOrEmail },
        ],
      },
      { _id: 1, email: 1, firstname: 1, lastname: 1, password: 1 }
    );

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return createErrorResponse("Invalid username/email or password", 401);
    }

    const generatedOTP = generateSecureOTP();
    
    // Update OTP and send email in parallel
    const [updateResult] = await Promise.all([
      UserModel.findByIdAndUpdate(user._id, { otp: generatedOTP }),
      // Send email asynchronously without waiting
      sendEmail({
        to: user.email,
        subject: "OTP Verification",
        html: render(OtpTemplate(user.firstname, generatedOTP)),
        from: {
          name: "Syncure",
          address: "support@patientfitnesstracker.com",
        },
      }).catch(error => console.error("Email sending failed:", error))
    ]);

    return createSuccessResponse({ message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Error during login:", { error: error.message, role: body.role });
    return createErrorResponse("Login failed", 500);
  }
}