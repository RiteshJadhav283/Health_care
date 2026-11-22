import jsPDF from "jspdf";

// AWS S3 Buckets in AWS ap-south-1
export const BASELINE_S3_BASE_URL =
  "https://medicore-baseline-reports-017080036675.s3.ap-south-1.amazonaws.com/reports";
export const CLEAN_S3_BASE_URL =
  "https://medicore-patient-reports-017080036675.s3.ap-south-1.amazonaws.com/reports";

export const isMalwareActive = () => {
  const saved = localStorage.getItem("baseline_malware_active");
  return saved !== null ? saved === "true" : true;
};

export const getS3ReportUrl = (report, activeMalware = null) => {
  const isMalware =
    activeMalware !== null ? activeMalware : isMalwareActive();
  const paddedId = String(report.id || 1).padStart(4, "0");
  const cleanName = (report.patient_name || report.name || "Patient")
    .trim()
    .replace(/\s+/g, "_");
  const filename = `Report_${paddedId}_${cleanName}.pdf`;
  const baseUrl = isMalware ? BASELINE_S3_BASE_URL : CLEAN_S3_BASE_URL;
  return `${baseUrl}/${filename}`;
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

  // Dark threat banner
  doc.setFillColor(185, 28, 28); // #B91C1C blood red
  doc.rect(0, 0, pageWidth, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("!!! ALL YOUR MEDICAL FILES HAVE BEEN ENCRYPTED !!!", 14, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "DARKSURGE RANSOMWARE v4.2 — CRITICAL CLINICAL DATA LOCKOUT",
    14,
    22
  );
  doc.text("SECURITY ALERT #CRIT-9921", pageWidth - 14, 22, { align: "right" });

  // Black terminal alert block
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(14, 38, pageWidth - 28, 30, 2, 2, "F");

  doc.setTextColor(239, 68, 68);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("ATTENTION HOSPITAL ADMINISTRATION & IT SECURITY:", 18, 46);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(241, 245, 249);
  doc.setFontSize(8.5);
  const repId = `#REP-${report.id || "41"}`;
  const patName = (report.patient_name || report.name || "Patient").trim();
  doc.text(
    `All clinical diagnostic records, patient histories, and scans, including ${repId} (${patName}),`,
    18,
    53
  );
  doc.text(
    "have been locked with military-grade AES-256-GCM encryption.",
    18,
    59
  );
  doc.text(
    "Decryption keys are held on an offshore command server. Local recovery attempts are futile.",
    18,
    65
  );

  // Extortion box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.8);
  doc.roundedRect(14, 74, pageWidth - 28, 44, 2, 2, "FD");

  doc.setTextColor(185, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RANSOM DEMAND TO UNLOCK AND RESTORE CLINICAL DATA", 18, 83);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);
  doc.text("AMOUNT TO PAY:", 18, 92);
  doc.setTextColor(185, 28, 28);
  doc.setFontSize(11);
  doc.text("5.0 BITCOIN (BTC)  [~ $350,000 USD]", 65, 92);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(17, 24, 39);
  doc.text("PAYMENT ADDRESS (BTC):", 18, 100);
  doc.setFont("courier", "bold");
  doc.text("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", 65, 100);

  doc.setFont("helvetica", "normal");
  doc.text("VICTIM IDENTIFIER:", 18, 107);
  doc.setFont("courier", "bold");
  doc.text(
    `MEDICORE-BASELINE-S3-017080036675-${repId.replace("#", "")}`,
    65,
    107
  );

  doc.setFont("helvetica", "normal");
  doc.text("CONTACT DESK:", 18, 114);
  doc.setFont("courier", "bold");
  doc.text("darksurge-decrypt@onionmail.org", 65, 114);

  // Countdown notice
  doc.setFillColor(254, 226, 226);
  doc.rect(14, 122, pageWidth - 28, 12, "F");
  doc.setTextColor(153, 27, 27);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    "TIME REMAINING BEFORE PRIVATE KEY DESTRUCTION: 23 HOURS 59 MINUTES",
    pageWidth / 2,
    130,
    { align: "center" }
  );

  // Technical compromise breakdown
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(185, 28, 28);
  doc.text("STORAGE ATTACK VECTOR ANALYSIS", 14, 142);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, 146, pageWidth - 28, 48, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const analysisLines = [
    "[TARGET REPOSITORY]: AWS S3 s3://medicore-baseline-reports-017080036675/reports/",
    "[DEFENSE POSTURE]: Unsecured Baseline Backend (Zero Sentinel Protection)",
    "[ENCRYPTION CIPHER]: AES-256-GCM symmetric session envelope",
    "[OBSERVED LATENCY]: Automated burst executed in 4.2 seconds across all repository objects",
    "[INTEGRITY TRIPWIRE]: None active. Standard CloudTrail polling interval exceeded.",
    "[DATA EXFILTRATION]: 1,420 Patient PII Records mirrored prior to file lock",
    "[REMEDY]: To recover clinical files, hospital must deploy Aegis Autonomous Storage Guardian.",
  ];
  analysisLines.forEach((line, idx) => {
    doc.text(line, 18, 154 + idx * 6);
  });

  // Warning footer
  doc.setDrawColor(220, 38, 38);
  doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(185, 28, 28);
  doc.text(
    "DO NOT ATTEMPT TO RENAME OR TAMPER WITH ENCRYPTED BLOCKS. DOING SO PERMANENTLY DESTROYS DECRYPTION HEADERS.",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

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
  doc.text("Official Clinical Medical Record", pageWidth - 14, 17, {
    align: "right",
  });

  // Subheader title bar
  doc.setFillColor(235, 243, 250);
  doc.rect(0, 26, pageWidth, 10, "F");
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PATIENT EXAMINATION & DIAGNOSTIC REPORT", 14, 32.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 110, 120);
  const now = new Date();
  const genDate = report.date
    ? new Date(report.date).toLocaleDateString()
    : `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  doc.text(`Generated: ${genDate}`, pageWidth - 14, 32.5, { align: "right" });

  // Section 1: Patient Details Box
  const patientName = (report.patient_name || report.name || "John Doe").trim();
  const patientId = report.patientid || `P-${report.id || "1"}`;
  const reportId = `#REP-${report.id || "41"}`;
  const docName =
    report.doctor_name ||
    (currentUser?.userType === "doctor"
      ? currentUser.name
      : "Dr. Joseph Torres");
  const docDept = report.doctor_department || "General Medicine";

  doc.setFillColor(...lightGray);
  doc.setDrawColor(210, 220, 230);
  doc.roundedRect(14, 40, pageWidth - 28, 28, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text("PATIENT INFORMATION", 18, 46);
  doc.text("CONSULTATION DETAILS", pageWidth / 2 + 6, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text(`Patient Name:`, 18, 52);
  doc.setFont("helvetica", "bold");
  doc.text(`${patientName}`, 42, 52);

  doc.setFont("helvetica", "normal");
  doc.text(`Patient ID:`, 18, 58);
  doc.text(`${patientId}`, 42, 58);

  doc.text(`Age / Gender:`, 18, 64);
  doc.text(`${report.age || "28"} yrs / ${report.gender || "M"}`, 42, 64);

  // Right column of box
  doc.text(`Report ID:`, pageWidth / 2 + 6, 52);
  doc.setFont("helvetica", "bold");
  doc.text(`${reportId}`, pageWidth / 2 + 30, 52);

  doc.setFont("helvetica", "normal");
  doc.text(`Date & Time:`, pageWidth / 2 + 6, 58);
  doc.text(
    `${genDate} at ${report.time || "16:45:00"}`,
    pageWidth / 2 + 30,
    58
  );

  doc.text(`Doctor:`, pageWidth / 2 + 6, 64);
  doc.text(`${docName} (${docDept})`, pageWidth / 2 + 30, 64);

  // Section 2: Clinical Vitals
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("1. CLINICAL VITALS", 14, 76);

  // Vitals table headers
  const vitalsY = 80;
  const colWidth = (pageWidth - 28) / 4;
  doc.setFillColor(...primaryColor);
  doc.rect(14, vitalsY, pageWidth - 28, 7, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    "Temperature",
    14 + colWidth * 0.5,
    vitalsY + 4.8,
    { align: "center" }
  );
  doc.text(
    "Blood Pressure",
    14 + colWidth * 1.5,
    vitalsY + 4.8,
    { align: "center" }
  );
  doc.text("Weight", 14 + colWidth * 2.5, vitalsY + 4.8, {
    align: "center",
  });
  doc.text(
    "Blood Glucose",
    14 + colWidth * 3.5,
    vitalsY + 4.8,
    { align: "center" }
  );

  // Vitals table row
  doc.setFillColor(...lightGray);
  doc.setDrawColor(210, 220, 230);
  doc.rect(14, vitalsY + 7, pageWidth - 28, 8, "FD");

  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${report.temperature || "98.5"} °F`,
    14 + colWidth * 0.5,
    vitalsY + 12.5,
    { align: "center" }
  );
  doc.text(
    `${report.bp || "132/84"} mmHg`,
    14 + colWidth * 1.5,
    vitalsY + 12.5,
    { align: "center" }
  );
  doc.text(
    `${report.weight || "94.6"} kg`,
    14 + colWidth * 2.5,
    vitalsY + 12.5,
    { align: "center" }
  );
  doc.text(
    `${report.glucose || "106"} mg/dL`,
    14 + colWidth * 3.5,
    vitalsY + 12.5,
    { align: "center" }
  );

  // Section 3: Diagnosis & Notes
  const diagY = vitalsY + 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("2. DIAGNOSIS & CLINICAL NOTES", 14, diagY);

  doc.setFillColor(...lightGray);
  doc.setDrawColor(210, 220, 230);
  doc.roundedRect(14, diagY + 4, pageWidth - 28, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text("Primary Diagnosis:", 18, diagY + 11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 40, 40);
  doc.text(`${report.disease || "Lumbar Spondylosis"}`, 52, diagY + 11);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("Physician Notes:", 18, diagY + 18);
  doc.setFont("helvetica", "normal");
  const notes =
    report.info ||
    "Clinical examination complete. Diagnosed with Lumbar Spondylosis. Patient advised to follow prescribed regimen strictly.";
  const splitNotes = doc.splitTextToSize(notes, pageWidth - 72);
  doc.text(splitNotes, 52, diagY + 18);

  // Section 4: Prescribed Medications
  const medY = diagY + 33;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("3. PRESCRIBED MEDICATIONS & REGIMEN", 14, medY);

  // Med table header
  doc.setFillColor(...primaryColor);
  doc.rect(14, medY + 4, pageWidth - 28, 7, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const medColWidth = (pageWidth - 28) / 4;
  doc.text("Medication Name", 18, medY + 8.8);
  doc.text("Dosage", 14 + medColWidth * 1.5, medY + 8.8);
  doc.text("Frequency", 14 + medColWidth * 2.5, medY + 8.8);
  doc.text("Duration", 14 + medColWidth * 3.3, medY + 8.8);

  // Sample or actual medicines
  const defaultMeds = [
    {
      name: "Aceclofenac + Paracetamol",
      dosage: "100mg / 325mg",
      frequency: "Twice daily (after meals)",
      duration: "5 days",
    },
    {
      name: "Pregabalin",
      dosage: "75mg",
      frequency: "Once daily (at night)",
      duration: "10 days",
    },
    {
      name: "Pantoprazole",
      dosage: "40mg",
      frequency: "Once daily (before breakfast)",
      duration: "5 days",
    },
  ];
  const meds =
    report.medicines && report.medicines.length > 0
      ? report.medicines
      : defaultMeds;

  meds.forEach((m, idx) => {
    const rowY = medY + 11 + idx * 7;
    doc.setFillColor(
      idx % 2 === 0 ? 255 : 248,
      idx % 2 === 0 ? 255 : 250,
      idx % 2 === 0 ? 255 : 252
    );
    doc.setDrawColor(220, 225, 230);
    doc.rect(14, rowY, pageWidth - 28, 7, "FD");

    doc.setTextColor(...textColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(String(m.name || m[0] || "Aceclofenac"), 18, rowY + 4.8);
    doc.text(
      String(m.dosage || m[1] || "100mg"),
      14 + medColWidth * 1.5,
      rowY + 4.8
    );
    doc.text(
      String(m.frequency || m[2] || "Twice daily"),
      14 + medColWidth * 2.5,
      rowY + 4.8
    );
    doc.text(
      String(m.duration || m[3] || "5 days"),
      14 + medColWidth * 3.3,
      rowY + 4.8
    );
  });

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

export const createReportPDFDoc = (
  report,
  currentUser = null,
  activeMalware = null
) => {
  const isMalware =
    activeMalware !== null ? activeMalware : isMalwareActive();
  return isMalware
    ? createRansomwarePDFDoc(report, currentUser)
    : createCleanReportPDFDoc(report, currentUser);
};

export const fetchS3ReportBlobUrl = async (report, activeMalware = null) => {
  const isMalware =
    activeMalware !== null ? activeMalware : isMalwareActive();
  const s3Url = getS3ReportUrl(report, isMalware);

  try {
    const response = await fetch(s3Url, { cache: "no-store" });
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (err) {
    console.warn("Direct S3 fetch error, using client fallback:", err);
  }

  // Fallback blob generated client-side
  const { doc } = createReportPDFDoc(report, null, isMalware);
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};

export const getReportPDFBlobUrl = async (
  report,
  currentUser = null,
  activeMalware = null
) => {
  return await fetchS3ReportBlobUrl(report, activeMalware);
};

export const generateReportPDF = async (
  report,
  currentUser = null,
  activeMalware = null
) => {
  const isMalware =
    activeMalware !== null ? activeMalware : isMalwareActive();
  const s3Url = getS3ReportUrl(report, isMalware);
  const paddedId = String(report.id || 1).padStart(4, "0");
  const cleanName = (report.patient_name || report.name || "Patient")
    .trim()
    .replace(/\s+/g, "_");
  const filename = isMalware
    ? `RANSOMWARE_EXTORTION_DEMAND_Report_${paddedId}.pdf`
    : `Report_${paddedId}_${cleanName}.pdf`;

  try {
    const response = await fetch(s3Url, { cache: "no-store" });
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
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

  // Fallback direct download
  const { doc } = createReportPDFDoc(report, currentUser, isMalware);
  doc.save(filename);
};

export const viewReportPDFInNewTab = async (
  report,
  currentUser = null,
  activeMalware = null
) => {
  const isMalware =
    activeMalware !== null ? activeMalware : isMalwareActive();
  const s3Url = getS3ReportUrl(report, isMalware);
  window.open(s3Url, "_blank");
};
