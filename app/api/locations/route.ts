import { NextRequest } from "next/server";
import dbConfig from "@utils/db";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";
import CityStateHospital from "@models/city-state-hospitals";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await dbConfig();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const type = searchParams.get('type') || 'states';

    let data;
    
    switch (type) {
      case 'states':
        const stateDocuments = await CityStateHospital.find({}).lean();
        const states = [];
        for (const doc of stateDocuments) {
          // Extract state names from document keys (excluding _id)
          const stateNames = Object.keys(doc).filter(key => key !== '_id' && key !== '__v');
          for (const stateName of stateNames) {
            states.push({ id: (doc._id as any).toString(), name: stateName });
          }
        }
        data = { states };
        break;
        
      case 'cities':
        if (!state) {
          return createErrorResponse("State parameter required for cities", 400);
        }
        const stateDoc = await CityStateHospital.findById(state).lean();
        if (!stateDoc) {
          return createErrorResponse("State not found", 404);
        }
        const stateName = Object.keys(stateDoc).find(key => key !== '_id' && key !== '__v');
        const cities = stateName ? Object.keys((stateDoc as any)[stateName] || {}).map(cityName => ({
          id: cityName,
          name: cityName
        })) : [];
        data = { cities, state: { id: state, name: stateName } };
        break;
        
      case 'hospitals':
        if (!city) {
          return createErrorResponse("City parameter required for hospitals", 400);
        }
        const [stateId, cityName] = city.includes('|') ? city.split('|') : [state, city];
        const hospitalDoc = await CityStateHospital.findById(stateId).lean();
        if (!hospitalDoc) {
          return createErrorResponse("State not found", 404);
        }
        const stateKey = Object.keys(hospitalDoc).find(key => key !== '_id' && key !== '__v');
        const hospitals = stateKey ? ((hospitalDoc as any)[stateKey]?.[cityName] || []).map((h: any, index: number) => ({
          id: h.hospital_id || `${stateId}_${cityName}_${index}`,
          name: h.hospital_name
        })) : [];
        data = { hospitals, city: { id: cityName, name: cityName } };
        break;
        
      default:
        return createErrorResponse("Invalid type parameter", 400);
    }

    return createSuccessResponse(data);
    
  } catch (error: any) {
    console.error("Error fetching location data:", error);
    return createErrorResponse(
      "Failed to fetch location data", 
      500, 
      error.message
    );
  }
}