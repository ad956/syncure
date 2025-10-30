import dbConfig from "@utils/db";
import CityStateHospital from "@models/city-state-hospitals";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(req: Request) {
  try {
    await dbConfig();

    const statesArray = await CityStateHospital.find({});

    if (!statesArray || statesArray.length === 0) {
      return createErrorResponse("States not found", 404);
    }

    const allStateNames = new Set();
    
    statesArray.forEach((state) => {
      const stateObj = state.toObject();
      const stateNames = Object.keys(stateObj).filter(key => 
        key !== '_id' && 
        key !== '__v' && 
        key !== 'cities' && 
        typeof stateObj[key] === 'object' && 
        stateObj[key] !== null
      );
      stateNames.forEach(name => allStateNames.add(name));
    });
    
    console.log('All unique state names:', Array.from(allStateNames));

    const uniqueStates = Array.from(allStateNames).map((name, index) => ({
      id: (index + 1).toString(),
      name: name
    }));

    return createSuccessResponse(uniqueStates);
  } catch (error: any) {
    console.error("Error fetching states:", { error: error.message });
    return createErrorResponse("Failed to fetch states", 500);
  }
}
