// import "./SavingLoader.css";
import React from "react";
import { ClipLoader } from "react-spinners";

const SavingLoader = (props) => {
  return (
    <div className="saving-loader-wrapper">
      {props.saving ? (
        <ClipLoader
          css={{
            display: "block",
            margin: "0 auto",
            cursor: "default",
            // color: "lightGray",
          }}
          loading={props.saving}
          size={30}
          color={"lightGray"}
        />
      ) : (
        <p
          style={{
            fontStyle: "italic",
            fontSize: "1.2rem",
            color: "lightGray",
          }}
        >
          changes saved
        </p>
      )}
    </div>
  );
};

export default SavingLoader;
