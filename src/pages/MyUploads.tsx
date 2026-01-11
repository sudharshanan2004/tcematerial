import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { MaterialCard } from '@/components/MaterialCard';
import { User } from '@supabase/supabase-js';
import { Upload, FileText, Trash2, ArrowLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Material {
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
}

const MyUploads = () => {
  const [user, setUser] = useState<User | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      fetchMaterials();
    }
  }, [user]);

  const fetchMaterials = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('materials')
      .select(`
        id, title, description, subject, material_type, file_url,
        download_count, view_count, semester, year, created_at,
        categories (name, slug)
      `)
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMaterials(data);
    }
    setLoading(false);
  };

  const handleDelete = async (materialId: string, fileUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/materials/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('materials').remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;

      setMaterials(materials.filter(m => m.id !== materialId));
      toast({
        title: 'Deleted',
        description: 'Material has been deleted successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="My Uploads"
        description="Manage your uploaded study materials"
        keywords="my uploads, manage materials"
      />
      
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:text-[#FA76FF] transition-colors animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div>
              <h1 className="text-3xl md:text-4xl font-medium mb-2">My Uploads</h1>
              <p className="text-gray-500">
                {materials.length} material{materials.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
            <Link
              to="/upload"
              className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase text-sm hover:bg-[#1A1A1A] transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload New
            </Link>
          </div>

          {/* Materials Grid */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : materials.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">You haven't uploaded any materials yet</p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#FA76FF] hover:underline"
              >
                <Upload className="w-4 h-4" />
                Upload your first material
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material, index) => (
                <div 
                  key={material.id}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${0.3 + (index * 0.05)}s`, animationFillMode: 'both' }}
                >
                  <MaterialCard material={material} />
                  
                  {/* Delete Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="absolute top-4 right-4 p-2 bg-white border border-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-500"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Material</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{material.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(material.id, material.file_url)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyUploads;