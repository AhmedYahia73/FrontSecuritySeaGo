import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { Search, ArrowLeft, LogIn, MapPin, CheckCircle2, User, Phone } from "lucide-react";
import { toast } from "react-toastify";

export default function GateUsersSearch() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New State for Success Popup
  const [successData, setSuccessData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery || searchQuery.trim() === "") {
      toast.error("Please enter a phone number to search.");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setData(null);

    try {
      const response = await api.get(`/security/home/search_village_users`, {
        params: {
          phone: searchQuery.trim(),
          locale: "en"
        }
      });
      
      // The API returns { user: userObject } on success.
      if (response.data && response.data.user) {
        setData(Array.isArray(response.data.user) ? response.data.user : [response.data.user]);
      } else if (response.data && response.data.data) {
        // Fallback for { data: ... }
        setData(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
      } else if (response.data) {
        setData(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        toast.error(error.response?.data?.errors?.phone?.[0] || error.response?.data?.error || "User not found.");
      } else {
        toast.error("Error searching for user.");
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterClick = (user) => {
    setSelectedUser(user);
    
    // Automatically select the first unit if available
    const units = user.units || user.appartments || [];
    if (units.length > 0) {
      setSelectedUnit(units[0].id?.toString() || "");
    } else {
      setSelectedUnit("");
    }
    
    setIsModalOpen(true);
  };

  const handleConfirmEntrance = async () => {
    if (!selectedUser) return;
    if (!selectedUnit) {
      toast.error("Please select a unit.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await api.post("/security/home/entrance_user", {
        gate_id: id,
        user_id: selectedUser.id,
        appartment_id: selectedUnit,
        locale: "en"
      });
      
      // On Success, show the beautiful popup with the returned data
      toast.success(response.data.success || "Access granted successfully!");
      setSuccessData(response.data);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      
    } catch (error) {
      toast.error(error.response?.data?.errors || error.response?.data?.error || "Error granting access.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessData(null);
    setSelectedUser(null);
    setSearchQuery("");
    setData(null);
    setHasSearched(false);
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
                Entrance User Search
              </h1>
              <p className="text-gray-500 text-base max-w-xl">
                Search for owners and renters by phone number to log their entrance through the gate.
              </p>
            </div>
            
            {/* Search Bar - Full Width below title */}
            <form onSubmit={handleSearch} className="relative w-full flex gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="Enter full phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '3.5rem', height: '4rem' }}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-lg placeholder:text-gray-400 focus:bg-white focus:border-[#0AA6A5]/50 focus:ring-2 focus:ring-[#0AA6A5]/20 transition-all outline-none shadow-sm hover:border-gray-300"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="h-[4rem] px-8 bg-[#0AA6A5] text-white rounded-xl font-bold hover:bg-teal-500 transition-all shadow-sm shadow-[#0AA6A5]/20 flex items-center justify-center gap-2 disabled:opacity-50 min-w-[140px]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Search <Search size={20} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto mt-10" style={{ padding: '0 1.5rem' }}>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-gray-100 border-t-[#0AA6A5] rounded-full animate-spin"></div>
              <Search className="w-5 h-5 text-[#0AA6A5] animate-pulse" />
            </div>
          </div>
        ) : hasSearched && (!data || data.length === 0) ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 flex flex-col items-center justify-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No user found</h3>
            <p className="text-gray-500 text-base">Make sure the phone number is correct and try again.</p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((user, index) => {
              const userName = user.name || "Unknown User";
              const userImage = user.image_link || user.image || null;
              
              const firstUnit = (user.units && user.units[0]) || {};
              const appartmentName = user.appartment || firstUnit.appartment || "N/A";

              return (
                <div key={user.id || index} className="group relative bg-white rounded-2xl border border-gray-200 flex flex-col shadow-sm hover:shadow-lg hover:shadow-[#0AA6A5]/5 transition-all duration-300 hover:border-[#0AA6A5]/40" style={{ padding: '1.5rem' }}>
                  
                  {/* Card Header (Image, Name) */}
                  <div className="relative z-10 flex flex-col gap-3 border-b border-gray-100" style={{ paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                    <div className="flex gap-4 items-center">
                      {userImage ? (
                         <img src={userImage.replace('storage//', 'storage/')} alt="User" className="w-16 h-16 rounded-2xl object-cover border border-gray-200 bg-gray-50 shadow-sm" />
                      ) : (
                         <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                           <User size={24} />
                         </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl" title={userName}>{userName}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Registered User
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="relative z-10 flex flex-col gap-3" style={{ marginBottom: '1.5rem' }}>
                    
                    {/* Unit Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center" style={{ padding: '1rem' }}>
                        <span className="text-gray-500 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-1.5">
                          <MapPin size={12} className="text-[#0AA6A5]" /> Unit
                        </span>
                        <span className="font-semibold text-gray-900 text-base truncate" title={appartmentName}>
                          {appartmentName}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-center" style={{ padding: '1rem' }}>
                        <span className="text-gray-500 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest mb-1.5">
                          <Phone size={12} className="text-[#0AA6A5]" /> Phone
                        </span>
                        <span className="font-semibold text-gray-900 text-base truncate">
                          {searchQuery || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => handleEnterClick(user)}
                    className="mt-auto w-full bg-white text-[#0AA6A5] border-2 border-[#0AA6A5] rounded-xl font-bold hover:bg-[#0AA6A5] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-sm"
                    style={{ padding: '0.875rem' }}
                  >
                    Log Entrance <LogIn size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center opacity-50">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-400 text-lg">Enter a phone number above and click search.</p>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white border border-gray-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-in-center">
            
            <div style={{ padding: '2rem' }}>
              <div className="w-16 h-16 bg-[#0AA6A5]/10 rounded-2xl flex items-center justify-center text-[#0AA6A5] mx-auto" style={{ marginBottom: '1.5rem' }}>
                <CheckCircle2 size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-900" style={{ marginBottom: '0.75rem' }}>Log Entrance</h2>
              <p className="text-center text-gray-500 text-sm leading-relaxed" style={{ marginBottom: '2rem' }}>
                Confirm entry for <span className="text-[#0AA6A5] font-semibold">{selectedUser?.name || 'User'}</span>.
              </p>
              
              <div style={{ marginBottom: '2rem' }}>
                <label className="block text-gray-700 text-sm font-bold" style={{ marginBottom: '0.5rem' }}>Select Destination Unit</label>
                <select 
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:border-[#0AA6A5] focus:ring-1 focus:ring-[#0AA6A5] outline-none transition-all"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  style={{ height: '3rem', padding: '0 1rem' }}
                >
                  <option value="" disabled>Select a unit...</option>
                  {(selectedUser?.units || selectedUser?.appartments || []).map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name || unit.appartment || unit.unit_number}</option>
                  ))}
                </select>
                {(!selectedUser?.units && !selectedUser?.appartments) || (selectedUser?.units?.length === 0 && selectedUser?.appartments?.length === 0) ? (
                  <p className="text-red-500 text-xs font-medium" style={{ marginTop: '0.5rem' }}>This user does not have any units assigned.</p>
                ) : null}
              </div>
              
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
                  disabled={isSubmitting || !selectedUnit}
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

      {/* Success Details Modal */}
      {isSuccessModalOpen && successData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" style={{ padding: '1rem' }}>
          <div className="relative bg-white border border-gray-100 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl scale-in-center">
            
            {/* Header / Banner */}
            <div className="bg-gradient-to-br from-[#0AA6A5] to-teal-500 flex flex-col items-center justify-center text-white relative overflow-hidden" style={{ padding: '2rem' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
              
              {successData.user_image ? (
                 <img src={successData.user_image.replace('storage//', 'storage/')} alt="User" className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg relative z-10 bg-white" style={{ marginBottom: '1rem' }} />
              ) : (
                 <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-white shadow-lg relative z-10" style={{ marginBottom: '1rem' }}>
                   <User size={40} />
                 </div>
              )}
              
              <h2 className="text-2xl font-bold text-center relative z-10" style={{ marginBottom: '0.5rem' }}>{successData.user_name || "Unknown"}</h2>
              <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/30 relative z-10 shadow-sm backdrop-blur-sm" style={{ padding: '0.375rem 1rem' }}>
                {successData.user_type || "Owner"}
              </span>
            </div>

            <div style={{ padding: '2rem' }}>
              <div className="flex items-center justify-center text-emerald-500 font-bold bg-emerald-50 rounded-xl w-fit mx-auto border border-emerald-100" style={{ padding: '0.5rem 1rem', marginBottom: '2rem', gap: '0.5rem' }}>
                <CheckCircle2 size={18} /> Entrance Logged Successfully
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
                <div className="bg-gray-50 rounded-2xl border border-gray-100 flex flex-col" style={{ padding: '1rem' }}>
                  <span className="text-gray-400 flex items-center text-[10px] font-bold uppercase tracking-widest" style={{ gap: '0.375rem', marginBottom: '0.375rem' }}>
                    <MapPin size={12} className="text-[#0AA6A5]" /> Unit Name
                  </span>
                  <span className="font-semibold text-gray-900 text-lg truncate">
                    {successData.appartment || "N/A"}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-2xl border border-gray-100 flex flex-col" style={{ padding: '1rem' }}>
                  <span className="text-gray-400 flex items-center text-[10px] font-bold uppercase tracking-widest" style={{ gap: '0.375rem', marginBottom: '0.375rem' }}>
                    <MapPin size={12} className="text-[#0AA6A5]" /> Unit Type
                  </span>
                  <span className="font-semibold text-gray-900 text-lg capitalize truncate">
                    {successData.unit_type || "N/A"}
                  </span>
                </div>

                <div className="col-span-2 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center" style={{ padding: '1.25rem' }}>
                  <span className="text-gray-400 flex items-center text-[10px] font-bold uppercase tracking-widest" style={{ gap: '0.375rem', marginBottom: '0.375rem' }}>
                    Last Entrance
                  </span>
                  <span className="font-semibold text-gray-900 text-lg">
                    {successData.time && successData.time.trim() !== "" ? successData.time : "No previous entry"}
                  </span>
                </div>
              </div>
              
              <button
                onClick={closeSuccessModal}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold transition-all shadow-lg shadow-gray-900/20 flex items-center justify-center text-base rounded-xl"
                style={{ padding: '1rem' }}
              >
                Exit & New Search
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
