import React from "react";
import Colors from "../../utils/Colors";

export default function Btn({ title, onClick ,firstScreen}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: firstScreen ?"100%":"90%",
        height: 40,
        backgroundColor: Colors.PRIMARY,
        color: Colors.WHITE,
        marginLeft:firstScreen ? "0%" :"5%",
        borderRadius:firstScreen ?0: 10,
        border: 0,
        marginTop: 25,
        marginBottom: firstScreen? 0:10,
        fontSize: 20
      }}
    >
      {title}
    </button>
  );
}
