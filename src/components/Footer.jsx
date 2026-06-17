import React from "react";

const Footer = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 flex h-12 items-center justify-center border-t border-slate-200 bg-white/95 px-3 text-center text-slate-600 shadow-[0_-6px_18px_rgba(15,23,42,0.06)] backdrop-blur" dir="rtl">
      <p className="truncate text-xs font-medium sm:text-sm">
        <span>&copy;2025 Developed by </span><span className="text-violet-700">Andreh Daher</span> - <span className="text-violet-700">Eli Daher</span>
      </p>
    </footer>
  );
};

export default Footer;
