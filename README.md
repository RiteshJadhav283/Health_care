# E-Health Management Hub

Welcome to E-Health Management Hub, a comprehensive Hospital Management System web application developed with React, Express, Node, and PostgreSQL. This system is designed to streamline hospital operations, enhance communication between patients and healthcare providers, and ensure efficient management of healthcare-related activities.

🔗 **Live Frontend Application**: [https://health-care-six-ivory.vercel.app/](https://health-care-six-ivory.vercel.app/)

## Features

### Role-Based Access

E-Health Management Hub incorporates role-based access control with three distinct roles:

- **Admin**: Has full access to all functionalities, including user management, maintaining hospital equipment, and users record.

- **Patient**: Can book appointments with specific doctors, view appointment history, and access personal health records.

- **Doctor**: Has the ability to view and manage appointments, generate patient reports, and update medical records.

### Appointment Booking

Patients can easily book appointments with their preferred doctors using the intuitive interface. The system ensures smooth scheduling and helps patients manage their healthcare appointments efficiently.

### Report Generation & PDF Export

Doctors can generate detailed medical reports for their patients, providing a comprehensive overview of their medical history, prescriptions, vitals, and diagnostic details. Both Doctors and Patients can view and download clinical reports in **PDF format**.

## Documentation

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- PostgreSQL: [Download and Install PostgreSQL](https://www.postgresql.org/)

### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/SamarthD1/Health_care.git
   cd Health_care
   ```

2. Start the backend express server:

   ```bash
   cd Backend
   npm run dev
   ```

   Make sure you have your postgres server running. Before running the server, configure your postgres credentials and other environment variables in the `.env` file. Refer to the `example.env` file for reference.

3. Start React app:

   ```bash
   cd FrontEnd
   npm start
   ```
