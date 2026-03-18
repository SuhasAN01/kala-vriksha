const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://admin:vriksha2026@cluster0.rgzyk.mongodb.net/kala_vriksha?retryWrites=true&w=majority';

(async function() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');
  
  const UserSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.model('User', UserSchema);
  
  await User.updateOne({ email: 'admin_e2e@test.com' }, { $set: { role: 'admin' } });
  console.log('Elevated admin_e2e@test.com to admin role');
  
  process.exit(0);
})();
