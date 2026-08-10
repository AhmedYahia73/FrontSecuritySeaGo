import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGet } from "../../Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { Umbrella, Users, ArrowLeft, UserCheck } from "lucide-react";

export default function BeachDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data, loading, error } = useGet({ url: `/security/home/entrance_beach?beach_id=${id}` });

  if (loading) return <FullPageLoader />;
  if (error) return (
    <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-red-500 font-semibold text-xl mb-4">Error loading beach statistics.</div>
      <button onClick={() => navigate(-1)} className="text-[#0AA6A5] hover:underline flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Beaches
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
          Back to Beaches
        </button>

        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between z-10" style={{ padding: '3.5rem', marginBottom: '60px', gap: '2rem' }}>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="flex items-center relative z-10" style={{ gap: '1.5rem' }}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-[#0AA6A5] p-[2px] shadow-lg shadow-teal-500/30">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <Umbrella className="w-10 h-10 text-[#0AA6A5]" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600" style={{ marginBottom: '0.5rem' }}>
                Beach Dashboard
              </h1>
              <p className="text-gray-500 text-lg max-w-xl">
                Monitor daily entrance statistics and activity for this beach.
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
            <h3 className="text-5xl font-bold text-gray-900">{stats.user_beach || 0}</h3>
          </div>
        </div>

        {/* Premium CTA Banner for User Entrance */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row items-center justify-between w-full" style={{ marginBottom: '4rem', padding: '3.5rem', gap: '2.5rem' }}>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-blue-50 rounded-full blur-[60px] opacity-70 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-5 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center" style={{ gap: '1.5rem' }}>
            <div className="w-20 h-20 shrink-0 rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex items-center justify-center shadow-sm">
              <UserCheck className="w-10 h-10 text-blue-500" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ marginBottom: '0.75rem' }}>
                Beach Entrance Logging
              </h3>
              <p className="text-gray-500 text-lg max-w-lg leading-relaxed">
                Log the entrance of registered village owners and renters to the beach. Search by exact phone number to authorize their entry and check umbrella availability.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => navigate(`/beaches/${id}/users`)}
              className="group flex items-center justify-center w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_25px_rgba(59,130,246,0.5)] hover:-translate-y-1"
              style={{ padding: '1.25rem 2.5rem', gap: '0.75rem' }}
            >
              Log User Entry
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
