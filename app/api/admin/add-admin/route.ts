import { NextResponse } from "next/server";
import Admin from "@models/admin";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import hashPassword from "@utils/hash-password";

import { auth } from "@lib/auth";

import { NewAdminTemplate, sendEmail } from "@lib/emails";
import { render } from "@react-email/render";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return errorHandler("Unauthorized", STATUS_CODES.BAD_REQUEST);
    }

    await dbConfig();

    const formData = await request.json();
    const { firstname, lastname, email, password } = formData;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return errorHandler("Admin already exists", STATUS_CODES.CONFLICT);
    }

    // Generate a username
    let username = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
    let usernameSuffix = 0;
    let usernameExists = true;

    while (usernameExists) {
      const existingUser = await Admin.findOne({ username });
      if (!existingUser) {
        usernameExists = false;
      } else {
        usernameSuffix++;
        username = `${firstname.toLowerCase()}.${lastname.toLowerCase()}${usernameSuffix}`;
      }
    }

    // Hashing password
    const hashedPassword = await hashPassword(password);

    // New admin
    const newAdmin = new Admin({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role: "admin",
      otp: "",
      dob: "1970-01-01",
      gender: "Male",
      contact: "",
      profile:
        "https://res.cloudinary.com/doahnjt5z/image/upload/v1736261729/assets/xeqy76eccywusabkdkjc.png",
      address: {
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
      },
    });

    // Save new admin
    await newAdmin.save();

    const mailsent = await sendEmail({
      to: email,
      subject: "Welcome to Syncure - Admin Account Created",
      html: render(
        NewAdminTemplate({
          firstname,
          lastname,
          email,
          username,
          password: password,
        })
      ),
      from: {
        name: "Syncure",
        address: "support@patientfitnesstracker.com",
      },
    });

    if (!mailsent) {
      console.error("Failed to send welcome email to new admin");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin added successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding admin:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
