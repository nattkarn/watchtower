"use client";

import { useState } from "react";
import TopNav from "../../components/top-nav";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer";
import Modal from "../../components/modal";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockData = {
    totalUrls: 12,
    errorUrls: 2,
    expiringSSL: 3,
    recentAlerts: [
      {
        message: "SSL ของ https://abc.com กำลังจะหมดอายุ",
        time: "5 นาทีที่แล้ว",
      },
      {
        message: "URL https://example.net ไม่ตอบสนอง",
        time: "15 นาทีที่แล้ว",
      },
      {
        message: "SSL ของ https://foobar.dev หมดอายุแล้ว",
        time: "1 ชั่วโมงที่แล้ว",
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-black ">
          <h1 className="text-3xl font-bold mb-6 text-white">📊 Dashboard</h1>

          {/* สรุปจำนวน URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-indigo-400 mb-1">
                🔗 URLs ทั้งหมด
              </h2>
              <p className="text-3xl font-bold">{mockData.totalUrls}</p>
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold text-red-400 mb-1">
                ❌ URLs ผิดพลาด
              </h2>
              <p className="text-3xl font-bold">{mockData.errorUrls}</p>
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold text-yellow-400 mb-1">
                📅 SSL ใกล้หมดอายุ
              </h2>
              <p className="text-3xl font-bold">{mockData.expiringSSL}</p>
            </div>
          </div>

          {/* กล่องแจ้งเตือน */}
          <div className="card mb-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-white">
                🔔 แจ้งเตือนล่าสุด
              </h2>
              <div className="flex space-x-2">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 text-sm"
                  onClick={() => alert("ดูทั้งหมด")}
                >
                  ดูทั้งหมด
                </button>
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 text-sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  ➕ เพิ่ม URL
                </button>
              </div>
            </div>
            <ul className="text-sm space-y-2">
              {mockData.recentAlerts.map((alert, i) => (
                <li key={i} className="border-b border-gray-700 pb-2">
                  <p>{alert.message}</p>
                  <span className="text-gray-400 text-xs">{alert.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
      <Footer />

      {/* Modal เพิ่ม URL */}
      <Modal
        title="เพิ่ม URL ใหม่"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <label className="block text-gray-300 mb-1">URL</label>
          <input
            type="url"
            className="form-control mb-4"
            placeholder="https://example.com"
            required
          />
          <button type="submit" className="btn-primary">
            บันทึก
          </button>
        </form>
      </Modal>
    </div>
  );
}
