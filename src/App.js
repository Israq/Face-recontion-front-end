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
  error: "",
  boxes: [],
  processedImages: [],
  loading: false,
  route: "SignIn",
  isLoading: true,
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

    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://face-recognition-backend-r8nm.onrender.com/verify-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => {
          if (user.id) {
            this.loadUser(user);
            this.setState({
              isSignedIn: true,
              route: "home",
              isLoading: false,
            });
          }
        })
        .catch(() => localStorage.removeItem("token"));
      this.setState({ isLoading: false });
    } else {
      this.setState({ isLoading: false });
    }
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
    if (data.token) localStorage.setItem("token", data.token);
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
    this.setState({ loading: true, boxes: [], error: "" });
    const imageUrl = this.state.input;

    if (!imageUrl) {
      this.setState({ loading: false, error: "Please enter an image URL" });
      return;
    }

    const proxiedUrl = `https://face-recognition-backend-r8nm.onrender.com/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    this.setState({ imageUrl: proxiedUrl });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = proxiedUrl;
    img.onerror = () => {
      this.setState({
        loading: false,
        error: "Failed to load image. Check the URL and try again.",
      });
    };
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
          const displayWidth = Number(imageElement.width);
          const displayHeight = Number(imageElement.height);
          const naturalWidth = imageElement.naturalWidth;
          const naturalHeight = imageElement.naturalHeight;

          const scaleX = displayWidth / naturalWidth;
          const scaleY = displayHeight / naturalHeight;

          const boxes = detections.map((det, i) => {
            const face = det.detection.box;
            return {
              id: i,
              leftCol: face.x * scaleX,
              topRow: face.y * scaleY,
              rightCol: displayWidth - (face.x + face.width) * scaleX,
              bottomRow: displayHeight - (face.y + face.height) * scaleY,
              confidence: Math.round(det.detection.score * 100),
            };
          });
          this.setState({ boxes: boxes, error: "" });
        } else {
          this.setState({
            error: "No faces detected in this image. Try another photo.",
          });
        }
        this.setState({ loading: false });
      } catch (err) {
        console.log("Face detection error:", err);
        this.setState({
          loading: false,
          error: "Face detection failed. Please try again.",
        });
      }

      if (!this.state.processedImages.includes(imageUrl)) {
        this.setState({
          processedImages: [...this.state.processedImages, imageUrl],
        });

        fetch("https://face-recognition-backend-r8nm.onrender.com/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: this.state.user.id }),
        })
          .then((response) => response.json())
          .then((count) => {
            this.setState(Object.assign(this.state.user, { entries: count }));
          })
          .catch((err) => console.log("Entry update error:", err));
      }
    };
  };

  onRouteChange = (route) => {
    if (route === "SignOut") {
      localStorage.removeItem("token");
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes, loading, isLoading, error } =
      this.state;
    const isMobile =
      /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) ||
      window.innerWidth < 1024;
    if (isLoading)
      return (
        <div className="vh-100 flex items-center justify-center">
          <h1 className="f1 light-purple">Loading...</h1>
        </div>
      );
    return (
      <div className="App">
        {!isMobile && (
          <ParticlesBg type="cobweb" config={particlesOptions} bg={true} />
        )}
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
            {error && <p className="f3 black mt3">{error}</p>}
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
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
