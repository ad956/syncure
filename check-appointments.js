const { MongoClient, ObjectId } = require('mongodb');

async function checkAppointments() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('syncure');
    
    const patientId = new ObjectId('66b72552fc219b2351f1717e');
    
    console.log('Checking appointments for patient:', patientId.toString());
    
    // Check all appointments
    const allAppointments = await db.collection('bookedappointments').find({
      patient_id: patientId
    }).toArray();
    
    console.log('Total appointments:', allAppointments.length);
    
    // Check pending appointments
    const pendingAppointments = await db.collection('bookedappointments').find({
      patient_id: patientId,
      approved: 'pending'
    }).toArray();
    
    console.log('Pending appointments:', pendingAppointments.length);
    
    if (pendingAppointments.length > 0) {
      console.log('Sample pending appointment:', JSON.stringify(pendingAppointments[0], null, 2));
    }
    
    // Check if collection exists and has any data
    const totalCount = await db.collection('bookedappointments').countDocuments();
    console.log('Total appointments in collection:', totalCount);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkAppointments();