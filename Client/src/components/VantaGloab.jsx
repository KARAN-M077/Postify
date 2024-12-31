import React, { useEffect, useRef } from "react";

const VantaBackground = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect;

    if (window.VANTA) {
      vantaEffect = window.VANTA.GLOBE({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xf75607,
        size: 1,
        backgroundColor: 0x0
      });
    }

    // Cleanup on unmount
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return <div ref={vantaRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default VantaBackground;
