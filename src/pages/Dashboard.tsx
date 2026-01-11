import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { MaterialCard } from '@/components/MaterialCard';
import { User } from '@supabase/supabase-js';
import { Bookmark, Upload, FileText, Eye, Download } from 'lucide-react';

interface SavedMaterial {
  id: string;
  saved_at: string;
  materials: {
    id: string;
    title: string;
    description: string | null;
    subject: string | null;
    material_type: string;
    file_url: string;
    download_count: number;
    view_count: number;
    semester: number | null;
    year: number | null;
    created_at: string;
    categories: {
      name: string;
      slug: string;
    } | null;
  };
}

interface UserStats {
  totalUploads: number;
  totalViews: number;
  totalDownloads: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [savedMaterials, setSavedMaterials] = useState<SavedMaterial[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({ totalUploads: 0, totalViews: 0, totalDownloads: 0 });
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch saved materials
    const { data: savedData } = await supabase
      .from('saved_materials')
      .select(`
        id,
        saved_at,
        materials (
          id, title, description, subject, material_type, file_url,
          download_count, view_count, semester, year, created_at,
          categories (name, slug)
        )
      `)
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (savedData) {
      setSavedMaterials(savedData as SavedMaterial[]);
    }

    // Fetch user's upload stats
    const { data: uploadsData } = await supabase
      .from('materials')
      .select('id, view_count, download_count')
      .eq('uploaded_by', user.id);

    if (uploadsData) {
      setUserStats({
        totalUploads: uploadsData.length,
        totalViews: uploadsData.reduce((sum, m) => sum + m.view_count, 0),
        totalDownloads: uploadsData.reduce((sum, m) => sum + m.download_count, 0)
      });
    }

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single();

    if (profileData?.display_name) {
      setDisplayName(profileData.display_name);
    }

    setLoading(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Dashboard"
        description="Manage your saved materials and uploads"
        keywords="dashboard, saved materials, my uploads"
      />
      
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <h1 className="text-3xl md:text-4xl font-medium mb-2">
              Welcome{displayName ? `, ${displayName}` : ''}!
            </h1>
            <p className="text-gray-500">
              Manage your saved materials and track your contributions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="border border-black p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#FA76FF]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-medium">{userStats.totalUploads}</p>
                  <p className="text-sm text-gray-500 uppercase">Uploads</p>
                </div>
              </div>
            </div>
            <div className="border border-black p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100">
                  <Eye className="w-6 h-6 text-blue-800" />
                </div>
                <div>
                  <p className="text-3xl font-medium">{userStats.totalViews}</p>
                  <p className="text-sm text-gray-500 uppercase">Total Views</p>
                </div>
              </div>
            </div>
            <div className="border border-black p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100">
                  <Download className="w-6 h-6 text-green-800" />
                </div>
                <div>
                  <p className="text-3xl font-medium">{userStats.totalDownloads}</p>
                  <p className="text-sm text-gray-500 uppercase">Downloads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Link
              to="/upload"
              className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase text-sm hover:bg-[#1A1A1A] transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload New Material
            </Link>
            <Link
              to="/my-uploads"
              className="flex items-center gap-2 px-6 py-3 border border-black font-medium uppercase text-sm hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View My Uploads
            </Link>
          </div>

          {/* Saved Materials */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <div className="flex items-center gap-3 mb-6">
              <Bookmark className="w-6 h-6" />
              <h2 className="text-2xl font-medium">Saved Materials</h2>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : savedMaterials.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-300">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">No saved materials yet</p>
                <Link
                  to="/browse"
                  className="text-sm font-medium text-[#FA76FF] hover:underline"
                >
                  Browse materials to save
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedMaterials.map((saved, index) => (
                  <div 
                    key={saved.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.5 + (index * 0.05)}s`, animationFillMode: 'both' }}
                  >
                    <MaterialCard material={saved.materials} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;