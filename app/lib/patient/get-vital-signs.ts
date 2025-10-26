import { getSession } from "@lib/auth/get-session";
import VitalSigns from "@models/vital-signs";
import dbConfig from "@utils/db";

export default async function getVitalSigns(): Promise<any[]> {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      console.error('No session found for vital signs fetch');
      return [];
    }

    await dbConfig();
    
    const vitals = await VitalSigns
      .find({ patient_id: (session as any).user.id })
      .sort({ recorded_at: -1 })
      .limit(30)
      .lean();

    return JSON.parse(JSON.stringify(vitals)) || [];
  } catch (error) {
    console.error(
      "An error occurred while fetching vital signs: ",
      error
    );
    return [];
  }
}