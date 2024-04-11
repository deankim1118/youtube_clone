import mongoose from 'mongoose';
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatar_url: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  videos: [{ type: mongoose.Schema.ObjectId, ref: 'Video' }],
});

userSchema.pre('save', async function () {
  if (this.isModified('passwaord')) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
