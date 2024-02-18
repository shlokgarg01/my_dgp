import React from "react";
import Loader from "react-js-loader";
import Colors from "../utils/Colors";

export default function LoaderComponent() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0, 0.2)",
        zIndex: 5,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 40,
          height: "100%",
        }}
      >
        <Loader type="spinner-default" bgColor={Colors.PRIMARY} size={100} />
      </div>
    </div>
  );
}
