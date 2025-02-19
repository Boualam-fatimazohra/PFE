import * as React from "react";
import { Eye, Download, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Document {
  title: string;
  date: string;
}

interface DocumentsSectionProps {
  documents: Document[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  return (
    <div className="bg-white p-6 border border-[#999]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Kit Formations</h3>
        <Button style={{ backgroundColor: 'black !important', color: 'white !important' }}>Importer</Button>
      </div>
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-y border-[#DDD]">
            <span className="font-semibold text-[#333]">{doc.title}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#595959] font-semibold">{doc.date}</span>
              <div className="flex items-center gap-2">
                <button><Eye size={18} /></button>
                <button><Download size={18} /></button>
                <button><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsSection;