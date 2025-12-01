// ============================================
// FILE: src/components/CertificateGenerator.jsx - TEMPLATE STYLE
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
    
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${certificateData.userName}-Certificate.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="relative w-full aspect-[1.414/1] bg-white shadow-2xl overflow-hidden"
        style={{ maxWidth: '1000px', margin: '0 auto' }}
      >
        {/* Double Border Frame */}
        <div className="absolute inset-0 border-[25px] border-black">
          <div className="absolute inset-0 border-[3px] border-dashed border-black m-3"></div>
        </div>

        {/* Main Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-12 py-14">
          
          {/* Title */}
          <h1 
            className="text-3xl font-bold text-black mb-8"
            style={{ fontFamily: 'Old Standard TT, serif', letterSpacing: '0.05em' }}
          >
            Certificate of Completion
          </h1>

          {/* Body Text */}
          <p className="text-base text-gray-700 mb-4">
            This certificate is hereby bestowed upon
          </p>

          {/* Recipient Name */}
          <div className="mb-4">
            <h2 
              className="text-3xl text-black mb-2"
              style={{ 
                fontFamily: 'Brush Script MT, cursive',
                fontStyle: 'italic'
              }}
            >
              {certificateData.userName}
            </h2>
            <div className="w-full h-0.5 bg-black"></div>
          </div>

          {/* Course Info */}
          <p className="text-sm text-gray-700 text-center max-w-3xl mb-2">
            for the exceptional performance that led to the successful completion of
          </p>
          <p className="text-base text-gray-700 text-center max-w-3xl mb-1">
            TechAge Africa's <span className="font-semibold">{certificateData.title}</span>
          </p>

          {/* Footer */}
          <div className="w-full flex justify-between items-end mt-auto">
            {/* Left: Logo & Institute Info */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-4xl font-bold">T</span>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-black">TechAge Africa</h3>
                <p className="text-xs text-gray-600 max-w-[200px] leading-tight mt-1">
                  Empowering Africa through technology education and innovation
                </p>
              </div>
            </div>

            {/* Right: Signature */}
            <div className="text-center">
              <div className="mb-2">
                <p 
                  className="text-xl text-black"
                  style={{ 
                    fontFamily: 'Brush Script MT, cursive',
                    fontStyle: 'italic'
                  }}
                >
                  {certificateData.instructor || 'Admin'}
                </p>
              </div>
              <div className="border-t-2 border-black pt-1 min-w-[150px]">
                <p className=" text-gray-700 text-xs">Course Instructor</p>
              </div>
            </div>
          </div>

          {/* Date - Bottom Right Small */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <p className="text-xs text-gray-600">
              Completed: {certificateData.completedDate}
            </p>
          </div>
        </div>
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