import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import api from "../utils/api";
import { toast } from "react-toastify";

// Utility function to clear local/session storage on logout
const clearAuthData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("village_id");
  sessionStorage.clear();
};

export default function Navbar() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const userName = userData?.name;

  const userInitials = userName
    ? userName
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
    : "AD";

  const handleLogout = async () => {

    try {
      const response = await api.get("/security/logout");

      if (response.status === 200 || response.status === 204) {
        clearAuthData();
        toast.success("Logout successful");
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(
        error?.response?.data?.message ?? "An error occurred during logout"
      );
      clearAuthData();
      navigate("/login");
    }
  };

  return (
    <header className="w-full h-16 flex items-center justify-between !p-6">
      {/* Show back button only if not on the home page */}
      {location.pathname !== "/" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-bg-primary hover:bg-gray-100 rounded-full"
          aria-label="Go Back"
        >
          <ArrowLeft className="h-5 w-5 font-bold" />
        </Button>
      )}

      {/* Left section: Avatar and welcome message */}
      <div className="flex items-center gap-2 text-teal-600 font-semibold text-lg">
        <Avatar className="w-9 h-9 bg-gray-300 text-white font-bold text-sm">
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        Hello {userName || "Admin"}
      </div>

      {/* Right section: Language & Logout */}
      <div className="flex items-center gap-4 md:gap-6 text-teal-600 font-semibold">
        <Button
          variant="outline"
          onClick={() => {
            const currentLang = localStorage.getItem("language") || "en";
            const newLang = currentLang === "en" ? "ar" : "en";
            localStorage.setItem("language", newLang);
            window.location.reload();
          }}
          className="text-bg-primary border-bg-primary hover:bg-teal-50 px-3"
        >
          {localStorage.getItem("language") === "ar" ? "EN" : "AR"}
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-bg-primary cursor-pointer flex items-center gap-2 hover:text-teal-700"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
