const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ElectricSchema = new Schema(
  {
    number: {
      type: String,
      required: [true, "Account Number is required"],
      trim: true,
    },
    property: {
      type: String,
      required: [true, "Property Address is required"],
      trim: true,
    },
    last_used: {
      type: Number,
      required: [true, "Consumption is required"],
    },
    unit_rate: {
      type: Number,
      default: 0.0,
    },
    standingCharge: {
      type: Number,
      default: 0.0,
    },
    balance: {
      type: Number,
      default: 0.0,
    }
  },
  { versionKey: false }
);

const Electric = mongoose.model("Electric", ElectricSchema);
module.exports = { Electric };
