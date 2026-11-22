import { Table, Button, Modal, Space } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye, AiOutlineDownload } from "react-icons/ai";
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
  isMalwareActive,
} from "../../../../../utils/generateReportPDF";

const AllReport = () => {
  const dispatch = useDispatch();

  const [malwareActive, setMalwareActive] = useState(() => isMalwareActive());

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

  const handleViewPDF = async (record) => {
    const s3Result = await getReportPDFBlobUrl(record, user, malwareActive);
    setPreviewModal({
      open: true,
      url: s3Result,
      report: record,
    });
  };

  const handleClosePreview = () => {
    if (previewModal.url && previewModal.url.startsWith("blob:")) {
      URL.revokeObjectURL(previewModal.url);
    }
    setPreviewModal({ open: false, url: null, report: null });
  };

  useEffect(() => {
    dispatch(GetPatients());
    dispatch(GetDoctorDetails());
    dispatch(GetAllData());
    dispatch(GetAllReports(user?.userType, user?.id));

    const handleUpdate = () => {
      setMalwareActive(isMalwareActive());
      try {
        const saved = localStorage.getItem("extra_simulation_reports");
        setExtraReports(saved ? JSON.parse(saved) : []);
      } catch {
        setExtraReports([]);
      }
    };

    window.addEventListener("medicore_reports_updated", handleUpdate);
    return () => window.removeEventListener("medicore_reports_updated", handleUpdate);
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
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            icon={<AiOutlineEye style={{ fontSize: "15px" }} />}
            style={{
              borderColor: "#184C78",
              color: "#184C78",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "4px",
              fontWeight: "500",
            }}
            onClick={() => handleViewPDF(record)}
          >
            View PDF
          </Button>
          <Button
            type="primary"
            icon={<AiOutlineDownload style={{ fontSize: "15px" }} />}
            style={{
              backgroundColor: "#184C78",
              borderColor: "#184C78",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              borderRadius: "4px",
              fontWeight: "500",
            }}
            onClick={() => generateReportPDF(record, user, malwareActive)}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h1 style={{ color: "rgb(184 191 234)", margin: 0 }}>Reports</h1>
          </div>

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

      {/* PDF View Modal (Streaming directly from AWS S3 Bucket) */}
      <Modal
        title={`Medical Report Preview — #REP-${previewModal.report?.id || ""}`}
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
            style={{ backgroundColor: "#184C78", borderColor: "#184C78" }}
            onClick={() =>
              generateReportPDF(previewModal.report, user, malwareActive)
            }
          >
            Download PDF
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
            style={{ border: "1px solid #cbd5e1", borderRadius: "6px" }}
          />
        )}
      </Modal>
    </>
  );
};

export default AllReport;
