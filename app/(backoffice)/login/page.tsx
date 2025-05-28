"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { config } from "../../config";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("watchtower_user_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire("กรอกข้อมูลให้ครบ", "", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        username,
        password,
      };
      const response = await axios.post(
        `${config.apiUrl}/api/auth/login`,
        payload
      );
      if (response.data.token !== undefined) {
        const token = response.data.token;
        localStorage.setItem("watchtower_user_token", token);
        localStorage.setItem("watchtower_user_name", username);
        router.push("/dashboard");
      } else {
        Swal.fire("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", "", "error");
      }
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด", "", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950 px-6">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          🔐 เข้าสู่ระบบ Watchtower
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control w-full"
              placeholder="admin"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control w-full"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className={`btn-primary w-full flex justify-center items-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-sign-in-alt mr-2"></i> เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
