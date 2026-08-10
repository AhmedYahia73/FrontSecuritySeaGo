import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { Search, ArrowLeft, LogIn, MapPin, QrCode, CheckCircle2, User } from "lucide-react";
import { toast } from "react-toastify";

export default function GateVisitorsSearch() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      let url = `/security/home/visitors?page=${page}&locale=en`;
      if (debouncedSearch && debouncedSearch.trim() !== "") {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }
      
      const response = await api.get(url);
      if (response.data && response.data.visitors) {
        setData(response.data.visitors);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("You are not authorized to view visitors.");
      } else {
        toast.error("Error fetching visitors.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  const handleEnterClick = (visitor) => {
    setSelectedVisitor(visitor);
    setIsModalOpen(true);
  };

  const handleConfirmEntrance = async () => {
    if (!selectedVisitor) return;
    setIsSubmitting(true);
    try {
      const response = await api.post("/security/home/entrance_visitor", {
        gate_id: id,
        visitor_id: selectedVisitor.id,
        locale: "en"
      });
      toast.success(response.data.success || "Access granted successfully!");
      setIsModalOpen(false);
      setSelectedVisitor(null);
      fetchVisitors();
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error granting access.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans selection:bg-[#0AA6A5] selection:text-white pb-24 relative overflow-hidden">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#0AA6A5]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      {/* Header Section */}
      <div className="relative z-10 border-b border-gray-200 bg-white shadow-sm" style={{ padding: '2rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-[#0AA6A5] transition-all font-medium mb-6 w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Gate Dashboard
          </button>
          
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-gray-900">
                Visitor Access Center
              </h1>
              <p className="text-gray-500 text-base max-w-xl">
                Seamlessly search, verify, and grant entry to incoming visitors with real-time logging.
              </p>
            </div>
            
            {/* Search Bar - Full Width below title */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by unit number or owner name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '3.5rem', height: '4rem' }}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-lg placeholder:text-gray-400 focus:bg-white focus:border-[#0AA6A5]/50 focus:ring-2 focus:ring-[#0AA6A5]/20 transition-all outline-none shadow-sm hover:border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto mt-10" style={{ padding: '0 1.5rem' }}>
        
        {loading && !data ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-gray-100 border-t-[#0AA6A5] rounded-full animate-spin"></div>
              <Search className="w-5 h-5 text-[#0AA6A5] animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {(!data?.data || data.data.length === 0) ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 flex flex-col items-center justify-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No visitors found</h3>
                <p className="text-gray-500 text-base">Your search returned zero results. Try a different query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.data.map((visitor) => (
                  <div key={visitor.id} className="group relative bg-white rounded-2xl border border-gray-200 flex flex-col shadow-sm hover:shadow-lg hover:shadow-[#0AA6A5]/5 transition-all duration-300 hover:border-[#0AA6A5]/40" style={{ padding: '1.5rem' }}>
                    
                    <div className="relative z-10 flex flex-col gap-3 border-b border-gray-100" style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                      <h3 className="font-bold text-gray-900 text-xl" title={visitor.owner}>{visitor.owner || "Unknown"}</h3>
                      <div className="flex items-center gap-3">
                        <span className="bg-[#0AA6A5]/10 text-[#0AA6A5] text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full border border-[#0AA6A5]/20">
                          {visitor.visitor_type}
                        </span>
                        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-full border border-gray-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Valid Entry
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
                      <div className="bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center" style={{ padding: '1rem' }}>
                        <span className="text-gray-500 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-1.5">
                          <MapPin size={12} className="text-[#0AA6A5]" /> Unit
                        </span>
                        <span className="font-semibold text-gray-900 text-base truncate">{visitor.appartment_name || '-'}</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center" style={{ padding: '1rem' }}>
                        <span className="text-gray-500 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-1.5">
                          <QrCode size={12} className="text-[#0AA6A5]" /> Code
                        </span>
                        <span className="font-semibold text-gray-900 text-base tracking-widest">{visitor.code}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleEnterClick(visitor)}
                      className="mt-auto w-full bg-white text-[#0AA6A5] border-2 border-[#0AA6A5] rounded-xl font-bold hover:bg-[#0AA6A5] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-sm"
                      style={{ padding: '0.875rem' }}
                    >
                      Grant Access <LogIn size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {data?.last_page > 1 && (
              <div className="flex items-center justify-center gap-6 pt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium disabled:opacity-50 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm text-sm"
                >
                  <ArrowLeft size={16} /> Prev
                </button>
                <span className="text-gray-500 text-sm font-medium">
                  <span className="text-gray-900 font-bold">{page}</span> / {data.last_page}
                </span>
                <button
                  disabled={page === data.last_page}
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium disabled:opacity-50 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm text-sm"
                >
                  Next <ArrowLeft size={16} className="rotate-180" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Futuristic Modal (Light Mode) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white border border-gray-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-in-center">
            
            <div style={{ padding: '2rem' }}>
              <div className="w-16 h-16 bg-[#0AA6A5]/10 rounded-2xl flex items-center justify-center text-[#0AA6A5] mx-auto" style={{ marginBottom: '1.5rem' }}>
                <CheckCircle2 size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-900" style={{ marginBottom: '0.75rem' }}>Authorize Entry</h2>
              <p className="text-center text-gray-500 text-base leading-relaxed" style={{ marginBottom: '2rem' }}>
                Confirm entry for <span className="text-[#0AA6A5] font-semibold">{selectedVisitor?.owner || 'Visitor'}</span> proceeding to unit <span className="text-gray-900 font-bold">{selectedVisitor?.appartment_name}</span>.
              </p>
              
              <div className="flex items-center justify-center" style={{ gap: '0.75rem' }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm"
                  disabled={isSubmitting}
                  style={{ padding: '0.75rem 0' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEntrance}
                  className="flex-1 rounded-xl bg-[#0AA6A5] hover:bg-teal-500 text-white font-bold transition-all shadow-sm shadow-[#0AA6A5]/30 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  disabled={isSubmitting}
                  style={{ padding: '0.75rem 0' }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Confirm <ArrowLeft size={16} className="rotate-180" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
