import React from "react";
import { Helmet } from "react-helmet";

function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Lofi Music Radio</title>
        <meta
          name="robots"
          content="noindex, nofollow"
        />
      </Helmet>
      <h1>404 - Page Not Found</h1>
    </>
  );
}

export default NotFound;
