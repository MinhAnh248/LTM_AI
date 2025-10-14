import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart3, Plus, Target, FileText, History, User, LogOut, TrendingUp, CreditCard, PiggyBank, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #007bff;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.1);
  padding: 1rem 2rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #007bff;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #007bff;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(45deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #c82333, #a71e2a);
    transform: translateY(-2px);
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 15px;
  text-decoration: none;
  color: ${props => props.$active ? '#fff' : '#007bff'};
  background: ${props => props.$active 
    ? 'linear-gradient(45deg, #007bff, #0056b3)' 
    : 'transparent'};
  border: 2px solid ${props => props.$active ? '#007bff' : 'transparent'};
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(45deg, #0056b3, #004085)' 
      : 'rgba(0, 123, 255, 0.1)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
  }
`;

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/add', label: 'Thêm Chi tiêu', icon: Plus },
    { path: '/income', label: 'Thu nhập', icon: TrendingUp },
    { path: '/debt', label: 'Quản lý Nợ', icon: CreditCard },
    { path: '/savings', label: 'Tiết kiệm', icon: PiggyBank },
    { path: '/reminders', label: 'Lời nhắc', icon: Bell },
    { path: '/budget', label: 'Ngân sách', icon: Target },
    { path: '/reports', label: 'Báo cáo', icon: FileText },
    { path: '/history', label: 'Lịch sử', icon: History },
  ];

  const handleLogout = async () => {
    try {
      await api.logout();
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      onLogout();
    }
  };

  return (
    <Nav>
      <NavContainer>
        <Logo>🤖 AI Expense Manager</Logo>
        <NavLinks>
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink 
              key={path}
              to={path} 
              $active={location.pathname === path}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </NavLinks>
        <UserSection>
          <UserInfo>
            <User size={18} />
            {user?.full_name || user?.email}
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={16} />
            Đăng xuất
          </LogoutButton>
        </UserSection>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;