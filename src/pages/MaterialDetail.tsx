import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { PDFViewer } from '@/components/PDFViewer';
import { format } from 'date-fns';
import { 
  FileText, Download, Eye, Calendar, BookOpen, 
  Bookmark, BookmarkCheck, ArrowLeft, Share2, User 
} from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface Material {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  material_type: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  download_count: number;
  view_count: number;
  semester: number | null;
  year: number | null;
  college: string | null;
  created_at: string;
  uploaded_by: string;
  categories: {
    name: string;
    slug: string;
  } | null;
}

interface UploaderProfile {
  display_name: string | null;
}

const MaterialDetail = () => {
  const { id } = useParams();
  const [material, setMaterial] = useState<Material | null>(null);
  const [uploaderProfile, setUploaderProfile] = useState<UploaderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (id) {
      fetchMaterial();
      incrementViewCount();
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      checkIfSaved();
    }
  }, [user, id]);

  const fetchMaterial = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select(`
        *,
        categories (name, slug)
      `)
      .eq('id', id)
      .single();

    if (!error && data) {
      setMaterial(data);
      // Fetch uploader profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', data.uploaded_by)
        .single();
      
      setUploaderProfile(profileData);
    }
    setLoading(false);
  };

  const incrementViewCount = async () => {
    // Increment view count directly
    const { data: currentMaterial } = await supabase
      .from('materials')
      .select('view_count')
      .eq('id', id)
      .single();
    
    if (currentMaterial) {
      await supabase
        .from('materials')
        .update({ view_count: currentMaterial.view_count + 1 })
        .eq('id', id);
    }
  };

  const checkIfSaved = async () => {
    const { data } = await supabase
      .from('saved_materials')
      .select('id')
      .eq('user_id', user!.id)
      .eq('material_id', id)
      .single();
    
    setIsSaved(!!data);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save materials',
        variant: 'destructive'
      });
      return;
    }

    if (isSaved) {
      const { error } = await supabase
        .from('saved_materials')
        .delete()
        .eq('user_id', user.id)
        .eq('material_id', id);

      if (!error) {
        setIsSaved(false);
        toast({
          title: 'Removed from saved',
          description: 'Material removed from your dashboard'
        });
      }
    } else {
      const { error } = await supabase
        .from('saved_materials')
        .insert({ user_id: user.id, material_id: id });

      if (!error) {
        setIsSaved(true);
        toast({
          title: 'Saved!',
          description: 'Material added to your dashboard'
        });
      }
    }
  };

  const handleDownload = async () => {
    if (!material) return;

    // Increment download count
    await supabase
      .from('materials')
      .update({ download_count: material.download_count + 1 })
      .eq('id', id);

    // Open file in new tab for download
    window.open(material.file_url, '_blank');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: material?.title,
        text: material?.description || 'Check out this study material',
        url: window.location.href
      });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Share link has been copied to clipboard'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">Loading...</div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-medium mb-4">Material not found</h1>
          <Link to="/browse" className="text-[#FA76FF] hover:underline">
            Browse all materials
          </Link>
        </div>
      </div>
    );
  }

  const isPDF = material.file_url.toLowerCase().endsWith('.pdf');

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={material.title}
        description={material.description || `${material.material_type} - ${material.subject || 'Study Material'}`}
        keywords={`${material.subject}, ${material.material_type}, study material, college notes`}
      />
      
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/browse" 
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:text-[#FA76FF] transition-colors animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Actions */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <div className="flex flex-wrap items-start gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2">
                      {material.title}
                    </h1>
                    {material.subject && (
                      <p className="text-lg text-gray-500 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {material.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase text-sm hover:bg-[#1A1A1A] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-3 border border-black font-medium uppercase text-sm transition-colors ${
                      isSaved ? 'bg-[#FA76FF] border-[#FA76FF]' : 'hover:bg-gray-50'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 border border-black font-medium uppercase text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* PDF/Image Viewer */}
              <div className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                {isPDF ? (
                  <PDFViewer url={material.file_url} />
                ) : (
                  <div className="border border-black">
                    <img 
                      src={material.file_url} 
                      alt={material.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Material Info Card */}
                <div className="border border-black p-6 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  <h3 className="font-medium uppercase text-sm mb-4">Details</h3>
                  
                  <div className="space-y-4">
                    {/* Type */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="text-sm font-medium capitalize">
                        {material.material_type.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Category */}
                    {material.categories && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Category</span>
                        <span className="text-sm font-medium">{material.categories.name}</span>
                      </div>
                    )}

                    {/* Semester */}
                    {material.semester && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Semester</span>
                        <span className="text-sm font-medium">Semester {material.semester}</span>
                      </div>
                    )}

                    {/* Year */}
                    {material.year && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Year</span>
                        <span className="text-sm font-medium">{material.year}</span>
                      </div>
                    )}

                    {/* College */}
                    {material.college && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">College</span>
                        <span className="text-sm font-medium">{material.college}</span>
                      </div>
                    )}

                    {/* File Size */}
                    {material.file_size && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Size</span>
                        <span className="text-sm font-medium">
                          {(material.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="border border-black p-6 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  <h3 className="font-medium uppercase text-sm mb-4">Stats</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50">
                      <Eye className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-2xl font-medium">{material.view_count}</p>
                      <p className="text-xs text-gray-500 uppercase">Views</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50">
                      <Download className="w-5 h-5 mx-auto mb-2" />
                      <p className="text-2xl font-medium">{material.download_count}</p>
                      <p className="text-xs text-gray-500 uppercase">Downloads</p>
                    </div>
                  </div>
                </div>

                {/* Uploader Info */}
                <div className="border border-black p-6 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                  <h3 className="font-medium uppercase text-sm mb-4">Uploaded By</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{uploaderProfile?.display_name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(material.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {material.description && (
                  <div className="border border-black p-6 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
                    <h3 className="font-medium uppercase text-sm mb-4">Description</h3>
                    <p className="text-sm text-gray-600">{material.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaterialDetail;