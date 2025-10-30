import CityStateHospital from "@models/city-state-hospitals";
import dbConfig from "@utils/db";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");

  try {
    if (!state) {
      return createErrorResponse("State parameter is missing", 400);
    }

    await dbConfig();
    const stateDocument = await CityStateHospital.findOne({
      [state]: { $exists: true },
    });

    if (!stateDocument) {
      return createErrorResponse("State not found", 404);
    }

    // Get the cities for the given state
    const cityNames = Object.keys(stateDocument.get(state));

    if (cityNames.length === 0) {
      return createErrorResponse("No cities found for the given state", 404);
    }

    const cities = cityNames.map((name, index) => ({
      id: (index + 1).toString(),
      name: name
    }));

    return createSuccessResponse(cities);
  } catch (error: any) {
    console.error("Error fetching cities:", { error: error.message, state });
    return createErrorResponse("Failed to fetch cities", 500);
  }
}
