"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "../../components/top-nav";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer";

export default function UnauthorizedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000); // 3 วิ

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-black flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-red-400">🚫 Unauthorized</h1>
            <p className="text-lg mb-6 text-gray-300">
              คุณไม่มีสิทธิ์เข้าถึงหน้านี้<br />
              ระบบจะนำคุณกลับไปที่ Dashboard ภายใน 3 วินาที
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary px-6 py-2 rounded-full"
            >
              ⏎ กลับไปหน้า Dashboard ทันที
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
