import React from "react";

const SchemaMarkup = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lofi Music Radio",
    url: "https://lofimusicradio.com",
    description:
      "Free online lofi radio player with multiple stations, customizable backgrounds, and no ads.",
    inLanguage: ["en", "es", "de", "fr", "it", "ru", "zh"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://lofimusicradio.com/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const radioSchema = {
    "@context": "https://schema.org",
    "@type": "RadioStation",
    name: "Lofi Music Radio",
    url: "https://lofimusicradio.com",
    description:
      "Stream lofi music for study, relaxation, and chill vibes. Ad-free online radio with varied stations.",
    logo: {
      "@type": "ImageObject",
      url: "https://lofimusicradio.com/lofi-radio-logo-blue.webp",
    },
    image: "https://lofimusicradio.com/lofi-radio-logo-blue.webp",
    genre: ["Lofi", "Jazz", "Hip Hop", "Chill", "House", "Ambient"],
    broadcastFrequency: "Online",
    broadcastAffiliateOf: {
      "@type": "Organization",
      name: "Lofi Music Radio",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(radioSchema) }}
      />
    </>
  );
};

export default SchemaMarkup;
