import React from "react";
import { Route, Routes } from "react-router-dom";
import DLogin from "../Pages/Dashboard/Dashboard-Login/DLogin";
import DSignup from "../Pages/Dashboard/Dashboard-Login/Signup/DSignup";
import AddAdmin from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/Add_Admin";
import AddAmbulance from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/Add_Ambulance";
import AddDoctor from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/Add_Doctor";
import AllReport from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/AllReport";
import CheckAppointment from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/Check_Appointment";
import CreateReport from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/Create_Report";
import DoctorProfile from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/Doctor_Profile";
import PatientDetails from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/Patient_Details";
import BookAppointment from "../Pages/Dashboard/Main-Dashboard/AllPages/Patient/Book_Appointment";
import PatientProfile from "../Pages/Dashboard/Main-Dashboard/AllPages/Patient/Patient_Profile";
import FrontPage from "../Pages/Dashboard/Main-Dashboard/GlobalFiles/FrontPage";
import AdminProfile from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/Admin_Profile";
import SignupDetails from "../Pages/Dashboard/Dashboard-Login/Signup/SignupDetails";

const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<DLogin />} />
        <Route path="/signup" element={<DSignup />} />
        <Route path="/adddetails" element={<SignupDetails />} />
        <Route path="/dashboard" element={<FrontPage />} />
        <Route path="/addoctor" element={<AddDoctor />} />
        <Route path="/addambulance" element={<AddAmbulance />} />
        <Route path="/addadmin" element={<AddAdmin />} />
        <Route path="/adminprofile" element={<AdminProfile />} />
        {/* Doctor Part */}
        <Route path="/reports" element={<AllReport />} />
        <Route path="/checkappointment" element={<CheckAppointment />} />
        <Route path="/createreport" element={<CreateReport />} />
        <Route path="/patientdetails" element={<PatientDetails />} />
        <Route path="/doctorprofile" element={<DoctorProfile />} />
        {/* Patient Part */}
        <Route path="/bookappointment" element={<BookAppointment />} />
        <Route path="/patientprofile" element={<PatientProfile />} />
      </Routes>
    </>
  );
};

export default AllRoutes;
