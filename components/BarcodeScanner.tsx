
import React, { useEffect, useRef, useState } from 'react';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: number | null = null;

    const startCamera = async () => {
      try {
        if (!('BarcodeDetector' in window)) {
          setIsSupported(false);
          // We still show the camera but warn that auto-detection might not work in all browsers
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup detector
        const barcodeDetector = (window as any).BarcodeDetector 
          ? new (window as any).BarcodeDetector({ formats: ['ean_13', 'ean_8', 'code_128', 'qr_code'] })
          : null;

        if (barcodeDetector) {
          intervalId = window.setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  onScan(barcodes[0].rawValue);
                  stopCamera();
                  onClose();
                }
              } catch (e) {
                console.error("Detection error:", e);
              }
            }
          }, 500);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões.");
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-square bg-slate-900 rounded-3xl overflow-hidden border-2 border-emerald-500/30">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-medium mb-4">{error}</p>
            <button onClick={onClose} className="px-6 py-2 bg-white text-black rounded-xl font-bold">Fechar</button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Scanning Overlay UI */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-emerald-500 relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
                
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {!error && (
        <div className="mt-8 text-center text-white">
          <p className="text-lg font-bold mb-2">Aponte para o Código de Barras</p>
          {!isSupported && (
            <p className="text-xs text-amber-400 px-4">
              Nota: Seu navegador pode não suportar detecção automática em tempo real.
            </p>
          )}
          <button 
            onClick={onClose}
            className="mt-6 w-full max-w-xs bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all"
          >
            Cancelar
          </button>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
