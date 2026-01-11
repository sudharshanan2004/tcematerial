import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { MaterialCard } from '@/components/MaterialCard';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const selectedCategory = searchParams.get('category');
  const selectedType = searchParams.get('type');
  const selectedSemester = searchParams.get('semester');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [selectedCategory, selectedType, selectedSemester, searchQuery]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    let query = supabase
      .from('materials')
      .select(`
        id, title, description, subject, material_type, file_url, 
        download_count, view_count, semester, year, created_at,
        categories (name, slug)
      `)
      .order('created_at', { ascending: false });

    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    if (selectedType) {
      query = query.eq('material_type', selectedType);
    }

    if (selectedSemester) {
      query = query.eq('semester', parseInt(selectedSemester));
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setMaterials(data);
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedType || selectedSemester || searchQuery;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Browse Materials"
        description="Browse and discover study materials, notes, and question papers shared by students."
        keywords="study materials, browse notes, question papers, college resources"
      />
      
      <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            Browse Materials
          </h1>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-black h-12"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 h-12 border border-black font-medium uppercase text-sm transition-colors ${showFilters ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-6 h-12 border border-black font-medium uppercase text-sm bg-[#FA76FF] hover:bg-[#ff8fff] transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="px-4 md:px-8 pb-8 animate-fade-in">
          <div className="max-w-6xl mx-auto border border-black p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium uppercase mb-3">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        if (selectedCategory === category.slug) {
                          searchParams.delete('category');
                        } else {
                          searchParams.set('category', category.slug);
                        }
                        setSearchParams(searchParams);
                      }}
                      className={`px-3 py-1 text-sm border border-black transition-colors ${
                        selectedCategory === category.slug 
                          ? 'bg-black text-white' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium uppercase mb-3">Type</label>
                <div className="flex flex-wrap gap-2">
                  {['notes', 'question_paper', 'other'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        if (selectedType === type) {
                          searchParams.delete('type');
                        } else {
                          searchParams.set('type', type);
                        }
                        setSearchParams(searchParams);
                      }}
                      className={`px-3 py-1 text-sm border border-black transition-colors ${
                        selectedType === type 
                          ? 'bg-black text-white' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester Filter */}
              <div>
                <label className="block text-sm font-medium uppercase mb-3">Semester</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => {
                        if (selectedSemester === sem.toString()) {
                          searchParams.delete('semester');
                        } else {
                          searchParams.set('semester', sem.toString());
                        }
                        setSearchParams(searchParams);
                      }}
                      className={`w-10 h-10 text-sm border border-black transition-colors ${
                        selectedSemester === sem.toString() 
                          ? 'bg-black text-white' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Materials Grid */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">Loading materials...</div>
          ) : materials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No materials found</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium underline hover:no-underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material, index) => (
                <div 
                  key={material.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.4 + (index * 0.05)}s`, animationFillMode: 'both' }}
                >
                  <MaterialCard material={material} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Browse;