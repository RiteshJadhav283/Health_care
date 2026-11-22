import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Live S3 Buckets in AWS ap-south-1
export const BASELINE_S3_BASE_URL = "https://medicore-baseline-reports-017080036675.s3.ap-south-1.amazonaws.com/reports";
export const CLEAN_S3_BASE_URL = "https://medicore-patient-reports-017080036675.s3.ap-south-1.amazonaws.com/reports";

export const getS3ReportUrl = (report, isRansomware = true) => {
  const paddedId = String(report.id || 1).padStart(4, "0");
  const cleanName = (report.patient_name || report.name || "Patient").trim().replace(/\s+/g, "_");
  const filename = `Report_${paddedId}_${cleanName}.pdf`;
  const baseUrl = isRansomware ? BASELINE_S3_BASE_URL : CLEAN_S3_BASE_URL;
  return `${baseUrl}/${filename}`;
};

export const fetchS3ReportBlobUrl = async (report, isRansomware = true) => {
  const s3Url = getS3ReportUrl(report, isRansomware);
  try {
    const response = await fetch(s3Url, { cache: "no-store" });
    if (response.ok) {
      const blob = await response.blob();
      return { url: URL.createObjectURL(blob), fromS3: true, s3Url };
    }
  } catch (err) {
    console.warn("Direct S3 fetch error:", err);
  }
  return null;
};

// Generates the DarkSurge 5.0 BTC Ransomware Extortion Document
export const createRansomwarePDFDoc = (report, currentUser = null) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const patientName =
    report.patient_name ||
    (currentUser?.userType === "patient" ? currentUser.name : report.name) ||
    "John Doe";

  // Red Header Banner
  doc.setFillColor(185, 28, 28); // #b91c1c dark red
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("!!! ALL MEDICAL FILES ENCRYPTED BY DARKSURGE !!!", 14, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("DARKSURGE RANSOMWARE v4.2 - CRITICAL HOSPITAL STORAGE COMPROMISE", 14, 18);

  doc.setFontSize(8);
  doc.setTextColor(254, 202, 202);
  doc.text("STATUS: SYSTEM LOCKED", pageWidth - 14, 18, { align: "right" });

  // Subheader title bar (Amber Alert)
  doc.setFillColor(254, 226, 226);
  doc.rect(0, 28, pageWidth, 9, "F");
  doc.setTextColor(153, 27, 27);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(`EXTORTION LOCKOUT NOTICE: REPORT #REP-${report.id || "41"}`, 14, 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Incident Timestamp: ${new Date().toLocaleDateString()}`, pageWidth - 14, 34, { align: "right" });

  // Extortion Notice Box
  let startY = 43;
  doc.setDrawColor(239, 68, 68);
  doc.setFillColor(255, 245, 245);
  doc.roundedRect(14, startY, pageWidth - 28, 44, 2, 2, "FD");

  doc.setTextColor(153, 27, 27);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ATTENTION: E-HEALTH MANAGEMENT HUB / MEDICORE HEALTHCARE ADMINISTRATION", 18, startY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(33, 37, 41);
  doc.text(
    `All clinical diagnostics, laboratory vitals, and physician notes for Patient: ${patientName} (ID: P-${report.patientid || "1"})`,
    18,
    startY + 15
  );
  doc.text(
    "have been encrypted with military-grade AES-256-GCM algorithms by DarkSurge.",
    18,
    startY + 21
  );
  doc.text(
    "Your baseline storage has NO Aegis protection. Local backups have been neutralized.",
    18,
    startY + 27
  );
  doc.setTextColor(185, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Original clinical contents cannot be decrypted or viewed until ransom payment is confirmed.",
    18,
    startY + 35
  );

  // Black Ransom Payment Demand Box
  startY = 93;
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(14, startY, pageWidth - 28, 54, 2, 2, "F");

  doc.setTextColor(239, 68, 68); // Red
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RANSOM DEMAND TO UNLOCK AND RECOVER YOUR CLINICAL FILES:", 18, startY + 10);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("AMOUNT TO PAY:   5.0 BITCOIN (BTC)   [~ $350,000 USD]", 18, startY + 20);

  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248); // Cyan
  doc.text("SEND PAYMENT TO WALLET: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", 18, startY + 29);

  doc.setTextColor(248, 113, 113);
  doc.setFontSize(9);
  doc.text("TIME REMAINING:   23 HOURS : 59 MINUTES : 59 SECONDS", 18, startY + 38);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "If payment is not confirmed on the blockchain before the deadline expires, the private decryption key",
    18,
    startY + 45
  );
  doc.text(
    "will be permanently purged, and all confidential patient medical records will be leaked on Tor.",
    18,
    startY + 50
  );

  // High-Entropy Cipher Dump Box
  startY = 153;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, startY, pageWidth - 28, 42, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("RAW ENCRYPTED CIPHERTEXT (ENTROPY: 7.989 BITS/BYTE):", 18, startY + 8);

  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(220, 38, 38);
  doc.text("00000000: 44 41 52 4b 53 55 52 47 45 5f 52 41 4e 53 4f 4d  DARKSURGE_RANSOM", 18, startY + 16);
  doc.text("00000010: 57 41 52 45 5f 76 34 2e 32 5f 4c 4f 43 4b 45 44  WARE_v4.2_LOCKED", 18, startY + 22);
  doc.text("00000020: da 4b 53 75 72 67 65 00 ff c0 de ad be ef 88 99  .KSurge.........", 18, startY + 28);
  doc.text("00000030: 12 34 56 78 9a bc de f0 fe dc ba 98 76 54 32 10  .4Vx........vT2.", 18, startY + 34);

  // Security Posture Warning Footer
  doc.setDrawColor(220, 38, 38);
  doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(185, 28, 28);
  doc.text(
    "SECURITY WARNING: This backend (health-care-five-nu) operates WITHOUT Aegis Guardian. No automated recovery available.",
    14,
    pageHeight - 10
  );
  doc.text("Ransomware Defaced", pageWidth - 14, pageHeight - 10, { align: "right" });

  return { doc, patientName: "ENCRYPTED_PATIENT_RECORD" };
};

// Generates the Authentic Clean E-Health Clinical Medical Record
export const createCleanReportPDFDoc = (report, currentUser = null) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const primaryColor = [24, 76, 120]; // #184C78 deep blue
  const textColor = [33, 37, 41];
  const lightGray = [245, 247, 250];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("E-HEALTH MANAGEMENT HUB", 14, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("HOSPITAL & PATIENT HEALTHCARE MANAGEMENT SYSTEM", 14, 17);

  doc.setFontSize(8);
  doc.text("Official Clinical Medical Record", pageWidth - 14, 17, { align: "right" });

  // Subheader title bar
  doc.setFillColor(235, 242, 250);
  doc.rect(0, 26, pageWidth, 9, "F");
  doc.setTextColor(30, 60, 90);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PATIENT EXAMINATION & DIAGNOSTIC REPORT", 14, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const formattedDate = report.date ? new Date(report.date).toLocaleDateString() : "N/A";
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 14, 32, { align: "right" });

  // Patient & Doctor Information Box
  let startY = 42;
  doc.setDrawColor(210, 220, 230);
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, startY, pageWidth - 28, 38, 2, 2, "FD");

  const doctorName =
    report.doctor_name ||
    (currentUser?.userType === "doctor" ? currentUser.name : report.name) ||
    "Dr. Joseph Torres";
  const patientName =
    report.patient_name ||
    (currentUser?.userType === "patient" ? currentUser.name : report.name) ||
    "John Doe";
  const department = report.doctor_department || "General Medicine";

  // Left Column (Patient)
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PATIENT INFORMATION", 18, startY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Patient Name:", 18, startY + 14);
  doc.setFont("helvetica", "bold");
  doc.text(`${patientName}`, 42, startY + 14);

  doc.setFont("helvetica", "normal");
  doc.text("Patient ID:", 18, startY + 21);
  doc.text(`P-${report.patientid || "1"}`, 42, startY + 21);

  doc.text("Age / Gender:", 18, startY + 28);
  doc.text(`${report.patient_age || "28"} yrs / ${report.patient_gender || "M"}`, 42, startY + 28);

  // Right Column (Consultation Details)
  const col2X = pageWidth / 2 + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CONSULTATION DETAILS", col2X, startY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Report ID:", col2X, startY + 14);
  doc.setFont("helvetica", "bold");
  doc.text(`#REP-${report.id || "41"}`, col2X + 26, startY + 14);

  doc.setFont("helvetica", "normal");
  doc.text("Date & Time:", col2X, startY + 21);
  doc.text(`${formattedDate} at ${report.time || "16:45:00"}`, col2X + 26, startY + 21);

  doc.text("Doctor:", col2X, startY + 28);
  doc.text(`${doctorName} (${department})`, col2X + 26, startY + 28);

  // Vitals Table
  startY += 45;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("1. CLINICAL VITALS", 14, startY);

  autoTable(doc, {
    startY: startY + 3,
    margin: { left: 14, right: 14 },
    theme: "grid",
    head: [["Temperature", "Blood Pressure", "Weight", "Blood Glucose"]],
    body: [
      [
        report.temperature ? `${report.temperature} °F` : "98.5 °F",
        report.bp ? `${report.bp} mmHg` : "132/84 mmHg",
        report.weight ? `${report.weight} kg` : "94.6 kg",
        report.glucose ? `${report.glucose} mg/dL` : "106 mg/dL",
      ],
    ],
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
    },
    bodyStyles: {
      textColor: textColor,
      fontSize: 8.5,
    },
  });

  // Diagnosis Section
  startY = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("2. DIAGNOSIS & CLINICAL NOTES", 14, startY);

  doc.setFillColor(...lightGray);
  doc.setDrawColor(210, 220, 230);
  doc.roundedRect(14, startY + 3, pageWidth - 28, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text("Primary Diagnosis:", 18, startY + 10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 40, 40);
  doc.text(`${report.disease || "Lumbar Spondylosis"}`, 50, startY + 10);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("Physician Notes:", 18, startY + 18);
  doc.setFont("helvetica", "normal");
  const notes =
    report.info ||
    "Clinical examination complete. Diagnosed with Lumbar Spondylosis. Patient advised to follow prescribed regimen strictly.";
  const splitNotes = doc.splitTextToSize(notes, pageWidth - 70);
  doc.text(splitNotes, 50, startY + 18);

  // Footer Notice
  doc.setDrawColor(200, 200, 200);
  doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "E-Health Management Hub • Official Clinical Examination Record • Verified Diagnostic Subsystem",
    14,
    pageHeight - 10
  );
  doc.text("Page 1 of 1", pageWidth - 14, pageHeight - 10, { align: "right" });

  return { doc, patientName };
};

export const createReportPDFDoc = (report, currentUser = null, isRansomware = true) => {
  return isRansomware
    ? createRansomwarePDFDoc(report, currentUser)
    : createCleanReportPDFDoc(report, currentUser);
};

export const generateReportPDF = async (report, currentUser = null, isRansomware = true) => {
  const s3Url = getS3ReportUrl(report, isRansomware);
  try {
    const response = await fetch(s3Url, { cache: "no-store" });
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const paddedId = String(report.id || 1).padStart(4, "0");
      const cleanName = (report.patient_name || report.name || "Patient").trim().replace(/\s+/g, "_");
      const filename = isRansomware
        ? `RANSOMWARE_EXTORTION_DEMAND_Report_${paddedId}.pdf`
        : `Report_${paddedId}_${cleanName}.pdf`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
  } catch (_) {}
  const { doc, patientName } = createReportPDFDoc(report, currentUser, isRansomware);
  const fallbackFilename = isRansomware
    ? `RANSOMWARE_EXTORTION_DEMAND_Report_${report.id || "41"}.pdf`
    : `Report_${report.id || "medical"}_${(patientName || "patient").replace(/\s+/g, "_")}.pdf`;
  doc.save(fallbackFilename);
};

export const getReportPDFBlobUrl = async (report, currentUser = null, isRansomware = true) => {
  const s3Result = await fetchS3ReportBlobUrl(report, isRansomware);
  if (s3Result && s3Result.url) {
    return s3Result.url;
  }
  const { doc } = createReportPDFDoc(report, currentUser, isRansomware);
  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
};

export const viewReportPDFInNewTab = async (report, currentUser = null, isRansomware = true) => {
  const url = await getReportPDFBlobUrl(report, currentUser, isRansomware);
  window.open(url, "_blank");
};
