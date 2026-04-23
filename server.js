// import libraries
const express = require("express");
const cors = require("cors");

// cloudant imports
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const app = express(); // creates backend server

// backend communication
app.use(cors());          // allows frontend request
app.use(express.json());  // reads json data

// cloudant setup
const cloudant = CloudantV1.newInstance({
  authenticator: new IamAuthenticator({
    apikey: "xRmbu1Y5_HHYxWBmM4Q882tj7TE4t3d1-QiCfcxJmNou"
  })
});

cloudant.setServiceUrl("https://7ae4201c-ff99-454d-a6df-97aa8ef7480b-bluemix.cloudantnosqldb.appdomain.cloud");

// test connection
cloudant.getAllDbs()
  .then(res => {
    console.log("Connected to Cloudant");
    console.log(res.result);
  })
  .catch(err => {
    console.log("Cloudant connection error:", err.message);
  });

// Test API
app.get("/", (req, res) => {
  res.send("Backend is running.");
});


// REGISTER API
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  try {
    // check if email already exists
    const existing = await cloudant.postFind({
      db: "users",
      selector: { email: email }
    });

    if (existing.result.docs.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // save new user
    await cloudant.postDocument({
      db: "users",
      document: { name, email, password }
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});


// LOGIN API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // find user by email only first
    const result = await cloudant.postFind({
      db: "users",
      selector: { email: email }
    });

    if (result.result.docs.length === 0) {
      // email not found
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const user = result.result.docs[0];

    // check password separately
    if (user.password !== password) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // login success - don't send password back to frontend
    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});


// BOOKING API - save a booking
app.post("/booking", async (req, res) => {
  const { fname, lname, email, from, to, dep, cabin, passengers, total } = req.body;

  // input validation
  if (!fname || !lname || !email || !from || !to || !dep) {
    return res.status(400).json({ message: "Please fill all required booking fields" });
  }

  try {
    const booking = {
      fname,
      lname,
      email,
      from,
      to,
      dep,
      cabin:      cabin      || "Economy",
      passengers: passengers || "1 Adult",
      total:      total      || "0",
      bookedAt:   new Date().toISOString()
    };

    await cloudant.postDocument({
      db: "bookings",
      document: booking
    });

    res.json({
      message: "Booking successful",
      booking: booking
    });

  } catch (err) {
    console.error("Booking error:", err.message);
    res.status(500).json({ message: "Booking failed. Please try again." });
  }
});


// BOOKINGS API - get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const result = await cloudant.postAllDocs({
      db: "bookings",
      includeDocs: true
    });

    // filter out Cloudant design documents
    const bookings = result.result.rows
      .map(row => row.doc)
      .filter(doc => !doc._id.startsWith('_design'));

    res.json(bookings);

  } catch (err) {
    console.error("Get bookings error:", err.message);
    res.status(500).json({ message: "Could not fetch bookings." });
  }
});


// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});