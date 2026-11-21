const countReportQuery = `SELECT COUNT(*) FROM reports;`;

const createReportQuery = `INSERT INTO reports (
    patientid,
    doctorid,
    date,
    time,
    disease,
    temperature,
    weight,
    bp,
    glucose,
    info
  )
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
  )`;

const getLastReportIdQuery = `SELECT id
from reports
ORDER BY id DESC
LIMIT 1;`;

const getPatientReportQuery = `SELECT 
  doctors.name,
  doctors.name AS doctor_name,
  doctors.department AS doctor_department,
  patients.name AS patient_name,
  patients.age AS patient_age,
  patients.gender AS patient_gender,
  reports.*
FROM reports
JOIN doctors ON reports.doctorid = doctors.id
JOIN patients ON reports.patientid = patients.id
WHERE reports.patientid = $1
ORDER BY reports.id DESC;`;

const getDoctorReportQuery = `SELECT 
  patients.name,
  patients.name AS patient_name,
  patients.age AS patient_age,
  patients.gender AS patient_gender,
  doctors.name AS doctor_name,
  doctors.department AS doctor_department,
  reports.*
FROM reports
JOIN patients ON reports.patientid = patients.id
JOIN doctors ON reports.doctorid = doctors.id
WHERE reports.doctorid = $1
ORDER BY reports.id DESC;`;

module.exports = {
  getLastReportIdQuery,
  countReportQuery,
  createReportQuery,
  getDoctorReportQuery,
  getPatientReportQuery,
};
