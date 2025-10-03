import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import api from '../services/api';
import BudgetAlerts from '../components/BudgetAlerts';
import ReminderNotifications from '../components/ReminderNotifications';

const DashboardContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MetricIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(45deg, #007bff, #0056b3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff;
`;

const MetricLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
`;

const ChartTitle = styled.h3`
  color: #007bff;
  margin-bottom: 1rem;
  text-align: center;
`;

const TimelineChart = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
`;

const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [incomeSummary, setIncomeSummary] = useState(null);
  const [debtSummary, setDebtSummary] = useState(null);
  const [savingsSummary, setSavingsSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [summaryRes, incomeRes, debtRes, savingsRes, categoryRes, dailyRes] = await Promise.all([
        api.getSummary(),
        api.getIncomeSummary(),
        api.getDebtSummary(),
        api.getSavingsSummary(),
        api.getCategoryBreakdown(),
        api.getDailySpending()
      ]);

      setSummary(summaryRes.data);
      setIncomeSummary(incomeRes.data);
      setDebtSummary(debtRes.data);
      setSavingsSummary(savingsRes.data);
      setCategoryData(categoryRes.data);
      setDailyData(dailyRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <DashboardContainer>
      <h1>📊 Dashboard Tổng quan</h1>
      
      <ReminderNotifications />
      <BudgetAlerts />
      
      <MetricsGrid>
        <MetricCard style={{borderColor: '#28a745'}}>
          <MetricIcon style={{background: 'linear-gradient(45deg, #28a745, #1e7e34)'}}>
            <TrendingUp size={24} />
          </MetricIcon>
          <MetricContent>
            <MetricValue style={{color: '#28a745'}}>{formatCurrency(incomeSummary?.total_income || 0)}</MetricValue>
            <MetricLabel>Tổng thu nhập</MetricLabel>
          </MetricContent>
        </MetricCard>

        <MetricCard>
          <MetricIcon>
            <DollarSign size={24} />
          </MetricIcon>
          <MetricContent>
            <MetricValue>{formatCurrency(summary?.total || 0)}</MetricValue>
            <MetricLabel>Tổng chi tiêu</MetricLabel>
          </MetricContent>
        </MetricCard>

        <MetricCard style={{borderColor: '#dc3545'}}>
          <MetricIcon style={{background: 'linear-gradient(45deg, #dc3545, #c82333)'}}>
            <DollarSign size={24} />
          </MetricIcon>
          <MetricContent>
            <MetricValue style={{color: '#dc3545'}}>{formatCurrency(debtSummary?.total_debt || 0)}</MetricValue>
            <MetricLabel>Tổng nợ còn lại</MetricLabel>
          </MetricContent>
        </MetricCard>

        <MetricCard style={{borderColor: '#007bff'}}>
          <MetricIcon style={{background: 'linear-gradient(45deg, #007bff, #0056b3)'}}>
            <DollarSign size={24} />
          </MetricIcon>
          <MetricContent>
            <MetricValue style={{color: '#007bff'}}>{formatCurrency(savingsSummary?.total_savings || 0)}</MetricValue>
            <MetricLabel>Tổng tiết kiệm</MetricLabel>
          </MetricContent>
        </MetricCard>

        <MetricCard style={{borderColor: incomeSummary?.total_income > (summary?.total + debtSummary?.total_debt) ? '#28a745' : '#dc3545'}}>
          <MetricIcon style={{background: `linear-gradient(45deg, ${incomeSummary?.total_income > (summary?.total + debtSummary?.total_debt) ? '#28a745, #1e7e34' : '#dc3545, #c82333'})`}}>
            <DollarSign size={24} />
          </MetricIcon>
          <MetricContent>
            <MetricValue style={{color: incomeSummary?.total_income > (summary?.total + debtSummary?.total_debt) ? '#28a745' : '#dc3545'}}>
              {formatCurrency((incomeSummary?.total_income || 0) - (summary?.total || 0) - (debtSummary?.total_debt || 0) + (savingsSummary?.total_savings || 0))}
            </MetricValue>
            <MetricLabel>Tài sản ròng</MetricLabel>
          </MetricContent>
        </MetricCard>

        <MetricCard>
          <MetricIcon>
            <ShoppingCart size={24} />
          </MetricIcon>
          <MetricContent>
            <MetricValue>{summary?.count || 0}</MetricValue>
            <MetricLabel>Số giao dịch</MetricLabel>
          </MetricContent>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>📊 Phân bổ theo danh mục</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>📈 Chi tiêu theo ngày (7 ngày gần nhất)</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#007bff" 
                strokeWidth={3}
                dot={{ fill: '#007bff', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <TimelineChart>
        <ChartTitle>📅 Xu hướng chi tiêu theo thời gian</ChartTitle>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#007bff" 
              strokeWidth={2}
              dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TimelineChart>
    </DashboardContainer>
  );
};

export default Dashboard;