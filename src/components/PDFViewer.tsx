import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface PDFViewerProps {
  url: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  return (
    <div className="border border-black">
      {/* PDF Embed */}
      <div className="relative bg-gray-100" style={{ height: '70vh' }}>
        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full h-full"
          title="PDF Viewer"
        />
      </div>
      
      {/* Fallback/Open in new tab */}
      <div className="p-4 border-t border-black flex items-center justify-between bg-white">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="w-4 h-4" />
          <span>PDF Document</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium hover:text-[#FA76FF] transition-colors"
        >
          Open in new tab
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};