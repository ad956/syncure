const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/syncure';

async function listDoctors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const doctorsCollection = mongoose.connection.db.collection('doctor');
    
    const doctors = await doctorsCollection.find({}).toArray();
    
    console.log(`Found ${doctors.length} doctors:`);
    
    doctors.forEach((doctor, index) => {
      console.log(`\nDoctor ${index + 1}:`);
      console.log('- ID:', doctor._id);
      console.log('- Name:', `${doctor.firstname} ${doctor.lastname}`);
      console.log('- Specialty:', doctor.specialty);
      console.log('- Active:', doctor.is_active);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

listDoctors();