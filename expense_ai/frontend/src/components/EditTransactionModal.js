import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Save, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border-radius: 20px 20px 0 0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
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
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &:invalid {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &.primary {
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
    
    &:hover {
      background: linear-gradient(45deg, #0056b3, #004085);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ValidationMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PreviewCard = styled.div`
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border: 2px solid #007bff;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
`;

const PreviewTitle = styled.div`
  font-weight: 600;
  color: #007bff;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const PreviewContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewDescription = styled.div`
  font-weight: 600;
  color: #495057;
`;

const PreviewAmount = styled.div`
  font-weight: bold;
  color: #dc3545;
  font-size: 1.1rem;
`;

const PreviewDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
`;

const categories = [
    { value: 'an uong', label: '🍽️ Ăn uống' },
    { value: 'di lai', label: '🚗 Đi lại' },
    { value: 'hoc tap', label: '📚 Học tập' },
    { value: 'giai tri', label: '🎮 Giải trí' },
    { value: 'hoa don', label: '💡 Hóa đơn' },
    { value: 'khac', label: '📦 Khác' }
];

const EditTransactionModal = ({ isOpen, onClose, transaction, onSave }) => {
    const [formData, setFormData] = useState({
        date: '',
        amount: '',
        description: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Initialize form data when transaction changes
    useEffect(() => {
        if (transaction) {
            setFormData({
                date: transaction.date || '',
                amount: transaction.amount?.toString() || '',
                description: transaction.description || '',
                category: transaction.category || ''
            });
            setErrors({});
        }
    }, [transaction]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.date) {
            newErrors.date = 'Vui lòng chọn ngày';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Vui lòng nhập số tiền hợp lệ';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Vui lòng nhập mô tả';
        }

        if (!formData.category) {
            newErrors.category = 'Vui lòng chọn danh mục';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin');
            return;
        }

        setLoading(true);
        try {
            const updatedTransaction = {
                ...transaction,
                date: formData.date,
                amount: parseFloat(formData.amount),
                description: formData.description.trim(),
                category: formData.category
            };

            await onSave(updatedTransaction);
            toast.success('✅ Đã cập nhật giao dịch thành công!');
            onClose();
        } catch (error) {
            console.error('Error updating transaction:', error);
            toast.error('❌ Có lỗi xảy ra khi cập nhật giao dịch');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };

    const getCategoryLabel = (value) => {
        const category = categories.find(cat => cat.value === value);
        return category ? category.label : value;
    };

    if (!isOpen || !transaction) return null;

    return (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        <FileText size={20} />
                        Chỉnh sửa giao dịch
                    </ModalTitle>
                    <CloseButton onClick={handleClose} disabled={loading}>
                        <X size={20} />
                    </CloseButton>
                </ModalHeader>

                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>
                                <Calendar size={16} />
                                Ngày
                            </Label>
                            <Input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.date && (
                                <ValidationMessage>⚠️ {errors.date}</ValidationMessage>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <DollarSign size={16} />
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
                            {errors.amount && (
                                <ValidationMessage>⚠️ {errors.amount}</ValidationMessage>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <FileText size={16} />
                                Mô tả
                            </Label>
                            <Input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Nhập mô tả giao dịch..."
                                required
                            />
                            {errors.description && (
                                <ValidationMessage>⚠️ {errors.description}</ValidationMessage>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                <Tag size={16} />
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
                            {errors.category && (
                                <ValidationMessage>⚠️ {errors.category}</ValidationMessage>
                            )}
                        </FormGroup>

                        {/* Preview */}
                        {formData.description && formData.amount && (
                            <PreviewCard>
                                <PreviewTitle>👁️ Xem trước giao dịch</PreviewTitle>
                                <PreviewContent>
                                    <PreviewDescription>{formData.description}</PreviewDescription>
                                    <PreviewAmount>{formatCurrency(formData.amount)}</PreviewAmount>
                                </PreviewContent>
                                <PreviewDetails>
                                    <span>{getCategoryLabel(formData.category)}</span>
                                    <span>{formData.date}</span>
                                </PreviewDetails>
                            </PreviewCard>
                        )}

                        <ButtonGroup>
                            <Button
                                type="button"
                                className="secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                className="primary"
                                disabled={loading}
                            >
                                <Save size={16} />
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </ButtonGroup>
                    </form>
                </ModalBody>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default EditTransactionModal;