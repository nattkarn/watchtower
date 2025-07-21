"use client";

import { useState, useEffect } from "react";
import TopNav from "@/app/components/top-nav";
import Sidebar from "@/app/components/sidebar";
import Footer from "@/app/components/footer";
import Modal from "@/app/components/modal";
import api from "@/app/util/AxiosInstance";
import Swal from "sweetalert2";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [line, setLine] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setrole] = useState("user");
  const [status, setStatus] = useState("active");
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/user`, {
        withCredentials: true,
      });

      setUsers(res.data);
      // console.log(res.data);
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

  const handleSave = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        title: "Password และ Confirm Password ไม่ตรงกัน",
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    const payload: any = {
      username,
      email,
      tel: tel,
      line: line,
      role,
      status,
    };
    console.log('payload', payload);

    if (password && password.trim() !== "") {
      payload.password = password;
    }

    try {
      if (id === null) {
        await api.post(`/user/signup`, payload);
      } else {
        // console.log('update user', payload.password);
        await api.patch(`/user/update-user/${id}`, payload, {
          withCredentials: true,
        });
      }

      fetchUsers();
      resetForm();
      setShowModal(false);
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

  const handleEdit = async (user: any) => {
    try {
      const res = await api.get(`/user/find-user/${user.username}`, {
        withCredentials: true,
      });

      const fetchedUser = res.data.data;

      setId(fetchedUser.id);
      setUsername(fetchedUser.username);
      setEmail(fetchedUser.email || "");
      setTel(fetchedUser.tel || "");
      setLine(fetchedUser.line || "");
      setrole(fetchedUser.role);
      setStatus(fetchedUser.status);
      setPassword("");
      setConfirmPassword("");
      setShowModal(true);
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
  const handleDelete = async (id: number) => {
    if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่")) return;

    await api.delete(`/user/delete-user/${id}`, {
      withCredentials: true,
    });
    fetchUsers();
  };

  const resetForm = () => {
    setId(null);
    setUsername("");
    setEmail("");
    setTel("");
    setLine("");
    setPassword("");
    setConfirmPassword("");
    setrole("USER");
    setStatus("INACTIVE");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">จัดการผู้ใช้</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              + เพิ่มผู้ใช้
            </button>
          </div>

          <table className="table-auto w-full text-left text-sm mt-4">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">LINE ID</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">จัดการผู้ใช้</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-t border-gray-700">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.tel}</td>
                  <td className="px-4 py-2">{user.line}</td>
                  <td className="px-4 py-2">{user.role.name}</td>
                  <td className="px-4 py-2">{user.status}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-400 hover:underline mr-2"
                      onClick={() => handleEdit(user)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDelete(user.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="เพิ่ม/แก้ไขผู้ใช้"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Phone
                </label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  LINE ID
                </label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Role
                </label>
                <select
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={role}
                  onChange={(e) => setrole(e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
                  onClick={handleSave}
                >
                  บันทึก
                </button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
      <Footer />
    </div>
  );
}
