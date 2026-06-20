import React from "react";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      error: "",
    };
  }
  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value, error: "" });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value, error: "" });
  };

  onSubmitSignIn = () => {
    this.setState({ error: "" });
    fetch("https://face-recognition-backend-r8nm.onrender.com/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user && user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange("home");
        } else {
          this.setState({ error: "Invalid email or password" });
        }
      })
      .catch(() => {
        this.setState({ error: "Unable to connect. Please try again." });
      });
  };

  onGuestSignIn = () => {
    this.setState(
      {
        signInEmail: "guest@demo.com",
        signInPassword: "guest123",
        error: "",
      },
      () => {
        fetch("https://face-recognition-backend-r8nm.onrender.com/signin", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "guest@demo.com",
            password: "guest123",
          }),
        })
          .then((response) => response.json())
          .then((user) => {
            if (user && user.id) {
              this.props.loadUser(user);
              this.props.onRouteChange("home");
            } else {
              this.setState({ error: "Guest account unavailable" });
            }
          })
          .catch(() => {
            this.setState({ error: "Unable to connect. Please try again." });
          });
      },
    );
  };

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba --black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              {this.state.error && (
                <p className="f6 ba b--white black bg-white-80 pa2 br2 mt2">
                  {this.state.error}
                </p>
              )}
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  value={this.state.signInEmail}
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  value={this.state.signInPassword}
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt2">
              <input
                onClick={this.onGuestSignIn}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="button"
                value="Try as Guest"
              />
            </div>
            <div className="lh-copy mt1">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim black db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default SignIn;
