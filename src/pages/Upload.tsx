import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload as UploadIcon, FileText, X } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Upload = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [college, setCollege] = useState('');

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

    fetchCategories();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF or image file (JPG, PNG, WebP)',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 10MB',
        variant: 'destructive'
      });
      return;
    }

    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload materials',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive'
      });
      return;
    }

    if (!title || !materialType) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(filePath);

      // Create material record
      const { error: insertError } = await supabase
        .from('materials')
        .insert({
          title,
          description: description || null,
          category_id: categoryId || null,
          material_type: materialType,
          file_url: publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          uploaded_by: user.id,
          subject: subject || null,
          semester: semester ? parseInt(semester) : null,
          year: year ? parseInt(year) : null,
          college: college || null
        });

      if (insertError) throw insertError;

      toast({
        title: 'Success!',
        description: 'Your material has been uploaded successfully'
      });

      navigate('/my-uploads');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Upload Material"
        description="Share your study materials with the college community"
        keywords="upload notes, share materials, college resources"
      />
      
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium mb-2 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Upload Material
          </h1>
          <p className="text-gray-500 mb-8 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            Share your notes, question papers, or study materials with the community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed p-8 text-center transition-colors ${
                dragActive ? 'border-[#FA76FF] bg-[#FA76FF]/10' : 'border-black'
              } ${selectedFile ? 'bg-gray-50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-4">
                  <FileText className="w-10 h-10" />
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium mb-2">Drag and drop your file here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <label className="inline-block px-6 py-2 border border-black font-medium uppercase text-sm cursor-pointer hover:bg-black hover:text-white transition-colors">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileInput}
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-4">
                    Supported: PDF, JPG, PNG, WebP (Max 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium uppercase mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Data Structures Notes - Unit 1"
                className="border-black h-12"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium uppercase mb-2">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the material..."
                className="border-black min-h-[100px]"
              />
            </div>

            {/* Material Type & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium uppercase mb-2">
                  Material Type <span className="text-red-500">*</span>
                </label>
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger className="border-black h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notes">Handwritten Notes</SelectItem>
                    <SelectItem value="question_paper">Question Paper</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium uppercase mb-2">
                  Category
                </label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="border-black h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject & Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium uppercase mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Data Structures"
                  className="border-black h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium uppercase mb-2">
                  Semester
                </label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="border-black h-12">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Year & College */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium uppercase mb-2">
                  Year
                </label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g., 2024"
                  className="border-black h-12"
                  min="2000"
                  max="2030"
                />
              </div>
              <div>
                <label className="block text-sm font-medium uppercase mb-2">
                  College
                </label>
                <Input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g., XYZ Engineering College"
                  className="border-black h-12"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full bg-black text-white font-medium py-4 px-6 uppercase text-sm hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Material'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Upload;