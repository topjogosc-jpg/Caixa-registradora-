
import React, { useEffect, useRef, useState } from 'react';

interface ProductPhotoCameraProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const ProductPhotoCamera: React.FC<ProductPhotoCameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Não foi possível acessar a câmera para tirar a foto.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-square bg-slate-900 rounded-3xl overflow-hidden border-2 border-emerald-500">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <p className="mb-4">{error}</p>
            <button onClick={onClose} className="px-6 py-2 bg-white text-black rounded-xl font-bold">Fechar</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-white/50 rounded-2xl"></div>
            </div>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {!error && (
        <div className="mt-8 flex gap-4 w-full max-w-xs">
          <button 
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all"
          >
            Voltar
          </button>
          <button 
            onClick={handleCapture}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/30"
          >
            Tirar Foto
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPhotoCamera;
