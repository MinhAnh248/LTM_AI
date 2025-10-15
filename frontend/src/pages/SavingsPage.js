import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Target, Plus, DollarSign, Calendar, TrendingUp, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const SavingsContainer = styled.div`
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
  color: #28a745;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #28a745, #1e7e34);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(45deg, #1e7e34, #155724);
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
  border: 2px solid #28a745;
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.1);
  text-align: center;
`;

const SummaryValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const GoalCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid ${props => props.isCompleted ? '#28a745' : '#e9ecef'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CompletedBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const GoalTitle = styled.h3`
  color: #495057;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GoalActions = styled.div`
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
  
  &.deposit {
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

const GoalInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const GoalLabel = styled.span`
  color: #6c757d;
`;

const GoalValue = styled.span`
  font-weight: 600;
  color: ${props => props.color || '#495057'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(45deg, #28a745, #1e7e34);
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.3s ease;
`;

const Suggestion = styled.div`
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #155724;
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
    border-color: #28a745;
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
    border-color: #28a745;
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
    background: linear-gradient(45deg, #28a745, #1e7e34);
    color: white;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

const goalTypes = [
  { value: 'house', label: '🏠 Mua nhà' },
  { value: 'car', label: '🚗 Mua xe' },
  { value: 'travel', label: '✈️ Du lịch' },
  { value: 'education', label: '🎓 Giáo dục' },
  { value: 'emergency', label: '🚨 Quỹ khẩn cấp' },
  { value: 'retirement', label: '👴 Hưu trí' },
  { value: 'investment', label: '📈 Đầu tư' },
  { value: 'other', label: '🎯 Khác' }
];

const SavingsPage = () => {
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    goal_name: '',
    goal_type: 'house',
    target_amount: '',
    target_date: '',
    monthly_target: '',
    description: ''
  });
  const [depositData, setDepositData] = useState({
    deposit_amount: '',
    deposit_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      const [goalsRes, summaryRes] = await Promise.all([
        api.getSavingsGoals(),
        api.getSavingsSummary()
      ]);

      setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
      setSummary(summaryRes.data || {});
    } catch (error) {
      console.error('Error loading savings data:', error);
      toast.error('Không thể tải dữ liệu tiết kiệm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.addSavingsGoal(formData);
      if (response.data.success) {
        toast.success('✅ Đã thêm mục tiêu tiết kiệm thành công!');
        setShowAddModal(false);
        setFormData({
          goal_name: '',
          goal_type: 'house',
          target_amount: '',
          target_date: '',
          monthly_target: '',
          description: ''
        });
        loadSavingsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi thêm mục tiêu');
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.makeSavingsDeposit(selectedGoal.id, depositData);
      if (response.data.success) {
        toast.success('✅ ' + response.data.message);
        setShowDepositModal(false);
        setDepositData({
          deposit_amount: '',
          deposit_date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        loadSavingsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi gửi tiết kiệm');
    }
  };

  const handleDeleteGoal = async (goal) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mục tiêu "${goal.goal_name}"?`)) {
      return;
    }

    try {
      const response = await api.deleteSavingsGoal(goal.id);
      if (response.data.success) {
        toast.success('✅ Đã xóa mục tiêu tiết kiệm');
        loadSavingsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi xóa mục tiêu');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getGoalTypeLabel = (value) => {
    const type = goalTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getProgress = (goal) => {
    return (goal.current_amount / goal.target_amount) * 100;
  };

  const getDaysRemaining = (goal) => {
    if (!goal.target_date) return null;
    const target = new Date(goal.target_date);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMonthlyNeeded = (goal) => {
    const remaining = goal.target_amount - goal.current_amount;
    const daysRemaining = getDaysRemaining(goal);
    if (!daysRemaining || daysRemaining <= 0) return 0;
    const monthsRemaining = Math.max(1, daysRemaining / 30);
    return remaining / monthsRemaining;
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <SavingsContainer>
      <Header>
        <Title>🎯 Kế hoạch Tiết kiệm</Title>
        <AddButton onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Thêm Mục tiêu
        </AddButton>
      </Header>

      <SummaryGrid>
        <SummaryCard>
          <SummaryValue>{formatCurrency(summary.total_savings || 0)}</SummaryValue>
          <SummaryLabel>Tổng tiết kiệm</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{formatCurrency(summary.total_target || 0)}</SummaryValue>
          <SummaryLabel>Tổng mục tiêu</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{summary.active_goals || 0}</SummaryValue>
          <SummaryLabel>Mục tiêu đang có</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{summary.completed_goals || 0}</SummaryValue>
          <SummaryLabel>Đã hoàn thành</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{formatCurrency(summary.monthly_deposits || 0)}</SummaryValue>
          <SummaryLabel>Gửi tháng này</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue>{summary.progress_percentage?.toFixed(1) || 0}%</SummaryValue>
          <SummaryLabel>Tiến độ tổng thể</SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <GoalsGrid>
        {goals.map(goal => {
          const progress = getProgress(goal);
          const isCompleted = progress >= 100;
          const daysRemaining = getDaysRemaining(goal);
          const monthlyNeeded = getMonthlyNeeded(goal);

          return (
            <GoalCard key={goal.id} isCompleted={isCompleted}>
              {isCompleted && (
                <CompletedBadge>
                  <CheckCircle size={16} />
                </CompletedBadge>
              )}
              
              <GoalHeader>
                <GoalTitle>
                  <Target size={20} />
                  {goal.goal_name}
                </GoalTitle>
                <GoalActions>
                  {!isCompleted && (
                    <ActionButton 
                      className="deposit"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowDepositModal(true);
                      }}
                    >
                      <DollarSign size={16} />
                    </ActionButton>
                  )}
                  <ActionButton 
                    className="delete"
                    onClick={() => handleDeleteGoal(goal)}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </GoalActions>
              </GoalHeader>

              <GoalInfo>
                <GoalLabel>Loại:</GoalLabel>
                <GoalValue>{getGoalTypeLabel(goal.goal_type)}</GoalValue>
              </GoalInfo>

              <GoalInfo>
                <GoalLabel>Hiện tại:</GoalLabel>
                <GoalValue color="#28a745">{formatCurrency(goal.current_amount)}</GoalValue>
              </GoalInfo>

              <GoalInfo>
                <GoalLabel>Mục tiêu:</GoalLabel>
                <GoalValue>{formatCurrency(goal.target_amount)}</GoalValue>
              </GoalInfo>

              <GoalInfo>
                <GoalLabel>Còn lại:</GoalLabel>
                <GoalValue color="#dc3545">
                  {formatCurrency(Math.max(0, goal.target_amount - goal.current_amount))}
                </GoalValue>
              </GoalInfo>

              {goal.target_date && (
                <GoalInfo>
                  <GoalLabel>Hạn:</GoalLabel>
                  <GoalValue color={daysRemaining < 30 ? '#dc3545' : '#495057'}>
                    {new Date(goal.target_date).toLocaleDateString('vi-VN')}
                    {daysRemaining > 0 && ` (${daysRemaining} ngày)`}
                  </GoalValue>
                </GoalInfo>
              )}

              <ProgressBar>
                <ProgressFill percentage={progress} />
              </ProgressBar>

              <GoalInfo>
                <GoalLabel>Tiến độ:</GoalLabel>
                <GoalValue color="#28a745">{progress.toFixed(1)}%</GoalValue>
              </GoalInfo>

              {!isCompleted && monthlyNeeded > 0 && (
                <Suggestion>
                  💡 Gợi ý: Gửi {formatCurrency(monthlyNeeded)}/tháng để đạt mục tiêu đúng hạn
                </Suggestion>
              )}
            </GoalCard>
          );
        })}
      </GoalsGrid>

      {/* Add Goal Modal */}
      {showAddModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <ModalContent>
            <ModalTitle>Thêm Mục tiêu Tiết kiệm</ModalTitle>
            <Form onSubmit={handleAddGoal}>
              <FormGroup>
                <Label>Tên mục tiêu</Label>
                <Input
                  type="text"
                  value={formData.goal_name}
                  onChange={(e) => setFormData({...formData, goal_name: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Loại mục tiêu</Label>
                <Select
                  value={formData.goal_type}
                  onChange={(e) => setFormData({...formData, goal_type: e.target.value})}
                >
                  {goalTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Số tiền mục tiêu (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Hạn hoàn thành</Label>
                <Input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({...formData, target_date: e.target.value})}
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
                  Thêm Mục tiêu
                </ModalButton>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Deposit Modal */}
      {showDepositModal && selectedGoal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowDepositModal(false)}>
          <ModalContent>
            <ModalTitle>Gửi tiết kiệm: {selectedGoal.goal_name}</ModalTitle>
            <Form onSubmit={handleDeposit}>
              <GoalInfo>
                <GoalLabel>Hiện tại:</GoalLabel>
                <GoalValue color="#28a745">{formatCurrency(selectedGoal.current_amount)}</GoalValue>
              </GoalInfo>
              <GoalInfo>
                <GoalLabel>Còn lại:</GoalLabel>
                <GoalValue color="#dc3545">
                  {formatCurrency(selectedGoal.target_amount - selectedGoal.current_amount)}
                </GoalValue>
              </GoalInfo>

              <FormGroup>
                <Label>Số tiền gửi (VNĐ)</Label>
                <Input
                  type="number"
                  value={depositData.deposit_amount}
                  onChange={(e) => setDepositData({...depositData, deposit_amount: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Ngày gửi</Label>
                <Input
                  type="date"
                  value={depositData.deposit_date}
                  onChange={(e) => setDepositData({...depositData, deposit_date: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Ghi chú</Label>
                <Input
                  type="text"
                  value={depositData.notes}
                  onChange={(e) => setDepositData({...depositData, notes: e.target.value})}
                />
              </FormGroup>

              <ModalActions>
                <ModalButton type="button" className="cancel" onClick={() => setShowDepositModal(false)}>
                  Hủy
                </ModalButton>
                <ModalButton type="submit" className="submit">
                  Gửi tiết kiệm
                </ModalButton>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </SavingsContainer>
  );
};

export default SavingsPage;