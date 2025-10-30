const { MongoClient, ObjectId } = require('mongodb');

async function approveUserAppointments() {
  const patientId = '66b72552fc219b2351f1717e';
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to Local MongoDB');

    const db = client.db('syncure');
    const bookedAppointments = db.collection('bookedappointments');
    
    // Find appointments for this patient
    const appointments = await bookedAppointments.find({
      patient_id: new ObjectId(patientId)
    }).toArray();
    
    console.log(`Found ${appointments.length} appointments for patient ${patientId}`);
    
    if (appointments.length > 0) {
      // Approve the first appointment
      const result = await bookedAppointments.updateOne(
        { _id: appointments[0]._id },
        { $set: { approved: 'approved' } }
      );
      
      console.log(`✅ Approved appointment: ${appointments[0].disease} at ${appointments[0].hospital.name}`);
      console.log(`Date: ${new Date(appointments[0].date).toLocaleDateString()}`);
    } else {
      console.log('❌ No appointments found for this patient');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

approveUserAppointments();