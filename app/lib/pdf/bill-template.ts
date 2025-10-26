import jsPDF from 'jspdf';

export interface BillData {
  patientName: string;
  patientEmail: string;
  hospitalName: string;
  disease: string;
  note: string;
  amount: number;
  transactionId: string;
  date: string;
  billId: string;
}

export function generateBillPDF(data: BillData): jsPDF {
  const doc = new jsPDF();
  
  // Premium gradient background
  doc.setFillColor(250, 251, 252);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Main container with shadow effect
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 10, 190, 277, 4, 4, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.roundedRect(10, 10, 190, 277, 4, 4, 'S');
  
  // Header with brand colors
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(15, 15, 180, 45, 3, 3, 'F');
  
  // Syncure Logo - Always visible and prominent
  doc.setFillColor(255, 255, 255);
  doc.circle(35, 37.5, 12, 'F');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(2);
  doc.circle(35, 37.5, 12, 'S');
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('S', 31, 42);
  
  // Company branding
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Syncure', 55, 35);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Healthcare Excellence', 55, 45);
  
  // Receipt info - right aligned
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 195, 30, { align: 'right' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${data.billId}`, 195, 40, { align: 'right' });
  doc.text(data.date, 195, 48, { align: 'right' });
  
  // Success status badge
  let yPos = 70;
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(15, yPos, 180, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ PAYMENT COMPLETED SUCCESSFULLY', 105, yPos + 13, { align: 'center' });
  
  // Patient details card
  yPos += 35;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, yPos, 170, 35, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, yPos, 170, 35, 2, 2, 'S');
  
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT INFORMATION', 25, yPos + 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.patientName}`, 25, yPos + 22);
  doc.text(`Email: ${data.patientEmail}`, 25, yPos + 30);
  
  // Appointment details card
  yPos += 45;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, yPos, 170, 45, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, yPos, 170, 45, 2, 2, 'S');
  
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('APPOINTMENT DETAILS', 25, yPos + 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Hospital: ${data.hospitalName}`, 25, yPos + 22);
  doc.text(`Condition: ${data.disease}`, 25, yPos + 30);
  if (data.note) {
    doc.text(`Notes: ${data.note}`, 25, yPos + 38);
  }
  
  // Payment breakdown table
  yPos += 55;
  doc.setFillColor(51, 65, 85);
  doc.roundedRect(20, yPos, 170, 15, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT BREAKDOWN', 25, yPos + 10);
  
  // Table content
  yPos += 20;
  doc.setFillColor(255, 255, 255);
  doc.rect(20, yPos, 170, 25, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(20, yPos, 170, 25, 'S');
  
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Service', 25, yPos + 8);
  doc.text('Description', 80, yPos + 8);
  doc.text('Amount', 160, yPos + 8);
  
  doc.line(20, yPos + 12, 190, yPos + 12);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Consultation Fee', 25, yPos + 20);
  doc.text('Medical Appointment', 80, yPos + 20);
  doc.text(`₹${data.amount}`, 160, yPos + 20);
  
  // Total amount highlight
  yPos += 35;
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(110, yPos, 80, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAID', 150, yPos + 10, { align: 'center' });
  doc.setFontSize(18);
  doc.text(`₹${data.amount}`, 150, yPos + 20, { align: 'center' });
  
  // Transaction details
  yPos += 40;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, yPos, 170, 50, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, yPos, 170, 50, 2, 2, 'S');
  
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION DETAILS', 25, yPos + 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Transaction ID: ${data.transactionId}`, 25, yPos + 22);
  doc.text('Payment Gateway: Razorpay', 25, yPos + 30);
  doc.text('Status: Successfully Processed', 25, yPos + 38);
  doc.text(`Processed On: ${data.date}`, 25, yPos + 46);
  
  // Footer with branding
  yPos += 60;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing Syncure - Your trusted healthcare partner', 105, yPos + 10, { align: 'center' });
  doc.text('For support: support@syncure.com | Visit: www.syncure.com', 105, yPos + 18, { align: 'center' });
  doc.setFont('helvetica', 'italic');
  doc.text('This is a computer-generated receipt and requires no signature', 105, yPos + 26, { align: 'center' });
  
  return doc;
}