import { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 30px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${props => props.active ? 'linear-gradient(45deg, #667eea, #764ba2)' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 15px;
  border: none;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OTPContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  text-align: center;
`;

const OTPTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const OTPInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #667eea;
  border-radius: 10px;
  font-size: 24px;
  text-align: center;
  letter-spacing: 10px;
  margin: 15px 0;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 10px;
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        toast.error('Đăng nhập thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi kết nối!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.requires_otp) {
        setShowOTP(true);
        // Hiển thị OTP demo
        if (data.otp_demo) {
          toast.success(`OTP của bạn: ${data.otp_demo}`, { duration: 10000 });
        } else {
          toast.success('OTP đã được gửi đến email của bạn!');
        }
      } else if (data.success) {
        toast.success('Đăng ký thành công!');
        setIsLogin(true);
      } else {
        toast.error(data.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      toast.error('Lỗi kết nối!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Xác thực thành công!');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'OTP không đúng!');
      }
    } catch (error) {
      toast.error('Lỗi kết nối!');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('OTP mới đã được gửi!');
      }
    } catch (error) {
      toast.error('Lỗi khi gửi OTP!');
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Title>💰 Expense AI</Title>
        <Subtitle>Quản lý chi tiêu thông minh</Subtitle>

        {!showOTP ? (
          <>
            <TabContainer>
              <Tab active={isLogin} onClick={() => setIsLogin(true)}>
                Đăng nhập
              </Tab>
              <Tab active={!isLogin} onClick={() => setIsLogin(false)}>
                Đăng ký
              </Tab>
            </TabContainer>

            <Form onSubmit={isLogin ? handleLogin : handleRegister}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
              </Button>
            </Form>
          </>
        ) : (
          <OTPContainer>
            <OTPTitle>🔐 Xác thực OTP</OTPTitle>
            <p>Nhập mã OTP đã được gửi đến {email}</p>
            <OTPInput
              type="text"
              maxLength="6"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOTP(e.target.value.replace(/\D/g, ''))}
            />
            <Button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>
            <ResendButton onClick={handleResendOTP}>
              Gửi lại OTP
            </ResendButton>
          </OTPContainer>
        )}
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;
