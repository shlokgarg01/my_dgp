import React from "react";
import Colors from "../../utils/Colors";

export default function Btn({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "90%",
        height: 40,
        backgroundColor: Colors.PRIMARY,
        color: Colors.WHITE,
        marginLeft: "5%",
        borderRadius: 10,
        border: 0,
        marginTop: 25,
        marginBottom: 10,
        fontSize: 20
      }}
    >
      {title}
    </button>
  );
}
