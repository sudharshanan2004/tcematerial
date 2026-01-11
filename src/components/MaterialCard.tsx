import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface MaterialCardProps {
  material: {
    id: string;
    title: string;
    description: string | null;
    subject: string | null;
    material_type: string;
    download_count: number;
    view_count: number;
    semester: number | null;
    year: number | null;
    created_at: string;
    categories?: {
      name: string;
      slug: string;
    } | null;
  };
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'notes':
      return 'bg-blue-100 text-blue-800';
    case 'question_paper':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  return (
    <Link 
      to={`/material/${material.id}`}
      className="group block border border-black hover:border-[#FA76FF] transition-colors"
    >
      {/* Card Header */}
      <div className="p-4 border-b border-black group-hover:border-[#FA76FF] transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-3 border border-black group-hover:bg-[#FA76FF] group-hover:border-[#FA76FF] transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg leading-tight line-clamp-2 group-hover:text-[#FA76FF] transition-colors">
              {material.title}
            </h3>
            {material.subject && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {material.subject}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4">
        {material.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {material.description}
          </p>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 text-xs font-medium uppercase ${getTypeColor(material.material_type)}`}>
            {material.material_type.replace('_', ' ')}
          </span>
          {material.semester && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
              Sem {material.semester}
            </span>
          )}
          {material.year && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
              {material.year}
            </span>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {material.view_count} views
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {material.download_count} downloads
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(material.created_at), 'MMM d')}
          </span>
        </div>
      </div>
    </Link>
  );
};