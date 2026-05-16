import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Hospital } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useStore';

const ClinicLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setAuth({ name: 'Clinic Owner', email: 'owner@test.com' }, 'mock-token', 'owner');
      toast.success('Welcome back!');
      navigate('/clinic/dashboard');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-teal-500/20">
             <Hospital className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Business Portal</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage your clinic with ease</p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-2xl shadow-black/5 dark:shadow-none border border-gray-100 dark:border-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="name@clinic.com"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 pl-12 pr-6 font-bold outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" size={14} className="text-xs font-bold text-teal-600 hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 pl-12 pr-6 font-bold outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Log In <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 text-center">
             <p className="text-gray-500 dark:text-gray-400 font-medium">
                New to ClinicBook? <Link to="/clinic/register" className="text-teal-600 font-bold">Register Clinic</Link>
             </p>
          </div>
        </motion.div>

        {/* Back to Patient App */}
        <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-gray-500 font-bold text-sm hover:text-teal-600 transition-colors">
           Are you a patient? Login here
        </Link>
      </div>
    </div>
  );
};

export default ClinicLogin;
