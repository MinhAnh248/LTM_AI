import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TransactionForm from './pages/TransactionForm';
import IncomePage from './pages/IncomePage';
import DebtPage from './pages/DebtPage';
import SavingsPage from './pages/SavingsPage';
import RemindersPage from './pages/RemindersPage';
import BudgetPage from './pages/BudgetPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import { isWANMode } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  color: #212529;
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  min-height: 100vh;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (isWANMode) {
      // WAN mode: Require login
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } else {
      // LAN mode: Auto login
      if (!token || !userData) {
        const lanUser = { id: 1, email: 'lan@local', full_name: 'LAN User' };
        localStorage.setItem('token', 'lan-mode');
        localStorage.setItem('user', JSON.stringify(lanUser));
        setUser(lanUser);
      } else {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <Router>
      <AppContainer>
        <Sidebar user={user} onLogout={handleLogout} />
        <MainContent>
          <ContentWrapper>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<TransactionForm />} />
              <Route path="/income" element={<IncomePage />} />
              <Route path="/debt" element={<DebtPage />} />
              <Route path="/savings" element={<SavingsPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/reports" element={<ReportPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </ContentWrapper>
        </MainContent>
        <Toaster position="top-right" />
      </AppContainer>
    </Router>
  );
}

export default App;
