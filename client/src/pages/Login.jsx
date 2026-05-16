import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useStore';

const Login = () => {
  const [step, setStep] = useState('PHONE'); // PHONE, OTP, PROFILE
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', dob: '', gender: '' });
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const otpRefs = useRef([]);

  // Timer logic for OTP
  useEffect(() => {
    let interval;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async () => {
    if (phone.length !== 10) return;
    setLoading(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1500));
      toast.success('OTP sent successfully!');
      setStep('OTP');
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (finalOtp) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(r => setTimeout(r, 1500));
      // In real app, check if user is new or existing
      const isNewUser = true; 
      if (isNewUser) {
        setStep('PROFILE');
      } else {
        setAuth({ name: 'Existing User', phone }, 'mock-token', 'patient');
        navigate('/');
      }
    } catch (err) {
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async () => {
    if (!profileData.name) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setAuth({ ...profileData, phone }, 'mock-token', 'patient');
      toast.success('Profile completed!');
      navigate('/');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center">
      <div className="w-full max-w-[480px] h-full min-h-screen relative overflow-hidden flex flex-col">
        
        {/* Top Gradient Header */}
        <div className="h-[40vh] bg-gradient-to-br from-teal-600 to-teal-800 flex flex-col items-center justify-center text-white p-8 relative">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-4 border border-white/30"
           >
              <div className="text-4xl">🏥</div>
           </motion.div>
           <h1 className="text-4xl font-black tracking-tight">ClinicBook</h1>
           <p className="text-teal-50/80 font-medium mt-2">Your health, our priority</p>
           
           {/* Decorative circles */}
           <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
           <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-teal-400/20 rounded-full blur-3xl" />
        </div>

        {/* Form Card */}
        <div className="flex-grow bg-white dark:bg-gray-900 -mt-10 rounded-t-[40px] z-10 p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Phone Entry */}
            {step === 'PHONE' && (
              <motion.div
                key="phone"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Enter your mobile number</h2>
                  <p className="text-gray-500 text-sm mt-1">We'll send an OTP to verify your account</p>
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 dark:border-gray-700 pr-3">
                     <span className="text-lg">🇮🇳</span>
                     <span className="font-bold text-gray-900 dark:text-white">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 pl-24 pr-12 text-lg font-bold tracking-widest outline-none transition-all dark:text-white"
                    placeholder="00000 00000"
                  />
                  {phone.length === 10 && (
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={24} />
                  )}
                </div>

                <button 
                  onClick={handleSendOtp}
                  disabled={phone.length !== 10 || loading}
                  className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl shadow-teal-500/10 transition-all flex items-center justify-center gap-2 ${
                    phone.length === 10 
                    ? 'bg-teal-600 text-white active:scale-95' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Get OTP'}
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  By continuing you agree to our <span className="text-teal-600 font-bold">Terms</span> and <span className="text-teal-600 font-bold">Privacy Policy</span>
                </p>
              </motion.div>
            )}

            {/* Step 2: OTP Entry */}
            {step === 'OTP' && (
              <motion.div
                key="otp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8 text-center"
              >
                <div className="text-left">
                  <button onClick={() => setStep('PHONE')} className="text-teal-600 font-bold flex items-center gap-1 mb-4">
                    <ChevronLeft size={20} /> Change Number
                  </button>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Verify OTP</h2>
                  <p className="text-gray-500 text-sm mt-1">We sent a 6-digit OTP to +91 ******{phone.slice(-4)}</p>
                </div>

                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-12 h-14 bg-gray-50 dark:bg-gray-800 border-b-4 border-gray-200 dark:border-gray-700 focus:border-teal-500 rounded-xl text-center text-xl font-black outline-none transition-all dark:text-white"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-500">
                    {timer > 0 ? (
                      `Resend OTP in 0:${timer.toString().padStart(2, '0')}`
                    ) : (
                      <button onClick={() => { setTimer(45); handleSendOtp(); }} className="text-teal-600 font-bold">Resend OTP</button>
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400">Didn't receive OTP? Check spam folder</p>
                </div>

                {loading && (
                   <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-teal-600" size={32} />
                      <p className="text-sm font-bold text-teal-600">Verifying...</p>
                   </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Profile Completion */}
            {step === 'PROFILE' && (
              <motion.div
                key="profile"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">Step 2 of 2</span>
                   <button onClick={() => navigate('/')} className="text-gray-400 font-bold text-sm">Skip for now</button>
                </div>
                
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Tell us about yourself 👋</h2>
                  <p className="text-gray-500 text-sm mt-1">Complete your profile for a better experience</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={profileData.name}
                      onChange={e => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-teal-500/20 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      value={profileData.email}
                      onChange={e => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-teal-500/20 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-grow space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Date of Birth</label>
                      <input 
                        type="date" 
                        value={profileData.dob}
                        onChange={e => setProfileData({...profileData, dob: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-5 font-bold outline-none focus:ring-2 focus:ring-teal-500/20 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Male', 'Female', 'Other', 'Prefer not'].map(g => (
                         <button
                           key={g}
                           onClick={() => setProfileData({...profileData, gender: g})}
                           className={`py-3 rounded-xl font-bold text-sm transition-all ${
                             profileData.gender === g 
                             ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                             : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100'
                           }`}
                         >
                           {g}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleProfileComplete}
                  disabled={!profileData.name || loading}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 mt-4 ${
                    profileData.name 
                    ? 'bg-teal-600 text-white active:scale-95' 
                    : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Continue'}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
