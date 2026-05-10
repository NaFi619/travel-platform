import mongoose, { Schema, model, models } from "mongoose";

const DestinationSchema = new Schema({
  title: String,
  location: String,
  image: String,
  description: String,
  isSponsored: { type: Boolean, default: false }, // Feature 4: Sponsored
  packages: {
    budget: {
      price: Number,
      stay: String,
      transport: String,
      perks: [String]
    },
    elite: {
      price: Number,
      stay: String,
      transport: String,
      perks: [String]
    }
  },
  topStays: [{
    name: String,
    price: String,
    rating: Number,
    affiliateLink: String // Feature 1 & 6: Affiliates
  }],
  expert: {
    name: String,
    phone: String, // For WhatsApp
    rating: Number,
    avatar: String
  }
}, { timestamps: true });

export const Destination = models.Destination || model("Destination", DestinationSchema);