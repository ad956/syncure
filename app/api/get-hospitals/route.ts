import CityStateHospital from "@models/city-state-hospitals";
import dbConfig from "@utils/db";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const state = searchParams.get("state");
  const city = searchParams.get("city");

  try {
    if (!state || !city) {
      return createErrorResponse("State or city parameter is missing", 400);
    }

    await dbConfig();

    const stateHospitals = await CityStateHospital.findOne({
      [state]: { $exists: true },
    });

    if (!stateHospitals) {
      return createErrorResponse("No hospitals found for the specified state", 404);
    }

    const cityHospitals = stateHospitals.get(state)[city];

    if (!cityHospitals) {
      return createErrorResponse("No hospitals found in the specified city", 404);
    }

    return createSuccessResponse(cityHospitals);
  } catch (error: any) {
    console.error("Error fetching hospitals:", { error: error.message, state, city });
    return createErrorResponse("Failed to fetch hospitals", 500);
  }
}
