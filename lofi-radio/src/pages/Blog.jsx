import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { blogPosts } from "../data/blogPosts";

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

      <div className="content-page">
        <h1 className="content-page__title">Lofi Music Blog</h1>
        <p className="content-page__subtitle">
          Articles about lofi music, productivity, focus, and the best online radio
          stations.
        </p>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="blog-card">
              <Link
                to={`/blog/${post.slug}`}
                className="blog-card__link">
                <h2 className="blog-card__title">{post.title}</h2>
              </Link>
              <p className="blog-card__meta">
                {post.date} &middot; {post.readTime}
              </p>
              <p className="blog-card__description">{post.description}</p>
              <Link
                to={`/blog/${post.slug}`}
                className="blog-card__cta">
                Read article →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default Blog;
