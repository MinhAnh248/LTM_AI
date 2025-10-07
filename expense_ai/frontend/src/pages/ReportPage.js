import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Download, TrendingUp, DollarSign, Target, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ReportContainer = styled.div`
  max-width: 1200px;
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

const FilterSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
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
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(45deg, #0056b3, #004085);
  }
  
  &.secondary {
    background: linear-gradient(45deg, #28a745, #1e7e34);
    
    &:hover {
      background: linear-gradient(45deg, #1e7e34, #155724);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
  text-align: center;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(45deg, #007bff, #0056b3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1rem;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
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

const FullWidthChart = styled(ChartCard)`
  grid-column: 1 / -1;
`;

const InsightsCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
`;

const InsightItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 123, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const InsightIcon = styled.div`
  color: #007bff;
`;

const InsightText = styled.div`
  flex: 1;
  color: #495057;
`;

const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];

const ReportPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    expenses: [],
    categoryBreakdown: [],
    dailySpending: [],
    summary: {}
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const [expensesRes, categoryRes, dailyRes, summaryRes, analysisRes] = await Promise.all([
        api.getExpenses(dateRange),
        api.getCategoryBreakdown(),
        api.getDailySpending(),
        api.getSummary(),
        api.getAnalysis()
      ]);

      setReportData({
        expenses: Array.isArray(expensesRes.data) ? expensesRes.data : [],
        categoryBreakdown: Array.isArray(categoryRes.data) ? categoryRes.data : [],
        dailySpending: Array.isArray(dailyRes.data) ? dailyRes.data : [],
        summary: summaryRes.data || {}
      });
      setAnalysis(analysisRes.data);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Không thể tạo báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // TODO: Implement export functionality
    toast('Chức năng xuất báo cáo sẽ được cập nhật sớm', {
      icon: 'ℹ️',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const getTopCategory = () => {
    if (!Array.isArray(reportData.categoryBreakdown) || reportData.categoryBreakdown.length === 0) return 'Không có dữ liệu';
    const top = reportData.categoryBreakdown.reduce((max, cat) => 
      cat.amount > max.amount ? cat : max
    );
    return top.category;
  };

  const getAverageDaily = () => {
    if (!Array.isArray(reportData.dailySpending) || reportData.dailySpending.length === 0) return 0;
    const total = reportData.dailySpending.reduce((sum, day) => sum + day.amount, 0);
    return total / reportData.dailySpending.length;
  };

  const getSpendingTrend = () => {
    if (!Array.isArray(reportData.dailySpending) || reportData.dailySpending.length < 2) return 'Không đủ dữ liệu';
    const recent = reportData.dailySpending.slice(-7);
    const older = reportData.dailySpending.slice(-14, -7);
    
    if (recent.length === 0 || older.length === 0) return 'Không đủ dữ liệu';
    
    const recentAvg = recent.reduce((sum, day) => sum + day.amount, 0) / recent.length;
    const olderAvg = older.reduce((sum, day) => sum + day.amount, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'Tăng';
    if (recentAvg < olderAvg * 0.9) return 'Giảm';
    return 'Ổn định';
  };

  return (
    <ReportContainer>
      <Header>
        <Title>📊 Báo cáo Chi tiêu</Title>
        <Subtitle>Phân tích chi tiết và xu hướng chi tiêu của bạn</Subtitle>
      </Header>

      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <Label>
              <Calendar size={16} />
              Từ ngày
            </Label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>
              <Calendar size={16} />
              Đến ngày
            </Label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </FilterGroup>

          <Button onClick={generateReport} disabled={loading}>
            <TrendingUp size={16} />
            {loading ? 'Đang tạo...' : 'Tạo báo cáo'}
          </Button>

          <Button className="secondary" onClick={exportReport}>
            <Download size={16} />
            Xuất báo cáo
          </Button>
        </FilterGrid>
      </FilterSection>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <DollarSign size={24} />
          </StatIcon>
          <StatValue>{formatCurrency(reportData.summary.total)}</StatValue>
          <StatLabel>Tổng chi tiêu</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Target size={24} />
          </StatIcon>
          <StatValue>{formatCurrency(getAverageDaily())}</StatValue>
          <StatLabel>Trung bình/ngày</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <TrendingUp size={24} />
          </StatIcon>
          <StatValue>{getTopCategory()}</StatValue>
          <StatLabel>Danh mục chi nhiều nhất</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <AlertCircle size={24} />
          </StatIcon>
          <StatValue>{getSpendingTrend()}</StatValue>
          <StatLabel>Xu hướng (7 ngày gần nhất)</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>📊 Phân bổ theo danh mục</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {reportData.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>📈 Chi tiêu theo danh mục</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <FullWidthChart>
        <ChartTitle>📅 Xu hướng chi tiêu theo thời gian</ChartTitle>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={reportData.dailySpending}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#007bff" 
              strokeWidth={2}
              dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
              name="Chi tiêu hàng ngày"
            />
          </LineChart>
        </ResponsiveContainer>
      </FullWidthChart>

      {analysis && (
        <InsightsCard>
          <h3 style={{ color: '#007bff', marginBottom: '1.5rem' }}>🤖 Phân tích AI</h3>
          
          <InsightItem>
            <InsightIcon>
              <TrendingUp size={20} />
            </InsightIcon>
            <InsightText>
              <strong>Xu hướng chi tiêu:</strong> {analysis.spending_pattern || 'Đang phân tích...'}
            </InsightText>
          </InsightItem>

          <InsightItem>
            <InsightIcon>
              <Target size={20} />
            </InsightIcon>
            <InsightText>
              <strong>Dự đoán tuần tới:</strong> {analysis.prediction || 'Đang tính toán...'}
            </InsightText>
          </InsightItem>

          <InsightItem>
            <InsightIcon>
              <DollarSign size={20} />
            </InsightIcon>
            <InsightText>
              <strong>Gợi ý tiết kiệm:</strong> {analysis.savings_tips || 'Đang tạo gợi ý...'}
            </InsightText>
          </InsightItem>
        </InsightsCard>
      )}
    </ReportContainer>
  );
};

export default ReportPage;