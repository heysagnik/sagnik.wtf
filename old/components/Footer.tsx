"use client";

import { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString());
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="mt-8 flex justify-between items-center text-gray-500">
      <p className="text-gray-400">Sagnik Sahoo</p>
      <p className="text-gray-400">{time}</p>
    </footer>
  );
};

export default Footer;