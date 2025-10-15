import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Check, X, Edit3, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const PreviewContainer = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const PreviewHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewTitle = styled.h2`
  color: #007bff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  
  &:hover {
    background: #f8f9fa;
    color: #dc3545;
  }
`;

const PreviewContent = styled.div`
  padding: 1.5rem;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
`;

const SectionTitle = styled.h3`
  color: #495057;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #0056b3;
  }
`;

const RawText = styled.pre`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ExtractedInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #495057;
`;

const InfoValue = styled.span`
  color: #007bff;
  font-weight: 500;
`;

const EditableInput = styled.input`
  border: 1px solid #007bff;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  width: 150px;
`;

const EditableSelect = styled.select`
  border: 1px solid #007bff;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  width: 150px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 2px solid #e9ecef;
`;

const ActionButton = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
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
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
`;

const categories = [
  { value: 'an uong', label: '🍽️ Ăn uống' },
  { value: 'di lai', label: '🚗 Đi lại' },
  { value: 'hoc tap', label: '📚 Học tập' },
  { value: 'giai tri', label: '🎮 Giải trí' },
  { value: 'hoa don', label: '💡 Hóa đơn' },
  { value: 'khac', label: '📦 Khác' }
];

const OCRPreview = ({ isOpen, onClose, ocrResult, onConfirm }) => {
  const [showRawText, setShowRawText] = useState(false);
  const [editableData, setEditableData] = useState({
    amount: '',
    description: '',
    category: 'khac',
    date: ''
  });

  // Update editableData when ocrResult changes
  useEffect(() => {
    if (ocrResult && isOpen) {
      setEditableData({
        amount: ocrResult.amount || '',
        description: ocrResult.description || '',
        category: ocrResult.category || 'khac',
        date: ocrResult.date || ''
      });
    }
  }, [ocrResult, isOpen]);

  const handleInputChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    // Validate data
    if (!editableData.amount || !editableData.description) {
      toast.error('Vui lòng điền đầy đủ số tiền và mô tả');
      return;
    }

    onConfirm(editableData);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCategoryLabel = (value) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  if (!isOpen || !ocrResult) return null;

  return (
    <PreviewModal onClick={(e) => e.target === e.currentTarget && onClose()}>
      <PreviewContainer>
        <PreviewHeader>
          <PreviewTitle>
            <Edit3 size={24} />
            Kết quả quét hóa đơn
          </PreviewTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </PreviewHeader>

        <PreviewContent>
          <SectionGrid>
            <Section>
              <SectionTitle>
                📄 Text đã trích xuất
                <ToggleButton onClick={() => setShowRawText(!showRawText)}>
                  {showRawText ? <EyeOff size={16} /> : <Eye size={16} />}
                </ToggleButton>
              </SectionTitle>
              
              {showRawText && (
                <RawText>{ocrResult.raw_text || 'Không có text thô'}</RawText>
              )}
              
              {!showRawText && (
                <div style={{ 
                  padding: '1rem', 
                  background: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  Nhấn 👁️ để xem text gốc
                </div>
              )}
            </Section>

            <Section>
              <SectionTitle>🤖 Thông tin đã phân tích</SectionTitle>
              
              <ExtractedInfo>
                <InfoItem>
                  <InfoLabel>💰 Số tiền:</InfoLabel>
                  <EditableInput
                    type="number"
                    value={editableData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="Nhập số tiền"
                  />
                </InfoItem>

                <InfoItem>
                  <InfoLabel>📝 Mô tả:</InfoLabel>
                  <EditableInput
                    type="text"
                    value={editableData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Nhập mô tả"
                  />
                </InfoItem>

                <InfoItem>
                  <InfoLabel>🏷️ Danh mục:</InfoLabel>
                  <EditableSelect
                    value={editableData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </EditableSelect>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>📅 Ngày:</InfoLabel>
                  <EditableInput
                    type="date"
                    value={editableData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </InfoItem>
              </ExtractedInfo>
            </Section>
          </SectionGrid>

          <Section>
            <SectionTitle>📋 Xem trước giao dịch</SectionTitle>
            <div style={{ 
              padding: '1rem', 
              background: 'white', 
              borderRadius: '8px',
              border: '2px solid #007bff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{editableData.description}</strong>
                <strong style={{ color: '#dc3545' }}>
                  {editableData.amount ? formatCurrency(editableData.amount) : '0 ₫'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6c757d' }}>
                <span>{getCategoryLabel(editableData.category)}</span>
                <span>{editableData.date}</span>
              </div>
            </div>
          </Section>
        </PreviewContent>

        <ActionButtons>
          <ActionButton className="secondary" onClick={onClose}>
            <X size={16} />
            Hủy bỏ
          </ActionButton>
          <ActionButton className="primary" onClick={handleConfirm}>
            <Check size={16} />
            Xác nhận & Lưu
          </ActionButton>
        </ActionButtons>
      </PreviewContainer>
    </PreviewModal>
  );
};

export default OCRPreview;