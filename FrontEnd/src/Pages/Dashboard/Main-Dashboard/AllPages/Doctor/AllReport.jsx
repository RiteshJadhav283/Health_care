import { Table, Button, Modal, Space, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineDownload, AiOutlinePlus, AiOutlineReload } from "react-icons/ai";
import { FaShieldAlt, FaSkullCrossbones } from "react-icons/fa";
import Sidebar from "../../GlobalFiles/Sidebar";
import {
  GetAllData,
  GetPatients,
  GetDoctorDetails,
  GetAllReports,
} from "../../../../../Redux/Datas/action";
import {
  generateReportPDF,
  getReportPDFBlobUrl,
} from "../../../../../utils/generateReportPDF";

const AllReport = () => {
  const dispatch = useDispatch();

  // Persistent simulation state
  const [ransomwareActive, setRansomwareActive] = useState(() => {
    const saved = localStorage.getItem("ransomware_simulation_active");
    return saved !== null ? saved === "true" : true;
  });

  const [extraReports, setExtraReports] = useState(() => {
    try {
      const saved = localStorage.getItem("extra_simulation_reports");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [previewModal, setPreviewModal] = useState({
    open: false,
    url: null,
    report: null,
  });

  const handleToggleRansomware = (active) => {
    setRansomwareActive(active);
    localStorage.setItem("ransomware_simulation_active", String(active));
  };

  const handleAddSimulationReport = () => {
    const totalReports = (reports?.length || 0) + extraReports.length;
    const newId = totalReports + 1;
    const mockNames = [
      "Alex Rivera",
      "Emma Watson",
      "David Kim",
      "Sophia Martinez",
      "Liam Johnson",
      "Elena Rostova",
    ];
    const mockDiseases = [
      "Acute Bronchitis",
      "Type 2 Diabetes Checkup",
      "Hypertension Stage 1",
      "Lumbar Strain",
      "Allergic Rhinitis",
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
      temperature: (98.0 + (newId % 4) * 0.4).toFixed(1),
      weight: (64 + (newId % 25)).toFixed(1),
      bp: `${120 + (newId % 15)}/${80 + (newId % 8)}`,
      glucose: `${100 + (newId % 20)}`,
      info: `Simulation examination report generated for ${pickedName}. Diagnostic indicators reviewed and verified.`,
    };

    const updated = [newReport, ...extraReports];
    setExtraReports(updated);
    localStorage.setItem("extra_simulation_reports", JSON.stringify(updated));
  };

  const handleResetSimulationReports = () => {
    setExtraReports([]);
    localStorage.removeItem("extra_simulation_reports");
  };

  const handleViewPDF = async (record) => {
    const url = await getReportPDFBlobUrl(record, user, ransomwareActive);
    setPreviewModal({
      open: true,
      url: url,
      report: record,
    });
  };

  const handleClosePreview = () => {
    if (previewModal.url) {
      URL.revokeObjectURL(previewModal.url);
    }
    setPreviewModal({ open: false, url: null, report: null });
  };

  useEffect(() => {
    dispatch(GetPatients());
    dispatch(GetDoctorDetails());
    dispatch(GetAllData());
    dispatch(GetAllReports(user?.userType, user?.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { reports } = useSelector((store) => store.data.reports);
  const {
    data: { user },
  } = useSelector((state) => state.auth);

  let Name;
  if (user?.userType === "patient") {
    Name = "Doctor Name";
  } else {
    Name = "Patient Name";
  }

  const combinedReports = [...extraReports, ...(reports || [])];

  const reportColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Tag color={ransomwareActive ? "red" : "blue"}>#REP-{id || "1"}</Tag>,
      width: 90,
    },
    { title: Name, dataIndex: "name", key: "name" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Disease", dataIndex: "disease", key: "disease" },
    { title: "Temp (°F)", dataIndex: "temperature", key: "temperature" },
    { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
    { title: "BP (mmHg)", dataIndex: "bp", key: "bp" },
    { title: "Glucose", dataIndex: "glucose", key: "glucose" },
    {
      title: "Status",
      key: "status",
      render: () =>
        ransomwareActive ? (
          <Tag color="error" style={{ fontWeight: 600 }}>
            LOCKED (5.0 BTC)
          </Tag>
        ) : (
          <Tag color="success" style={{ fontWeight: 600 }}>
            RESTORED / CLEAN
          </Tag>
        ),
      width: 140,
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            icon={<AiOutlineEye style={{ fontSize: "15px" }} />}
            style={{
              borderColor: ransomwareActive ? "#dc2626" : "#184C78",
              color: ransomwareActive ? "#dc2626" : "#184C78",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "4px",
              fontWeight: "600",
            }}
            onClick={() => handleViewPDF(record)}
          >
            {ransomwareActive ? "View Defaced PDF" : "View PDF"}
          </Button>
          <Button
            type="primary"
            icon={<AiOutlineDownload style={{ fontSize: "15px" }} />}
            style={{
              backgroundColor: ransomwareActive ? "#b91c1c" : "#184C78",
              borderColor: ransomwareActive ? "#b91c1c" : "#184C78",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "4px",
              fontWeight: "500",
            }}
            onClick={() => generateReportPDF(record, user, ransomwareActive)}
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="container">
        <Sidebar />

        <div className="AfterSideBar">
          {/* Header & Simulation Control Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ color: "rgb(184 191 234)", margin: 0 }}>Reports</h1>
              {ransomwareActive ? (
                <span
                  style={{
                    background: "#fee2e2",
                    color: "#b91c1c",
                    border: "1px solid #f87171",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    fontSize: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaSkullCrossbones /> ⚠️ RANSOMWARE ENCRYPTED (5.0 BTC EXTORTION)
                </span>
              ) : (
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    border: "1px solid #86efac",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    fontSize: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaShieldAlt /> 🟢 SIMULATION: RANSOMWARE REMOVED (CLEAN RESTORED)
                </span>
              )}
            </div>

            {/* Simulation Action Buttons */}
            <Space size="middle" style={{ flexWrap: "wrap" }}>
              {ransomwareActive ? (
                <Button
                  type="primary"
                  icon={<FaShieldAlt style={{ marginRight: "4px" }} />}
                  style={{
                    backgroundColor: "#16a34a",
                    borderColor: "#16a34a",
                    fontWeight: 700,
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(22, 163, 74, 0.2)",
                  }}
                  onClick={() => handleToggleRansomware(false)}
                >
                  🛡️ Remove Ransomware (Restore Clean)
                </Button>
              ) : (
                <Button
                  type="primary"
                  danger
                  icon={<FaSkullCrossbones style={{ marginRight: "4px" }} />}
                  style={{
                    fontWeight: 700,
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
                  }}
                  onClick={() => handleToggleRansomware(true)}
                >
                  ☣️ Simulate Ransomware Attack
                </Button>
              )}

              <Button
                type="default"
                icon={<AiOutlinePlus />}
                style={{
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  fontWeight: 600,
                  borderRadius: "6px",
                }}
                onClick={handleAddSimulationReport}
              >
                Add New Test Report
              </Button>

              {extraReports.length > 0 && (
                <Button
                  type="text"
                  icon={<AiOutlineReload />}
                  style={{ color: "#64748b", fontSize: "12px" }}
                  onClick={handleResetSimulationReports}
                >
                  Reset ({extraReports.length} added)
                </Button>
              )}
            </Space>
          </div>

          {/* Incident / Security Posture Alert Banner */}
          {ransomwareActive ? (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "16px",
                color: "#991b1b",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div>
                <strong>CRITICAL SECURITY INCIDENT (UNSECURED BASELINE):</strong> Storage and EHR
                subsystem compromised by DarkSurge Ransomware. PDFs are locked with an extortion demand
                of <strong>5.0 BTC (~$350,000 USD)</strong> to restore medical records.
              </div>
              <Button
                size="small"
                style={{
                  backgroundColor: "#16a34a",
                  borderColor: "#16a34a",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
                onClick={() => handleToggleRansomware(false)}
              >
                Click to Neutralize & Restore
              </Button>
            </div>
          ) : (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "16px",
                color: "#166534",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div>
                <strong>SIMULATION STATUS (CLEAN RESTORED):</strong> Ransomware defacement has been
                removed. Patient examination records, clinical diagnostics, vitals, and physician notes
                are fully restored and accessible.
              </div>
              <Button
                size="small"
                danger
                style={{ fontWeight: 600 }}
                onClick={() => handleToggleRansomware(true)}
              >
                Re-Simulate Ransomware Attack
              </Button>
            </div>
          )}

          <div>
            {user?.userType !== "admin" ? (
              <div className="patientDetails">
                <div className="patientBox">
                  <Table
                    columns={reportColumns}
                    dataSource={combinedReports}
                    rowKey={(r) => r.id || r.name}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* PDF View Modal */}
      <Modal
        title={
          <span style={{ color: ransomwareActive ? "#b91c1c" : "#184C78" }}>
            {ransomwareActive
              ? `⚠️ LOCKED FILE PREVIEW: #REP-${previewModal.report?.id || ""} (Ransomware Extortion Active)`
              : `Medical Report Preview — #REP-${previewModal.report?.id || ""}`}
          </span>
        }
        open={previewModal.open}
        onCancel={handleClosePreview}
        width={850}
        style={{ top: 20 }}
        footer={[
          <Button key="close" onClick={handleClosePreview}>
            Close
          </Button>,
          <Button
            key="newtab"
            icon={<AiOutlineEye />}
            onClick={() => window.open(previewModal.url, "_blank")}
          >
            Open in New Tab
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<AiOutlineDownload />}
            style={{
              backgroundColor: ransomwareActive ? "#b91c1c" : "#184C78",
              borderColor: ransomwareActive ? "#b91c1c" : "#184C78",
            }}
            onClick={() => generateReportPDF(previewModal.report, user, ransomwareActive)}
          >
            {ransomwareActive ? "Download Ransom Note PDF" : "Download PDF"}
          </Button>,
        ]}
        destroyOnClose
      >
        {previewModal.url && (
          <iframe
            src={previewModal.url}
            title="Medical Report PDF Preview"
            width="100%"
            height="580px"
            style={{ border: "1px solid #e2e8f0", borderRadius: "6px" }}
          />
        )}
      </Modal>
    </>
  );
};

export default AllReport;
