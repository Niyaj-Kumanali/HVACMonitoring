import React, { useEffect } from 'react';
import '../App.css'

const Headernav: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar") as HTMLDivElement;
      const logo = document.getElementById("logo") as HTMLAnchorElement;

      if (navbar && logo) {
        if (window.scrollY > 75) {
          navbar.style.padding = "30px 10px";
          logo.style.fontSize = "25px";
        } else {
          navbar.style.padding = "80px 10px";
          logo.style.fontSize = "35px";
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

  return (
    <div id="navbar">
      <a href="#default" id="logo">CompanyLogo</a>
      <div id="navbar-right">
        <a className="active" href="#home">Home</a>
        <a href="#contact">Contact</a>
        <a href="#about">About</a>
      </div>
    </div>
  );
};

export default Headernav;
