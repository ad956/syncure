const { MongoClient, ObjectId } = require('mongodb');

async function createAndApproveAppointment() {
  const patientId = '66b72552fc219b2351f1717e';
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to Local MongoDB');

    const db = client.db('syncure');
    const bookedAppointments = db.collection('bookedappointments');
    
    // Create an approved appointment for this patient
    const appointment = {
      _id: new ObjectId(),
      date: new Date('2024-11-15'),
      timing: { startTime: '10:00 AM', endTime: '10:30 AM' },
      state: 'Andhra Pradesh',
      city: 'Hyderabad',
      hospital: { id: '1', name: 'Apollo Hospitals' },
      disease: 'Checkup',
      note: 'Regular health checkup',
      approved: 'approved',
      patient_id: new ObjectId(patientId),
      booked_for: { type: 'self' },
      payment: { 
        razorpayPaymentId: 'pay_approved123', 
        razorpayOrderId: 'order_approved123',
        amount: 250, 
        status: 'completed' 
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await bookedAppointments.insertOne(appointment);
    console.log(`✅ Created approved appointment for patient ${patientId}`);
    console.log(`Appointment: ${appointment.disease} at ${appointment.hospital.name}`);
    console.log(`Date: ${appointment.date.toLocaleDateString()}`);
    console.log(`Status: ${appointment.approved}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createAndApproveAppointment();