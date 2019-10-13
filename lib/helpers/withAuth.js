import React    from "react";
import router   from "next/router";
import { auth } from "../db";

const withAuth = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        status: "LOADING",
        user: {}
      };
    }
    componentDidMount() {
      auth.onAuthStateChanged(authUser => {
        if (authUser) {
          this.setState( {
            status: "SIGNED_IN",
            user: authUser
          });
        } else {
          router.push("/");
        }
      });
    }
    renderContent() {
      const { status, user } = this.state;
      if (status == "LOADING") {
        return <h3>Loading ......</h3>;
      } else if (status == "SIGNED_IN") {
        return <Component {...this.props} currentUser={user} />;
      }
    }
    render() {
      return <>{this.renderContent()}</>;
    }
  };
};
export default withAuth;