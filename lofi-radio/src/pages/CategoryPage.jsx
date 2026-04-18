import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link, Navigate } from "react-router-dom";

const BASE_URL = "https://lofimusicradio.com";

const CATEGORY_META = {
  lofi: {
    name: "Lofi",
    title: "Free Lofi Music Radio — 24/7 Lofi Hip Hop Stations",
    description:
      "Stream free lofi hip hop music 24/7. Ad-free lofi radio stations for studying, focus, and relaxation. Listen to Lofi Girl, Chillhop Music, and more.",
    heading: "Lofi Hip Hop Radio Stations",
    intro:
      "Lofi hip hop is the go-to soundtrack for studying, coding, writing, and deep focus. These stations stream around the clock — slow beats, jazz samples, and vintage warmth with no ads, no interruptions. Whether you need background music for a three-hour study session or a quick creative sprint, lofi music provides the perfect unobtrusive atmosphere.",
    faq: [
      {
        q: "What is lofi music?",
        a: "Lofi (low fidelity) music is characterized by its intentional audio imperfections — vinyl crackle, tape hiss, gentle beats — that create a warm, nostalgic sound. It is widely used as background music for studying and focus.",
      },
      {
        q: "Is lofi music good for studying?",
        a: "Yes. Lofi music is instrumental, which means it does not compete with language-processing tasks like reading or writing. Its slow, repetitive structure provides just enough stimulation to prevent boredom without becoming a distraction.",
      },
    ],
  },
  jazz: {
    name: "Jazz",
    title: "Free Jazz Radio — Online Jazz Music Stations 24/7",
    description:
      "Listen to free online jazz radio stations 24/7. Stream smooth jazz, cafe music, piano jazz, and BGM jazz ad-free. Perfect for work, study, and relaxation.",
    heading: "Jazz Radio Stations",
    intro:
      "Jazz music has been the soundtrack of cafes, libraries, and creative workspaces for decades. These online jazz stations capture that timeless atmosphere — smooth chord progressions, improvised melodies, and a sense of sophisticated ease. Stream piano jazz for focused work or cafe BGM for a cozy background ambiance.",
    faq: [
      {
        q: "What is the best jazz radio station for studying?",
        a: "Cafe Music BGM and Piano Jazz Music are excellent for study and work. They offer gentle, unobtrusive jazz that improves mood without demanding attention.",
      },
      {
        q: "Is jazz music good for concentration?",
        a: "Jazz without lyrics is excellent for concentration tasks. Its complex but familiar harmonic structure can improve mood and cognitive performance compared to silence.",
      },
    ],
  },
  "rap-hip-hop": {
    name: "Rap/Hip Hop",
    title: "Free Hip Hop Radio — Online Rap & Hip Hop Stations",
    description:
      "Stream free hip hop and rap radio online. Classic hip hop, trap, and R&B stations available 24/7, ad-free. The best online rap radio stations.",
    heading: "Hip Hop & Rap Radio Stations",
    intro:
      "From golden-era classics to modern trap, this collection of hip hop radio stations covers the full spectrum of the genre. Whether you are revisiting 90s boom bap or exploring contemporary rap, these stations deliver non-stop hip hop culture. Ideal for workouts, commutes, or any session that needs energy.",
    faq: [
      {
        q: "What is the best free hip hop radio station online?",
        a: "HIP HOP CLASSIC and Best of Mix are two of the top free hip hop stations, streaming classic and contemporary tracks 24/7 with no ads.",
      },
      {
        q: "Can I listen to hip hop radio without ads?",
        a: "Yes. All stations on Lofi Music Radio are completely ad-free, including the hip hop and rap category.",
      },
    ],
  },
  nature: {
    name: "Nature",
    title: "Nature Sounds Radio — Rain, Forest & Ocean Sounds 24/7",
    description:
      "Stream free nature sounds online: rain, forest, fireplace, and ocean waves 24/7. Ad-free ambient nature radio for sleep, focus, and relaxation.",
    heading: "Nature Sounds Radio",
    intro:
      "Sometimes music is too much and you need pure texture. Nature sounds provide a scientifically supported backdrop for focus, meditation, and sleep. Rain pattering on leaves, ocean waves rolling in, a fireplace crackling in winter — these sounds reduce cortisol, mask distracting environmental noise, and create a sense of calm that no synthesized track can match.",
    faq: [
      {
        q: "Do nature sounds help with sleep?",
        a: "Yes. Research suggests that nature sounds, particularly rain and flowing water, can reduce stress hormones and ease the transition into sleep by masking irregular environmental noise.",
      },
      {
        q: "What nature sounds are best for focus?",
        a: "Rain sounds and forest ambiance are most effective for cognitive focus. A moderate level of nature sound (around 65 dB) has been shown to improve creative performance.",
      },
    ],
  },
  synthwave: {
    name: "Synthwave",
    title: "Synthwave Radio — Free Retrowave & Synthwave Music Online",
    description:
      "Stream free synthwave and retrowave music 24/7. Online synthwave radio stations featuring the best 80s-inspired electronic music, ad-free.",
    heading: "Synthwave & Retrowave Radio",
    intro:
      "Synthwave is a love letter to the 1980s — pulsing arpeggios, gated reverb drums, cinematic pads, and the unmistakable neon glow of a late-night drive. Whether you are coding, designing, or just need a soundtrack that makes ordinary tasks feel epic, synthwave delivers the atmosphere. These stations stream the best retrowave, outrun, and dark synth music around the clock.",
    faq: [
      {
        q: "What is synthwave music?",
        a: "Synthwave is an electronic music genre inspired by the sounds and aesthetics of 1980s films, TV, and video games. It features synthesizers, drum machines, and a distinctly retro, cinematic feel.",
      },
      {
        q: "Is synthwave good for coding?",
        a: "Many developers find synthwave ideal for night coding sessions. Its driving rhythm provides energy without the distraction of lyrics, and its futuristic atmosphere fits the flow of technical work.",
      },
    ],
  },
  house: {
    name: "House",
    title: "House Music Radio — Free Online House & Electronic Music",
    description:
      "Stream free house music radio online 24/7. Ad-free electronic music stations featuring deep house, tech house, and tropical house.",
    heading: "House Music Radio Stations",
    intro:
      "House music has been moving dance floors and inspiring creativity since the Chicago underground of the early 1980s. These stations stream quality house music from world-class labels and DJs — from the polished productions of Tomorrowland to the club-ready cuts of Toolroom Records. High-energy, groove-driven, and relentlessly upbeat.",
    faq: [
      {
        q: "What is the difference between deep house and tech house?",
        a: "Deep house is soulful and atmospheric, built on jazz chords and vocal samples. Tech house is darker and more percussive, blending the groove of house with the edge of techno.",
      },
    ],
  },
  meditation: {
    name: "Meditation",
    title: "Meditation Music Radio — Free Relaxation & Healing Music Online",
    description:
      "Stream free meditation and relaxation music 24/7. Ad-free healing sounds, binaural beats, and calming music for meditation, yoga, and sleep.",
    heading: "Meditation & Relaxation Radio",
    intro:
      "Meditation music provides the auditory environment for mindfulness, yoga, and restorative rest. These stations offer healing frequencies, soft ambient pads, and gentle melodies designed to quiet mental chatter and support deeper states of relaxation. Whether you are starting a morning meditation practice or recovering from a stressful day, these streams create an immediate sense of calm.",
    faq: [
      {
        q: "What is the best music for meditation?",
        a: "Music without strong rhythms or melodies works best — slow, sustained tones, binaural beats, and nature-derived sounds. The stations in this category are specifically curated for meditative listening.",
      },
    ],
  },
  "drum-bass": {
    name: "Drum & Bass",
    title: "Drum & Bass Radio — Free DnB Music Online 24/7",
    description:
      "Stream free drum and bass music online 24/7. Ad-free DnB radio with liquid drum and bass, atmospheric DnB, and more.",
    heading: "Drum & Bass Radio Stations",
    intro:
      "Drum and bass is one of the most technically demanding and emotionally intense genres in electronic music — fast breakbeats, heavy basslines, and intricate production. Whether you prefer the lush, melodic sound of liquid DnB or the harder edge of neurofunk, these stations deliver non-stop energy. Popular with gym-goers, runners, and anyone needing maximum output.",
    faq: [
      {
        q: "What is drum and bass music?",
        a: "Drum and bass (DnB) is an electronic genre characterized by fast breakbeat rhythms (160–180 BPM) and heavy bass lines. It emerged from the UK rave scene in the early 1990s.",
      },
    ],
  },
  techno: {
    name: "Techno",
    title: "Techno Radio — Free Minimal & Dark Techno Music Online",
    description:
      "Stream free techno music online 24/7. Ad-free minimal techno, dark techno, and underground electronic music stations.",
    heading: "Techno Radio Stations",
    intro:
      "Techno is the sound of the machine — hypnotic, relentless, and precise. Born in Detroit in the mid-1980s, it has since split into dozens of subgenres from minimal techno to industrial. These stations deliver the darker, more underground side of electronic music, perfect for late-night sessions that demand total focus or immersive listening.",
    faq: [
      {
        q: "What is minimal techno?",
        a: "Minimal techno strips the music to its essentials — repetitive kick drums, sparse hi-hats, and subtle evolving textures. Its hypnotic simplicity makes it uniquely effective as background music for sustained focus.",
      },
    ],
  },
  reggaeton: {
    name: "Reggaeton",
    title: "Reggaeton Radio — Free Latin Music Online 24/7",
    description:
      "Stream free reggaeton and Latin music radio online 24/7. Ad-free reggaeton, romantic, and Latin urban music stations.",
    heading: "Reggaeton & Latin Radio",
    intro:
      "Reggaeton's infectious dembow rhythm has conquered charts worldwide. These stations cover the full spectrum of Latin urban music — from classic reggaeton hits to romantic bachata and modern pop latino. Perfect for parties, workouts, or just adding some energy and warmth to your day.",
    faq: [
      {
        q: "What is reggaeton music?",
        a: "Reggaeton is a Latin urban music genre that originated in Puerto Rico in the late 1990s. It blends Caribbean rhythms (particularly the dembow beat) with hip hop, dancehall, and Latin pop influences.",
      },
    ],
  },
};

function CategoryPage() {
  const { category } = useParams();
  const meta = CATEGORY_META[category];

  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => {
        const cat = (data.categories || []).find((c) => c.name === meta?.name);
        setStations(cat?.stations || []);
      })
      .catch(() => {});
  }, [category, meta]);

  if (!meta) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: meta.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta
          name="description"
          content={meta.description}
        />
        <link
          rel="canonical"
          href={`${BASE_URL}/stations/${category}`}
        />
        <meta
          property="og:title"
          content={meta.title}
        />
        <meta
          property="og:description"
          content={meta.description}
        />
        <meta
          property="og:url"
          content={`${BASE_URL}/stations/${category}`}
        />
        <meta
          property="og:image"
          content={`${BASE_URL}/lofi-radio-logo-blue.webp`}
        />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="content-page">
        <nav className="content-page__breadcrumb">
          <Link to="/">Home</Link> &rsaquo; <Link to="/">Stations</Link> &rsaquo;{" "}
          <span>{meta.name}</span>
        </nav>

        <h1 className="content-page__title">{meta.heading}</h1>
        <p className="content-page__intro">{meta.intro}</p>

        {stations.length > 0 && (
          <section className="category-stations">
            <h2 className="category-stations__title">Available Stations</h2>
            <ul className="category-stations__list">
              {stations.map((station) => (
                <li
                  key={station.name}
                  className="category-stations__item">
                  <Link
                    to="/"
                    className="category-stations__link">
                    <span className="category-stations__name">{station.name}</span>
                    <span className="category-stations__cta">▶ Listen now</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="category-faq">
          <h2 className="category-faq__title">Frequently Asked Questions</h2>
          {meta.faq.map((item) => (
            <div
              key={item.q}
              className="category-faq__item">
              <h3 className="category-faq__question">{item.q}</h3>
              <p className="category-faq__answer">{item.a}</p>
            </div>
          ))}
        </section>

        <div className="content-page__cta-row">
          <Link
            to="/"
            className="blog-card__cta">
            🎵 Open the Radio Player
          </Link>
          <Link
            to="/blog"
            className="blog-card__cta">
            📖 Read the Blog
          </Link>
        </div>
      </div>
    </>
  );
}

export default CategoryPage;
