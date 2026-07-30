import { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import Dialog from './Dialog';
import Button from './Button';

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onDetected: (barcode: string) => void;
  onProductFound?: (product: any) => void;
  onNewProduct?: (info: any) => void;
}

export default function BarcodeScanner({
  open,
  onClose,
  onDetected,
  onProductFound,
  onNewProduct,
}: BarcodeScannerProps) {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manualBarcode, setManualBarcode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!open) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      return;
    }

    if (mode === 'camera') {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, [open, mode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera error:', error);
      setMode('manual');
    }
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onDetected(manualBarcode.trim());
      setManualBarcode('');
      onClose();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { default: Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('barcode-scanner');
      const result = await scanner.scanFile(file, true);
      onDetected(result);
      scanner.clear();
      onClose();
    } catch (error) {
      alert('تعذر قراءة الباركود من الصورة. تأكد من وضوح الصورة.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="مسح الباركود">
      <div className="space-y-4 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('camera')}
            className={`flex-1 py-2 rounded-btn font-semibold text-small ${
              mode === 'camera' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'
            }`}
          >
            <Camera size={16} className="inline mr-1" />
            كاميرا
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 rounded-btn font-semibold text-small ${
              mode === 'manual' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'
            }`}
          >
            يدوي
          </button>
        </div>

        {mode === 'camera' && (
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-input bg-black" />
            <div className="mt-2">
              <label className="flex items-center justify-center gap-2 py-2 rounded-btn border border-border cursor-pointer hover:bg-gray-50">
                <Upload size={16} />
                <span className="text-small">رفع صورة من المعرض</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {mode === 'manual' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder="أدخل الباركود يدوياً..."
              className="input-field flex-1"
            />
            <Button onClick={handleManualSubmit}>بحث</Button>
          </div>
        )}
      </div>
    </Dialog>
  );
          }
