import mongoose from "mongoose";

const delivererSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

const Deliverer = mongoose.model("Deliverer", delivererSchema);

export default Deliverer;
