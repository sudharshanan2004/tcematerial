import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SEOHead } from '@/components/SEOHead';
import { MaterialCard } from '@/components/MaterialCard';
import { getSavedMaterials, getUserStats } from '@/data/mockData';
import { Bookmark, Upload, FileText, Eye, Download } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!user) return null;

  const savedMaterials = getSavedMaterials();
  const userStats = getUserStats(user.id);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title="Dashboard" description="Manage your saved materials and uploads" />
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8"><h1 className="text-3xl md:text-4xl font-medium mb-2">Welcome, {user.displayName}!</h1></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="border border-black p-6"><div className="flex items-center gap-4"><div className="p-3 bg-[#FA76FF]"><FileText className="w-6 h-6" /></div><div><p className="text-3xl font-medium">{userStats.totalUploads}</p><p className="text-sm text-gray-500 uppercase">Uploads</p></div></div></div>
            <div className="border border-black p-6"><div className="flex items-center gap-4"><div className="p-3 bg-blue-100"><Eye className="w-6 h-6 text-blue-800" /></div><div><p className="text-3xl font-medium">{userStats.totalViews}</p><p className="text-sm text-gray-500 uppercase">Views</p></div></div></div>
            <div className="border border-black p-6"><div className="flex items-center gap-4"><div className="p-3 bg-green-100"><Download className="w-6 h-6 text-green-800" /></div><div><p className="text-3xl font-medium">{userStats.totalDownloads}</p><p className="text-sm text-gray-500 uppercase">Downloads</p></div></div></div>
          </div>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/upload" className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase text-sm"><Upload className="w-4 h-4" />Upload New</Link>
            <Link to="/my-uploads" className="flex items-center gap-2 px-6 py-3 border border-black font-medium uppercase text-sm"><FileText className="w-4 h-4" />My Uploads</Link>
          </div>
          <div><div className="flex items-center gap-3 mb-6"><Bookmark className="w-6 h-6" /><h2 className="text-2xl font-medium">Saved Materials</h2></div>
            {savedMaterials.length === 0 ? (<div className="text-center py-12 border border-dashed border-gray-300"><p className="text-gray-500">No saved materials yet</p></div>) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{savedMaterials.map((saved) => (<MaterialCard key={saved.id} material={saved.materials} />))}</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
