import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import './App.css';

const particlesOptions = {
      num: [10, 20],
      rps: 0.1,
      radius: [5, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      // body: "./img/icon.png", // Whether to render pictures
      // rotate: [0, 20],
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0, // all or center or {x:1,y:1,width:100,height:100}
      color: ["random", "#ff0000"],
      cross: "dead", // cross or bround
      random: 15,  // or null,
      g: 5,    // gravity
      // f: [2, -1], // force
      onParticleUpdate: (ctx, particle) => {
          ctx.beginPath();
          ctx.rect(particle.p.x, particle.p.y, particle.radius * 3, particle.radius * 3);
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.closePath();
      }
    };
const initialState = {
  
    input: '',
    imageUrl:'',
    box: {},
    route: 'SignIn',
    isSignedIn:false,
    user: {
      id : '',
      name: '',
      email:'',
      password:'',
      entries: 0,
      joined: ''
    }
  }


class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id : data.id,
      name: data.name,
      email:data.email,
      entries: data.entries,
      joined: data.joined

    }})
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://face-recognition-backend-r8nm.onrender.com/imageurl' ,{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
    }) 
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://face-recognition-backend-r8nm.onrender.com/image' ,{
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               id: this.state.user.id
            })
        }) 
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log)
        }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if(route === 'SignOut'){
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true}) 
    }
    this.setState({route: route});
  }
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
            <ParticlesBg  
            type="cobweb" 
            config={particlesOptions} 
            bg={true} />
        <Navigation isSignedIn={isSignedIn} onRoutechange={this.onRouteChange}/>
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
               <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
            :(
              route === 'SignIn'
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
              : <Register loadUser={ this.loadUser} onRouteChange={this.onRouteChange}/>
             )
        }  
    </div>
    );
  }
}

export default App;
