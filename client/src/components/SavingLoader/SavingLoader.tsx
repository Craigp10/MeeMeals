// import "./SavingLoader.css";
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";


const clipStyler = {
  display: "block",
  margin: "0 auto",
  cursor: "default",
  // color: "lightGray",
};

const SavingLoader = (props: any) => {
  const [saveTimer, setSaveTimer] = useState(0);

  useEffect(() => {
    setSaveTimer(0);
  }, [props]);

  useEffect(() => {
    //Timer that counts and removes saved message from user display after 5 seconds of no new saves
    const timer: NodeJS.Timer = setTimeout(() => {
      setSaveTimer(saveTimer + 1);
    }, 1000);
    if (saveTimer == 5) {
      props.setSaveObject({
        saving: false,
        status: "",
      });
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [saveTimer]);

  return (
    <div className="saving-loader-wrapper">
      {props.saving ? (
        <ClipLoader
          // @ts-ignore 
          css={clipStyler}
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
