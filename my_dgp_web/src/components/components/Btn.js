import React from "react";
import Colors from "../../utils/Colors";
import "../../styles/ComponentStyles.css";
import { ReactComponent as Loader } from "./Spinner.svg";

export default function Btn({ title, onClick, loading, smallButton }) {
  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: 'center',
        width: smallButton ? "40%" : "90%",
        height: 40,
        backgroundColor: Colors.PRIMARY,
        color: Colors.WHITE,
        borderRadius: 10,
        border: 0,
        marginTop: 25,
        marginBottom: 10,
        fontSize: 20,
      }}
    >
      {loading ? <Loader className="spinner" /> : title}
    </button>
  );
}
