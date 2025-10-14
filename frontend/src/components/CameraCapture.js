import { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Camera, X, RotateCcw, Check, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CameraModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const CameraContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 80vh;
  background: #000;
  border-radius: 15px;
  overflow: hidden;
`;

const VideoElement = styled.video`
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: cover;
`;

const CapturedImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
`;

const CameraControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ControlButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &.capture {
    background: #fff;
    border: 4px solid #007bff;
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  &.action {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
      transform: scale(1.1);
    }
  }
  
  &.danger {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: scale(1.1);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const FileUploadArea = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 2px dashed #007bff;
  border-radius: 15px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: #0056b3;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CameraCapture = ({ isOpen, onClose, onCapture }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Sử dụng camera sau nếu có
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Không thể truy cập camera. Vui lòng cho phép quyền camera.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    stopCamera();
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmCapture = useCallback(async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      await onCapture(blob);
      handleClose();
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Có lỗi xảy ra khi xử lý ảnh');
    } finally {
      setIsProcessing(false);
    }
  }, [capturedImage, onCapture]);

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    setIsProcessing(true);
    try {
      await onCapture(file);
      handleClose();
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      toast.error('Có lỗi xảy ra khi xử lý ảnh');
    } finally {
      setIsProcessing(false);
    }
  }, [onCapture]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setIsProcessing(false);
    onClose();
  }, [stopCamera, onClose]);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    }
    
    return () => {
      if (!isOpen) {
        stopCamera();
      }
    };
  }, [isOpen, capturedImage, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <CameraModal>
      <CloseButton onClick={handleClose}>
        <X size={20} />
      </CloseButton>

      <CameraContainer>
        {capturedImage ? (
          <>
            <CapturedImage src={capturedImage} alt="Captured receipt" />
            <CameraControls>
              <ControlButton className="danger" onClick={retakePhoto} title="Chụp lại">
                <RotateCcw size={24} />
              </ControlButton>
              <ControlButton 
                className="action" 
                onClick={confirmCapture} 
                disabled={isProcessing}
                title="Xác nhận"
              >
                <Check size={24} />
              </ControlButton>
            </CameraControls>
          </>
        ) : stream ? (
          <>
            <VideoElement ref={videoRef} autoPlay playsInline />
            <CameraControls>
              <ControlButton className="capture" onClick={capturePhoto} title="Chụp ảnh">
                <Camera size={24} color="#007bff" />
              </ControlButton>
            </CameraControls>
          </>
        ) : (
          <FileUploadArea onClick={() => fileInputRef.current?.click()}>
            <Upload size={48} style={{ marginBottom: '1rem' }} />
            <h3>Chụp ảnh hóa đơn</h3>
            <p>Nhấn để chọn ảnh từ thư viện</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
              Hoặc cho phép camera để chụp ảnh trực tiếp
            </p>
          </FileUploadArea>
        )}
      </CameraContainer>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </CameraModal>
  );
};

export default CameraCapture;