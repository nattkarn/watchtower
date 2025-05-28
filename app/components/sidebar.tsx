'use client';

import Link from 'next/link';

export default function Sidebar() {
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'fa-solid fa-gauge-high',
    },
    {
      title: 'ติดตาม URL',
      href: '/urls',
      icon: 'fa-solid fa-link',
    },
    {
      title: 'ประวัติการแจ้งเตือน',
      href: '/logs',
      icon: 'fa-solid fa-bell',
    },
    {
      title: 'ตั้งค่า',
      href: '/settings',
      icon: 'fa-solid fa-gear',
    },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="sidebar-item">
                <i className={`${item.icon} w-5`}></i>
                <span className="ml-3">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
