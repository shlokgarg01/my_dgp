import React from "react";
import Colors from "../../utils/Colors";

export default function InputGroup({
  placeholder,
  value,
  onChange,
  type,
  icon,
  bgColor,
  disabled,
  roundedBorder,
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor ? bgColor : Colors.WHITE,
        display: "flex",
        flexDirection: "row",
        borderRadius: roundedBorder ? 100 : 7,
        alignItems: "center",
        marginTop: 16,
        paddingLeft: 10,
      }}
    >
      {icon}
      <input
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        style={{
          color: Colors.BLACK,
          backgroundColor: bgColor ? bgColor : Colors.WHITE,
          width: "100%",
          borderWidth: 0,
          paddingLeft: 10,
          height: 34,
          outline: "none", // removes border on focus
          borderRadius: roundedBorder ? 100 : 7,
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
