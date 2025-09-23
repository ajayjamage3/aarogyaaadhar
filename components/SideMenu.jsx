'use client';

import { useState } from 'react';
import { FaBars, FaTimes, FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome className="mr-3" />, href: '/dashboard' },
    { name: 'Create Customer', icon: <FaUser className="mr-3" />, href: '/create-customer' },
    { name: 'View Customers', icon: <FaCog className="mr-3" />, href: '/view-customers' },
    {
      name: "Logout",
      icon: <FaSignOutAlt className="mr-3" />,
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  return (
    <div className="relative flex-shrink-0">
      {/* Mobile toggle */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md focus:outline-none shadow-md"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white text-gray-800 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center bg-green-600 text-white text-xl font-bold shadow">
          My App
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto mt-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center px-6 py-3 hover:bg-green-100 hover:text-green-700 transition-colors rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      item.onClick?.();
                    }}
                    className="w-full text-left flex items-center px-6 py-3 hover:bg-green-100 hover:text-green-700 transition-colors rounded"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
          © {new Date().getFullYear()} My App
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 md:hidden z-30"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
}
