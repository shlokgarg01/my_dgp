import React from "react";
import Colors from "../../utils/Colors";
import "../../styles/ComponentStyles.css";
import { ReactComponent as Loader } from "./Spinner.svg";

export default function Btn({ title, onClick, loading, smallButton, bgColor, noMargin, leftMargin = false, btnHeight = 40 }) {
  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: 'center',
        width: smallButton ? "40%" : "90%",
        height: btnHeight,
        backgroundColor: bgColor || Colors.PRIMARY,
        color: Colors.WHITE,
        borderRadius: 10,
        border: 0,
        marginTop: noMargin ? 0 : 25,
        marginBottom: noMargin ? 0 : 10,
        marginLeft: leftMargin ? 7 : 0,
        fontSize: 20,
      }}
    >
      {loading ? <Loader className="spinner" /> : title}
    </button>
  );
}
