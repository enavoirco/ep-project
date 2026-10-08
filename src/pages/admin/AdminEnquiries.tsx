import React, { useState, useEffect } from 'react';
import { FileQuestion, Search, Clock, ArrowRight, Eye, CheckCircle2, X } from 'lucide-react';
import { Enquiry } from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface AdminEnquiriesProps {
  navigate: (path: string) => void;
}

export const AdminEnquiries: React.FC<AdminEnquiriesProps> = ({ navigate }) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const data = await api.getEnquiries();
        setEnquiries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-[#302B2B] tracking-tight">
          Website Inbound Enquiries Feed
        </h1>
        <p className="text-xs text-[#747474] mt-0.5">
          Audit trail of every digital interaction, quote calculation, and location inquiry submitted on the website.
        </p>
      </div>

      <div className="rounded-sm bg-white border border-[#E3E3E0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F4] border-b border-[#E3E3E0] text-[#747474] uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Form Type</th>
                <th className="py-3 px-3">Associated Billboard</th>
                <th className="py-3 px-3">Linked CRM Lead</th>
                <th className="py-3 px-4 text-right">Payload Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E0]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#747474]">
                    Loading enquiries stream...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#747474]">
                    No digital enquiries logged yet.
                  </td>
                </tr>
              ) : (
                enquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3 px-4 text-[#747474]">
                      {new Date(enq.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold bg-[#E8F6FA] text-[#0879A3] border border-[#1098C7]/30">
                        {enq.form_type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#302B2B] font-medium">
                      {enq.location_name || 'General Inquiry'}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => navigate('/admin/leads')}
                        className="text-[#1098C7] hover:underline font-mono text-xs cursor-pointer"
                      >
                        {enq.lead_id}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="px-2.5 py-1 rounded-xs bg-[#F7F7F4] hover:bg-[#E3E3E0] text-[#302B2B] text-xs font-semibold cursor-pointer border border-[#E3E3E0]"
                      >
                        Inspect Payload
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E3E3E0] rounded-sm max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E3E0] pb-3">
              <h3 className="font-display font-bold text-base text-[#302B2B]">
                Enquiry Data Dump #{selectedEnquiry.id}
              </h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-[#747474] hover:text-[#302B2B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <pre className="p-4 rounded-xs bg-[#F7F7F4] border border-[#E3E3E0] text-[11px] text-[#302B2B] font-mono overflow-x-auto max-h-72">
                {JSON.stringify(selectedEnquiry.payload, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xs bg-[#302B2B] text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
