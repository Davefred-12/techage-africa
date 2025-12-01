// ============================================
// FILE: src/components/CertificateGenerator.jsx - AUTO CERTIFICATE
// ============================================
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
import { Button } from './ui/button';

const CertificateGenerator = ({ certificateData }) => {
  const certificateRef = useRef(null);

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    
    // Capture the certificate as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // Convert to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${certificateData.userName}-${certificateData.title}-Certificate.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="relative w-full aspect-[1.414/1] bg-white shadow-2xl rounded-lg overflow-hidden"
        style={{ maxWidth: '1000px', margin: '0 auto' }}
      >
        {/* Decorative Border */}
        <div className="absolute inset-0 border-[20px] border-double border-primary-600/20 rounded-lg">
          <div className="absolute inset-0 border-[8px] border-primary-600 rounded-lg m-2"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-16 text-center">
          {/* Logo/Header */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4 mx-auto">
              T
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              TechAge Africa
            </h1>
            <p className="text-sm text-gray-600 mt-2">Learning Management System</p>
          </div>

          {/* Certificate Title */}
          <div className="mb-8">
            <h2 className="text-5xl font-serif font-bold text-gray-800 mb-4">
              Certificate of Completion
            </h2>
            <p className="text-lg text-gray-600">This is to certify that</p>
          </div>

          {/* Student Name */}
          <div className="mb-6">
            <h3 className="text-4xl font-bold text-primary-600 mb-2 border-b-2 border-primary-600 pb-2 px-8">
              {certificateData.userName}
            </h3>
          </div>

          {/* Course Info */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-2">has successfully completed</p>
            <h4 className="text-2xl font-bold text-gray-800 mb-4">
              {certificateData.title}
            </h4>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Modules:</span> {certificateData.modules}
              </div>
              <div>
                <span className="font-semibold">Lessons:</span> {certificateData.lessons}
              </div>
              <div>
                <span className="font-semibold">Hours:</span> {certificateData.hoursLearned}h
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 w-full">
            <div className="flex justify-between items-end">
              {/* Date */}
              <div className="text-left">
                <p className="text-sm text-gray-600 mb-1">Date of Completion</p>
                <p className="text-lg font-semibold text-gray-800 border-t-2 border-gray-800 pt-2">
                  {certificateData.completedDate}
                </p>
              </div>

              {/* Instructor Signature */}
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Instructor</p>
                <div className="border-t-2 border-gray-800 pt-2">
                  <p className="text-lg font-semibold text-gray-800">
                    {certificateData.instructor || 'TechAge Admin'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
              ID: CERT-{certificateData.id.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary-600"></div>
        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary-600"></div>
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary-600"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary-600"></div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={downloadCertificate}
          className="gap-2"
        >
          <Download className="w-5 h-5" />
          Download Certificate as PDF
        </Button>
      </div>
    </div>
  );
};

export default CertificateGenerator;