import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { User, Lock, AtSign, Eye, EyeOff, Phone, X } from 'lucide-react';
import { ArchoraLogo } from '../components/ArchoraLogo';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AdminLoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // New States for Reset Flow
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState('');

  const navigate = useNavigate();
  const { setIsAdminLoggedIn, setCurrentUser } = useAppContext();

  useEffect(() => {
    const savedUsername = localStorage.getItem('archora_remembered_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check for hardcoded admin credentials first
    if (username === 'shaho555' && password === 'Sh@ho_555') {
      setIsAdminLoggedIn(true);
      navigate('/admin');
      return;
    }

    setIsLoading(true);
    try {
      await sleep(600); // Simulate network delay

      // Local storage mock auth
      const storedUsersStr = localStorage.getItem('mock_users') || '[]';
      const storedUsers = JSON.parse(storedUsersStr);
      
      const user = storedUsers.find((u: any) => u.email === username || u.username === username);
      
      if (user && user.password === password) {
        if (rememberMe) {
          localStorage.setItem('archora_remembered_username', username);
        } else {
          localStorage.removeItem('archora_remembered_username');
        }
        
        sessionStorage.setItem('archora_customer_auth', 'true');
        localStorage.setItem('archora_current_user', JSON.stringify(user));
        if (setCurrentUser) setCurrentUser(user);
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await sleep(600); // Simulate network delay

      const storedUsersStr = localStorage.getItem('mock_users') || '[]';
      const storedUsers = JSON.parse(storedUsersStr);

      // Check if email already exists
      if (storedUsers.some((u: any) => u.email === email)) {
        setError('Email already in use');
        return;
      }

      // Add new user
      const newUser = {
        id: 'user_' + Date.now(),
        fullName,
        email,
        phone,
        username: email,
        password, // Storing plaintext for mock purposes ONLY
        role: 'customer',
        createdAt: Date.now(),
        status: 'Active'
      };

      storedUsers.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(storedUsers));

      sessionStorage.setItem('archora_customer_auth', 'true');
      localStorage.setItem('archora_current_user', JSON.stringify(newUser));
      if (setCurrentUser) setCurrentUser(newUser);
      navigate('/');
    } catch (err: any) {
      console.error('Sign-up error:', err);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);
    setResetError('');
    await sleep(800);
    
    const storedStr = localStorage.getItem('mock_users') || '[]';
    const storedUsers = JSON.parse(storedStr);
    const user = storedUsers.find((u: any) => u.email === resetEmail || u.username === resetEmail);
    
    setIsLoading(false);
    
    if (user) {
      setResetStep(2);
    } else {
      setResetError('No account found with this email/phone.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setIsLoading(true);
    await sleep(500);
    setIsLoading(false);
    
    if (resetOtp === '1234') {
      setResetStep(3);
    } else {
      setResetError('Invalid verification code.');
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    await sleep(800);
    
    const storedStr = localStorage.getItem('mock_users') || '[]';
    const storedUsers = JSON.parse(storedStr);
    const userIndex = storedUsers.findIndex((u: any) => u.email === resetEmail || u.username === resetEmail);
    
    if (userIndex !== -1) {
      storedUsers[userIndex].password = newPassword;
      localStorage.setItem('mock_users', JSON.stringify(storedUsers));
      
      // Cleanup & Close
      setResetStep(1);
      setShowForgotModal(false);
      setResetEmail('');
      setResetOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      
      alert('Password successfully reset! You can now log in.');
    } else {
      setResetError('An error occurred. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-[linear-gradient(135deg,#cba24d_0%,#e7cd82_30%,#cda653_60%,#906619_100%)] relative overflow-hidden">
      {/* Texture overlay for the background - fine grain + sparkles */}
      <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: `radial-gradient(circle at 10% 20%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 30% 70%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 70% 90%, rgba(255,255,255,0.9) 1px, transparent 1px)`, backgroundSize: '120px 120px' }}></div>
      {/* Extra ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#fff5d0]/30 rounded-full blur-[120px] mix-blend-overlay pointer-events-none"></div>

      <div className="w-full max-w-[360px] rounded-[24px] p-8 md:p-10 shadow-[0_20px_40px_-5px_rgba(40,20,0,0.6),0_0_20px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.5)] bg-gradient-to-b from-[#e3c786] via-[#cca352] to-[#a37622] relative flex flex-col items-center">
        {/* Subtle scratch texture for card to mimic brushed metal */}
        <div className="absolute inset-0 rounded-[24px] opacity-[0.15] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 6px)` }}></div>
        <div className="absolute inset-0 rounded-[24px] opacity-[0.1] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}></div>

        {/* Avatar Icon (Recessed) */}
        <div className="relative w-[88px] h-[88px] rounded-full bg-gradient-to-b from-[#a37722] to-[#d4af5e] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 flex items-center justify-center mb-8">
          <User className="w-10 h-10 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1} fill="none" />
        </div>

        {/* Title */}
        <h1 className="text-[20px] text-[#5A4210] mb-8 uppercase tracking-[0.1em] font-sans font-normal" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>
          {isSignUp ? 'Create Account' : 'Member Login'}
        </h1>

        {error && <div className="mb-4 text-red-900 bg-red-200/50 px-4 py-2 rounded-md text-xs font-semibold w-full text-center relative z-10">{error}</div>}
        
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="w-full space-y-5 relative z-10">
          {isSignUp && (
            <div className="relative group">
              <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
              </div>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-[56px] pr-6 py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
                placeholder="User Full Name"
                required
              />
            </div>
          )}

          {isSignUp ? (
            <>
              <div className="relative group">
                <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                  <AtSign className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-[56px] pr-6 py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
                  placeholder="Email Address"
                  required
                />
              </div>
              
              <div className="relative group">
                <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                  <Phone className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-[56px] pr-6 py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
                  placeholder="Phone Number"
                  required
                />
              </div>
            </>
          ) : (
            <div className="relative group">
              <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                <AtSign className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-[56px] pr-6 py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
                placeholder="Email Address"
                required
              />
            </div>
          )}

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
              <Lock className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-[56px] pr-[56px] py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
              placeholder="Password"
              required
            />
            <div 
              className="absolute right-[22px] top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-[#5A4210]" strokeWidth={1.5} fill="none" />
              ) : (
                <Eye className="w-5 h-5 text-[#5A4210]" strokeWidth={1.5} fill="none" />
              )}
            </div>
          </div>

          {isSignUp && (
            <div className="relative group">
              <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
              </div>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-[56px] pr-[56px] py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
                placeholder="Confirm Password"
                required
              />
              <div 
                className="absolute right-[22px] top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-[#5A4210]" strokeWidth={1.5} fill="none" />
                ) : (
                  <Eye className="w-5 h-5 text-[#5A4210]" strokeWidth={1.5} fill="none" />
                )}
              </div>
            </div>
          )}

          {/* Options Row (Login Only) */}
          {!isSignUp && (
            <div className="flex justify-between items-center px-2 pt-1 pb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-5 h-5 rounded-full shadow-[inset_2px_3px_5px_rgba(60,30,0,0.9),inset_-1px_-1px_3px_rgba(255,230,150,0.6),0_1px_1px_rgba(255,255,255,0.5)] border border-[#8b651b]/30 flex items-center justify-center bg-gradient-to-b from-[#a37722] to-[#d4af5e]">
                  <div className={`w-2 h-2 rounded-full bg-[#5A4210] shadow-[0_1px_1px_rgba(255,255,255,0.4)] transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
                <span className="text-[#5A4210] text-[13px] font-medium tracking-wide" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>Remember me</span>
                <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              </label>
              <button 
                type="button" 
                onClick={() => {
                  setResetStep(1);
                  setResetEmail('');
                  setResetOtp('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                  setResetError('');
                  setShowForgotModal(true);
                }}
                className="text-[#5A4210] text-[13px] font-medium tracking-wide hover:opacity-80 transition-opacity" 
                style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {isSignUp && (
            <div className="flex justify-center pb-2 pt-1">
              <button type="button" onClick={() => setIsSignUp(false)} className="text-[#5A4210] font-medium text-[13px] px-6 py-2 rounded-full bg-gradient-to-b from-[#a37722] to-[#d4af5e] shadow-[inset_2px_3px_5px_rgba(60,30,0,0.7),inset_-1px_-1px_3px_rgba(255,230,150,0.6),0_1px_1px_rgba(255,255,255,0.5)] border border-[#8b651b]/30 hover:brightness-105 transition-all flex items-center gap-1" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>
                Already a member? <span className="font-bold ml-1">Login</span>
              </button>
            </div>
          )}

          {/* Login/Signup Button */}
          <div className="flex justify-center pb-6 relative z-20">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`${isSignUp ? 'w-[220px]' : 'w-[180px]'} h-[54px] rounded-full bg-[linear-gradient(90deg,#875f15_0%,#e8cc7d_30%,#fdf5ca_50%,#e8cc7d_70%,#875f15_100%)] shadow-[0_15px_25px_-5px_rgba(50,25,0,0.7),inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.97] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="text-[#5A4210] font-bold text-[16px] md:text-[17px] tracking-widest drop-shadow-[0_1px_0px_rgba(255,255,255,0.5)] uppercase">
                {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login')}
              </span>
            </button>
          </div>

          {/* Footer (Login Only) */}
          {!isSignUp && (
            <div className="text-center flex flex-col items-center">
              <span className="text-[#5A4210] text-[13px] mb-2 font-medium" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>Not a member?</span>
              <button type="button" onClick={() => setIsSignUp(true)} className="text-[#5A4210] font-medium text-[13px] px-6 py-[10px] rounded-full bg-gradient-to-b from-[#a37722] to-[#d4af5e] shadow-[inset_2px_3px_5px_rgba(60,30,0,0.7),inset_-1px_-1px_3px_rgba(255,230,150,0.6),0_1px_1px_rgba(255,255,255,0.5)] border border-[#8b651b]/30 hover:brightness-105 transition-all" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>
                Create an account
              </button>
            </div>
          )}
        </form>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 frosted-glass-white-backdrop z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-[400px] rounded-[24px] p-8 shadow-[0_20px_40px_-5px_rgba(40,20,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.5)] bg-gradient-to-b from-[#e3c786] via-[#cca352] to-[#a37622] relative flex flex-col items-center">
            
            <button 
              onClick={() => {
                setShowForgotModal(false);
                setResetStep(1);
                setResetEmail('');
                setResetOtp('');
                setNewPassword('');
                setConfirmNewPassword('');
                setResetError('');
              }}
              className="absolute top-4 right-4 text-[#5A4210] hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-[20px] text-[#5A4210] mb-6 uppercase tracking-[0.1em] font-sans font-normal" style={{ textShadow: '0 1px 1px rgba(255,255,255,0.4)' }}>
              Reset Password
            </h2>
            
            {resetStep === 1 && (
              <form onSubmit={handleForgotPassword} className="w-full space-y-6">
                <p className="text-[#5A4210] text-sm text-center font-medium opacity-80 px-4">
                  Enter your email address to receive a verification code.
                </p>
                
                {resetError && (
                  <p className="text-red-700 bg-red-100/50 p-2 rounded-lg text-sm text-center font-medium">
                    {resetError}
                  </p>
                )}
                
                <div className="relative group">
                  <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                    <AtSign className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
                  </div>
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full pl-[56px] pr-6 py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
                    placeholder="Email Address"
                    required
                  />
                </div>
                
                <div className="flex justify-center pb-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full h-[54px] rounded-full bg-[linear-gradient(90deg,#875f15_0%,#e8cc7d_30%,#fdf5ca_50%,#e8cc7d_70%,#875f15_100%)] shadow-[0_15px_25px_-5px_rgba(50,25,0,0.7),inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.97] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-[#5A4210] font-bold text-sm tracking-widest drop-shadow-[0_1px_0px_rgba(255,255,255,0.5)] uppercase">
                      {isLoading ? 'Sending...' : 'Send Code'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {resetStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
                <p className="text-[#5A4210] text-sm text-center font-medium opacity-80 px-4">
                  We sent a code to <span className="font-bold">{resetEmail}</span>.<br />(Hint: use 1234)
                </p>
                
                {resetError && (
                  <p className="text-red-700 bg-red-100/50 p-2 rounded-lg text-sm text-center font-medium">
                    {resetError}
                  </p>
                )}
                
                <div className="relative group">
                  <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
                  </div>
                  <input 
                    type="text" 
                    value={resetOtp}
                    onChange={e => setResetOtp(e.target.value)}
                    className="w-full pl-[56px] pr-6 py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30 text-center tracking-[0.5em]"
                    placeholder="0000"
                    maxLength={4}
                    required
                  />
                </div>
                
                <div className="flex justify-center pb-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full h-[54px] rounded-full bg-[linear-gradient(90deg,#875f15_0%,#e8cc7d_30%,#fdf5ca_50%,#e8cc7d_70%,#875f15_100%)] shadow-[0_15px_25px_-5px_rgba(50,25,0,0.7),inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.97] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-[#5A4210] font-bold text-sm tracking-widest drop-shadow-[0_1px_0px_rgba(255,255,255,0.5)] uppercase">
                      {isLoading ? 'Verifying...' : 'Verify Code'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {resetStep === 3 && (
              <form onSubmit={handleResetPassword} className="w-full space-y-6">
                <p className="text-[#5A4210] text-sm text-center font-medium opacity-80 px-4">
                  Create a new password for your account.
                </p>
                
                {resetError && (
                  <p className="text-red-700 bg-red-100/50 p-2 rounded-lg text-sm text-center font-medium">
                    {resetError}
                  </p>
                )}
                
                <div className="relative group">
                  <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
                  </div>
                  <input 
                    type={showResetPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-[56px] pr-[56px] py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
                    placeholder="New Password"
                    required
                  />
                  <div 
                    className="absolute right-[22px] top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                  >
                    {showResetPassword ? (
                      <EyeOff className="w-5 h-5 text-[#5A4210]" strokeWidth={1.5} fill="none" />
                    ) : (
                      <Eye className="w-5 h-5 text-[#5A4210]" strokeWidth={1.5} fill="none" />
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute left-[22px] top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-[#5A4210] drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]" strokeWidth={1.5} fill="none" />
                  </div>
                  <input 
                    type={showResetConfirmPassword ? "text" : "password"} 
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-[56px] pr-[56px] py-[16px] rounded-[24px] bg-gradient-to-b from-[#ae8027] to-[#d4b162] shadow-[inset_4px_6px_10px_rgba(60,30,0,0.9),inset_-2px_-2px_6px_rgba(255,230,150,0.6),0_1px_2px_rgba(255,255,255,0.6)] border border-[#8b651b]/30 text-[#5A4210] placeholder-[#5A4210]/60 outline-none text-[16px] font-medium tracking-wide transition-all focus:ring-1 focus:ring-white/30"
                    placeholder="Confirm New Password"
                    required
                  />
                  <div 
                    className="absolute right-[22px] top-1/2 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                    onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                  >
                    {showResetConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-[#5A4210]" strokeWidth={1.5} fill="none" />
                    ) : (
                      <Eye className="w-5 h-5 text-[#5A4210]" strokeWidth={1.5} fill="none" />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center pb-2">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full h-[54px] rounded-full bg-[linear-gradient(90deg,#875f15_0%,#e8cc7d_30%,#fdf5ca_50%,#e8cc7d_70%,#875f15_100%)] shadow-[0_15px_25px_-5px_rgba(50,25,0,0.7),inset_0_2px_3px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.97] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-[#5A4210] font-bold text-sm tracking-widest drop-shadow-[0_1px_0px_rgba(255,255,255,0.5)] uppercase">
                      {isLoading ? 'Saving...' : 'Save Password'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
