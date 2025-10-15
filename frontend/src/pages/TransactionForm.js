import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { Calendar, DollarSign, Tag, FileText, Sparkles, Camera } from 'lucide-react';
import api from '../services/api';
import CameraCapture from '../components/CameraCapture';
import OCRPreview from '../components/OCRPreview';
import ReceiptUpload from '../components/ReceiptUpload';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid #007bff;
  box-shadow: 0 10px 30px rgba(0, 123, 255, 0.2);
`;

const FormTitle = styled.h1`
  color: #007bff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const SuggestionBox = styled.div`
  background: linear-gradient(45deg, #e3f2fd, #bbdefb);
  border: 2px solid #2196f3;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SuggestionText = styled.span`
  color: #1976d2;
  font-weight: 600;
`;

const CategoryTag = styled.span`
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.5);
    background: linear-gradient(45deg, #0056b3, #004085);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ScanButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #28a745, #1e7e34);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
    background: linear-gradient(45deg, #1e7e34, #155724);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: ''
  });
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showOCRPreview, setShowOCRPreview] = useState(false);
  const [ocrResult, setOCRResult] = useState(null);

  // Debounce function for API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Live category prediction
  useEffect(() => {
    if (formData.description.length > 2) {
      const debouncedPredict = debounce(async () => {
        try {
          const response = await api.predictCategory(formData.description);
          setSuggestedCategory(response.data.category);
          
          // Auto-select suggested category if form category is empty
          if (!formData.category) {
            setFormData(prev => ({ ...prev, category: response.data.category }));
          }
        } catch (error) {
          console.error('Error predicting category:', error);
        }
      }, 300);
      
      debouncedPredict();
    } else {
      setSuggestedCategory('');
    }
  }, [formData.description, formData.category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.addExpense(formData);
      
      // Kiểm tra cảnh báo ngân sách
      if (response.data.budget_alert) {
        const alert = response.data.budget_alert;
        if (alert.alert_type === 'danger') {
          toast.error(`🚨 ${alert.message}`, { duration: 6000 });
        } else {
          toast.error(`⚠️ ${alert.message}`, { duration: 4000 });
        }
      } else {
        toast.success('✅ Đã thêm chi tiêu thành công!');
      }
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        category: ''
      });
      setSuggestedCategory('');
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi thêm chi tiêu');
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (value) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const handleScanReceipt = async (imageFile) => {
    setIsScanning(true);
    try {
      const response = await api.scanReceipt(imageFile);
      
      if (response.data.success) {
        // Store OCR result and show preview
        setOCRResult({
          ...response.data.data,
          raw_text: response.data.raw_text
        });
        setShowOCRPreview(true);
        
        toast.success('✅ Đã quét hóa đơn thành công! Vui lòng kiểm tra thông tin.');
      } else {
        toast.error('❌ Không thể đọc thông tin từ hóa đơn');
      }
    } catch (error) {
      console.error('Error scanning receipt:', error);
      toast.error('❌ Có lỗi xảy ra khi quét hóa đơn');
    } finally {
      setIsScanning(false);
    }
  };

  const handleOCRConfirm = (confirmedData) => {
    // Fill form with confirmed OCR data
    setFormData({
      date: confirmedData.date,
      amount: confirmedData.amount.toString(),
      description: confirmedData.description,
      category: confirmedData.category
    });
    
    setShowOCRPreview(false);
    setOCRResult(null);
    toast.success('✅ Đã áp dụng thông tin từ hóa đơn!');
  };

  const handleOCRClose = () => {
    setShowOCRPreview(false);
    setOCRResult(null);
  };

  return (
    <FormContainer>
      <FormCard>
        <FormTitle>📝 Thêm Chi tiêu Mới</FormTitle>
        
        {/* Receipt Upload Section */}
        <ReceiptUpload
          onImageSelect={handleScanReceipt}
          onCameraOpen={() => setShowCamera(true)}
        />

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <Calendar size={18} />
              Ngày
            </Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <DollarSign size={18} />
              Số tiền (VNĐ)
            </Label>
            <Input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Nhập số tiền..."
              min="0"
              step="1000"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FileText size={18} />
              Mô tả chi tiêu
            </Label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Ví dụ: Mua cafe Highland, Ăn trưa..."
              required
            />
            
            {suggestedCategory && (
              <SuggestionBox>
                <Sparkles size={18} color="#1976d2" />
                <SuggestionText>AI gợi ý danh mục:</SuggestionText>
                <CategoryTag>{getCategoryLabel(suggestedCategory)}</CategoryTag>
              </SuggestionBox>
            )}
          </FormGroup>

          <FormGroup>
            <Label>
              <Tag size={18} />
              Danh mục
            </Label>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn danh mục...</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <ButtonGroup>
            <ScanButton 
              type="button" 
              onClick={() => setShowCamera(true)}
              disabled={loading || isScanning}
            >
              <Camera size={20} />
              {isScanning ? '📸 Đang quét...' : '📸 Quét hóa đơn'}
            </ScanButton>
            
            <SubmitButton type="submit" disabled={loading || isScanning}>
              {loading ? '⏳ Đang lưu...' : '💾 Lưu Chi tiêu'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </FormCard>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleScanReceipt}
      />

      {/* OCR Preview Modal */}
      <OCRPreview
        isOpen={showOCRPreview}
        onClose={handleOCRClose}
        ocrResult={ocrResult}
        onConfirm={handleOCRConfirm}
      />
    </FormContainer>
  );
};

export default TransactionForm;