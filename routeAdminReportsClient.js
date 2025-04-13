require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const AdminReportsClient = require("./models/modelAdminReportsClient");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads")); // Serve uploaded files

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Uploads will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// POST Route - Upload Invoice
app.post("/upload-invoice", upload.single("file"), async (req, res) => {
  try {
    const { invoiceNumber, amount, dateTime } = req.body;

    // Validate required fields
    if (!invoiceNumber || !amount || !dateTime || !req.file) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Create a new Invoice Entry
    const newInvoice = new AdminReportsClient({
      invoiceNumber,
      amount,
      dateTime,
      fileUrl: `/uploads/${req.file.filename}`, // Save file URL
    });

    // Save to MongoDB
    await newInvoice.save();

    res.status(201).json({ message: "Invoice uploaded successfully!", invoice: newInvoice });
  } catch (error) {
    console.error("Error uploading invoice:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
});

// Start Server
const PORT = process.env.PORT || 5030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



//THIS CODE JUST PASTED NOT COMPLETED I HAVE TO DO FROM THE STARTING 