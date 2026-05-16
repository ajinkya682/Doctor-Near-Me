import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const PatientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 flex justify-center">
      <div className="w-full max-w-[480px] bg-white dark:bg-gray-900 min-h-screen shadow-2xl relative flex flex-col">
        <TopBar />
        <main className="flex-grow px-4 pt-4 pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default PatientLayout;
