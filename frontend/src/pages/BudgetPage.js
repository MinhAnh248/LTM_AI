import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const BudgetContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #007bff;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
`;

const BudgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const BudgetCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CategoryName = styled.h3`
  color: #007bff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusIcon = styled.div`
  color: ${props => {
    if (props.percentage >= 100) return '#dc3545';
    if (props.percentage >= 80) return '#ffc107';
    return '#28a745';
  }};
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
  background: ${props => {
    if (props.percentage >= 100) return 'linear-gradient(45deg, #dc3545, #c82333)';
    if (props.percentage >= 80) return 'linear-gradient(45deg, #ffc107, #e0a800)';
    return 'linear-gradient(45deg, #28a745, #1e7e34)';
  }};
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.3s ease;
`;

const BudgetInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const BudgetText = styled.span`
  color: #495057;
  font-size: 0.9rem;
`;

const BudgetAmount = styled.span`
  font-weight: bold;
  color: ${props => props.color || '#495057'};
`;

const BudgetInput = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SetBudgetButton = styled.button`
  padding: 0.5rem 1rem;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: linear-gradient(45deg, #0056b3, #004085);
  }
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color || '#007bff'};
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const categories = [
  { value: 'an uong', label: '🍽️ Ăn uống', icon: '🍽️' },
  { value: 'di lai', label: '🚗 Đi lại', icon: '🚗' },
  { value: 'hoc tap', label: '📚 Học tập', icon: '📚' },
  { value: 'giai tri', label: '🎮 Giải trí', icon: '🎮' },
  { value: 'hoa don', label: '💡 Hóa đơn', icon: '💡' },
  { value: 'khac', label: '📦 Khác', icon: '📦' }
];

const BudgetPage = () => {
  const [budgets, setBudgets] = useState({});
  const [spending, setSpending] = useState({});
  const [newBudgets, setNewBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      const [budgetRes, spendingRes, statusRes] = await Promise.all([
        api.getBudgets(),
        api.getCategoryBreakdown(),
        api.getSpendingStatus()
      ]);

      setBudgets(budgetRes.data);
      
      // Convert spending array to object
      const spendingObj = {};
      spendingRes.data.forEach(item => {
        spendingObj[item.category] = item.amount;
      });
      setSpending(spendingObj);
      
      // Cập nhật thêm thông tin từ spending status nếu cần
      console.log('Spending status:', statusRes.data);
    } catch (error) {
      console.error('Error loading budget data:', error);
      toast.error('Không thể tải dữ liệu ngân sách');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (category) => {
    const amount = newBudgets[category];
    if (!amount || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    try {
      await api.setBudget({ category, limit: parseFloat(amount) });
      setBudgets(prev => ({ ...prev, [category]: parseFloat(amount) }));
      setNewBudgets(prev => ({ ...prev, [category]: '' }));
      toast.success('Đã cập nhật ngân sách thành công!');
    } catch (error) {
      console.error('Error setting budget:', error);
      toast.error('Có lỗi xảy ra khi cập nhật ngân sách');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const getSpendingPercentage = (category) => {
    const spent = spending[category] || 0;
    const budget = budgets[category] || 0;
    return budget > 0 ? (spent / budget) * 100 : 0;
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 100) return <AlertTriangle size={20} />;
    if (percentage >= 80) return <TrendingUp size={20} />;
    return <CheckCircle size={20} />;
  };

  const getTotalBudget = () => {
    return Object.values(budgets).reduce((sum, budget) => sum + (budget || 0), 0);
  };

  const getTotalSpending = () => {
    return Object.values(spending).reduce((sum, spent) => sum + (spent || 0), 0);
  };

  const getOverBudgetCategories = () => {
    return categories.filter(cat => getSpendingPercentage(cat.value) >= 100).length;
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <BudgetContainer>
      <Header>
        <Title>🎯 Quản lý Ngân sách</Title>
        <Subtitle>Theo dõi và kiểm soát chi tiêu theo từng danh mục</Subtitle>
      </Header>

      <SummaryCard>
        <h2>📊 Tổng quan Ngân sách</h2>
        <SummaryGrid>
          <SummaryItem>
            <SummaryValue color="#007bff">
              {formatCurrency(getTotalBudget())}
            </SummaryValue>
            <SummaryLabel>Tổng ngân sách</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue color="#dc3545">
              {formatCurrency(getTotalSpending())}
            </SummaryValue>
            <SummaryLabel>Đã chi tiêu</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue color={getTotalBudget() - getTotalSpending() >= 0 ? '#28a745' : '#dc3545'}>
              {formatCurrency(getTotalBudget() - getTotalSpending())}
            </SummaryValue>
            <SummaryLabel>Còn lại</SummaryLabel>
          </SummaryItem>
          <SummaryItem>
            <SummaryValue color={getOverBudgetCategories() > 0 ? '#dc3545' : '#28a745'}>
              {getOverBudgetCategories()}
            </SummaryValue>
            <SummaryLabel>Vượt ngân sách</SummaryLabel>
          </SummaryItem>
        </SummaryGrid>
      </SummaryCard>

      <BudgetGrid>
        {categories.map(category => {
          const percentage = getSpendingPercentage(category.value);
          const spent = spending[category.value] || 0;
          const budget = budgets[category.value] || 0;
          const remaining = budget - spent;

          return (
            <BudgetCard key={category.value}>
              <CategoryHeader>
                <CategoryName>
                  <span>{category.icon}</span>
                  {category.label}
                </CategoryName>
                <StatusIcon percentage={percentage}>
                  {getStatusIcon(percentage)}
                </StatusIcon>
              </CategoryHeader>

              <ProgressBar>
                <ProgressFill percentage={percentage} />
              </ProgressBar>

              <BudgetInfo>
                <BudgetText>Đã chi:</BudgetText>
                <BudgetAmount color="#dc3545">
                  {formatCurrency(spent)}
                </BudgetAmount>
              </BudgetInfo>

              <BudgetInfo>
                <BudgetText>Ngân sách:</BudgetText>
                <BudgetAmount color="#007bff">
                  {formatCurrency(budget)}
                </BudgetAmount>
              </BudgetInfo>

              <BudgetInfo>
                <BudgetText>Còn lại:</BudgetText>
                <BudgetAmount color={remaining >= 0 ? '#28a745' : '#dc3545'}>
                  {formatCurrency(remaining)}
                </BudgetAmount>
              </BudgetInfo>

              <BudgetInfo>
                <BudgetText>Tiến độ:</BudgetText>
                <BudgetAmount color={percentage >= 100 ? '#dc3545' : '#007bff'}>
                  {percentage.toFixed(1)}%
                </BudgetAmount>
              </BudgetInfo>

              <BudgetInput>
                <Input
                  type="number"
                  placeholder="Nhập ngân sách mới..."
                  value={newBudgets[category.value] || ''}
                  onChange={(e) => setNewBudgets(prev => ({
                    ...prev,
                    [category.value]: e.target.value
                  }))}
                />
                <SetBudgetButton onClick={() => handleSetBudget(category.value)}>
                  <Target size={16} />
                </SetBudgetButton>
              </BudgetInput>
            </BudgetCard>
          );
        })}
      </BudgetGrid>
    </BudgetContainer>
  );
};

export default BudgetPage;