const express = require("express");
require("dotenv").config();
const cors = require("cors");
const adminRouter = require("./routes/Admins.Route");
const ambulanceRouter = require("./routes/Ambulances.Route");
const appointmentRouter = require("./routes/Appointments.Route");
const doctorRouter = require("./routes/Doctors.Route");
const hospitalRouter = require("./routes/Hospitals.Route");
const patientRouter = require("./routes/Patients.Route");
const prescriptionRouter = require("./routes/Prescriptions.Route");
const reportRouter = require("./routes/Reports.Route");

const app = express();
const db = require("./configs/db");
const port = Number(process.env.PORT || process.env.APP_PORT || process.env.port || 3001);
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,https://health-care-six-ivory.vercel.app")
  .split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(express.json());
app.use(cors({ origin(origin, callback) {
  if (
    !origin ||
    allowedOrigins.includes("*") ||
    allowedOrigins.includes(origin) ||
    origin.endsWith(".vercel.app")
  ) {
    return callback(null, true);
  }
  return callback(new Error("Origin not allowed by CORS"));
} }));

app.get("/", (req, res) => {
  res.send("Healthcare System");
});

app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "ok" });
  } catch (error) {
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.use("/admin", adminRouter);
app.use("/ambulances", ambulanceRouter);
app.use("/appointments", appointmentRouter);
app.use("/doctors", doctorRouter);
app.use("/hospitals", hospitalRouter);
app.use("/patients", patientRouter);
app.use("/prescriptions", prescriptionRouter);
app.use("/reports", reportRouter);

app.listen(port, () => console.log(`Listening at port ${port}`));
