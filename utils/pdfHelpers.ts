import { jsPDF } from "jspdf";

/**
 * Adds a standardized header to a jsPDF document.
 * @param doc The jsPDF document instance.
 * @param pageNumber The current page number (optional, for future use).
 */
export const addPdfHeader = (doc: jsPDF, pageNumber?: number) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // Navy
    doc.text("ArthSahay 24/7", pageWidth / 2, 20, { align: "center" });
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text("A Tata Capital Initiative", pageWidth / 2, 26, { align: "center" });
    
    // Divider Line
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.5);
    doc.line(15, 32, pageWidth - 15, 32);
    
    // Page Number (optional)
    if (pageNumber !== undefined) {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${pageNumber}`, pageWidth - 15, 15, { align: "right" });
    }

    // Reset defaults for body content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
};
