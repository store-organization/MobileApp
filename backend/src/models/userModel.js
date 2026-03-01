import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpire: { type: Date },
  isVerified: { type: Boolean, default: false },
  resetToken: {
    type: String,
  },

  resetTokenExpire: {
    type: Date,
  },
});

const UserDb = mongoose.model('User', userSchema);

export default UserDb;
