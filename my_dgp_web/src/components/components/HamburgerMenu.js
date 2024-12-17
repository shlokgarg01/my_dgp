import { slide as Menu } from "react-burger-menu";
import React, { useState, useEffect } from 'react';
import Colors from "../../utils/Colors";
import { Link } from "react-router-dom";
import { RiHome7Line, RiLogoutBoxRLine } from "react-icons/ri";
import { PiClockClockwiseDuotone } from "react-icons/pi";
import { BiSupport ,BiMessage    } from "react-icons/bi";

export default function HamburgerMenu() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLogin = () => {
    if (localStorage.getItem('userId')) {
      return true;
    } else {
      return false;
    }
  }

  const renderDivider = () => {
    return (
      <div style={{
        width: '100%',
        height: '1px',
        backgroundColor: Colors.LIGHT_GRAY,
        margin: '10px 0'
      }}></div>
    )
  }

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
      padding: "2em 1em 0",
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
      color: Colors.DARK_GRAY,
      marginTop: 10
      // display: "inline-block",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)",
      zIndex: 1100
    },
  };

  return (
    <div style={{ zIndex: 10000000 }}>
      <Menu styles={styles}>
        <Link id="home" className="menu-item" to="/">
          <RiHome7Line color={Colors.PRIMARY} /> Home
        </Link>
        {renderDivider()}
        {isLogin() && <Link id="home" className="menu-item" to="/my-bookings">
          <PiClockClockwiseDuotone color={Colors.PRIMARY} /> My Bookings
        </Link>}
        {renderDivider()}

        <Link id="home" className="menu-item" to="/aboutus">
          <BiMessage color={Colors.PRIMARY} /> About Us
        </Link>
        <Link id="home" className="menu-item" to="/help">
          <BiSupport color={Colors.PRIMARY} /> Help
        </Link>
        {renderDivider()}

        {isLogin() && <Link id="home" className="menu-item" to="/">
          <RiLogoutBoxRLine color={Colors.PRIMARY} /> Logout
        </Link>}

        {renderDivider()}

      </Menu>
    </div>
  );
}
