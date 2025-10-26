const mongoose = require('mongoose');

// MongoDB connection string - update with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/syncure';

async function assignDoctorToAppointment() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const appointmentsCollection = mongoose.connection.db.collection('bookedAppointments');
    
    // Your account ID and doctor ID
    const patientId = new mongoose.Types.ObjectId('66b72552fc219b2351f1717e');
    const doctorId = new mongoose.Types.ObjectId('66b5e0aeea614d6d3301c858');
    
    // Find appointments for this patient
    const appointments = await appointmentsCollection.find({
      patient_id: patientId
    }).toArray();
    
    console.log(`Found ${appointments.length} appointments for patient`);
    
    if (appointments.length === 0) {
      console.log('No appointments found. Creating a dummy appointment...');
      
      // Create a dummy appointment
      const dummyAppointment = {
        date: new Date(),
        timing: {
          startTime: '10:00',
          endTime: '10:30'
        },
        state: 'California',
        city: 'Los Angeles',
        hospital: {
          id: new mongoose.Types.ObjectId(),
          name: 'General Hospital'
        },
        disease: 'General Consultation',
        note: 'Dummy appointment for chat testing',
        approved: 'approved',
        appointment_status: 'scheduled',
        patient_id: patientId,
        assigned_doctor: doctorId,
        payment: {
          razorpayPaymentId: 'dummy_payment_id',
          razorpayOrderId: 'dummy_order_id',
          amount: '500',
          status: 'completed'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await appointmentsCollection.insertOne(dummyAppointment);
      console.log('Created dummy appointment:', result.insertedId);
    } else {
      // Update existing appointments to assign doctor
      const updateResult = await appointmentsCollection.updateMany(
        {
          patient_id: patientId
        },
        {
          $set: {
            assigned_doctor: doctorId,
            approved: 'approved',
            appointment_status: 'scheduled',
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`Updated ${updateResult.modifiedCount} appointments with assigned doctor`);
    }
    
    // Verify the update
    const updatedAppointments = await appointmentsCollection.find({
      patient_id: patientId,
      assigned_doctor: doctorId
    }).toArray();
    
    console.log(`\nSuccess! Found ${updatedAppointments.length} appointments with assigned doctor`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

assignDoctorToAppointment();