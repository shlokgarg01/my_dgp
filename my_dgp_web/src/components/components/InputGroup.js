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
  noMargin,
  maxLength =""
}) {
  const handleInputChange = (e) => {
    if (type === "number" && maxLength) {
      if (e.target.value.length <= maxLength) {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };
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
        paddingRight: 10,
        padding: 5
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
          marginRight: 10,
          height: 34,
          outline: "none", // removes border on focus
          borderRadius: roundedBorder ? 100 : 7,
        }}
        value={value}
        onChange={handleInputChange}
      />
      {trailingIcon}
    </div>
  );
}
