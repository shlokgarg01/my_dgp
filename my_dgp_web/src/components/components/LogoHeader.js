import React from "react";
import Logo from "../../images/logo.png";
import { IoIosArrowDropleft } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Colors from "../../utils/Colors.js";

export default function LogoHeader({ showLogo }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <IoIosArrowDropleft
        onClick={() => navigate(-1)}
        size={40}
        color={Colors.BLACK}
      />
      {showLogo && (
        <img
          src={Logo}
          style={{
            margin: "0 auto",
            height: 40,
            width: 40,
            borderRadius: 100,
          }}
          alt=""
        />
      )}
    </div>
  );
}
