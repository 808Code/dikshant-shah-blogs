import React, { useEffect } from "react";

const posts = [
  {
    id: 10,
    website: "roboflow.com",
    title: "Automate Image Background Blurring Using SAM 2",
    image: "/roboflow/Screenshot-2025-08-04-at-10.35.17---AM.webp",
    url: "https://blog.roboflow.com/background-blurring-sam-2/",
  },
  {
    id: 9,
    website: "roboflow.com",
    title: "AI-Powered Invoice Analysis for Detecting Price Markups",
    image: "/roboflow/Screenshot-2025-08-11-at-11.01.02---AM.webp",
    url: "https://blog.roboflow.com/automated-invoice-analysis/#automate-invoice-processing-with-ai-conclusion",
  },
  {
    id: 8,
    website: "sievedata.com",
    title: "Building a robust ball tracking system for sports with SAM 2",
    image: "/sievedata/a-segmentation-map-of-sports-field-with-a-ball-bei.webp",
    url: "https://www.sievedata.com/blog/ball-tracking-with-sam2",
  },
  {
    id: 7,
    website: "sievedata.com",
    title: "Building an Automated Background and Caption Effects Pipeline",
    image: "/sievedata/minimalist-silhouette-of-a-person-against-a-bold-w.webp",
    url: "https://www.sievedata.com/blog/automated-background-and-caption-effects-pipeline",
  },
  {
    id: 6,
    website: "sievedata.com",
    title: "Comparing the best methods for OCR on videos",
    image: "/sievedata/a-magnifying-glass-show-over-a-video-with-various-.webp",
    url: "https://www.sievedata.com/blog/automated-background-and-caption-effects-pipeline",
  },
  {
    id: 5,
    website: "sievedata.com",
    title: "Comparing the best methods for OCR on videos",
    image: "/sievedata/a-roll-of-video-tape-with-a-knife-next-to-it.webp",
    url: "https://www.sievedata.com/resources/how-to-build-long-form-video-repurposing-tool",
  },
  {
    id: 4,
    website: "sievedata.com",
    title: "How to Build a Performant Background Blurring Tool",
    image: "/sievedata/a-mountain-landscape-with-a-blurry-screen-in-front.webp",
    url: "https://www.sievedata.com/resources/how-to-build-long-form-video-repurposing-tool",
  },
  {
    id: 3,
    website: "sievedata.com",
    title: "How to Automatically Blur Faces in Videos",
    image: "/sievedata/a-blurry-oval-shape.webp",
    url: "https://www.sievedata.com/resources/how-to-blur-faces-in-video",
  },
  {
    id: 2,
    website: "sievedata.com",
    title: "Exploring SAM 2 and its Variants for Video Object Segmentation",
    image: "/sievedata/a-segmentation-map.webp",
    url: "https://www.sievedata.com/resources/how-to-build-long-form-video-repurposing-tool",
  },
  {
    id: 1,
    website: "sievedata.com",
    title: "Comparing Zero-Shot Object Detection Models: YOLO vs. Florence 2",
    image: "/sievedata/a-blurry-oval-shape (1).webp",
    url: "https://www.sievedata.com/resources/how-to-build-long-form-video-repurposing-tool",
  },
  {
    id: 0,
    website: "medium.com",
    title: "Thought to Image: The Future of AI-Powered Mind Reading",
    image: "/others/Screenshot (60).png",
    url: "https://medium.com/@dikshant.shah2k/ai-a-new-frontier-87ca0c857898",
  },
];

function Post({ title, image, url, website }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        display: "block",
        width: 220,
        marginRight: 16,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        background: "#fff",
        border: "1px solid #ddd",
        transition: "transform 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      title={`${title} — ${website}`}
    >
      <img
        src={`${process.env.PUBLIC_URL}${image}`}
        alt={title}
        style={{ width: "100%", height: 130, objectFit: "cover" }}
      />
      <div style={{ padding: "0.5rem 1rem" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "1rem",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: "0.25rem 0 0 0",
            fontSize: "0.75rem",
            color: "#888",
            fontStyle: "normal",
          }}
        >
          {website}
        </p>
      </div>
    </a>
  );
}

function App() {
  useEffect(() => {
    document.title = "dikshantshah";
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>dikshant shah.</h1>
        <p style={{ color: "#777", marginTop: "0.25rem" }}>
          build something you yourself would use.
        </p>
      </header>

      <main>
        <section style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: "1rem",
              overflowX: "auto",
              padding: "1rem 0",
            }}
          >
            {posts
              .slice()
              .sort((a, b) => b.id - a.id) // sort descending by id
              .map(({ id, title, image, url, website }) => (
                <Post
                  key={`${website}-${id}`}
                  title={title}
                  image={image}
                  url={url}
                  website={website}
                />
              ))}
          </div>
        </section>
      </main>

      <footer
        style={{
          marginTop: "3rem",
          textAlign: "center",
          color: "#aaa",
          fontSize: "0.9rem",
        }}
      >
        ☮︎
      </footer>
    </div>
  );
}

export default App;
