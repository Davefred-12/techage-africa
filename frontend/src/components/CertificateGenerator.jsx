import { useRef } from 'react';
import { Download } from 'lucide-react';

const CertificateGenerator = ({ certificateData }) => {
  const certificateRef = useRef(null);

  const downloadCertificate = async () => {
    // Import libraries dynamically for better performance
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    
    const element = certificateRef.current;
    
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: '#ffffff',
      logging: false,
      width: 1200,
      height: 900,
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
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Certificate Preview */}
      <div className="w-full bg-gray-100 p-2 sm:p-4 md:p-6 rounded-lg">
        <div 
          ref={certificateRef}
          className="relative w-full bg-gradient-to-br from-white to-blue-50 shadow-2xl mx-auto overflow-hidden"
          style={{ 
            aspectRatio: '1.414/1',
            maxWidth: '1000px'
          }}
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32">
            <div className="absolute top-0 left-0 w-full h-full border-t-4 sm:border-t-6 md:border-t-8 border-l-4 sm:border-l-6 md:border-l-8 border-blue-900"></div>
            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 border-t-2 border-l-2 border-blue-600"></div>
          </div>
          <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32">
            <div className="absolute top-0 right-0 w-full h-full border-t-4 sm:border-t-6 md:border-t-8 border-r-4 sm:border-r-6 md:border-r-8 border-blue-900"></div>
            <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 border-t-2 border-r-2 border-blue-600"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32">
            <div className="absolute bottom-0 left-0 w-full h-full border-b-4 sm:border-b-6 md:border-b-8 border-l-4 sm:border-l-6 md:border-l-8 border-blue-900"></div>
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 border-b-2 border-l-2 border-blue-600"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32">
            <div className="absolute bottom-0 right-0 w-full h-full border-b-4 sm:border-b-6 md:border-b-8 border-r-4 sm:border-r-6 md:border-r-8 border-blue-900"></div>
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 border-b-2 border-r-2 border-blue-600"></div>
          </div>

          {/* Decorative Line Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #1e3a8a 0, #1e3a8a 1px, transparent 0, transparent 50%)',
              backgroundSize: '10px 10px'
            }}></div>
          </div>

          {/* Main Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-10 md:py-14">
            
            {/* Logo */}
            <div className="mb-2 sm:mb-3 md:mb-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-lg sm:text-2xl md:text-3xl font-bold">T</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-2 sm:mb-3 md:mb-4">
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-xl font-bold text-blue-900 tracking-wide">
                CERTIFICATE
              </h1>
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-1">
                <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-blue-600"></div>
                <p className="text-xs sm:text-sm md:text-base text-blue-700 font-semibold">OF COMPLETION</p>
                <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-blue-600"></div>
              </div>
            </div>

            {/* Body Text */}
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 sm:mt-3 md:mt-4 mb-1 sm:mb-2">
              This is to certify that
            </p>

            {/* Recipient Name */}
            <div className="mb-2 sm:mb-3 md:mb-4 w-full max-w-md">
              <h2 className="text-xs sm:text-2xl md:text-3xl lg:text-4xl text-blue-900 text-center font-bold mb-1 sm:mb-2"
                  style={{ fontFamily: 'Georgia, serif' }}>
                {certificateData.userName}
              </h2>
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
            </div>

            {/* Course Info */}
            <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center max-w-xl px-2 mb-1">
              has successfully completed the
            </p>
            <div className="bg-blue-900 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg shadow-lg mb-1 sm:mb-1 md:mb-1 max-w-xl mx-2">
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-center">
                {certificateData.title}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
              at TechAge Africa
            </p>

            {/* Footer Section */}
            <div className="mt-auto pt-4 sm:pt-6 md:pt-8 w-full flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 px-2 sm:px-4">
              {/* Date */}
              <div className="text-center sm:text-left order-2 sm:order-1">
                <p className="text-xs sm:text-sm text-gray-500">Date of Completion</p>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-blue-900">
                  {certificateData.completedDate}
                </p>
              </div>

              {/* Signature */}
              <div className="text-center order-1 sm:order-2">
                <div className="mb-1 sm:mb-2">
                  <p className="text-base sm:text-lg md:text-xl text-blue-900 font-bold"
                     style={{ fontFamily: 'Georgia, serif' }}>
                    {certificateData.instructor || 'Admin'}
                  </p>
                </div>
                <div className="border-t-2 border-blue-900 pt-1 min-w-[120px] sm:min-w-[150px]">
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Course Instructor</p>
                </div>
              </div>

              {/* Seal */}
              <div className="order-3 hidden sm:block">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-4 border-blue-900 flex items-center justify-center bg-blue-50 relative">
                  <div className="absolute inset-1 rounded-full border-2 border-dashed border-blue-600"></div>
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2">
              <p className="text-xs text-gray-400 italic text-center px-2">
                Empowering Africa through technology
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={downloadCertificate}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          Download Certificate as PDF
        </button>
      </div>
    </div>
  );
};

export default CertificateGenerator;