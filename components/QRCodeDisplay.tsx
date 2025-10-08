import React, { useEffect, useRef, useState } from 'react';
import type { QRCodeDisplayProps } from '../types';

// Accessing QRCode from the global window object loaded via CDN.
declare global {
  interface Window {
    QRCode: any;
  }
}

const sizeOptions = [
  { label: 'صغير', value: 128 },
  { label: 'متوسط', value: 256 },
  { label: 'كبير', value: 512 },
  { label: 'كبير جدًا', value: 1024 },
];

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ userData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSize, setSelectedSize] = useState<number>(256); // Default download size
  const { fullName, email, phone, bio } = userData;

  const qrText = `الاسم الكامل: ${fullName}\nالبريد الإلكتروني: ${email}\nرقم الموبايل: ${phone}\nنبذة تعريفية: ${bio}`;
  const hasData = !!(fullName || email || phone || bio);

  // Effect to update ONLY the displayed canvas.
  useEffect(() => {
    if (hasData && canvasRef.current) {
      window.QRCode.toCanvas(canvasRef.current, qrText, { width: 256, margin: 2 }, (error: Error | null | undefined) => {
        if (error) console.error('Error rendering display canvas:', error);
      });
    } else if (canvasRef.current) {
      // Clear canvas if there's no data
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [qrText, hasData]);

  const handleDownloadPNG = async () => {
    if (!hasData) return;

    const tempCanvas = document.createElement('canvas');
    
    try {
      await new Promise<void>((resolve, reject) => {
        window.QRCode.toCanvas(tempCanvas, qrText, { width: selectedSize, margin: 2 }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    } catch (err) {
      console.error('Failed to generate QR code for download:', err);
      alert('حدث خطأ أثناء إنشاء رمز QR. يرجى المحاولة مرة أخرى.');
      return;
    }
    
    const fileName = `${fullName.replace(/\s+/g, '_') || 'qrcode'}_${selectedSize}.png`;
    const link = document.createElement('a');
    link.download = fileName;
    link.href = tempCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSVG = async () => {
    if (!hasData) return;

    let svgString: string;
    try {
        svgString = await new Promise<string>((resolve, reject) => {
            window.QRCode.toString(qrText, { type: 'svg', width: selectedSize, margin: 2 }, (err, url) => {
                if (err) reject(err);
                else if (url) resolve(url);
                else reject(new Error('Failed to generate SVG URL.'));
            });
        });
    } catch (err) {
        console.error('Failed to generate SVG for download:', err);
        alert('حدث خطأ أثناء إنشاء رمز QR. يرجى المحاولة مرة أخرى.');
        return;
    }

    const fileName = `${fullName.replace(/\s+/g, '_') || 'qrcode'}_${selectedSize}.svg`;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">رمز QR الخاص بك</h2>
      <div className="w-64 h-64 bg-white p-2 rounded-lg shadow-md flex items-center justify-center">
        {hasData ? (
           <canvas ref={canvasRef} width="256" height="256" className="max-w-full max-h-full" />
        ) : (
          <div className="text-center text-slate-400 p-4 border-2 border-dashed rounded-md w-full h-full flex flex-col justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5 6.5v2m-6.5-2H3m18 0h-2M5.5 5.5l1.414-1.414M18.5 5.5l-1.414-1.414m-12.728 12.728l1.414 1.414M18.5 18.5l-1.414 1.414M12 6.5c-3.038 0-5.5 2.462-5.5 5.5s2.462 5.5 5.5 5.5 5.5-2.462 5.5-5.5-2.462-5.5-5.5-5.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="mt-2 text-sm">أدخل بياناتك في النموذج لعرض رمز QR.</p>
          </div>
        )}
      </div>
      
      {/* Size Selector */}
      <div className="mt-6 w-full">
        <fieldset disabled={!hasData}>
          <legend className="block text-sm font-medium text-slate-700 mb-2 text-center">اختر حجم التحميل:</legend>
          <div className="flex justify-center gap-2 flex-wrap">
            {sizeOptions.map(option => (
              <div key={option.value}>
                <input
                  type="radio"
                  id={`size-${option.value}`}
                  name="size"
                  value={option.value}
                  checked={selectedSize === option.value}
                  onChange={() => setSelectedSize(option.value)}
                  className="sr-only peer"
                />
                <label
                  htmlFor={`size-${option.value}`}
                  className={`px-4 py-2 rounded-md text-sm font-semibold cursor-pointer transition-colors ${!hasData ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-700 border border-slate-300 peer-checked:bg-sky-600 peer-checked:text-white peer-checked:border-sky-600 hover:bg-slate-50'}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-4 w-full flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownloadPNG}
          disabled={!hasData}
          className="flex-1 inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          تحميل كـ PNG
        </button>
        <button
          onClick={handleDownloadSVG}
          disabled={!hasData}
          className="flex-1 inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          تحميل كـ SVG
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
