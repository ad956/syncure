import ChatScreen from "@components/ChatScreen";
import getDoctorData from "@lib/doctor/get-doctor-data";
import { getSession } from "@lib/auth/get-session";

export default async function DoctorChatPage() {
  const session = await getSession();
  const doctor = await getDoctorData(session?.user?.id);

  const currentUser = {
    _id: doctor._id,
    firstname: doctor.firstname,
    lastname: doctor.lastname,
    profile: doctor.profile,
    role: "doctor",
  };

  return (
    <div className="h-full bg-[#f3f6fd] p-4">
      <div className="h-full max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Chat with Patients</h1>
          <p className="text-gray-600">Communicate with your patients securely</p>
        </div>
        <div className="h-[calc(100%-80px)]">
          <ChatScreen currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}