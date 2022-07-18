import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }: any) => {
  return (
    <Route
      // {...rest}
      render={(props) => {
        return (
          <div>
            <Component {...rest} />
          </div>
        );
      }}
    />
  );
};

export default PublicRoute;
