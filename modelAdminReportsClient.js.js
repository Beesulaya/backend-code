// Backend/models/adminReportsClient.js
const mongoose = require("mongoose");

const AdminReportsClientSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    fileUrl: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true } 
);

const AdminReportsClient = mongoose.model(
  "Admin_Reports_Client",
  AdminReportsClientSchema
);
module.exports = AdminReportsClient;
