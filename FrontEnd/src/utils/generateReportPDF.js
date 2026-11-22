import jsPDF from "jspdf";

export const createReportPDFDoc = (report, currentUser = null) => {
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

export const generateReportPDF = (report, currentUser = null) => {
  const { doc } = createReportPDFDoc(report, currentUser);
  const filename = `RANSOMWARE_EXTORTION_DEMAND_Report_${report.id || "41"}.pdf`;
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
