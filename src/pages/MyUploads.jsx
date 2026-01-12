import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SEOHead } from '@/components/SEOHead';
import { MaterialCard } from '@/components/MaterialCard';
import { getUserUploads } from '@/data/mockData';
import { Upload, FileText, ArrowLeft } from 'lucide-react';

const MyUploads = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!user) return null;

  const materials = getUserUploads(user.id);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title="My Uploads" description="Manage your uploaded materials" />
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:text-[#FA76FF]"><ArrowLeft className="w-4 h-4" />Back to Dashboard</Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div><h1 className="text-3xl md:text-4xl font-medium mb-2">My Uploads</h1><p className="text-gray-500">{materials.length} materials uploaded</p></div>
            <Link to="/upload" className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase text-sm"><Upload className="w-4 h-4" />Upload New</Link>
          </div>
          {materials.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300"><FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" /><p className="text-gray-500 mb-4">No uploads yet</p><Link to="/upload" className="text-[#FA76FF] hover:underline">Upload your first material</Link></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{materials.map((material) => (<MaterialCard key={material.id} material={material} />))}</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyUploads;
