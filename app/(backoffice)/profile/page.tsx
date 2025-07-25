"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/app/components/top-nav";
import Sidebar from "@/app/components/sidebar";
import Footer from "@/app/components/footer";
import Modal from "@/app/components/modal";
import Swal from "sweetalert2";
import api from "@/app/util/AxiosInstance";

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editLine, setEditLine] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("watchtower_user_refreshToken");
    if (!token) {
      router.push("/");
      return;
    }

    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.post(
        `/user/user-info`,
        {},
        {
          withCredentials: true,
        }
      );

      setUser(res.data.data);
    } catch (error: any) {
      
      Swal.fire({
        title: `ไม่สามารถโหลดข้อมูลผู้ใช้ได้ ${error.response?.data?.message || error.message}`,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const handleUpdateContact = async () => {
    try {
      await api.patch(
        `/user/update-contract/${user.id}`,
        {
          tel: editPhone,
          line: editLine,
        },
        {
          withCredentials: true,
        }
      );
      Swal.fire({
        title: "อัปเดตข้อมูลติดต่อสำเร็จ",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      setShowContactModal(false);
      fetchUserProfile();
    } catch (error: any) {
      Swal.fire({
        title: `${error.response?.data?.message || error.message}`,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Swal.fire({
        title: "กรุณากรอกรหัสผ่านให้ครบ",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Password และ Confirm Password ไม่ตรงกัน",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      await api.patch(
        `/user/change-password`,
        { password: newPassword },
        {
          withCredentials: true,
        }
      );
      Swal.fire({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Swal.fire({
        title: error.response?.data?.message || error.message,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-white bg-gray-900 min-h-screen">
        <p>กำลังโหลดข้อมูลผู้ใช้...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">โปรไฟล์ของฉัน</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-xl shadow-lg">
            <div>
              <label className="text-gray-400">Username</label>
              <p className="text-lg">{user.username}</p>
            </div>

            <div>
              <label className="text-gray-400">ระดับผู้ใช้</label>
              <p className="text-lg">{user.level}</p>
            </div>

            <div>
              <label className="text-gray-400">สถานะ</label>
              <p className="text-lg">{user.status}</p>
            </div>

            <div>
              <label className="text-gray-400">เบอร์โทรศัพท์</label>
              <p className="text-lg">{user.tel || "-"}</p>
            </div>

            <div>
              <label className="text-gray-400">LINE ID</label>
              <p className="text-lg">{user.line || "-"}</p>
            </div>

            <div>
              <label className="text-gray-400">Email</label>
              <p className="text-lg">{user.email || "-"}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                setEditPhone(user.tel || "");
                setEditLine(user.line || "");
                setShowContactModal(true);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              แก้ไขข้อมูลติดต่อ
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </div>
        </main>
      </div>

      {/* Modal: Contact Info */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="แก้ไขข้อมูลติดต่อ"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">
              Phone
            </label>
            <input
              className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">
              LINE ID
            </label>
            <input
              className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
              value={editLine}
              onChange={(e) => setEditLine(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
              onClick={handleUpdateContact}
            >
              บันทึก
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Change Password */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="เปลี่ยนรหัสผ่าน"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
              onClick={handleChangePassword}
            >
              บันทึก
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
