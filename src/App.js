import React, { Component } from "react";
import * as faceapi from "@vladmandic/face-api";
import Navigation from "./Components/Navigation/Navigation";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";
import Logo from "./Components/Logo/Logo";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm.js/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import ParticlesBg from "particles-bg";
import "./App.css";

const particlesOptions = {
  num: [10, 20],
  rps: 0.1,
  radius: [5, 40],
  life: [1.5, 3],
  v: [2, 3],
  tha: [-40, 40],
  alpha: [0.6, 0],
  scale: [1, 0.1],
  position: "absolute",
  zIndex: -1,
  top: 0,
  left: 0,
  color: ["random", "#ff0000"],
  cross: "dead",
  random: 15,
  g: 5,
  onParticleUpdate: (ctx, particle) => {
    ctx.beginPath();
    ctx.rect(
      particle.p.x,
      particle.p.y,
      particle.radius * 3,
      particle.radius * 3,
    );
    ctx.fillStyle = particle.color;
    ctx.fill();
    ctx.closePath();
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "SignIn",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    password: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    this.loadModels();
  }

  loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model",
      );
      await faceapi.nets.faceLandmark68Net.loadFromUri(
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model",
      );
      console.log("Face detection models loaded");
    } catch (err) {
      console.log("Model loading error:", err);
    }
  };

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    const proxiedUrl = `http://localhost:3001/proxy-image?url=${encodeURIComponent(this.state.input)}`;
    this.setState({ imageUrl: proxiedUrl });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = proxiedUrl;
    img.onload = async () => {
      const imageElement = document.getElementById("inputimage");
      if (!imageElement) return;

      await new Promise((resolve) => {
        if (imageElement.complete && imageElement.naturalWidth > 0) resolve();
        else imageElement.onload = resolve;
      });

      try {
        const detections = await faceapi
          .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detections.length > 0) {
          const face = detections[0].detection.box;
          const displayWidth = Number(imageElement.width);
          const displayHeight = Number(imageElement.height);
          const naturalWidth = imageElement.naturalWidth;
          const naturalHeight = imageElement.naturalHeight;

          const scaleX = displayWidth / naturalWidth;
          const scaleY = displayHeight / naturalHeight;

          const box = {
            leftCol: face.x * scaleX,
            topRow: face.y * scaleY,
            rightCol: displayWidth - (face.x + face.width) * scaleX,
            bottomRow: displayHeight - (face.y + face.height) * scaleY,
          };
          this.setState({ box: box });
        }
      } catch (err) {
        console.log("Face detection error:", err);
      }

      fetch("http://localhost:3001/image", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: this.state.user.id }),
      })
        .then((response) => response.json())
        .then((count) => {
          this.setState(Object.assign(this.state.user, { entries: count }));
        })
        .catch((err) => console.log("Entry update error:", err));
    };
  };

  onRouteChange = (route) => {
    if (route === "SignOut") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" config={particlesOptions} bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRoutechange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "SignIn" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
