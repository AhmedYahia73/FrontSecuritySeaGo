import React, { useState, useEffect } from "react";
import { useGet } from "../Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { User, Mail, Phone, Shield, Camera, Edit3, Loader2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function Profile() {
  const { data, loading, error, refetch } = useGet({ url: "/security/profile" });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    image: null,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let profile = data?.data || data?.security || data;
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        password: "",
        image: null,
      });
    }
  }, [data]);

  if (loading) return <FullPageLoader />;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">Error loading profile. Please try again.</div>;

  let profile = data?.data || data?.security || data || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const payload = {};
      if (formData.name) payload.name = formData.name;
      if (formData.email) payload.email = formData.email;
      if (formData.phone) payload.phone = formData.phone;
      if (formData.password) payload.password = formData.password;
      
      // Only append image if it's a new base64 string
      if (formData.image && formData.image.startsWith('data:image')) {
        // Send the full base64 string including the "data:image/..." prefix
        payload.image = formData.image;
      }

      // Sending as JSON since image is base64
      const response = await api.post("/security/profile/update", payload);

      toast.success("Profile updated successfully!");
      if (refetch) refetch(); // Reload the data to reflect changes
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-gray-50/30 min-h-screen" style={{ padding: '2.5rem 3rem', paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="max-w-6xl mx-auto" style={{ gap: '2rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* Premium Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between z-10" style={{ padding: '3.5rem', marginBottom: '80px', gap: '2rem' }}>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 bg-teal-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center" style={{ gap: '1.5rem' }}>
            <div className="bg-gradient-to-br from-[#0AA6A5] to-teal-400 rounded-2xl shadow-lg shadow-teal-500/20 text-white shrink-0" style={{ padding: '1rem' }}>
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ marginBottom: '0.5rem' }}>My Profile</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">
                Manage your personal information, contact details, and account settings.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '2rem' }}>
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Card className="overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-white relative">
              {/* Cover Photo */}
              <div className="h-32 w-full bg-gradient-to-r from-teal-400 to-[#0AA6A5] relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
              </div>
              
              <CardContent className="relative z-10 flex flex-col items-center text-center" style={{ padding: "40px", paddingTop: "0" }}>
                {/* Avatar */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center relative group" style={{ marginTop: '-3.5rem' }}>
                  {(imagePreview || profile.image) ? (
                    <img 
                      src={imagePreview || (profile.image ? profile.image.replace('storage//', 'storage/') : '')} 
                      alt={profile.name || "Profile"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-300" />
                  )}
                  {/* Hover Overlay */}
                  <label htmlFor="image-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </label>
                </div>

                {/* Info List */}
                <div className="w-full" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="flex items-center rounded-2xl bg-gray-50 hover:bg-teal-50/50 transition-colors border border-gray-100/50 text-left" style={{ padding: '1rem', gap: '1rem' }}>
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Email Address</span>
                      <span className="text-gray-800 font-semibold truncate text-sm">{profile.email || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="flex items-center rounded-2xl bg-gray-50 hover:bg-teal-50/50 transition-colors border border-gray-100/50 text-left" style={{ padding: '1rem', gap: '1rem' }}>
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</span>
                      <span className="text-gray-800 font-semibold text-sm">{profile.phone || "Not provided"}</span>
                    </div>
                  </div>

                  <div className="flex items-center rounded-2xl bg-gray-50 hover:bg-teal-50/50 transition-colors border border-gray-100/50 text-left" style={{ padding: '1rem', gap: '1rem' }}>
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Village ID</span>
                      <span className="text-gray-800 font-semibold text-sm">{profile.village_id || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-7">
            <Card className="border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-white h-full">
              <CardContent className="h-full flex flex-col" style={{ padding: "40px" }}>
                <div className="flex items-center border-b border-gray-50" style={{ gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1.5rem' }}>
                  <div className="bg-teal-50 rounded-xl" style={{ padding: '0.625rem' }}>
                    <Edit3 className="w-6 h-6 text-[#0AA6A5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Edit Profile</h3>
                </div>

                <form onSubmit={handleUpdateProfile} className="flex-1 flex flex-col" style={{ gap: '1.5rem' }}>
                  
                  {/* Image Upload Input (Hidden) */}
                  <input 
                    type="file" 
                    id="image-upload" 
                    name="image"
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1.5rem' }}>
                    {/* Name */}
                    <div className="md:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="text-sm font-semibold text-gray-700" style={{ marginLeft: '0.25rem' }}>Full Name</label>
                      <Input 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Ahmed Ali"
                        className="h-12 px-4 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0AA6A5]/20 focus:border-[#0AA6A5] transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="text-sm font-semibold text-gray-700" style={{ marginLeft: '0.25rem' }}>Email Address</label>
                      <Input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        className="h-12 px-4 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0AA6A5]/20 focus:border-[#0AA6A5] transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="text-sm font-semibold text-gray-700" style={{ marginLeft: '0.25rem' }}>Phone Number</label>
                      <Input 
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01xxxxxxxxx"
                        className="h-12 px-4 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0AA6A5]/20 focus:border-[#0AA6A5] transition-all"
                      />
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="text-sm font-semibold text-gray-700" style={{ marginLeft: '0.25rem' }}>Password</label>
                      <div className="relative">
                        <Input 
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Leave blank to keep current password"
                          className="h-12 px-4 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0AA6A5]/20 focus:border-[#0AA6A5] transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-8">
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="w-full h-14 rounded-xl bg-[#0AA6A5] hover:bg-teal-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white font-bold text-lg"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
