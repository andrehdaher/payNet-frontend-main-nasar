import Footer from "./Footer";
import Navbar from "./NavBar";

export default function ScreenWrapper({ children, className = "", withNav = true, fullWidth = false }) {
    return (
        <div dir="rtl" className={`min-h-screen bg-slate-50 pt-20 pb-16 text-slate-900 ${className}`}>
            {withNav && <Navbar />}
            <main className={fullWidth ? "w-full px-4 pb-6 sm:px-6" : "mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 lg:px-8"}>
                {children}
            </main>
            <Footer />
        </div>
    )
}
