import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { PDFViewer } from '@/components/PDFViewer';
import { mockMaterials } from '@/data/mockData';
import { format } from 'date-fns';
import { FileText, Download, Eye, Calendar, BookOpen, Bookmark, ArrowLeft, Share2, User } from 'lucide-react';

const MaterialDetail = () => {
  const { id } = useParams();
  const material = mockMaterials.find(m => m.id === id);

  if (!material) {
    return (<div className="min-h-screen bg-white"><Navbar /><div className="pt-32 text-center"><h1 className="text-2xl font-medium mb-4">Material not found</h1><Link to="/browse" className="text-[#FA76FF] hover:underline">Browse all materials</Link></div></div>);
  }

  const isPDF = material.file_url.toLowerCase().endsWith('.pdf');

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title={material.title} description={material.description || material.subject} />
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/browse" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:text-[#FA76FF]"><ArrowLeft className="w-4 h-4" />Back to Browse</Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl md:text-3xl font-medium mb-2">{material.title}</h1>
              {material.subject && <p className="text-lg text-gray-500 flex items-center gap-2 mb-6"><BookOpen className="w-5 h-5" />{material.subject}</p>}
              <div className="flex flex-wrap gap-3 mb-8">
                <a href={material.file_url} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium uppercase text-sm"><Download className="w-4 h-4" />Download</a>
                <button className="flex items-center gap-2 px-6 py-3 border border-black font-medium uppercase text-sm"><Bookmark className="w-4 h-4" />Save</button>
              </div>
              {isPDF ? <PDFViewer url={material.file_url} /> : <div className="border border-black"><img src={material.file_url} alt={material.title} className="w-full" /></div>}
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="border border-black p-6"><h3 className="font-medium uppercase text-sm mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="capitalize">{material.material_type.replace('_', ' ')}</span></div>
                  {material.semester && <div className="flex justify-between"><span className="text-gray-500">Semester</span><span>Semester {material.semester}</span></div>}
                  {material.year && <div className="flex justify-between"><span className="text-gray-500">Year</span><span>{material.year}</span></div>}
                </div>
              </div>
              <div className="border border-black p-6"><h3 className="font-medium uppercase text-sm mb-4">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50"><Eye className="w-5 h-5 mx-auto mb-2" /><p className="text-2xl font-medium">{material.view_count}</p><p className="text-xs text-gray-500">Views</p></div>
                  <div className="text-center p-4 bg-gray-50"><Download className="w-5 h-5 mx-auto mb-2" /><p className="text-2xl font-medium">{material.download_count}</p><p className="text-xs text-gray-500">Downloads</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MaterialDetail;
