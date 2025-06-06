"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import TopNav from "../../components/top-nav";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer";
import Modal from "../../components/modal";
import { config } from "../../config";
import { differenceInDays, parseISO } from "date-fns";
import Swal from "sweetalert2";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [userLevel, setUserLevel] = useState<string | null>(null);
  const [urls, setUrls] = useState<any[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [label, setLabel] = useState("");
  const [sslExpireDate, setSslExpireDate] = useState("");

  // Export CSV modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [useDateFilter, setUseDateFilter] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const level = localStorage.getItem("watchtower_user_level");
    setUserLevel(level);
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/api/monitor/get-all-url`, {
        withCredentials: true,
      });
      setUrls(res.data);
    } catch (error) {
      console.error("❌ Error fetching URL data:", error);
    }
  };

  const totalUrls = urls.length;
  const errorUrls = urls.filter((u) => u.status === "inactive").length;
  const expiringSSL = urls.filter((u) => {
    if (!u.sslExpireDate) return false;
    const daysLeft = differenceInDays(parseISO(u.sslExpireDate), new Date());
    return daysLeft <= 15;
  }).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editId !== null) {
        await axios.patch(
          `${config.apiUrl}/api/monitor/update-url/${editId}`,
          {
            url: newUrl,
            label,
            sslExpireDate: sslExpireDate || undefined,
          },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${config.apiUrl}/api/monitor/create-url`,
          {
            url: newUrl,
            label,
            sslExpireDate: sslExpireDate || undefined,
          },
          { withCredentials: true }
        );
      }
      resetForm();
      fetchUrls();
    } catch (error: any) {
      alert(
        "❌ ไม่สามารถดำเนินการได้: " +
          (error?.response?.data?.message || "Unknown error")
      );
      console.error(error);
    }
  };

  const resetForm = () => {
    setNewUrl("");
    setLabel("");
    setSslExpireDate("");
    setEditId(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleExportCsv = async () => {
    try {
      const url = useDateFilter
        ? `${config.apiUrl}/api/report/export-csv-date`
        : `${config.apiUrl}/api/report/export-csv`;

      const payload = useDateFilter ? { fromDate, toDate } : {};

      const res = await axios.post(url, payload, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "url_report.csv";
      a.click();
      window.URL.revokeObjectURL(downloadUrl);

      setIsExportModalOpen(false);
      setUseDateFilter(false);
      setFromDate("");
      setToDate("");
    } catch (error) {
      console.error("❌ Error exporting CSV:", error);
      alert("ไม่สามารถ Export ได้");
    }
  };

  const handleManualCheck = async () => {
    try {
      const res = await axios.post(
        `${config.apiUrl}/api/scheduler/manual-check`,
        {},
        { withCredentials: true }
      );
      Swal.fire("✅ Manual health check started. Refreshing data...");

      // ⭐ Wait a bit → ให้ DB update เสร็จก่อน
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 sec
  
      // ⭐ Refresh URL list
      await fetchUrls();
    } catch (error) {
      console.error("❌ Error running manual health check:", error);
      Swal.fire("❌ ไม่สามารถเริ่ม Manual Health Check ได้");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-black text-white">
          <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-indigo-400 mb-1">
                🔗 URLs ทั้งหมด
              </h2>
              <p className="text-3xl font-bold">{totalUrls}</p>
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold text-red-400 mb-1">
                ❌ URLs ผิดพลาด
              </h2>
              <p className="text-3xl font-bold">{errorUrls}</p>
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold text-yellow-400 mb-1">
                📅 SSL ใกล้หมดอายุ
              </h2>
              <p className="text-3xl font-bold">{expiringSSL}</p>
            </div>
          </div>

          <div className="card mb-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">🔔 รายการ URL</h2>
              {userLevel === "admin" && (
                <div className="flex space-x-2">
                  <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 text-sm"
                    onClick={() => setIsModalOpen(true)}
                  >
                    ➕ เพิ่ม URL
                  </button>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 text-sm"
                    onClick={() => setIsExportModalOpen(true)}
                  >
                    📥 Export CSV
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
                    onClick={handleManualCheck}
                  >
                    🔄 Refresh (Manual Check)
                  </button>
                </div>
              )}
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-2">สถานะ</th>
                  <th className="py-2">URL</th>
                  <th className="py-2">Label</th>
                  <th className="py-2">SSL หมดอายุ</th>
                  <th className="py-2">เช็คล่าสุด</th>
                  <th className="py-2">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((item, i) => {
                  const daysLeft = item.sslExpireDate
                    ? differenceInDays(parseISO(item.sslExpireDate), new Date())
                    : null;
                  const statusColor =
                    item.status === "inactive" ? "bg-red-500" : "bg-green-500";
                  return (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="py-2">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${statusColor}`}
                        ></span>
                      </td>
                      <td className="py-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          🔗 {item.url}
                        </a>
                      </td>
                      <td className="py-2">{item.label}</td>
                      <td className="py-2">
                        {item.sslExpireDate
                          ? `${daysLeft} วัน (${item.sslExpireDate.slice(
                              0,
                              10
                            )})`
                          : "—"}
                      </td>
                      <td className="py-2">
                        {item.lastCheckedAt
                          ? new Date(item.lastCheckedAt).toLocaleString("th-TH")
                          : "—"}
                      </td>
                      <td className="py-2 space-x-2">
                        <button
                          className="text-blue-400 hover:underline"
                          onClick={() => {
                            setIsEditing(true);
                            setEditId(item.id);
                            setLabel(item.label);
                            setNewUrl(item.url);
                            setSslExpireDate(
                              item.sslExpireDate?.slice(0, 10) || ""
                            );
                            setIsModalOpen(true);
                          }}
                        >
                          ✏️ แก้ไข
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />

      {/* Modal: เพิ่ม/แก้ไข URL */}
      <Modal
        title={isEditing ? "✏️ แก้ไข URL" : "➕ เพิ่ม URL"}
        isOpen={isModalOpen}
        onClose={resetForm}
      >
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-300 mb-1">ชื่อ (label)</label>
          <input
            type="text"
            className="form-control mb-4"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="ชื่อที่ใช้แสดง เช่น my API"
            required
          />

          <label className="block text-gray-300 mb-1">URL</label>
          <input
            type="url"
            className="form-control mb-4"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />

          <label className="block text-gray-300 mb-1">
            วันหมดอายุ SSL (ถ้ามี)
          </label>
          <input
            type="date"
            className="form-control mb-4"
            value={sslExpireDate}
            onChange={(e) => setSslExpireDate(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            {isEditing ? "อัปเดต" : "บันทึก"}
          </button>
        </form>
      </Modal>

      {/* Modal: Export CSV */}
      <Modal
        title="📤 Export URL Report"
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      >
        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={useDateFilter}
              onChange={(e) => setUseDateFilter(e.target.checked)}
            />
            <span>กรองด้วยช่วงวันที่</span>
          </label>

          {useDateFilter && (
            <>
              <div>
                <label className="block text-gray-300 mb-1">จากวันที่</label>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">ถึงวันที่</label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            className="btn-primary w-full"
            onClick={handleExportCsv}
            disabled={useDateFilter && (!fromDate || !toDate)}
          >
            📤 ยืนยัน Export
          </button>
        </div>
      </Modal>
    </div>
  );
}
