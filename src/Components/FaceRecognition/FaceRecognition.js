import React from "react";
import "./FaceRecogNition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          crossOrigin="anonymous"
          width="500px"
          height="auto"
        />
        {boxes &&
          boxes.map((box) => (
            <div key={box.id}>
              <div
                className="bounding-box"
                style={{
                  top: box.topRow,
                  right: box.rightCol,
                  bottom: box.bottomRow,
                  left: box.leftCol,
                }}
              ></div>
              <span
                style={{
                  position: "absolute",
                  top: box.topRow - 20,
                  left: box.leftCol,
                  color: "#00ff00",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Face {box.id + 1}: {box.confidence}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
