import React from "react";
import { Helmet } from "react-helmet";
import { useParams, Link, Navigate } from "react-router-dom";
import { getBlogPost } from "../data/blogPosts";

const BASE_URL = "https://lofimusicradio.com";

function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <Navigate
        to="/blog"
        replace
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Lofi Music Radio</title>
        <meta
          name="description"
          content={post.description}
        />
        <link
          rel="canonical"
          href={`${BASE_URL}/blog/${post.slug}`}
        />
        <meta
          property="og:title"
          content={post.title}
        />
        <meta
          property="og:description"
          content={post.description}
        />
        <meta
          property="og:url"
          content={`${BASE_URL}/blog/${post.slug}`}
        />
        <meta
          property="og:type"
          content="article"
        />
        <meta
          property="og:image"
          content={`${BASE_URL}/lofi-radio-logo-blue.webp`}
        />
        <meta
          property="article:published_time"
          content={post.date}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            url: `${BASE_URL}/blog/${post.slug}`,
            image: `${BASE_URL}/lofi-radio-logo-blue.webp`,
            publisher: {
              "@type": "Organization",
              name: "Lofi Music Radio",
              url: BASE_URL,
              logo: {
                "@type": "ImageObject",
                url: `${BASE_URL}/lofi-radio-logo-blue.webp`,
              },
            },
          })}
        </script>
      </Helmet>

      <div className="content-page">
        <nav className="content-page__breadcrumb">
          <Link to="/">Home</Link> &rsaquo; <Link to="/blog">Blog</Link> &rsaquo;{" "}
          <span>{post.title}</span>
        </nav>

        <article className="blog-post">
          <header className="blog-post__header">
            <h1 className="blog-post__title">{post.title}</h1>
            <p className="blog-post__meta">
              {post.date} &middot; {post.readTime}
            </p>
          </header>

          <div
            className="blog-post__content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="blog-post__footer">
            <Link
              to="/blog"
              className="blog-card__cta">
              ← Back to Blog
            </Link>
            <Link
              to="/"
              className="blog-card__cta">
              🎵 Listen to Lofi Radio
            </Link>
          </footer>
        </article>
      </div>
    </>
  );
}

export default BlogPost;
