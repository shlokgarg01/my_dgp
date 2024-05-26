import React from "react";
import Colors from "../../utils/Colors";

export default function InputGroup({
  placeholder,
  value,
  onChange,
  type,
  icon,
  trailingIcon,
  bgColor,
  disabled,
  roundedBorder,
  noMargin
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor ? bgColor : Colors.WHITE,
        display: "flex",
        flexDirection: "row",
        borderRadius: roundedBorder ? 100 : 7,
        alignItems: "center",
        marginTop: noMargin ? 0 : 16,
        paddingLeft: 10,
        paddingRight: 10
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
          marginRight: 100,
          height: 34,
          outline: "none", // removes border on focus
          borderRadius: roundedBorder ? 100 : 7,
        }}
        value={value}
        onChange={onChange}
      />
      {trailingIcon}
    </div>
  );
}
