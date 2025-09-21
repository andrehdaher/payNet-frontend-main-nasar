import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Navbar from "./NavBar";

export default function ScreenWrapper({children, className, withNav=true}) {

    const vantaRef = useRef(null);
        const [vantaEffect, setVantaEffect] = useState(null);
      
        useEffect(() => {
            if (!vantaEffect && window.VANTA) {
                setVantaEffect(
                    window.VANTA.NET({
                        el: vantaRef.current,
                        color: 0xaeaeae,
                        backgroundColor: 0xfbfbfb,
                        points: 3.0,
                        maxDistance: 35.0,
                        spacing: 25.0,
                    })
                );
            }  
            return () => {
                if (vantaEffect) vantaEffect.destroy();
            };
        }, [vantaEffect]);

    return (
        <div dir="rtl" ref={vantaRef} className={`min-h-screen py-16 ${className}`}>
                {children}
            <Footer/>
            {withNav && <Navbar/>}
        </div>
    )
}
