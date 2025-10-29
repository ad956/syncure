const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/syncure';

const vitalSignsSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  weight: Number,
  systolic_bp: Number,
  diastolic_bp: Number,
  heart_rate: Number,
  temperature: Number,
  oxygen_saturation: Number,
  blood_sugar: Number,
  notes: String,
  recorded_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  collection: "vitalSigns",
  timestamps: true,
});

const VitalSigns = mongoose.model('VitalSigns', vitalSignsSchema);

async function addTodaysVitals() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const patientId = '66b72552fc219b2351f1717e';
    
    const todaysVital = new VitalSigns({
      patient_id: new mongoose.Types.ObjectId(patientId),
      weight: 71.2,
      systolic_bp: 125,
      diastolic_bp: 82,
      heart_rate: 75,
      temperature: 37.0,
      blood_sugar: 95,
      notes: 'Morning vitals - feeling good',
      recorded_at: new Date()
    });

    await todaysVital.save();
    console.log('✅ Added today\'s vital signs:', todaysVital._id);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addTodaysVitals();