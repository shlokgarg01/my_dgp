import { slide as Menu } from "react-burger-menu";
import React from "react";
import Colors from "../../utils/Colors";

export default function HamburgerMenu() {
  var styles = {
    bmBurgerButton: {
      position: "fixed",
      width: "28px",
      height: "25px",
      left: "2%",
      top: "2%",
    },
    bmBurgerBars: {
      background: Colors.BLACK,
    },
    // bmBurgerBarsHover: {
    //   background: "#a90000",
    // },
    bmCrossButton: {
      height: "24px",
      width: "24px",
    },
    bmCross: {
      background: Colors.WHITE,
    },
    bmMenuWrap: {
      position: "fixed",
      height: "100%",
    },
    bmMenu: {
      background: Colors.PRIMARY,
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
      color: Colors.WHITE,
      marginTop: 10
      // display: "inline-block",
    },
    bmOverlay: {
      background: "rgba(0, 0, 0, 0.3)",
    },
  };

  return (
    <div style={{ zIndex: 10000000 }}>
      <Menu styles={styles}>
        <a id="home" className="menu-item" href="/">
          Terms & Conditions
        </a>
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
