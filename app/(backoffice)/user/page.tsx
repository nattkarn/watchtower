'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import TopNav from '@/app/components/top-nav';
import Sidebar from '@/app/components/sidebar';
import Footer from '@/app/components/footer';
import Modal from '@/app/components/modal';
import { config } from '@/app/config';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [line, setLine] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [level, setLevel] = useState('user');
  const [status, setStatus] = useState('active');
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(`${config.apiUrl}/api/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("watchtower_user_token")}`,
      },
    });
    setUsers(res.data);
  };

  const handleSave = async () => {
    if (password !== confirmPassword) {
      alert('Password และ Confirm Password ไม่ตรงกัน');
      return;
    }

    const payload: any = {
        username,
        email,
        tel: tel,
        line: line,
        level,
        status
      };
    
      if (password && password.trim() !== '') {
        payload.password = password;
      }

    try {
      if (id === null) {
        await axios.post(`${config.apiUrl}/api/user/signup`, payload);
      } else {
        // console.log('update user', payload.password);
        await axios.patch(`${config.apiUrl}/api/user/update-user/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("watchtower_user_token")}`,
          },
        });
      }

      fetchUsers();
      resetForm();
      setShowModal(false);
    } catch (error: any) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = async (user: any) => {
    try {
      const res = await axios.get(`${config.apiUrl}/api/user/find-user/${user.username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("watchtower_user_token")}`,
        },
      });
  
      const fetchedUser = res.data.data;
  
      setId(fetchedUser.id);
      setUsername(fetchedUser.username);
      setEmail(fetchedUser.email || '');
      setTel(fetchedUser.tel || '');
      setLine(fetchedUser.line || '');
      setLevel(fetchedUser.level);
      setStatus(fetchedUser.status);
      setPassword('');
      setConfirmPassword('');
      setShowModal(true);
    } catch (error: any) {
      alert('ไม่สามารถโหลดข้อมูลผู้ใช้ได้: ' + (error.response?.data?.message || error.message));
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('ต้องการลบผู้ใช้นี้หรือไม่')) return;

    await axios.delete(`${config.apiUrl}/api/user/delete-user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("watchtower_user_token")}`,
      },
    });
    fetchUsers();
  };

  const resetForm = () => {
    setId(null);
    setUsername('');
    setEmail('');
    setTel('');
    setLine('');
    setPassword('');
    setConfirmPassword('');
    setLevel('user');
    setStatus('active');
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
                <th className="px-4 py-2">Level</th>
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
                  <td className="px-4 py-2">{user.level}</td>
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

          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="เพิ่ม/แก้ไขผู้ใช้">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Username</label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Email</label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Phone</label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">LINE ID</label>
                <input
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Level</label>
                <select
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">Status</label>
                <select
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white p-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
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
