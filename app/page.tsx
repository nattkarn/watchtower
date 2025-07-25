'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { config } from '../app/config';
import { differenceInDays, parseISO } from 'date-fns';

export default function Home() {
  const router = useRouter();

  const [urls, setUrls] = useState<any[]>([]);

  // 👉 คำนวณจาก urls ไม่ต้องสร้าง state เพิ่ม
  const totalUrls = urls.length;
  const errorUrlsCount = urls.filter((u) => u.status === 'inactive').length;
  const expiringSSLCount = urls.filter((u) => {
    if (!u.sslExpireDate) return false;
    const daysLeft = differenceInDays(parseISO(u.sslExpireDate), new Date());
    return daysLeft <= 15;
  }).length;

  useEffect(() => {
    const token = localStorage.getItem('watchtower_user_refreshToken');
    if (token) {
      router.push('/dashboard');
      return;
    }

    const fetchUrls = async () => {
      try {

        console.log('apiUrl',config.apiUrl);
        const response = await axios.get(`${config.apiUrl}/api/monitor/homepage-url`, {
        });
        setUrls(response.data);
      } catch (error) {
        console.error('Error fetching URL data:', error);
      }
    };

    fetchUrls();
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-300 px-6">
      <motion.div
        className="text-center max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.img
          src="/watchtower-icon.png"
          alt="Watchtower Logo"
          className="w-20 h-20 mx-auto mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">
          Welcome to Watchtower
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          ระบบเฝ้าระวังสถานะเว็บไซต์และใบรับรอง SSL <br /> สำหรับนักพัฒนาและ DevOps โดยเฉพาะ
        </p>

        <motion.div
          className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-left mb-6 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-sm text-indigo-400 mb-1 font-bold uppercase">
            สถานะระบบเบื้องต้น
          </p>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>🔗 URLs ทั้งหมด: {totalUrls}</li>
            <li>❌ URLs ผิดพลาด: {errorUrlsCount}</li>
            <li>📅 SSL ใกล้หมดอายุ: {expiringSSLCount}</li>
          </ul>
        </motion.div>

        <motion.button
          onClick={() => router.push('/login')}
          className="btn-primary px-6 py-2 text-lg rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fa-solid fa-right-to-bracket mr-2" />
          เข้าสู่ระบบ
        </motion.button>
      </motion.div>
    </main>
  );
}
