import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGet } from "../../Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { Waves, Users, ArrowLeft } from "lucide-react";

export default function PoolDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data, loading, error } = useGet({ url: `/security/home/entrance_pool?pool_id=${id}` });

  if (loading) return <FullPageLoader />;
  if (error) return (
    <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-red-500 font-semibold text-xl mb-4">Error loading pool statistics.</div>
      <button onClick={() => navigate(-1)} className="text-[#0AA6A5] hover:underline flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Pools
      </button>
    </div>
  );

  const stats = data || {};

  return (
    <div className="animate-in fade-in duration-700 bg-gray-50/50 min-h-screen" style={{ padding: '2.5rem 3rem', paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-[#0AA6A5] transition-colors font-medium bg-white rounded-full shadow-sm border border-gray-100 w-fit"
          style={{ padding: '0.5rem 1rem', marginBottom: '1.5rem', gap: '0.5rem' }}
        >
          <ArrowLeft size={18} />
          Back to Pools
        </button>

        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between z-10" style={{ padding: '3.5rem', marginBottom: '60px', gap: '2rem' }}>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="flex items-center relative z-10" style={{ gap: '1.5rem' }}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-[#0AA6A5] p-[2px] shadow-lg shadow-teal-500/30">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <Waves className="w-10 h-10 text-[#0AA6A5]" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600" style={{ marginBottom: '0.5rem' }}>
                Pool Dashboard
              </h1>
              <p className="text-gray-500 text-lg max-w-xl">
                Monitor daily entrance statistics and activity for this pool.
              </p>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300" style={{ padding: '3rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-gray-500 font-medium text-lg" style={{ marginBottom: '0.5rem' }}>Total Entered Today</p>
            <h3 className="text-5xl font-bold text-gray-900">{stats.user_pool || 0}</h3>
          </div>
        </div>

      </div>
    </div>
  );
}
