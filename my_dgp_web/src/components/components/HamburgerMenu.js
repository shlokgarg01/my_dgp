import { slide as Menu } from "react-burger-menu";
import React, { useState, useEffect } from 'react';
import Colors from "../../utils/Colors";
import { Link } from "react-router-dom";

export default function HamburgerMenu() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  var styles = {
    bmBurgerButton: {
      position: "fixed",
      width: "25px",
      height: "24px",
      left: windowWidth <= 768 ? "3%" : "2%", // Adjust value for mobile
      top: "15px",
    },
    bmBurgerBars: {
      background: Colors.DARK_GRAY,
    },
    // bmBurgerBarsHover: {
    //   background: "#a90000",
    // },
    bmCrossButton: {
      height: "24px",
      width: "24px",
    },
    bmCross: {
      background: Colors.BLACK,
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
    },
    bmMenu: {
      background: Colors.WHITE,
      padding: "2.5em 1.5em 0",
      fontSize: "1.15em",
    },
    bmMorphShape: {
      fill: "#373a47",
    },
    bmItemList: {
      color: "#b8b7ad",
      padding: "0.8em",
    },
    bmItem: {
      textDecoration: 'none',
      color: Colors.PRIMARY,
      marginTop: 10
      // display: "inline-block",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)",
      zIndex:1100
    },
  };

  return (
    <div style={{ zIndex: 10000000 }}>
      <Menu styles={styles}>
      <Link id="home" className="menu-item" to="/">
        Home       
      </Link>
        <Link id="home" className="menu-item" to="/terms-and-conditions">
          Terms & Conditions
        </Link>
        <Link id="home" className="menu-item"  to="/privacy-policy">
          Privacy Policy
        </Link>
        <Link id="home" className="menu-item" to="/refund-policy">
          Refund Policy
        </Link>
        <Link id="home" className="menu-item" to="/help">
          Help
        </Link>
        {/* <a id="about" className="menu-item" href="/about">
          About
        </a>
        <a id="contact" className="menu-item" href="/contact">
          Contact Us
        </a> */}
      </Menu>
    </div>
  );
}
