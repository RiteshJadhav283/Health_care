import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const createReportPDFDoc = (report, currentUser = null) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
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
    "Dr. Specialist";
  const patientName =
    report.patient_name ||
    (currentUser?.userType === "patient" ? currentUser.name : report.name) ||
    "Patient";
  const department = report.doctor_department || "Consultant Physician";

  // Left Column (Patient)
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PATIENT INFORMATION", 18, startY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Patient Name:`, 18, startY + 14);
  doc.setFont("helvetica", "bold");
  doc.text(`${patientName}`, 42, startY + 14);

  doc.setFont("helvetica", "normal");
  doc.text(`Patient ID:`, 18, startY + 21);
  doc.text(`P-${report.patientid || "001"}`, 42, startY + 21);

  doc.text(`Age / Gender:`, 18, startY + 28);
  doc.text(
    `${report.patient_age || "N/A"} yrs / ${report.patient_gender || "N/A"}`,
    42,
    startY + 28
  );

  // Right Column (Doctor & Report Details)
  const col2X = pageWidth / 2 + 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CONSULTATION DETAILS", col2X, startY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Report ID:`, col2X, startY + 14);
  doc.setFont("helvetica", "bold");
  doc.text(`#REP-${report.id || "001"}`, col2X + 26, startY + 14);

  doc.setFont("helvetica", "normal");
  doc.text(`Date & Time:`, col2X, startY + 21);
  doc.text(`${formattedDate} at ${report.time || "N/A"}`, col2X + 26, startY + 21);

  doc.text(`Doctor:`, col2X, startY + 28);
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
        report.temperature ? `${report.temperature} °F` : "N/A",
        report.bp ? `${report.bp} mmHg` : "N/A",
        report.weight ? `${report.weight} kg` : "N/A",
        report.glucose ? `${report.glucose} mg/dL` : "N/A",
      ],
    ],
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8.5,
      halign: "center",
      textColor: [40, 40, 40],
    },
  });

  // Diagnosis & Clinical Notes
  let afterVitalsY = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("2. DIAGNOSIS & CLINICAL NOTES", 14, afterVitalsY);

  doc.setFillColor(...lightGray);
  doc.setDrawColor(210, 220, 230);
  doc.roundedRect(14, afterVitalsY + 3, pageWidth - 28, 22, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text("Primary Diagnosis:", 18, afterVitalsY + 9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 40, 40);
  doc.text(`${report.disease || "General Medical Examination"}`, 50, afterVitalsY + 9);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("Physician Notes:", 18, afterVitalsY + 16);
  doc.setFont("helvetica", "normal");
  const notes = report.info || "Patient examined. Continue routine care and follow-up as advised.";
  const splitNotes = doc.splitTextToSize(notes, pageWidth - 75);
  doc.text(splitNotes, 50, afterVitalsY + 16);

  // Medications / Prescriptions Table
  let afterNotesY = afterVitalsY + 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("3. PRESCRIBED MEDICATIONS & REGIMEN", 14, afterNotesY);

  const medRows =
    report.medicines && report.medicines.length > 0
      ? report.medicines.map((m, idx) => [
          idx + 1,
          m.name || "N/A",
          m.dosage || "N/A",
          m.frequency || "N/A",
          m.duration || "N/A",
        ])
      : [["1", "No specific prescription recorded", "-", "-", "-"]];

  autoTable(doc, {
    startY: afterNotesY + 3,
    margin: { left: 14, right: 14 },
    theme: "striped",
    head: [["#", "Medicine / Treatment", "Dosage", "Frequency", "Duration"]],
    body: medRows,
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "left",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { fontStyle: "bold" },
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [40, 40, 40],
    },
  });

  // Signature and Footer
  const footerY = Math.max(doc.lastAutoTable.finalY + 18, pageHeight - 38);

  // Digital Signature section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text("Attending Physician:", pageWidth - 70, footerY);
  doc.setFont("helvetica", "italic");
  doc.text(`${doctorName}`, pageWidth - 70, footerY + 6);
  doc.setDrawColor(180, 180, 180);
  doc.line(pageWidth - 70, footerY + 8, pageWidth - 14, footerY + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Digitally Authorized & Verified", pageWidth - 70, footerY + 12);

  // Bottom Notice
  doc.setDrawColor(220, 220, 220);
  doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "E-Health Management Hub • This is a computer generated clinical report • Valid without physical signature",
    14,
    pageHeight - 9
  );
  doc.text(`Page 1 of 1`, pageWidth - 14, pageHeight - 9, { align: "right" });

  return { doc, patientName };
};

export const generateReportPDF = (report, currentUser = null) => {
  const { doc, patientName } = createReportPDFDoc(report, currentUser);
  const filename = `Report_${report.id || "medical"}_${(patientName || "patient").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
};

export const getReportPDFBlobUrl = (report, currentUser = null) => {
  const { doc } = createReportPDFDoc(report, currentUser);
  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
};

export const viewReportPDFInNewTab = (report, currentUser = null) => {
  const url = getReportPDFBlobUrl(report, currentUser);
  window.open(url, "_blank");
};
