import dbConfig from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const state = searchParams.get("state");
    const city = searchParams.get("city");

    if (!state || !city) {
      return new Response("State or city parameter is missing", {
        status: 400,
      });
    }

    const db = await dbConfig();
    const collection = db.collection("citystate_hospitals");

    const stateHospitals = await collection.findOne({
      [state]: { $exists: true },
    });

    if (!stateHospitals) {
      return new Response("No hospitals found for the specified state", {
        status: 404,
      });
    }

    const cityHospitals = stateHospitals[state][city];

    if (!cityHospitals) {
      return new Response("No hospitals found in the specified city", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(cityHospitals), { status: 200 });
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
