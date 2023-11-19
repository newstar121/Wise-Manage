const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharitySchema = new Schema(
  {
    organisation_number: {
      type: String,
      required: [true, "Organisation Number is required"]
    },
    reg_charity_number: {
      type: String,
      required: [true, "Registration Charity Number is required"],
    },
    group_subsid_suffix: {
      type: Number,
      required: [true, "Group Subid Suffix is required"]
    },
    charity_name: {
      type: String,
      required: [true, "Charity Name is required"],
      trim: true
    },
    reg_status: {
      type: String,
      required: [true, "Registration Status is required"],
      trim: true
    },
    date_of_registration: {
      type: Date
    },
    date_of_removal: {
      type: Date
    },
    income: {
      type: Number
    },
    reporting: {
      type: String
    },
    new: {
      type: Boolean, default: true
    },
    last_modified_time: {
      type: Date
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const Charity = mongoose.model("Charity", CharitySchema);
module.exports = { Charity };
