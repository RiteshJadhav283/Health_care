// AWS S3 Bucket for Unsecured Baseline Backend in AWS ap-south-1
export const S3_BASE_URL = "https://medicore-baseline-reports-017080036675.s3.ap-south-1.amazonaws.com/reports";

export const getS3ReportUrl = (report) => {
  const paddedId = String(report.id || 1).padStart(4, "0");
  const cleanName = (report.patient_name || report.name || "Patient").trim().replace(/\s+/g, "_");
  const filename = `Report_${paddedId}_${cleanName}.pdf`;
  return `${S3_BASE_URL}/${filename}`;
};

export const fetchS3ReportBlobUrl = async (report) => {
  const s3Url = getS3ReportUrl(report);
  try {
    const response = await fetch(s3Url, { cache: "no-store" });
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (err) {
    console.warn("Direct S3 fetch error, using direct URL:", err);
  }
  return s3Url;
};

export const getReportPDFBlobUrl = async (report, currentUser = null) => {
  return await fetchS3ReportBlobUrl(report);
};

export const generateReportPDF = async (report, currentUser = null) => {
  const s3Url = getS3ReportUrl(report);
  const paddedId = String(report.id || 1).padStart(4, "0");
  const cleanName = (report.patient_name || report.name || "Patient").trim().replace(/\s+/g, "_");
  const filename = `Report_${paddedId}_${cleanName}.pdf`;

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

  // Direct S3 fallback download
  const a = document.createElement("a");
  a.href = s3Url;
  a.download = filename;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const viewReportPDFInNewTab = async (report, currentUser = null) => {
  const s3Url = getS3ReportUrl(report);
  window.open(s3Url, "_blank");
};
