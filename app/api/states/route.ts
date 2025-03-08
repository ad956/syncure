import { NextResponse } from "next/server";
import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";
import CityStateHospital from "@models/city-state-hospitals";

export async function GET(req: Request) {
  try {
    await dbConfig();

    const statesArray = await CityStateHospital.find({}, { _id: 0 });

    if (!statesArray || statesArray.length === 0) {
      return errorHandler("States not found", STATUS_CODES.NOT_FOUND);
    }

    const stateNames = statesArray
      .flatMap((state) => Object.keys(state.toObject()))
      .filter((key) => key !== "cities");

    return NextResponse.json(stateNames, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching state data:", error);
    return errorHandler(
      error.message || "Internal Server Error",
      STATUS_CODES.SERVER_ERROR
    );
  }
}
