import dbConfig from "@utils/db";
import CityStateHospital from "@models/city-state-hospitals";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(req: Request) {
  try {
    await dbConfig();

    const statesArray = await CityStateHospital.find({}, { name: 1, _id: 1 });

    if (!statesArray || statesArray.length === 0) {
      return createErrorResponse("States not found", 404);
    }

    const states = statesArray.map((state) => ({
      id: state._id.toString(),
      name: state.name
    }));

    return createSuccessResponse(states);
  } catch (error: any) {
    console.error("Error fetching states:", { error: error.message });
    return createErrorResponse("Failed to fetch states", 500);
  }
}
