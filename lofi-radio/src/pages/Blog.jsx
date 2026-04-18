import React from "react";
import { Helmet } from "react-helmet";

function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog - Lofi Music Radio</title>
        <meta
          name="description"
          content="Articles and tips about lofi music, productivity, study techniques, and the best radio stations for focus and relaxation."
        />
        <meta
          property="og:title"
          content="Blog - Lofi Music Radio"
        />
        <meta
          property="og:description"
          content="Articles and tips about lofi music, productivity, study techniques, and the best radio stations for focus and relaxation."
        />
        <meta
          property="og:url"
          content="https://lofimusicradio.com/blog"
        />
        <link
          rel="canonical"
          href="https://lofimusicradio.com/blog"
        />
      </Helmet>
      <h1>Blog</h1>
    </>
  );
}

export default Blog;
