import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGet } from "../../Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { DoorOpen, Users, UserCheck, Key, Truck, HardHat, Briefcase, ArrowLeft } from "lucide-react";

export default function GateDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Note: Adjust the API endpoint as necessary based on your routes. 
  // Based on security.php it's /security/home/entrance_gate
  const { data, loading, error } = useGet({ url: `/security/home/entrance_gate?gate_id=${id}` });

  if (loading) return <FullPageLoader />;
  if (error) return (
    <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-red-500 font-semibold text-xl mb-4">Error loading gate statistics.</div>
      <button onClick={() => navigate(-1)} className="text-[#0AA6A5] hover:underline flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Gates
      </button>
    </div>
  );

  const stats = data || {};

  const statCards = [
    {
      title: "Total Entered",
      value: stats.entrance || 0,
      icon: <Users className="w-8 h-8 text-white" />,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50"
    },
    {
      title: "Owners",
      value: stats.entrance_owner || 0,
      icon: <UserCheck className="w-8 h-8 text-white" />,
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50"
    },
    {
      title: "Renters",
      value: stats.entrance_renter || 0,
      icon: <Key className="w-8 h-8 text-white" />,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50"
    },
    {
      title: "Total Visitors",
      value: stats.entrance_visitor || 0,
      icon: <Briefcase className="w-8 h-8 text-white" />,
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50"
    }
  ];

  const visitorBreakdown = [
    {
      title: "Guests",
      value: stats.entrance_visitor_guest || 0,
      icon: <Users className="w-6 h-6 text-[#0AA6A5]" />
    },
    {
      title: "Workers",
      value: stats.entrance_visitor_worker || 0,
      icon: <HardHat className="w-6 h-6 text-[#0AA6A5]" />
    },
    {
      title: "Delivery",
      value: stats.entrance_visitor_delivery || 0,
      icon: <Truck className="w-6 h-6 text-[#0AA6A5]" />
    }
  ];

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
          Back to Gates
        </button>

        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between z-10" style={{ padding: '3.5rem', marginBottom: '60px', gap: '2rem' }}>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="flex items-center relative z-10" style={{ gap: '1.5rem' }}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-[#0AA6A5] p-[2px] shadow-lg shadow-teal-500/30">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <DoorOpen className="w-10 h-10 text-[#0AA6A5]" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600" style={{ marginBottom: '0.5rem' }}>
                Gate Dashboard
              </h1>
              <p className="text-gray-500 text-lg max-w-xl">
                Real-time monitor of entrance statistics, visitors breakdown, and daily activity.
              </p>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300" style={{ padding: '2.5rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-gray-500 font-medium" style={{ marginBottom: '0.25rem' }}>{stat.title}</p>
              <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Visitor Breakdown Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden" style={{ padding: '2rem' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          
          <h2 className="text-2xl font-bold text-gray-900 relative z-10 flex items-center" style={{ marginBottom: '1.5rem', gap: '0.75rem' }}>
            <Briefcase className="w-6 h-6 text-orange-500" />
            Visitors Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 relative z-10" style={{ gap: '1.5rem' }}>
            {visitorBreakdown.map((item, idx) => (
              <div key={idx} className="bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all duration-300" style={{ padding: '2.5rem' }}>
                <div className="flex items-center" style={{ gap: '1rem' }}>
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">{item.title}</span>
                </div>
                <span className="text-2xl font-bold text-[#0AA6A5]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium CTA Banner for Visitor Management */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row items-center justify-between w-full" style={{ marginTop: '4rem', marginBottom: '2rem', padding: '3.5rem', gap: '2.5rem' }}>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-teal-50 rounded-full blur-[60px] opacity-70 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-[#0AA6A5] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center" style={{ gap: '1.5rem' }}>
            <div className="w-20 h-20 shrink-0 rounded-3xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 flex items-center justify-center shadow-sm">
              <Users className="w-10 h-10 text-[#0AA6A5]" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ marginBottom: '0.75rem' }}>
                Visitor Access Control
              </h3>
              <p className="text-gray-500 text-lg max-w-lg leading-relaxed">
                Search for incoming visitors by unit number or owner name, verify their credentials, and grant secure entry to the village.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => navigate(`/gates/${id}/visitors`)}
              className="group flex items-center justify-center w-full md:w-auto bg-gradient-to-r from-[#0AA6A5] to-teal-400 hover:from-teal-500 hover:to-teal-400 text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-[0_8px_20px_rgba(10,166,165,0.3)] hover:shadow-[0_12px_25px_rgba(10,166,165,0.5)] hover:-translate-y-1"
              style={{ padding: '1.25rem 2.5rem', gap: '0.75rem' }}
            >
              Search & Allow Entry
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
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
                User Entrance Logging
              </h3>
              <p className="text-gray-500 text-lg max-w-lg leading-relaxed">
                Log the entrance of registered village owners and renters. Search by exact phone number to authorize their entry securely.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <button 
              onClick={() => navigate(`/gates/${id}/users`)}
              className="group flex items-center justify-center w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_25px_rgba(59,130,246,0.5)] hover:-translate-y-1"
              style={{ padding: '1.25rem 2.5rem', gap: '0.75rem' }}
            >
              Log User Entry
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
