import React from "react";
import Logo from "../../images/logo.png";

export default function LogoHeader() {
  return (
    <div style={{ marginBottom: 10, textAlign: "center" }}>
      <img src={Logo} style={{ height: 40, width: 40, borderRadius: 100 }} alt="" />
    </div>
  );
}
