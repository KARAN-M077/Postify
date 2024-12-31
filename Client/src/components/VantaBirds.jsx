import React, { useEffect, useRef } from "react";

const VantaBirds = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect;

    // Ensure VANTA is available globally
    if (window.VANTA && window.VANTA.BIRDS) {
      vantaEffect = window.VANTA.BIRDS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0xffffff,
        color1: 0x0,
        separation: 30.0,
        alignment: 26.0,
      });
    }

    // Cleanup on unmount
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return <div ref={vantaRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default VantaBirds;
