const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/syncure';

async function checkAppointments() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const appointmentsCollection = mongoose.connection.db.collection('bookedAppointments');
    
    // Check appointments for the patient
    const patientId = new mongoose.Types.ObjectId('66b72552fc219b2351f1717e');
    
    const appointments = await appointmentsCollection.find({
      patient_id: patientId
    }).toArray();
    
    console.log(`Found ${appointments.length} appointments for patient`);
    
    appointments.forEach((apt, index) => {
      console.log(`\nAppointment ${index + 1}:`);
      console.log('- ID:', apt._id);
      console.log('- Patient ID:', apt.patient_id);
      console.log('- Assigned Doctor:', apt.assigned_doctor);
      console.log('- Approved:', apt.approved);
      console.log('- Status:', apt.appointment_status);
    });
    
    // Also check if doctor exists
    const doctorId = new mongoose.Types.ObjectId('66b5e0aeea614d6d3301c858');
    const doctorsCollection = mongoose.connection.db.collection('doctor');
    
    const doctor = await doctorsCollection.findOne({ _id: doctorId });
    console.log('\nDoctor found:', doctor ? `${doctor.firstname} ${doctor.lastname}` : 'Not found');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAppointments();