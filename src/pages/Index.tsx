import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { RotatingBadge } from '@/components/RotatingBadge';
import { MaterialsCarousel } from '@/components/MaterialsCarousel';
import { CategoryCard } from '@/components/CategoryCard';
import arrowDown from '@/assets/arrow-down.png';
import { FileText, BookOpen, ClipboardList, FlaskConical, FolderOpen, FileQuestion, Upload, Search, Bookmark } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
  'PenTool': <FileText className="w-8 h-8" />,
  'FileQuestion': <FileQuestion className="w-8 h-8" />,
  'ClipboardList': <ClipboardList className="w-8 h-8" />,
  'FlaskConical': <FlaskConical className="w-8 h-8" />,
  'BookOpen': <BookOpen className="w-8 h-8" />,
  'FolderOpen': <FolderOpen className="w-8 h-8" />,
};

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section');
    categoriesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="StudyShare - College Materials Hub"
        description="Share and discover study materials, handwritten notes, and previous year question papers with your college community."
        keywords="study materials, college notes, question papers, handwritten notes, exam preparation"
      />
      
      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Navbar />
      </div>
      
      {/* Decorative rotating badge */}
      <RotatingBadge 
        text="EXPLORE" 
        onClick={scrollToCategories}
        showIcon={true}
        icon={<img src={arrowDown} alt="Arrow down" className="w-6 h-6 md:w-7 md:h-7 lg:w-12 lg:h-12" />}
      />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-6 md:pb-16 lg:pb-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-6 md:mb-10 inline-flex flex-col items-center">
            <div className="flex items-center">
              <span className="border border-black px-3 md:px-6 py-2 md:py-4 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>Share &</span>
              <span className="bg-[#ff6bff] border border-black px-3 md:px-6 py-2 md:py-4 rounded-[20px] md:rounded-[40px] -ml-px animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>discover</span>
            </div>
            <div className="flex items-center -mt-px">
              <span className="border border-black px-3 md:px-6 py-2 md:py-4 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>study</span>
              <span className="border border-l-0 border-black px-3 md:px-6 py-2 md:py-4 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>materials</span>
            </div>
          </h1>
          <p className="text-sm md:text-base lg:text-[18px] text-black max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
            Access handwritten notes, previous year question papers, and study materials shared by your college community.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <Link 
              to="/browse"
              className="group relative overflow-hidden border border-black p-6 flex items-center gap-4 hover:bg-black transition-colors duration-300"
            >
              <Search className="w-6 h-6 group-hover:text-white transition-colors" />
              <div>
                <h3 className="font-medium group-hover:text-white transition-colors">Browse Materials</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">Find study resources</p>
              </div>
            </Link>
            <Link 
              to="/upload"
              className="group relative overflow-hidden border border-black p-6 flex items-center gap-4 hover:bg-black transition-colors duration-300"
            >
              <Upload className="w-6 h-6 group-hover:text-white transition-colors" />
              <div>
                <h3 className="font-medium group-hover:text-white transition-colors">Upload Material</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">Share your notes</p>
              </div>
            </Link>
            <Link 
              to="/dashboard"
              className="group relative overflow-hidden border border-black p-6 flex items-center gap-4 hover:bg-black transition-colors duration-300"
            >
              <Bookmark className="w-6 h-6 group-hover:text-white transition-colors" />
              <div>
                <h3 className="font-medium group-hover:text-white transition-colors">My Dashboard</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">Saved materials</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Materials Carousel */}
      <MaterialsCarousel />

      {/* Categories Section */}
      <section id="categories-section" className="px-4 md:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-medium mb-8 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${1.0 + (index * 0.1)}s`, animationFillMode: 'both' }}
              >
                <CategoryCard 
                  name={category.name}
                  slug={category.slug}
                  description={category.description}
                  icon={iconMap[category.icon] || <FolderOpen className="w-8 h-8" />}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white h-8 w-8 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-medium">StudyShare</span>
          </div>
          <p className="text-sm text-gray-500">
            Built for students, by students. Share knowledge, ace exams.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;