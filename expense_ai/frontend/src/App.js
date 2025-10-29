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
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <Dashboard />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <TransactionForm />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
        <Route path="/income" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <IncomePage />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
        <Route path="/debt" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <DebtPage />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
        <Route path="/savings" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <SavingsPage />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
        <Route path="/reminders" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <RemindersPage />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
        <Route path="/budget" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <BudgetPage />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <ReportPage />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <AppContainer>
              <Sidebar user={user} onLogout={handleLogout} />
              <MainContent>
                <ContentWrapper>
                  <HistoryPage />
                </ContentWrapper>
              </MainContent>
            </AppContainer>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
