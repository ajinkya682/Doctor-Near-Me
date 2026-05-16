import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, BarChart3, ArrowRight, Loader2, Upload, X, MailOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ClinicRegister = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const features = [
    { title: 'Reach More Patients', desc: 'Get discovered by thousands of patients in your local area.', icon: Users },
    { title: 'Smart Scheduling', desc: 'Reduce no-shows with automated WhatsApp/SMS reminders.', icon: ShieldCheck },
    { title: 'Detailed Analytics', desc: 'Track your clinic growth with real-time appointment data.', icon: BarChart3 }
  ];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    setLoading(true);
    try {
      // Create actual FormData for files
      const finalData = new FormData();
      Object.keys(data).forEach(key => finalData.append(key, data[key]));
      files.forEach(file => finalData.append('documents', file));

      await api.post('/auth/clinic/register', finalData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[40px] p-10 text-center shadow-2xl"
        >
          <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
             <MailOpen className="text-teal-600" size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Registration Successful!</h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            We have sent a verification link to your email. Please verify your email to proceed with setting up your clinic.
          </p>
          <button 
            onClick={() => navigate('/clinic/login')}
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-teal-500/20"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col md:flex-row">
      {/* Left: Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-600 p-16 flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10">
          <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 mb-12">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">🏥</div>
             ClinicBook
          </Link>
          <h1 className="text-5xl font-black leading-tight mb-8">Partner with us <br /><span className="text-teal-200">Grow your practice.</span></h1>
          <div className="space-y-8">
            {features.map((f, i) => (
              <motion.div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0"><f.icon size={24} /></div>
                <div><h3 className="font-bold text-xl">{f.title}</h3><p className="text-teal-50 opacity-80">{f.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Right: Detailed Form */}
      <div className="flex-grow flex items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Clinic Registration</h2>
            <p className="text-gray-500 mt-2">Join our network of elite medical professionals.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                <input name="fullName" required type="text" placeholder="Dr. Jane Smith" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Work Email</label>
                <input name="email" required type="email" placeholder="jane@clinic.com" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                <input name="phone" required type="tel" placeholder="+91 00000 00000" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                <input name="password" required type="password" placeholder="••••••••" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
                <input name="confirmPassword" required type="password" placeholder="••••••••" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all dark:text-white" />
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Supporting Documents (Medical License, Registration Certificate)</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-teal-500 hover:bg-teal-50/30 dark:hover:bg-teal-900/10 cursor-pointer transition-all"
              >
                <Upload className="text-gray-400" size={32} />
                <p className="text-sm font-bold text-gray-500">Tap to upload files</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate max-w-[150px]">{file.name}</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-red-500 hover:bg-red-50 p-1 rounded-lg"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 py-2">
               <input type="checkbox" required className="mt-1 w-4 h-4 accent-teal-600 rounded" />
               <p className="text-xs text-gray-500 dark:text-gray-400">I agree to the <span className="text-teal-600 font-bold underline">Terms for Clinic Partners</span>.</p>
            </div>

            <button disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 font-medium pb-10">
            Already have an account? <Link to="/clinic/login" className="text-teal-600 font-bold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicRegister;
