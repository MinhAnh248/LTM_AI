import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AlertTriangle, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const AlertsContainer = styled.div`
  margin-bottom: 2rem;
`;

const AlertsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AlertsTitle = styled.h3`
  color: #495057;
  margin: 0;
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AlertCard = styled.div`
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid ${props => 
    props.type === 'danger' ? '#dc3545' : 
    props.type === 'warning' ? '#ffc107' : '#28a745'
  };
  background: ${props => 
    props.type === 'danger' ? 'rgba(220, 53, 69, 0.1)' : 
    props.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(40, 167, 69, 0.1)'
  };
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AlertIcon = styled.div`
  color: ${props => 
    props.type === 'danger' ? '#dc3545' : 
    props.type === 'warning' ? '#ffc107' : '#28a745'
  };
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertMessage = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
`;

const AlertDetails = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => 
    props.percentage >= 100 ? '#dc3545' : 
    props.percentage >= 80 ? '#ffc107' : '#28a745'
  };
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.3s ease;
`;

const NoAlertsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #28a745;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(40, 167, 69, 0.2);
`;

const BudgetAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await api.getBudgetAlerts();
      setAlerts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading budget alerts:', error);
      setAlerts([]);
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

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  if (loading) {
    return <div>Đang tải cảnh báo...</div>;
  }

  return (
    <AlertsContainer>
      <AlertsHeader>
        <AlertTriangle size={20} />
        <AlertsTitle>Cảnh báo Ngân sách</AlertsTitle>
      </AlertsHeader>

      {alerts.length === 0 ? (
        <NoAlertsMessage>
          <CheckCircle size={20} />
          Tất cả ngân sách đều trong tầm kiểm soát!
        </NoAlertsMessage>
      ) : (
        <AlertsList>
          {alerts.map((alert, index) => (
            <AlertCard key={index} type={alert.alert_type}>
              <AlertIcon type={alert.alert_type}>
                {getAlertIcon(alert.alert_type)}
              </AlertIcon>
              
              <AlertContent>
                <AlertMessage>{alert.message}</AlertMessage>
                <AlertDetails>
                  Đã chi: {formatCurrency(alert.current_spent)} / {formatCurrency(alert.budget_limit)}
                </AlertDetails>
              </AlertContent>
              
              <ProgressBar>
                <ProgressFill percentage={alert.percentage} />
              </ProgressBar>
            </AlertCard>
          ))}
        </AlertsList>
      )}
    </AlertsContainer>
  );
};

export default BudgetAlerts;