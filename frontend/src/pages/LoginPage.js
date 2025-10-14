import React, { useState } from 'react';
import styled from 'styled-components';
import { User, Lock, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-radius: 10px;
  background: #f8f9fa;
  padding: 4px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #0056b3, #004085);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await api.login(formData.email, formData.password);
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          toast.success('Đăng nhập thành công!');
          onLogin(response.data.user);
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Register
        const response = await api.register(formData);
        if (response.data.success) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          setIsLogin(true);
          setFormData({ email: formData.email, password: '', full_name: '', phone: '' });
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>💰 Expense AI</Title>
        
        <TabContainer>
          <Tab active={isLogin} onClick={() => setIsLogin(true)}>
            Đăng nhập
          </Tab>
          <Tab active={!isLogin} onClick={() => setIsLogin(false)}>
            Đăng ký
          </Tab>
        </TabContainer>

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <InputGroup>
                <InputIcon><User size={20} /></InputIcon>
                <Input
                  type="text"
                  name="full_name"
                  placeholder="Họ và tên"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <InputIcon><Phone size={20} /></InputIcon>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại (tùy chọn)"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </>
          )}

          <InputGroup>
            <InputIcon><Mail size={20} /></InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><Lock size={20} /></InputIcon>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </SubmitButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;