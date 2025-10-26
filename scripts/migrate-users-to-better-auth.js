const { MongoClient } = require('mongodb');

async function migrateUsers() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('syncure');
    
    // Get all patients
    const patients = await db.collection('patient').find({}).toArray();
    
    console.log(`Found ${patients.length} patients to migrate`);
    
    // Create better-auth users
    for (const patient of patients) {
      const betterAuthUser = {
        id: patient._id.toString(),
        email: patient.email,
        name: `${patient.firstname} ${patient.lastname}`,
        emailVerified: true,
        role: patient.role || 'patient',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Insert into better-auth user collection
      await db.collection('user').updateOne(
        { email: patient.email },
        { $set: betterAuthUser },
        { upsert: true }
      );
      
      console.log(`Migrated user: ${patient.email}`);
    }
    
    // Create demo users for better-auth
    const demoUsers = [
      { email: 'johndoe@example.com', name: 'John Doe', role: 'patient' },
      { email: 'doctor@demo.com', name: 'Demo Doctor', role: 'doctor' },
      { email: 'hospital@demo.com', name: 'Demo Hospital', role: 'hospital' },
      { email: 'admin@demo.com', name: 'Demo Admin', role: 'admin' },
      { email: 'receptionist@demo.com', name: 'Demo Receptionist', role: 'receptionist' }
    ];
    
    for (const demoUser of demoUsers) {
      const betterAuthUser = {
        id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
        email: demoUser.email,
        name: demoUser.name,
        emailVerified: true,
        role: demoUser.role,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('user').updateOne(
        { email: demoUser.email },
        { $set: betterAuthUser },
        { upsert: true }
      );
      
      console.log(`Created demo user: ${demoUser.email}`);
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrateUsers();