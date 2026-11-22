import React, { useState, useEffect } from "react";
import { AiOutlineUserAdd, AiOutlineFileAdd } from "react-icons/ai";
import { FaAmbulance, FaUsers, FaShieldAlt, FaSkullCrossbones } from "react-icons/fa";
import { BsBookmarkPlus, BsFillBookmarkCheckFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { TbReportMedical } from "react-icons/tb";
import { Link } from "react-router-dom";
import { ImMenu } from "react-icons/im";
import { FiLogOut } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { MdDashboardCustomize } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { authLogout } from "../../../../Redux/auth/action";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const [malwareActive, setMalwareActive] = useState(() => {
    const saved = localStorage.getItem("baseline_malware_active");
    return saved !== null ? saved === "true" : true;
  });

  const {
    data: { user },
  } = useSelector((state) => state.auth);

  function toggle() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const syncState = () => {
      const saved = localStorage.getItem("baseline_malware_active");
      setMalwareActive(saved !== null ? saved === "true" : true);
    };
    window.addEventListener("medicore_reports_updated", syncState);
    return () => window.removeEventListener("medicore_reports_updated", syncState);
  }, []);

  const handlePurgeMalwareAndRestore = () => {
    localStorage.setItem("baseline_malware_active", "false");
    setMalwareActive(false);

    // Seed new clean clinical reports into extra reports
    try {
      const existing = localStorage.getItem("extra_simulation_reports");
      let reports = existing ? JSON.parse(existing) : [];
      if (reports.length === 0) {
        reports = [
          {
            id: 111,
            name: "Elena Rostova",
            patient_name: "Elena Rostova",
            patientid: "P-111",
            doctor_name: "Dr. Joseph Torres",
            doctor_department: "General Medicine",
            date: new Date().toISOString(),
            time: "10:15:00",
            disease: "Post-Viral Fatigue & Bronchitis",
            temperature: "98.4",
            weight: "62.0",
            bp: "122/80",
            glucose: "102",
            info: "Post-viral respiratory examination complete. Lungs clear. Clinical recovery verified.",
          },
          {
            id: 112,
            name: "David Kim",
            patient_name: "David Kim",
            patientid: "P-112",
            doctor_name: "Dr. Sarah Jenkins",
            doctor_department: "Cardiology",
            date: new Date().toISOString(),
            time: "11:30:00",
            disease: "Mild Hypertension Screening",
            temperature: "98.6",
            weight: "74.5",
            bp: "128/84",
            glucose: "108",
            info: "Routine cardiology checkup. Normal sinus rhythm. Cardiovascular profile verified intact.",
          },
        ];
        localStorage.setItem("extra_simulation_reports", JSON.stringify(reports));
      }
    } catch (_) {}

    message.success({
      content: "Malware files deleted! Clean medical reports restored from secure storage.",
      duration: 3.5,
    });

    window.dispatchEvent(
      new CustomEvent("medicore_reports_updated", {
        detail: { malwareActive: false },
      })
    );
  };

  const handleReSimulateRansomware = () => {
    localStorage.setItem("baseline_malware_active", "true");
    setMalwareActive(true);

    message.warning({
      content: "Ransomware simulation active: S3 files locked with 5.0 BTC extortion note.",
      duration: 3.5,
    });

    window.dispatchEvent(
      new CustomEvent("medicore_reports_updated", {
        detail: { malwareActive: true },
      })
    );
  };

  const handleAddNewReport = () => {
    try {
      const existing = localStorage.getItem("extra_simulation_reports");
      const list = existing ? JSON.parse(existing) : [];
      const newId = 111 + list.length;
      const mockNames = [
        "Liam Johnson",
        "Emma Watson",
        "Alex Rivera",
        "Sophia Martinez",
        "Noah Brown",
      ];
      const mockDiseases = [
        "Allergic Rhinitis Consultation",
        "Type-2 Diabetes Routine Review",
        "Clinical Cardiology Checkup",
        "Lumbar Spondylosis Diagnostic",
        "Seasonal Asthma Assessment",
      ];
      const pickedName = mockNames[newId % mockNames.length];
      const pickedDisease = mockDiseases[newId % mockDiseases.length];

      const newReport = {
        id: newId,
        name: pickedName,
        patient_name: pickedName,
        patientid: `P-${newId}`,
        doctor_name: "Dr. Joseph Torres",
        doctor_department: "General Medicine",
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        disease: pickedDisease,
        temperature: (98.0 + (newId % 4) * 0.3).toFixed(1),
        weight: (65 + (newId % 20)).toFixed(1),
        bp: `${120 + (newId % 12)}/${80 + (newId % 6)}`,
        glucose: `${98 + (newId % 25)}`,
        info: `Clean clinical diagnostic record for ${pickedName}. All vital signs and physician notes verified.`,
      };

      const updated = [newReport, ...list];
      localStorage.setItem("extra_simulation_reports", JSON.stringify(updated));

      message.success(`New clean report #REP-${newId} (${pickedName}) created.`);

      window.dispatchEvent(
        new CustomEvent("medicore_reports_updated", {
          detail: { malwareActive: false },
        })
      );
    } catch (_) {}
  };

  return (
    <>
      <div>
        <div style={{ width: isOpen ? "200px" : "70px" }} className={`sidebar`}>
          <div className="top_section">
            <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
              HMS
            </h1>
            <div
              style={{ marginLeft: isOpen ? "50px" : "0px" }}
              className="bars"
            >
              <ImMenu onClick={toggle} style={{ cursor: "pointer" }} />
            </div>
          </div>
          <div className="bottomSection">
            <Link className="link" activeclassname="active" to={"/dashboard"}>
              <div className="icon">
                <MdDashboardCustomize className="mainIcon" />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                DashBoard
              </div>
            </Link>
            {user?.userType === "patient" ? (
              <>
                <Link
                  className="link"
                  activeclassname="active"
                  to={"/patientprofile"}
                >
                  <div className="icon">
                    <CgProfile className="mainIcon" />
                  </div>
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Profile
                  </div>
                </Link>
                <Link
                  className="link"
                  activeclassname="active"
                  to={"/bookappointment"}
                >
                  <div className="icon">
                    <BsBookmarkPlus className="mainIcon" />
                  </div>
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Book Appointment
                  </div>
                </Link>
              </>
            ) : null}
            {user?.userType === "doctor" ? (
              <>
                <Link
                  className="link"
                  activeclassname="active"
                  to={"/doctorprofile"}
                >
                  <div className="icon">
                    <CgProfile className="mainIcon" />
                  </div>
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Profile
                  </div>
                </Link>
                <Link
                  className="link"
                  activeclassname="active"
                  to={"/patientdetails"}
                >
                  <div className="icon">
                    <FaUsers className="mainIcon" />
                  </div>
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Patients
                  </div>
                </Link>
              </>
            ) : null}

            {user?.userType !== "admin" ? (
              <>
                <Link
                  className="link"
                  activeclassname="active"
                  to={"/checkappointment"}
                >
                  <div className="icon">
                    <BsFillBookmarkCheckFill className="mainIcon" />
                  </div>
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    My Appointments
                  </div>
                </Link>
                <Link className="link" activeclassname="active" to={"/reports"}>
                  <div className="icon">
                    <TbReportMedical className="mainIcon" />
                  </div>
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    Reports
                  </div>
                </Link>
              </>
            ) : null}

            {/* Sidebar Malware Purge & Clean File Restoration Controls */}
            <div
              style={{
                marginTop: "16px",
                marginBottom: "8px",
                borderTop: "1px solid rgba(255, 255, 255, 0.25)",
                paddingTop: "10px",
              }}
            >
              {malwareActive ? (
                <div
                  className="link"
                  onClick={handlePurgeMalwareAndRestore}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(22, 163, 74, 0.85)",
                    borderRadius: "6px",
                    margin: "0 8px 6px 8px",
                    padding: isOpen ? "8px 10px" : "8px 0",
                    justifyContent: isOpen ? "flex-start" : "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                  title="Purge Malware & Restore Clean Files"
                >
                  <div className="icon" style={{ display: "flex", justifyContent: "center" }}>
                    <FaShieldAlt style={{ fontSize: "1.2rem", color: "#ffffff" }} />
                  </div>
                  <div
                    style={{
                      display: isOpen ? "block" : "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: "1.2",
                    }}
                    className="link_text"
                  >
                    <div>Purge Malware</div>
                    <div style={{ fontSize: "10px", opacity: 0.9 }}>Restore Clean Files</div>
                  </div>
                </div>
              ) : (
                <div
                  className="link"
                  onClick={handleReSimulateRansomware}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(220, 38, 38, 0.85)",
                    borderRadius: "6px",
                    margin: "0 8px 6px 8px",
                    padding: isOpen ? "8px 10px" : "8px 0",
                    justifyContent: isOpen ? "flex-start" : "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                  title="Re-simulate Ransomware Infection"
                >
                  <div className="icon" style={{ display: "flex", justifyContent: "center" }}>
                    <FaSkullCrossbones style={{ fontSize: "1.2rem", color: "#ffffff" }} />
                  </div>
                  <div
                    style={{
                      display: isOpen ? "block" : "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: "1.2",
                    }}
                    className="link_text"
                  >
                    <div>Infect Files</div>
                    <div style={{ fontSize: "10px", opacity: 0.9 }}>Simulate Ransomware</div>
                  </div>
                </div>
              )}

              {/* Add New Report Button */}
              <div
                className="link"
                onClick={handleAddNewReport}
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                  borderRadius: "6px",
                  margin: "0 8px 6px 8px",
                  padding: isOpen ? "8px 10px" : "8px 0",
                  justifyContent: isOpen ? "flex-start" : "center",
                }}
                title="Create New Clean Report"
              >
                <div className="icon" style={{ display: "flex", justifyContent: "center" }}>
                  <AiOutlineFileAdd style={{ fontSize: "1.2rem", color: "#ffffff" }} />
                </div>
                <div
                  style={{
                    display: isOpen ? "block" : "none",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                  className="link_text"
                >
                  + New Report
                </div>
              </div>
            </div>

            <Link
              className="LogOutPath link"
              onClick={() => {
                dispatch(authLogout());
              }}
              to={"/"}
            >
              <div className="icon">
                <FiLogOut />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                Logout
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
