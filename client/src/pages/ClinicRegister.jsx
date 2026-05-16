import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Users, BarChart3, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClinicRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const features = [
    { title: 'Reach More Patients', desc: 'Get discovered by thousands of patients in your local area.', icon: Users },
    { title: 'Smart Scheduling', desc: 'Reduce no-shows with automated WhatsApp/SMS reminders.', icon: ShieldCheck },
    { title: 'Detailed Analytics', desc: 'Track your clinic growth with real-time appointment data.', icon: BarChart3 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Registration successful! Please verify your email.');
      navigate('/clinic/login');
    } catch (err) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col md:flex-row">
      {/* Left Column: Marketing (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-teal-600 p-16 flex-col justify-between text-white relative overflow-hidden">
        <div className="z-10">
          <Link to="/" className="text-3xl font-black tracking-tighter flex items-center gap-2 mb-12">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">🏥</div>
             ClinicBook
          </Link>
          
          <h1 className="text-5xl font-black leading-tight mb-8">
            Grow your medical practice <br />
            <span className="text-teal-200">with ClinicBook.</span>
          </h1>

          <div className="space-y-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <f.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{f.title}</h3>
                  <p className="text-teal-50 opacity-80">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="z-10 border-t border-white/10 pt-8 flex items-center gap-4">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-teal-600" alt="user" />
              ))}
           </div>
           <p className="text-sm font-medium text-teal-50">Joined by 500+ clinics this month</p>
        </div>

        {/* Decorative background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Right Column: Form */}
      <div className="flex-grow flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden text-center mb-8">
             <h1 className="text-3xl font-black text-teal-600">ClinicBook</h1>
             <p className="text-gray-500 font-medium">Business Portal</p>
          </div>

          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Create Business Account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign up your clinic and start accepting bookings today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <input 
                required
                type="text" 
                placeholder="Dr. John Doe"
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <input 
                required
                type="email" 
                placeholder="john@clinic.com"
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl py-4 px-6 font-bold outline-none transition-all dark:text-white"
              />
            </div>

            <div className="flex items-start gap-3 py-2">
               <input type="checkbox" required className="mt-1 w-4 h-4 accent-teal-600 rounded" />
               <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                 I agree to the <span className="text-teal-600 font-bold">Terms of Service</span> and <span className="text-teal-600 font-bold">Privacy Policy</span>.
               </p>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Sign Up Now <ArrowRight size={20} /></>}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 font-medium">
            Already have an account? <Link to="/clinic/login" className="text-teal-600 font-bold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicRegister;
