"use client";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FaDoorOpen, FaWater, FaSwimmer, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const [permissions, setPermissions] = useState({
    gate: false,
    beach: false,
    pool: false,
    inside_gates: false,
  });

  useEffect(() => {
    try {
      const userPerms = localStorage.getItem("userPermission");
      if (userPerms) {
        const parsed = JSON.parse(userPerms);
        setPermissions({
          gate: !!parsed.gate,
          beach: !!parsed.beach,
          pool: !!parsed.pool,
          inside_gates: !!parsed.inside_gates,
        });
      }
    } catch (error) {
      console.error("Error parsing user permissions:", error);
    }
  }, []);

  return (
    <div className="!p-4 flex !gap-3 md:flex-row flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto">
        {permissions.gate && (
          <Link
            to={"/gates"}
            className="group relative overflow-hidden bg-white border border-gray-100 !p-8 lg:!p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(10,166,165,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-start"
          >
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-32 h-32 bg-teal-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-[#0AA6A5] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-teal-500/20">
              <FaDoorOpen className="text-3xl text-white" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#0AA6A5] transition-colors">Gates</div>
              <div className="text-base text-gray-500">Manage external gates</div>
            </div>
          </Link>
        )}

        {permissions.beach && (
          <Link
            to={"/beaches"}
            className="group relative overflow-hidden bg-white border border-gray-100 !p-8 lg:!p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(10,166,165,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-start"
          >
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
              <FaWater className="text-3xl text-white" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#0AA6A5] transition-colors">Beaches</div>
              <div className="text-base text-gray-500">Manage beach access</div>
            </div>
          </Link>
        )}

        {permissions.pool && (
          <Link
            to={"/pools"}
            className="group relative overflow-hidden bg-white border border-gray-100 !p-8 lg:!p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(10,166,165,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-start"
          >
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-32 h-32 bg-cyan-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-cyan-500/20">
              <FaSwimmer className="text-3xl text-white" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#0AA6A5] transition-colors">Pools</div>
              <div className="text-base text-gray-500">Manage pool access</div>
            </div>
          </Link>
        )}

        {permissions.inside_gates && (
          <Link
            to={"/inside-gates"}
            className="group relative overflow-hidden bg-white border border-gray-100 !p-8 lg:!p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(10,166,165,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-start"
          >
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-32 h-32 bg-purple-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-purple-500/20">
              <FaShieldAlt className="text-3xl text-white" />
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#0AA6A5] transition-colors">Inside Gates</div>
              <div className="text-base text-gray-500">Manage internal gates</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;