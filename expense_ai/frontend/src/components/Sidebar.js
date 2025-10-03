import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart3, Plus, TrendingUp, CreditCard, PiggyBank, Bell, Target, FileText, History, User, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  @media (max-width: 768px) {
    width: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const Logo = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const LogoText = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  ${props => props.$active && `
    background: rgba(255, 255, 255, 0.15);
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #fbbf24;
    }
  `}
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const UserSection = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: rgba(220, 53, 69, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(220, 53, 69, 0.3);
    color: white;
  }
`;

const MobileHeader = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: linear-gradient(90deg, #1e3a8a 0%, #1e40af 100%);
    color: white;
    position: sticky;
    top: 0;
    z-index: 999;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    <>
      <MobileHeader>
        <LogoText>💰 Expense AI</LogoText>
        <MenuButton onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </MenuButton>
      </MobileHeader>
      
      <SidebarContainer className={isMobileOpen ? 'open' : ''}>
        <Logo>
          <LogoText>💰 Expense AI</LogoText>
        </Logo>
        
        <Navigation>
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavItem 
              key={path}
              to={path} 
              $active={location.pathname === path}
              onClick={() => setIsMobileOpen(false)}
            >
              <NavIcon>
                <Icon size={20} />
              </NavIcon>
              {label}
            </NavItem>
          ))}
        </Navigation>
        
        <UserSection>
          <UserInfo>
            <User size={18} />
            {user?.full_name || user?.email}
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={18} />
            Đăng xuất
          </LogoutButton>
        </UserSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;