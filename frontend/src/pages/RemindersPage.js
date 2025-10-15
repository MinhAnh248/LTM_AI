import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Bell, Plus, Calendar, DollarSign, Repeat, Trash2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const RemindersContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #007bff;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(45deg, #0056b3, #004085);
    transform: translateY(-2px);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
  text-align: center;
`;

const SummaryValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.color || '#007bff'};
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const RemindersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ReminderCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid ${props => 
    props.isOverdue ? '#dc3545' : 
    props.isDueToday ? '#ffc107' : '#e9ecef'
  };
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ReminderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReminderTitle = styled.h3`
  color: #495057;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReminderActions = styled.div`
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
  
  &.delete {
    background: #dc3545;
    color: white;
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const ReminderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const ReminderLabel = styled.span`
  color: #6c757d;
`;

const ReminderValue = styled.span`
  font-weight: 600;
  color: ${props => props.color || '#495057'};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => 
    props.status === 'overdue' ? '#dc3545' : 
    props.status === 'due_today' ? '#ffc107' : 
    props.status === 'upcoming' ? '#007bff' : '#28a745'
  };
  color: white;
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
    border-color: #007bff;
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
    border-color: #007bff;
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
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

const reminderTypes = [
  { value: 'bill', label: '💡 Hóa đơn' },
  { value: 'debt', label: '💳 Trả nợ' },
  { value: 'subscription', label: '📱 Đăng ký' },
  { value: 'insurance', label: '🛡️ Bảo hiểm' },
  { value: 'tax', label: '📋 Thuế' },
  { value: 'other', label: '📝 Khác' }
];

const repeatTypes = [
  { value: 'none', label: 'Không lặp lại' },
  { value: 'days', label: 'Hàng ngày' },
  { value: 'weeks', label: 'Hàng tuần' },
  { value: 'months', label: 'Hàng tháng' }
];

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    reminder_type: 'bill',
    amount: '',
    due_date: '',
    repeat_type: 'none',
    repeat_interval: '1',
    description: ''
  });

  useEffect(() => {
    loadRemindersData();
  }, []);

  const loadRemindersData = async () => {
    try {
      const [remindersRes, summaryRes] = await Promise.all([
        api.getReminders(),
        api.getReminderSummary()
      ]);

      setReminders(Array.isArray(remindersRes.data) ? remindersRes.data : []);
      setSummary(summaryRes.data || {});
    } catch (error) {
      console.error('Error loading reminders data:', error);
      toast.error('Không thể tải dữ liệu lời nhắc');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.addReminder(formData);
      if (response.data.success) {
        toast.success('✅ Đã thêm lời nhắc thành công!');
        setShowAddModal(false);
        setFormData({
          title: '',
          reminder_type: 'bill',
          amount: '',
          due_date: '',
          repeat_type: 'none',
          repeat_interval: '1',
          description: ''
        });
        loadRemindersData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi thêm lời nhắc');
    }
  };

  const handleCompleteReminder = async (reminder) => {
    try {
      const response = await api.completeReminder(reminder.id);
      if (response.data.success) {
        toast.success('✅ Đã đánh dấu hoàn thành!');
        loadRemindersData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra');
    }
  };

  const handleDeleteReminder = async (reminder) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lời nhắc "${reminder.title}"?`)) {
      return;
    }

    try {
      const response = await api.deleteReminder(reminder.id);
      if (response.data.success) {
        toast.success('✅ Đã xóa lời nhắc');
        loadRemindersData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('❌ Có lỗi xảy ra khi xóa lời nhắc');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getReminderTypeLabel = (value) => {
    const type = reminderTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getRepeatTypeLabel = (value) => {
    const type = repeatTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getReminderStatus = (reminder) => {
    const dueDate = new Date(reminder.due_date);
    const today = new Date();
    
    if (dueDate < today.setHours(0, 0, 0, 0)) {
      return 'overdue';
    } else if (dueDate.toDateString() === new Date().toDateString()) {
      return 'due_today';
    } else {
      return 'upcoming';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'overdue': return 'Quá hạn';
      case 'due_today': return 'Hôm nay';
      case 'upcoming': return 'Sắp tới';
      default: return 'Hoàn thành';
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <RemindersContainer>
      <Header>
        <Title>🔔 Lời nhắc Thanh toán</Title>
        <AddButton onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Thêm Lời nhắc
        </AddButton>
      </Header>

      <SummaryGrid>
        <SummaryCard>
          <SummaryValue>{summary.active_reminders || 0}</SummaryValue>
          <SummaryLabel>Tổng lời nhắc</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue color="#dc3545">{summary.overdue || 0}</SummaryValue>
          <SummaryLabel>Quá hạn</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue color="#ffc107">{summary.due_today || 0}</SummaryValue>
          <SummaryLabel>Hôm nay</SummaryLabel>
        </SummaryCard>
        <SummaryCard>
          <SummaryValue color="#007bff">{summary.due_this_week || 0}</SummaryValue>
          <SummaryLabel>Tuần này</SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <RemindersGrid>
        {reminders.map(reminder => {
          const status = getReminderStatus(reminder);
          const isOverdue = status === 'overdue';
          const isDueToday = status === 'due_today';

          return (
            <ReminderCard key={reminder.id} isOverdue={isOverdue} isDueToday={isDueToday}>
              <ReminderHeader>
                <ReminderTitle>
                  <Bell size={20} />
                  {reminder.title}
                </ReminderTitle>
                <ReminderActions>
                  <ActionButton 
                    className="complete"
                    onClick={() => handleCompleteReminder(reminder)}
                  >
                    <CheckCircle size={16} />
                  </ActionButton>
                  <ActionButton 
                    className="delete"
                    onClick={() => handleDeleteReminder(reminder)}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </ReminderActions>
              </ReminderHeader>

              <ReminderInfo>
                <ReminderLabel>Loại:</ReminderLabel>
                <ReminderValue>{getReminderTypeLabel(reminder.reminder_type)}</ReminderValue>
              </ReminderInfo>

              {reminder.amount && (
                <ReminderInfo>
                  <ReminderLabel>Số tiền:</ReminderLabel>
                  <ReminderValue color="#dc3545">{formatCurrency(reminder.amount)}</ReminderValue>
                </ReminderInfo>
              )}

              <ReminderInfo>
                <ReminderLabel>Hạn:</ReminderLabel>
                <ReminderValue color={isOverdue ? '#dc3545' : '#495057'}>
                  {new Date(reminder.due_date).toLocaleDateString('vi-VN')}
                </ReminderValue>
              </ReminderInfo>

              {reminder.repeat_type !== 'none' && (
                <ReminderInfo>
                  <ReminderLabel>Lặp lại:</ReminderLabel>
                  <ReminderValue>
                    {getRepeatTypeLabel(reminder.repeat_type)}
                    {reminder.repeat_interval > 1 && ` (${reminder.repeat_interval})`}
                  </ReminderValue>
                </ReminderInfo>
              )}

              <ReminderInfo>
                <ReminderLabel>Trạng thái:</ReminderLabel>
                <StatusBadge status={status}>
                  {getStatusLabel(status)}
                </StatusBadge>
              </ReminderInfo>

              {reminder.description && (
                <ReminderInfo style={{marginTop: '0.5rem'}}>
                  <ReminderValue style={{fontSize: '0.9rem', color: '#6c757d'}}>
                    {reminder.description}
                  </ReminderValue>
                </ReminderInfo>
              )}
            </ReminderCard>
          );
        })}
      </RemindersGrid>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <ModalContent>
            <ModalTitle>Thêm Lời nhắc Mới</ModalTitle>
            <Form onSubmit={handleAddReminder}>
              <FormGroup>
                <Label>Tiêu đề</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Loại lời nhắc</Label>
                <Select
                  value={formData.reminder_type}
                  onChange={(e) => setFormData({...formData, reminder_type: e.target.value})}
                >
                  {reminderTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Số tiền (VNĐ) - Tùy chọn</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </FormGroup>

              <FormGroup>
                <Label>Ngày đến hạn</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Lặp lại</Label>
                <Select
                  value={formData.repeat_type}
                  onChange={(e) => setFormData({...formData, repeat_type: e.target.value})}
                >
                  {repeatTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </Select>
              </FormGroup>

              {formData.repeat_type !== 'none' && (
                <FormGroup>
                  <Label>Khoảng cách lặp lại</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.repeat_interval}
                    onChange={(e) => setFormData({...formData, repeat_interval: e.target.value})}
                  />
                </FormGroup>
              )}

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
                  Thêm Lời nhắc
                </ModalButton>
              </ModalActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </RemindersContainer>
  );
};

export default RemindersPage;