import getDoctorData from "@lib/doctor/get-doctor-data";
import ChatScreen from "@components/ChatScreen";

export default async function Doctor() {
  const doctor = await getDoctorData();

  return (
    <section className="bg-[#f3f6fd] p-2 overflow-y-auto grid place-items-center">
      <ChatScreen
        currentUser={{
          _id: doctor._id,
          firstname: doctor.firstname,
          lastname: doctor.lastname,
          specialty: doctor.gender,
          profile: doctor.profile,
          role: "Doctor",
        }}
      />
    </section>
  );
}
