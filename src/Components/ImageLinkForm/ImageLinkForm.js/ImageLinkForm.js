import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  const demoUrl =
    "https://plus.unsplash.com/premium_photo-1679415150611-9b24a9d3ce48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bXVsdGlwbGUlMjBmYWNlc3xlbnwwfHwwfHx8MA%3D%3D";

  const handleDemo = () => {
    onInputChange({ target: { value: demoUrl } });
    // Trigger detection after a short delay to let state update
    setTimeout(() => {
      document.querySelector(".grow").click();
    }, 100);
  };

  return (
    <div>
      <p className="f3">
        {"This Magic Brain will detect faces in your pictures. Give it a try."}
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
            placeholder="Paste image URL here..."
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>

        <div className="center mt3">
          <button
            className="f5 link ph3 pv2 dib white bg-dark-gray br3 pointer"
            onClick={handleDemo}
          >
            Try Demo Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
