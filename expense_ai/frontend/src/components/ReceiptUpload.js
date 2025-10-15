import { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Upload, Camera, FileImage, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UploadContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.isDragOver ? '#007bff' : '#e9ecef'};
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragOver ? 'rgba(0, 123, 255, 0.05)' : '#f8f9fa'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #007bff;
    background: rgba(0, 123, 255, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => props.isDragOver ? '#007bff' : '#6c757d'};
`;

const UploadText = styled.div`
  color: #495057;
  margin-bottom: 1rem;
`;

const UploadSubtext = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
    
    &:hover {
      background: linear-gradient(45deg, #0056b3, #004085);
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: linear-gradient(45deg, #28a745, #1e7e34);
    color: white;
    
    &:hover {
      background: linear-gradient(45deg, #1e7e34, #155724);
      transform: translateY(-2px);
    }
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-top: 1rem;
  position: relative;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 10px;
  border: 2px solid #007bff;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(220, 53, 69, 1);
  }
`;

const ReceiptUpload = ({ onImageSelect, onCameraOpen }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageFile(imageFile);
    } else {
      toast.error('Vui lòng chọn file ảnh');
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  }, []);

  const handleImageFile = useCallback((file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    // Call parent callback
    onImageSelect(file);
  }, [onImageSelect]);

  const handleRemoveImage = useCallback(() => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleAreaClick = useCallback(() => {
    if (!previewImage) {
      fileInputRef.current?.click();
    }
  }, [previewImage]);

  return (
    <UploadContainer>
      <UploadArea
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleAreaClick}
      >
        {!previewImage ? (
          <>
            <UploadIcon isDragOver={isDragOver}>
              📸
            </UploadIcon>
            <UploadText>
              <strong>Quét hóa đơn để tự động nhập chi tiêu</strong>
            </UploadText>
            <UploadSubtext>
              Kéo thả ảnh vào đây hoặc nhấn để chọn file
            </UploadSubtext>
            <ButtonGroup>
              <UploadButton 
                className="primary" 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <FileImage size={16} />
                Chọn ảnh
              </UploadButton>
              <UploadButton 
                className="secondary" 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCameraOpen();
                }}
              >
                <Camera size={16} />
                Chụp ảnh
              </UploadButton>
            </ButtonGroup>
          </>
        ) : (
          <PreviewContainer>
            <PreviewImage src={previewImage} alt="Receipt preview" />
            <RemoveButton onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}>
              <X size={16} />
            </RemoveButton>
          </PreviewContainer>
        )}
      </UploadArea>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </UploadContainer>
  );
};

export default ReceiptUpload;