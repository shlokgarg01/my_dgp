import React from "react";
import Colors from "../../utils/Colors";
import "../../styles/ComponentStyles.css";
import { ReactComponent as Loader } from "./Spinner.svg";

export default function Btn({ title, onClick, loading, smallButton, bgColor, noMargin, leftMargin = false, btnHeight = 40 ,  disabled = false,...rest}) {
  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: 'center',
        width: smallButton ? "40%" : "100%",
        height: btnHeight,
        backgroundColor: bgColor || Colors.PRIMARY,
        color: Colors.WHITE,
        border: 0,
        height: 48,
        borderRadius: 5,
        marginTop: noMargin ? 0 : 25,
        marginBottom: noMargin ? 0 : 10,
        marginLeft: leftMargin ? 7 : 0,
        fontSize: 20,
      }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader className="spinner" /> : title}
    </button>
  );
}
