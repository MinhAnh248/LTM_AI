import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Filter, Calendar, DollarSign, Tag, Trash2, Edit, AlertTriangle, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import EditTransactionModal from '../components/EditTransactionModal';

const HistoryContainer = styled.div`
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

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const HeaderActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.danger {
    background: linear-gradient(45deg, #dc3545, #c82333);
    
    &:hover {
      background: linear-gradient(45deg, #c82333, #a71e2a);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
    }
  }
  
  &.success {
    background: linear-gradient(45deg, #28a745, #1e7e34);
    
    &:hover {
      background: linear-gradient(45deg, #1e7e34, #155724);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const TransactionCount = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  grid-template-columns: 1fr 1fr 1fr auto;
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

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(45deg, #0056b3, #004085);
  }
`;

const TransactionTable = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  border: 2px solid #007bff;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 150px 120px 100px;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  padding: 1rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr 150px 120px 100px;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
  
  &:hover {
    background: rgba(0, 123, 255, 0.05);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const CategoryBadge = styled.span`
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AmountText = styled.span`
  font-weight: bold;
  color: #dc3545;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TableActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &.edit {
    background: #ffc107;
    color: white;
    
    &:hover {
      background: #e0a800;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
    }
  }
  
  &.delete {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
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

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #dc3545;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #dc3545;
`;

const ModalText = styled.p`
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ConfirmInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: #dc3545;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
    
    &:hover {
      background: #5a6268;
    }
  }
  
  &.confirm {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const categories = [
  { value: '', label: 'Tất cả danh mục' },
  { value: 'an uong', label: '🍽️ Ăn uống' },
  { value: 'di lai', label: '🚗 Đi lại' },
  { value: 'hoc tap', label: '📚 Học tập' },
  { value: 'giai tri', label: '🎮 Giải trí' },
  { value: 'hoa don', label: '💡 Hóa đơn' },
  { value: 'khac', label: '📦 Khác' }
];

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const loadTransactions = async () => {
    try {
      const response = await api.getExpenses();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Không thể tải dữ liệu giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Date filters
    if (filters.startDate) {
      filtered = filtered.filter(t => t.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(t => t.date <= filters.endDate);
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCategoryLabel = (value) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedTransaction) => {
    try {
      await api.updateExpense(updatedTransaction.id, {
        date: updatedTransaction.date,
        amount: updatedTransaction.amount,
        description: updatedTransaction.description,
        category: updatedTransaction.category
      });
      
      // Update local state immediately for better UX
      setTransactions(prev => 
        prev.map(t => 
          t.id === updatedTransaction.id 
            ? { ...t, ...updatedTransaction }
            : t
        )
      );
      
      // Also reload to ensure consistency
      loadTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
  };

  const handleDelete = async (transaction) => {
    if (!window.confirm(`Bạn có chắc muốn xóa giao dịch "${transaction.description}"?`)) {
      return;
    }

    try {
      await api.deleteExpense(transaction.id);
      toast.success('✅ Đã xóa giao dịch thành công!');

      // Reload transactions
      loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('❌ Có lỗi xảy ra khi xóa giao dịch');
    }
  };

  const handleClearAll = () => {
    setShowClearModal(true);
    setConfirmText('');
  };

  const confirmClearAll = async () => {
    if (confirmText !== "XOA TAT CA") {
      toast.error('❌ Vui lòng nhập chính xác "XOA TAT CA" để xác nhận');
      return;
    }

    try {
      setLoading(true);
      await api.clearAllExpenses();
      toast.success('✅ Đã xóa tất cả giao dịch thành công!');

      // Close modal and reload
      setShowClearModal(false);
      setConfirmText('');
      loadTransactions();
    } catch (error) {
      console.error('Error clearing all transactions:', error);
      toast.error('❌ Có lỗi xảy ra khi xóa tất cả giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const cancelClearAll = () => {
    setShowClearModal(false);
    setConfirmText('');
  };

  const handleCreateSampleData = async () => {
    if (!window.confirm('Tạo dữ liệu mẫu để test ứng dụng?')) {
      return;
    }

    try {
      setLoading(true);
      await api.createSampleData();
      toast.success('✅ Đã tạo dữ liệu mẫu thành công!');

      // Reload transactions
      loadTransactions();
    } catch (error) {
      console.error('Error creating sample data:', error);
      toast.error('❌ Có lỗi xảy ra khi tạo dữ liệu mẫu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <HistoryContainer>
      <Header>
        <Title>📋 Lịch sử Giao dịch</Title>
        <HeaderActions>
          <TransactionCount>
            <DollarSign size={16} />
            {filteredTransactions.length} giao dịch
          </TransactionCount>

          {transactions.length === 0 && (
            <HeaderActionButton
              className="success"
              onClick={handleCreateSampleData}
              disabled={loading}
              title="Tạo dữ liệu mẫu để test"
            >
              <Plus size={16} />
              {loading ? 'Đang tạo...' : 'Tạo dữ liệu mẫu'}
            </HeaderActionButton>
          )}

          {transactions.length > 0 && (
            <HeaderActionButton
              className="danger"
              onClick={handleClearAll}
              disabled={loading}
              title="Xóa tất cả giao dịch"
            >
              <AlertTriangle size={16} />
              {loading ? 'Đang xóa...' : 'Xóa tất cả'}
            </HeaderActionButton>
          )}
        </HeaderActions>
      </Header>

      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <Label>
              <Search size={16} />
              Tìm kiếm
            </Label>
            <Input
              type="text"
              placeholder="Tìm theo mô tả..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>
              <Tag size={16} />
              Danh mục
            </Label>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>
              <Calendar size={16} />
              Từ ngày - Đến ngày
            </Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </FilterGroup>

          <FilterButton onClick={clearFilters}>
            <Filter size={16} />
            Xóa bộ lọc
          </FilterButton>
        </FilterGrid>
      </FilterSection>

      <TransactionTable>
        <TableHeader>
          <div>Ngày</div>
          <div>Mô tả</div>
          <div>Số tiền</div>
          <div>Danh mục</div>
          <div>Thao tác</div>
        </TableHeader>

        {filteredTransactions.length === 0 ? (
          <EmptyState>
            <p>Không có giao dịch nào phù hợp với bộ lọc</p>
          </EmptyState>
        ) : (
          filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id || transaction.date + transaction.description}>
              <div>{transaction.date}</div>
              <div>{transaction.description}</div>
              <AmountText>{formatCurrency(transaction.amount)}</AmountText>
              <div>
                <CategoryBadge>
                  {getCategoryLabel(transaction.category)}
                </CategoryBadge>
              </div>
              <ActionButtons>
                <TableActionButton
                  className="edit"
                  onClick={() => handleEdit(transaction)}
                  title={`Chỉnh sửa giao dịch: ${transaction.description}`}
                >
                  <Edit size={14} />
                </TableActionButton>
                <TableActionButton
                  className="delete"
                  onClick={() => handleDelete(transaction)}
                  title={`Xóa giao dịch: ${transaction.description}`}
                >
                  <Trash2 size={14} />
                </TableActionButton>
              </ActionButtons>
            </TableRow>
          ))
        )}
      </TransactionTable>

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && cancelClearAll()}>
          <ModalContent>
            <ModalHeader>
              <AlertTriangle size={24} />
              <ModalTitle>Xác nhận xóa tất cả</ModalTitle>
            </ModalHeader>

            <ModalText>
              <strong>⚠️ CẢNH BÁO:</strong> Bạn sắp xóa <strong>{transactions.length} giao dịch</strong>.
              <br /><br />
              Hành động này <strong>KHÔNG THỂ HOÀN TÁC</strong>!
              <br /><br />
              Để xác nhận, vui lòng nhập chính xác: <strong>"XOA TAT CA"</strong>
            </ModalText>

            <ConfirmInput
              type="text"
              placeholder='Nhập "XOA TAT CA" để xác nhận'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoFocus
            />

            <ModalActions>
              <ModalButton className="cancel" onClick={cancelClearAll}>
                Hủy bỏ
              </ModalButton>
              <ModalButton
                className="confirm"
                onClick={confirmClearAll}
                disabled={confirmText !== "XOA TAT CA" || loading}
              >
                {loading ? 'Đang xóa...' : 'Xóa tất cả'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        transaction={editingTransaction}
        onSave={handleSaveEdit}
      />
    </HistoryContainer>
  );
};

export default HistoryPage;