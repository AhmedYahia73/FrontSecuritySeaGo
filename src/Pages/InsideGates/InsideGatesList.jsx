import React from "react";
import { useGet } from "../../Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { Clock, ShieldCheck, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function InsideGatesList() {
  const { data, loading, error } = useGet({ url: "/security/home/inside_gates" });
  const navigate = useNavigate();

  if (loading) return <FullPageLoader />;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">Error loading inside gates. Please try again.</div>;

  let insideGates = [];
  if (Array.isArray(data)) insideGates = data;
  else if (data?.data && Array.isArray(data.data)) insideGates = data.data;
  else if (data?.inside_gates && Array.isArray(data.inside_gates)) insideGates = data.inside_gates;
  else if (data && typeof data === 'object') {
    const arr = Object.values(data).find(Array.isArray);
    if (arr) insideGates = arr;
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 animate-in fade-in duration-700 bg-gray-50/50 min-h-screen" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Premium Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] p-10 md:p-14 lg:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8 z-10" style={{ marginBottom: '80px' }}>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 bg-teal-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-[#0AA6A5] to-teal-400 rounded-2xl shadow-lg shadow-teal-500/20 text-white shrink-0">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Inside Gates</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">
                Monitor and manage the internal security gates and checkpoints inside the village.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 shrink-0">
             <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 px-8 py-4 rounded-2xl">
                <span className="text-3xl font-black text-[#0AA6A5] leading-none mb-1">{insideGates.length}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inside Gates</span>
             </div>
          </div>
        </div>
        
        {insideGates.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <ShieldCheck className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-semibold">No inside gates assigned to you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {insideGates.map((gate) => (
              <Card 
                key={gate.id} 
                onClick={() => navigate(`/inside-gates/${gate.id}`)}
                className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(10,166,165,0.15)] hover:-translate-y-2 transition-all duration-300 bg-white group rounded-3xl relative flex flex-col cursor-pointer"
              >
                
                {/* Image / Header Section */}
                <div className="h-48 w-full relative overflow-hidden bg-gradient-to-br from-teal-400 to-[#0AA6A5]">
                  {gate.image_link ? (
                    <img 
                      src={gate.image_link.replace('storage//', 'storage/')} 
                      alt={gate.name || "Gate"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck className="w-20 h-20 text-white/40" />
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${gate.status === 1 ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                      {gate.status === 1 ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <CardContent className="p-10 pt-8 flex-1 flex flex-col relative bg-white">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#0AA6A5] transition-colors mb-4 line-clamp-1">
                    {gate.name || gate.translations?.[0]?.value}
                  </h3>
                  
                  {gate.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{gate.location}</span>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    {(gate.from && gate.to) ? (
                      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Clock className="w-4 h-4 text-[#0AA6A5]" />
                        <span className="text-sm font-semibold">{gate.from.slice(0,5)} - {gate.to.slice(0,5)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No hours set</span>
                    )}
                    
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
                      <span className="text-[#0AA6A5] font-bold text-lg leading-none">&rarr;</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
