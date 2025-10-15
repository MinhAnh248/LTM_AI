import React, { useState } from 'react';
import styled from 'styled-components';
import { DollarSign, Calendar, Tag, FileText, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const IncomeContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #28a745;
  text-align: center;
  margin-bottom: 2rem;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid #28a745;
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #28a745;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #28a745;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: linear-gradient(45deg, #28a745, #1e7e34);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #1e7e34, #155724);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const incomeCategories = [
  { value: 'luong', label: '💼 Lương' },
  { value: 'thuong', label: '🎁 Thưởng' },
  { value: 'dau tu', label: '📈 Đầu tư' },
  { value: 'ban hang', label: '🛒 Bán hàng' },
  { value: 'freelance', label: '💻 Freelance' },
  { value: 'cho thue', label: '🏠 Cho thuê' },
  { value: 'khac', label: '💰 Khác' }
];

const IncomePage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'luong',
    amount: '',
    description: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const response = await api.addIncome(formData);
      
      if (response.data.success) {
        toast.success('✅ Đã thêm thu nhập thành công!');
        setFormData({
          date: new Date().toISOString().split('T')[0],
          category: 'luong',
          amount: '',
          description: ''
        });
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error adding income:', error);
      toast.error('❌ Có lỗi xảy ra khi thêm thu nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IncomeContainer>
      <Title>💰 Thêm Thu nhập</Title>
      
      <FormCard>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
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
          </InputGroup>

          <InputGroup>
            <Label>
              <Tag size={18} />
              Loại thu nhập
            </Label>
            <Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              {incomeCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>
              <DollarSign size={18} />
              Số tiền (VNĐ)
            </Label>
            <Input
              type="number"
              name="amount"
              placeholder="Nhập số tiền..."
              value={formData.amount}
              onChange={handleInputChange}
              min="0"
              step="1000"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>
              <FileText size={18} />
              Mô tả
            </Label>
            <Input
              type="text"
              name="description"
              placeholder="Mô tả thu nhập..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            <Plus size={20} />
            {loading ? 'Đang thêm...' : 'Thêm Thu nhập'}
          </SubmitButton>
        </Form>
      </FormCard>
    </IncomeContainer>
  );
};

export default IncomePage;