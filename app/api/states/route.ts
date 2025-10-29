import dbConfig from "@utils/db";
import CityStateHospital from "@models/city-state-hospitals";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(req: Request) {
  try {
    await dbConfig();

    const statesArray = await CityStateHospital.find({}, { _id: 0 });

    if (!statesArray || statesArray.length === 0) {
      return createErrorResponse("States not found", 404);
    }

    const stateNames = statesArray
      .flatMap((state) => Object.keys(state.toObject()))
      .filter((key) => key !== "cities");

    return createSuccessResponse(stateNames);
  } catch (error: any) {
    console.error("Error fetching states:", { error: error.message });
    return createErrorResponse("Failed to fetch states", 500);
  }
}
