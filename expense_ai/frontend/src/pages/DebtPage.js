import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CreditCard, Plus, DollarSign, Calendar, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const DebtContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #dc3545;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(45deg, #c82333, #a71e2a);
    transform: translateY(-2px);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #dc3545;
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.1);
  text-align: center;
`;

const SummaryValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #dc3545;
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const DebtGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DebtCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid ${props => props.isOverdue ? '#dc3545' : '#e9ecef'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const DebtHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DebtTitle = styled.h3`
  color: #495057;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DebtActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &.pay {
    background: #28a745;
    color: white;
  }
  
  &.delete {
    background: #dc3545;
    color: white;
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const DebtInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const DebtLabel = styled.span`
  color: #6c757d;
`;

const DebtValue = styled.span`
  font-weight: 600;
  color: ${props => props.color || '#495057'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(45deg, #28a745, #1e7e34);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #495057;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #dc3545;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  
  &.cancel {
    background: #6c757d;
    color: white;
  }
  
  &.submit {
    background: linear-gradient(45deg, #dc3545, #c82333);
    color: white;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

const debtTypes = [
  { value: 'credit_card', label: '💳 Thẻ tín dụng' },
  { value: 'personal_loan', label: '💰 Vay cá nhân' },
  { value: 'mortgage', label: '🏠 Vay mua nhà' },
  { value: 'car_loan', label: '🚗 Vay mua xe' },
  { value: 'student_loan', label: '📚 Vay học phí' },
  { value: 'other', label: '📋 Khác' }
];

const DebtPage = () => {
  const [debts, setDebts] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [formData, setFormData] = useState({
    creditor_name: '',
    debt_type: 'credit_card',
    original_amount: '',
    interest_rate: '',
    due_date: '',
    monthly_payment: '',
    description: ''
  });
  const [paymentData, setPaymentData] = useState({
    payment_amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadDebtData();
  }, []);

  const loadDebtData = async () => {
    try {
      const [debtsRes, summaryRes] = await Promise.all([
        api.getDebts(),
        api.getDebtSummary()
      ]);

      setDebts(Array.isArray(debtsRes.data) ? debtsRes.data : []);
      setSummary(summaryRes.data || {});
    } catch (error) {
      console.error('Error loading debt data:', error);
      toast.error('Không thể tải dữ liệu nợ');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDebt = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.addDebt(formData);
      if (response.data.success) {
        toast.success('✅ Đã thêm khoản nợ thành công!');
        setShowAddModal(false);
        setFormData({
          creditor_name: '',
          debt_type: 'credit_card',
          original_amount: '',
          interest_rate: '',
          due_date: '',
          monthly_payment: '',
          description: ''
        });
        loadDebtData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi thêm nợ');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.makeDebtPayment(selectedDebt.id, paymentData);
      if (response.data.success) {
        toast.success('✅ ' + response.data.message);
        setShowPayModal(false);
        setPaymentData({
          payment_amount: '',
          payment_date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        loadDebtData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi thanh toán');
    }
  };

  const handleDeleteDebt = async (debt) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nợ "${debt.creditor_name}"?`)) {
      return;
    }

    try {
      const response = await api.deleteDebt(debt.id);
      if (response.data.success) {
        toast.success('✅ Đã xóa khoản nợ');
        loadDebtData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi xóa nợ');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getDebtTypeLabel = (value) => {
    const type = debtTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getPaymentProgress = (debt) => {
    return ((debt.original_amount - debt.remaining_amount) / debt.original_amount) * 100;
  };

  const isOverdue = (debt) => {
    if (!debt.due_date) return false;
    return new Date(debt.due_date) < new Date();
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <DebtContainer>
      <Header>
        <Title>💳 Quản lý Nợ</Title>
        <AddButton onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Thêm Nợ
        </AddButton>
      </Header>

      <SummaryGrid>
        <SummaryCard>
          <SummaryValue>{formatCurrency(summary.total_debt || 0)}</SummaryValue>
          <SummaryLabel>Tổng nợ còn lại</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{summary.active_debts || 0}</SummaryValue>
          <SummaryLabel>Số khoản nợ</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{formatCurrency(summary.monthly_payments || 0)}</SummaryValue>
          <SummaryLabel>Đã trả tháng này</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue style={{color: summary.due_soon > 0 ? '#dc3545' : '#28a745'}}>
            {summary.due_soon || 0}
          </SummaryValue>
          <SummaryLabel>Sắp đến hạn</SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <DebtGrid>
        {debts.map(debt => (
          <DebtCard key={debt.id} isOverdue={isOverdue(debt)}>
            <DebtHeader>
              <DebtTitle>
                <CreditCard size={20} />
                {debt.creditor_name}
              </DebtTitle>
              <DebtActions>
                <ActionButton 
                  className="pay"
                  onClick={() => {
                    setSelectedDebt(debt);
                    setShowPayModal(true);
                  }}
                >
                  <DollarSign size={16} />
                </ActionButton>
                <ActionButton 
                  className="delete"
                  onClick={() => handleDeleteDebt(debt)}
                >
                  <Trash2 size={16} />
                </ActionButton>
              </DebtActions>
            </DebtHeader>

            <DebtInfo>
              <DebtLabel>Loại nợ:</DebtLabel>
              <DebtValue>{getDebtTypeLabel(debt.debt_type)}</DebtValue>
            </DebtInfo>

            <DebtInfo>
              <DebtLabel>Còn lại:</DebtLabel>
              <DebtValue color="#dc3545">{formatCurrency(debt.remaining_amount)}</DebtValue>
            </DebtInfo>

            <DebtInfo>
              <DebtLabel>Gốc:</DebtLabel>
              <DebtValue>{formatCurrency(debt.original_amount)}</DebtValue>
            </DebtInfo>

            {debt.due_date && (
              <DebtInfo>
                <DebtLabel>Hạn trả:</DebtLabel>
                <DebtValue color={isOverdue(debt) ? '#dc3545' : '#495057'}>
                  {new Date(debt.due_date).toLocaleDateString('vi-VN')}
                  {isOverdue(debt) && ' (Quá hạn)'}
                </DebtValue>
              </DebtInfo>
            )}

            <ProgressBar>
              <ProgressFill percentage={getPaymentProgress(debt)} />
            </ProgressBar>

            <DebtInfo>
              <DebtLabel>Tiến độ:</DebtLabel>
              <DebtValue color="#28a745">{getPaymentProgress(debt).toFixed(1)}%</DebtValue>
            </DebtInfo>
          </DebtCard>
        ))}
      </DebtGrid>

      {/* Add Debt Modal */}
      {showAddModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <ModalContent>
            <ModalTitle>Thêm Khoản Nợ Mới</ModalTitle>
            <Form onSubmit={handleAddDebt}>
              <FormGroup>
                <Label>Tên chủ nợ</Label>
                <Input
                  type="text"
                  value={formData.creditor_name}
                  onChange={(e) => setFormData({...formData, creditor_name: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Loại nợ</Label>
                <Select
                  value={formData.debt_type}
                  onChange={(e) => setFormData({...formData, debt_type: e.target.value})}
                >
                  {debtTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Số tiền nợ (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.original_amount}
                  onChange={(e) => setFormData({...formData, original_amount: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Lãi suất (%/năm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.interest_rate}
                  onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                />
              </FormGroup>

              <FormGroup>
                <Label>Hạn trả</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </FormGroup>

              <FormGroup>
                <Label>Mô tả</Label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </FormGroup>

              <ModalActions>
                <ModalButton type="button" className="cancel" onClick={() => setShowAddModal(false)}>
                  Hủy
                </ModalButton>
                <ModalButton type="submit" className="submit">
                  Thêm Nợ
                </ModalButton>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Payment Modal */}
      {showPayModal && selectedDebt && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowPayModal(false)}>
          <ModalContent>
            <ModalTitle>Thanh toán: {selectedDebt.creditor_name}</ModalTitle>
            <Form onSubmit={handlePayment}>
              <DebtInfo>
                <DebtLabel>Nợ còn lại:</DebtLabel>
                <DebtValue color="#dc3545">{formatCurrency(selectedDebt.remaining_amount)}</DebtValue>
              </DebtInfo>

              <FormGroup>
                <Label>Số tiền thanh toán (VNĐ)</Label>
                <Input
                  type="number"
                  value={paymentData.payment_amount}
                  onChange={(e) => setPaymentData({...paymentData, payment_amount: e.target.value})}
                  max={selectedDebt.remaining_amount}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Ngày thanh toán</Label>
                <Input
                  type="date"
                  value={paymentData.payment_date}
                  onChange={(e) => setPaymentData({...paymentData, payment_date: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Ghi chú</Label>
                <Input
                  type="text"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                />
              </FormGroup>

              <ModalActions>
                <ModalButton type="button" className="cancel" onClick={() => setShowPayModal(false)}>
                  Hủy
                </ModalButton>
                <ModalButton type="submit" className="submit">
                  Thanh toán
                </ModalButton>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </DebtContainer>
  );
};

export default DebtPage;