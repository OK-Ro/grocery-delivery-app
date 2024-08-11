import mongoose from "mongoose";
const { Schema } = mongoose;

// Define user schema
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ["client", "deliverer"], default: "client" },
  termsAccepted: { type: Boolean, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Index for faster lookups
userSchema.index({ email: 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Exporting User model
const User = mongoose.model("User", userSchema);
export default User;
