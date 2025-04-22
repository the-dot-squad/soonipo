import mongoose from "mongoose";

const IpoSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, index: true },
    companyName: { type: String, index: true },
    date: { type: Date }, // Storing as native Date
    price: { type: String },
    shares: {
      number: Number,
      value: Number,
    },
    exchange: {
      symbol: String,
      country: String,
    },
    source: { type: String }, // Source of data
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, index: true },
  },
  {
    collection: "ipo",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.IPO || mongoose.model("IPO", IpoSchema);
