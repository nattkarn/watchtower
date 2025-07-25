"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import { config } from "../../app/config";

export default function TopNav() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const verifyAuth = async () => {
      try {
        const storedName = localStorage.getItem("watchtower_user_name");
        if (!storedName) {
          router.push("/");
          return;
        }
  
        const res = await axios.post(`${config.apiUrl}/api/auth/verify-token`, {token: localStorage.getItem("watchtower_user_refreshToken")}, {
          withCredentials: true,
        });
  
        if (res) {
          setName(storedName);
        } else {
          throw new Error("Token invalid");
        }
  
      } catch (err) {
        console.error("Error verifying token:", err);
        localStorage.clear();
        document.cookie = "watchtower_user_level=; max-age=0; path=/";
        document.cookie = "watchtower_user_name=; max-age=0; path=/";
        document.cookie = "watchtower_user_token=; max-age=0; path=/";
        document.cookie = "watchtower_user_refreshToken=; max-age=0; path=/";
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();

    setTimeout(() => setIsLoading(false), 500); // ลดเวลา load
  }, []);
 
  
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณกำลังจะออกจากระบบ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#d33",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      localStorage.clear();
      
      document.cookie = "watchtower_user_level=; max-age=0; path=/";
      document.cookie = "watchtower_user_name=; max-age=0; path=/";
      document.cookie = "watchtower_user_token=; max-age=0; path=/";
      document.cookie = "watchtower_user_refreshToken=; max-age=0; path=/";
      await axios.post(`${config.apiUrl}/api/auth/logout`, {}, {
        withCredentials: true,
      });
      
      router.push("/");
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-sm">
      <div className="mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/watchtower-icon.png"
            alt="Watchtower Logo"
            className="w-12 h-12 object-contain"
          />
          <span className="text-xl font-bold text-gray-200 tracking-wide">
            Watchtower
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <span className="text-gray-400">Loading...</span>
          ) : (
            <div className="flex items-center gap-4 h-10">
              <div className="flex items-center text-gray-300 font-medium gap-2 h-full">
                <i className="fas fa-user text-purple-400" />
                <span onClick={() => router.push("/profile")} className="cursor-pointer hover:underline">{name}</span>
              </div>
              <button className="btn-primary h-full mb-6" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
