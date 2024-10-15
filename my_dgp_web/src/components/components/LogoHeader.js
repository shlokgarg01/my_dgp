import React from "react";
import Logo from "../../images/logo_white.JPG";
import { IoIosArrowDropleftCircle  } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Colors from "../../utils/Colors.js";

export default function LogoHeader({ showLogo, backAction,heading }) {
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
        <IoIosArrowDropleftCircle 
          onClick={() => backAction ? backAction():navigate(-1)} 
          size={30}
          color={Colors.BLACK}
        />
      {showLogo && (
        <img
          src={Logo}
          style={{
            marginRight: '44%',
            // margin: "0 auto",
            height: 60,
            width: 60,
            borderRadius: 100,
          }}
          alt=""
        />
      )}
      {heading && (
        <div style={{flex:1,textAlign:'center',marginLeft:-12}} >{heading}</div>
      )}
    </div>
  );
}
