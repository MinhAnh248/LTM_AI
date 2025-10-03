import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const NotificationContainer = styled.div`
  margin-bottom: 2rem;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const NotificationTitle = styled.h3`
  color: #495057;
  margin: 0;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NotificationCard = styled.div`
  padding: 1rem;
  border-radius: 10px;
  border-left: 4px solid ${props => 
    props.isOverdue ? '#dc3545' : 
    props.isDueToday ? '#ffc107' : '#007bff'
  };
  background: ${props => 
    props.isOverdue ? 'rgba(220, 53, 69, 0.1)' : 
    props.isDueToday ? 'rgba(255, 193, 7, 0.1)' : 'rgba(0, 123, 255, 0.1)'
  };
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationIcon = styled.div`
  color: ${props => 
    props.isOverdue ? '#dc3545' : 
    props.isDueToday ? '#ffc107' : '#007bff'
  };
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationMessage = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.25rem;
`;

const NotificationDetails = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const NotificationActions = styled.div`
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
  
  &.complete {
    background: #28a745;
    color: white;
  }
  
  &.dismiss {
    background: #6c757d;
    color: white;
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const NoNotifications = styled.div`
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

const ReminderNotifications = () => {
  const [dueReminders, setDueReminders] = useState([]);
  const [dismissedReminders, setDismissedReminders] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDueReminders();
  }, []);

  const loadDueReminders = async () => {
    try {
      const response = await api.getDueReminders();
      setDueReminders(response.data);
    } catch (error) {
      console.error('Error loading due reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReminder = async (reminder) => {
    try {
      const response = await api.completeReminder(reminder.id);
      if (response.data.success) {
        toast.success('✅ Đã đánh dấu hoàn thành!');
        loadDueReminders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra');
    }
  };

  const handleDismissReminder = (reminderId) => {
    setDismissedReminders(prev => new Set([...prev, reminderId]));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
  };

  const isDueToday = (dueDate) => {
    const today = new Date().toDateString();
    return new Date(dueDate).toDateString() === today;
  };

  const getNotificationIcon = (reminder) => {
    if (isOverdue(reminder.due_date)) {
      return <AlertTriangle size={20} />;
    } else if (isDueToday(reminder.due_date)) {
      return <Clock size={20} />;
    } else {
      return <Bell size={20} />;
    }
  };

  const getNotificationMessage = (reminder) => {
    const dueDate = new Date(reminder.due_date).toLocaleDateString('vi-VN');
    
    if (isOverdue(reminder.due_date)) {
      return `⚠️ Quá hạn: ${reminder.title}`;
    } else if (isDueToday(reminder.due_date)) {
      return `🔔 Hôm nay: ${reminder.title}`;
    } else {
      return `📅 Sắp tới: ${reminder.title}`;
    }
  };

  const getNotificationDetails = (reminder) => {
    const dueDate = new Date(reminder.due_date).toLocaleDateString('vi-VN');
    const amountText = reminder.amount ? ` - ${formatCurrency(reminder.amount)}` : '';
    return `${dueDate}${amountText}`;
  };

  if (loading) {
    return <div>Đang tải thông báo...</div>;
  }

  const visibleReminders = dueReminders.filter(reminder => 
    !dismissedReminders.has(reminder.id)
  );

  return (
    <NotificationContainer>
      <NotificationHeader>
        <Bell size={20} />
        <NotificationTitle>Lời nhắc sắp đến hạn</NotificationTitle>
      </NotificationHeader>

      {visibleReminders.length === 0 ? (
        <NoNotifications>
          <CheckCircle size={20} />
          Không có lời nhắc nào sắp đến hạn!
        </NoNotifications>
      ) : (
        <NotificationList>
          {visibleReminders.map((reminder) => {
            const overdue = isOverdue(reminder.due_date);
            const dueToday = isDueToday(reminder.due_date);

            return (
              <NotificationCard 
                key={reminder.id} 
                isOverdue={overdue}
                isDueToday={dueToday}
              >
                <NotificationIcon isOverdue={overdue} isDueToday={dueToday}>
                  {getNotificationIcon(reminder)}
                </NotificationIcon>
                
                <NotificationContent>
                  <NotificationMessage>
                    {getNotificationMessage(reminder)}
                  </NotificationMessage>
                  <NotificationDetails>
                    {getNotificationDetails(reminder)}
                    {reminder.description && ` - ${reminder.description}`}
                  </NotificationDetails>
                </NotificationContent>
                
                <NotificationActions>
                  <ActionButton 
                    className="complete"
                    onClick={() => handleCompleteReminder(reminder)}
                    title="Đánh dấu hoàn thành"
                  >
                    <CheckCircle size={16} />
                  </ActionButton>
                  <ActionButton 
                    className="dismiss"
                    onClick={() => handleDismissReminder(reminder.id)}
                    title="Ẩn thông báo"
                  >
                    <X size={16} />
                  </ActionButton>
                </NotificationActions>
              </NotificationCard>
            );
          })}
        </NotificationList>
      )}
    </NotificationContainer>
  );
};

export default ReminderNotifications;