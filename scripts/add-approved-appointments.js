const { MongoClient, ObjectId } = require('mongodb');

async function addApprovedAppointments() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to Local MongoDB');

    const db = client.db('syncure');
    
    const patients = db.collection('patients');
    let patientId;
    
    const existingPatient = await patients.findOne({});
    if (existingPatient) {
      patientId = existingPatient._id;
    } else {
      const testPatient = {
        _id: new ObjectId(),
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        createdAt: new Date()
      };
      await patients.insertOne(testPatient);
      patientId = testPatient._id;
    }

    const bookedAppointments = db.collection('bookedappointments');
    
    const approvedAppointments = [
      {
        _id: new ObjectId(),
        date: new Date('2024-11-15'),
        timing: { startTime: '10:00 AM', endTime: '10:30 AM' },
        state: 'Andhra Pradesh',
        city: 'Hyderabad',
        hospital: { id: '1', name: 'Apollo Hospitals' },
        disease: 'Checkup',
        note: 'Regular checkup',
        approved: 'approved',
        patient_id: patientId,
        booked_for: { type: 'self' },
        payment: { razorpayPaymentId: 'pay_approved1', amount: 250, status: 'completed' },
        createdAt: new Date()
      },
      {
        _id: new ObjectId(),
        date: new Date('2024-11-20'),
        timing: { startTime: '2:00 PM', endTime: '2:30 PM' },
        state: 'Andhra Pradesh',
        city: 'Visakhapatnam',
        hospital: { id: '2', name: 'Care Hospitals' },
        disease: 'Consultation',
        note: 'Follow up',
        approved: 'approved',
        patient_id: patientId,
        booked_for: { type: 'self' },
        payment: { razorpayPaymentId: 'pay_approved2', amount: 250, status: 'completed' },
        createdAt: new Date()
      }
    ];

    const result = await bookedAppointments.insertMany(approvedAppointments);
    console.log(`✅ Added ${result.insertedCount} approved appointments`);
    
    approvedAppointments.forEach((apt, index) => {
      console.log(`${index + 1}. ${apt.disease} at ${apt.hospital.name} - ${apt.date.toLocaleDateString()}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addApprovedAppointments();