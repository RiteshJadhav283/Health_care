CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "phoneNum" BIGINT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL DEFAULT 'Doctor@123',
  age INTEGER NOT NULL,
  gender CHAR(1) NOT NULL,
  "bloodGroup" VARCHAR(3) NOT NULL,
  "DOB" DATE NOT NULL,
  address VARCHAR(255) NOT NULL,
  education VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  availability TIME[] NOT NULL DEFAULT ARRAY[
    '10:00'::TIME,'10:15'::TIME,'10:30'::TIME,'10:45'::TIME,
    '11:00'::TIME,'11:15'::TIME,'11:30'::TIME,'11:45'::TIME,
    '14:00'::TIME,'14:15'::TIME,'14:30'::TIME,'14:45'::TIME,
    '15:00'::TIME,'15:15'::TIME,'15:30'::TIME,'15:45'::TIME,'16:00'::TIME
  ],
  fees INT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "phoneNum" BIGINT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL DEFAULT 'Admin@123',
  age INTEGER NOT NULL,
  gender CHAR(1) NOT NULL,
  "DOB" DATE,
  address VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "phoneNum" BIGINT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender CHAR(1),
  "bloodGroup" VARCHAR(3),
  "DOB" DATE,
  address VARCHAR(255),
  "docID" INT REFERENCES doctors(id)
);

CREATE TABLE IF NOT EXISTS ambulance (
  "numPlate" VARCHAR(8) PRIMARY KEY,
  "ambuType" VARCHAR(50) NOT NULL,
  pph INT NOT NULL,
  "driverName" VARCHAR(255) NOT NULL,
  "driverNum" BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patientid INT NOT NULL REFERENCES patients(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  problem TEXT NOT NULL,
  doctorid INT NOT NULL REFERENCES doctors(id)
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  patientid INT NOT NULL REFERENCES patients(id),
  doctorid INT NOT NULL REFERENCES doctors(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  disease TEXT,
  temperature NUMERIC,
  weight NUMERIC,
  bp VARCHAR(32),
  glucose NUMERIC,
  info TEXT
);

CREATE TABLE IF NOT EXISTS medication (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(255),
  frequency VARCHAR(255),
  duration VARCHAR(255),
  reportid INT NOT NULL REFERENCES reports(id) ON DELETE CASCADE
);

CREATE OR REPLACE VIEW doctor_details AS SELECT * FROM doctors;
CREATE OR REPLACE VIEW patient_details AS SELECT * FROM patients;
