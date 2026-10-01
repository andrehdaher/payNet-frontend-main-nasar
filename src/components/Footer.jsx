import React from "react";

const Footer = ({ fixed = true }) => {
  return (
    <footer className={`${fixed ? 'fixed inset-x-0 bottom-0 z-40 shadow-[0_-6px_18px_rgba(15,23,42,0.06)] backdrop-blur' : 'mt-auto shrink-0'} flex h-12 items-center justify-center border-t border-slate-200 bg-white/95 px-3 text-center text-slate-600`} dir="rtl">
      <p className="truncate text-xs font-medium sm:text-sm">
        <span>&copy;2025 Developed by </span><span className="text-violet-700">Andreh Daher</span> - <span className="text-violet-700">Eli Daher</span>
      </p>
    </footer>
  );
};

export default Footer;
