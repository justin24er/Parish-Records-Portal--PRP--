// frontend/src/components/ui/CameraCapture.jsx
// Reusable "scan a document with your camera" widget. Opens the device
// camera (getUserMedia), lets the user frame the certificate/document,
// snaps a still frame to a <canvas>, and hands the resulting JPEG file back
// to the caller via onCapture(file) — which typically posts it straight to
// documentService.upload().
//
// Falls back gracefully with a clear Swahili error message if the browser/
// device has no camera or permission is denied, and always lets the user
// pick a file from disk instead.

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RotateCcw, Check, Upload, AlertTriangle, X } from 'lucide-react';
import Modal from './Modal';

export default function CameraCapture({ open, onClose, onCapture, title = 'Piga Picha ya Hati' }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const fileInputRef = useRef(null);

  const [error, setError]       = useState(null);
  const [ready, setReady]       = useState(false);
  const [snapshot, setSnapshot] = useState(null); // dataURL preview
  const [facingMode, setFacingMode] = useState('environment'); // back camera by default

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setReady(false);
    stopStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1600 }, height: { ideal: 1200 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Ruhusa ya kamera imekataliwa. Ruhusu ufikiaji wa kamera kwenye mipangilio ya kivinjari chako.');
      } else if (err.name === 'NotFoundError') {
        setError('Hakuna kamera iliyopatikana kwenye kifaa hiki.');
      } else {
        setError('Imeshindwa kufungua kamera. Unaweza kupakia faili badala yake.');
      }
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (open && !snapshot) startCamera();
    if (!open) { stopStream(); setSnapshot(null); setReady(false); setError(null); }
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, facingMode]);

  function takeSnapshot() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setSnapshot(canvas.toDataURL('image/jpeg', 0.92));
    stopStream();
  }

  function retake() {
    setSnapshot(null);
    startCamera();
  }

  function confirmSnapshot() {
    canvasRef.current.toBlob(
      (blob) => {
        const file = new File([blob], `hati-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file, { source: 'camera' });
        handleClose();
      },
      'image/jpeg',
      0.92
    );
  }

  function handleFilePicked(e) {
    const file = e.target.files?.[0];
    if (file) onCapture(file, { source: 'upload' });
    e.target.value = '';
    handleClose();
  }

  function handleClose() {
    stopStream();
    setSnapshot(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={title} maxWidth={520}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{
          position: 'relative', width: '100%', aspectRatio: '4/3',
          background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {error ? (
            <div style={{ color: '#fff', textAlign: 'center', padding: 'var(--space-4)' }}>
              <AlertTriangle size={28} style={{ marginBottom: 8, color: 'var(--color-warning)' }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>{error}</p>
            </div>
          ) : snapshot ? (
            <img src={snapshot} alt="Muhtasari wa hati" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <video ref={videoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!snapshot && !error && (
            <>
              <button className="btn btn-primary" onClick={takeSnapshot} disabled={!ready}>
                <Camera size={16} /> Piga Picha
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
                title="Badili kamera"
              >
                <RotateCcw size={16} /> Badili Kamera
              </button>
            </>
          )}
          {snapshot && (
            <>
              <button className="btn btn-secondary" onClick={retake}>
                <RotateCcw size={16} /> Piga Tena
              </button>
              <button className="btn btn-primary" onClick={confirmSnapshot}>
                <Check size={16} /> Tumia Picha Hii
              </button>
            </>
          )}
          <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} /> Pakia Faili Badala Yake
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf" hidden onChange={handleFilePicked} />
        </div>

        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Hakikisha hati inaonekana wazi, bapa, na yenye mwanga wa kutosha kabla ya kupiga picha.
        </p>
      </div>
    </Modal>
  );
}
