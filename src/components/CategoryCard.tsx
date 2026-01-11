import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, slug, description, icon }) => {
  return (
    <Link 
      to={`/browse?category=${slug}`}
      className="group relative border border-black p-6 flex flex-col gap-4 hover:bg-black transition-colors duration-300"
    >
      <div className="text-black group-hover:text-[#FA76FF] transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-lg group-hover:text-white transition-colors">{name}</h3>
        <p className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium group-hover:text-[#FA76FF] transition-colors">
        <span>Browse</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};