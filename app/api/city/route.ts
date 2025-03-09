import { NextResponse } from "next/server";
import CityStateHospital from "@models/city-state-hospitals";

import dbConfig from "@utils/db";
import { errorHandler } from "@utils/error-handler";
import { STATUS_CODES } from "@utils/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");

  try {
    if (!state) {
      return errorHandler(
        "State parameter is missing",
        STATUS_CODES.BAD_REQUEST
      );
    }

    await dbConfig();
    const stateDocument = await CityStateHospital.findOne({
      [state]: { $exists: true },
    });

    if (!stateDocument) {
      return errorHandler("State not found", STATUS_CODES.NOT_FOUND);
    }

    // Get the cities for the given state
    const cities = Object.keys(stateDocument.get(state));

    if (cities.length === 0) {
      return errorHandler(
        "No cities found for the given state",
        STATUS_CODES.NOT_FOUND
      );
    }

    return NextResponse.json(cities, { status: 200 });
  } catch (error) {
    console.error("Error fetching state and city data:", error);
    return errorHandler("Internal Server Error", STATUS_CODES.SERVER_ERROR);
  }
}
