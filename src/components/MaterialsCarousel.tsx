import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Eye } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  subject: string | null;
  material_type: string;
  download_count: number;
  view_count: number;
}

export const MaterialsCarousel: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('id, title, subject, material_type, download_count, view_count')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (!error && data) {
      setMaterials(data);
    }
  };

  if (materials.length === 0) {
    return null;
  }

  // Duplicate for seamless scrolling
  const duplicatedMaterials = [...materials, ...materials];

  return (
    <section className="py-8 overflow-hidden border-y border-black">
      <div className="relative">
        <div className="flex animate-scroll-left-fast hover:pause">
          {duplicatedMaterials.map((material, index) => (
            <a
              key={`${material.id}-${index}`}
              href={`/material/${material.id}`}
              className="flex-shrink-0 mx-2 group"
            >
              <div className="border border-black bg-white p-4 w-64 hover:bg-[#FA76FF] transition-colors duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 border border-black group-hover:border-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{material.title}</h3>
                    <p className="text-xs text-gray-500 group-hover:text-black/70 truncate">
                      {material.subject || material.material_type.replace('_', ' ')}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 group-hover:text-black/60">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {material.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {material.download_count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};