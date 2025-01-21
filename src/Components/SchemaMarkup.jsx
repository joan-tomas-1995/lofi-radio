import React from "react";

const SchemaMarkup = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Lofi Music Radio",
    description: "Stream lofi music for study, relaxation, and chill vibes.",
    url: "https://lofimusicradio.com",
    genre: ["Lofi", "Jazz", "Hip Hop", "House"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default SchemaMarkup;
