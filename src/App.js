import React, { useEffect } from "react";

// Full posts list
const posts = [
  {
    website: "roboflow.com",
    title: "AI-Powered Shelf Price Verification for Matching Label Prices to POS Server Prices",
    image: "/roboflow/Screenshot-2025-08-21-at-1.11.18---PM.webp",
    url: "https://blog.roboflow.com/ai-shelf-price-verification/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "SAM 2: Automate Image Background Blurring",
    image: "/roboflow/Screenshot-2025-08-04-at-10.35.17---AM.webp",
    url: "https://blog.roboflow.com/background-blurring-sam-2/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "Automate Marathon Bib Number Recognition with Computer Vision",
    image: "/roboflow/Screenshot-2025-08-28-at-4.09.13---PM.webp",
    url: "https://blog.roboflow.com/automated-marathon-bib-recognition/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "RF-DETR Aerial Imagery: SOTA Performance in Speed and Detection Accuracy",
    image: "/roboflow/Screenshot-2025-12-10-at-11.03.55---AM.webp",
    url: "https://blog.roboflow.com/ai-for-aerial-imagery/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "YOLO26: Exploring the Latest Advancements in Object Detection",
    image: "/roboflow/Screenshot-2025-10-20-at-10.26.52---AM.webp",
    url: "https://blog.roboflow.com/yolo26/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "Depth Anything 3 for Depth Estimation",
    image: "/roboflow/Screenshot-2026-01-14-at-9.34.09---AM.png",
    url: "https://blog.roboflow.com/depth-anything-3/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "RF-DETR: Detect Objects in Videos",
    image: "/roboflow/Screenshot-2025-10-06-at-11.11.47---AM.webp",
    url: "https://blog.roboflow.com/how-to-detect-objects-in-videos/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "Prompting Tips for Large Language Models with Vision Capabilities",
    image: "/roboflow/Screenshot-2025-09-08-at-4.22.43---PM.webp",
    url: "https://blog.roboflow.com/prompting-tips-for-large-language-models-with-vision/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "The Key Tasks in Computer Vision",
    image: "/roboflow/Screenshot-2025-09-22-at-10.42.24---AM.webp",
    url: "https://blog.roboflow.com/key-tasks-in-computer-vision/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "Comparing Depth Estimation Models",
    image: "/roboflow/Screenshot-2025-11-12-at-4.21.27---PM.webp",
    url: "https://blog.roboflow.com/depth-estimation-models/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "Running RF-DETR Base And Finetuned in Python",
    image: "/roboflow/Screenshot-2025-10-13-at-1.17.16---PM.webp",
    url: "https://blog.roboflow.com/python-object-detection/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "How to Build a Vision-Language Model Application with Next.js",
    image: "/roboflow/Screenshot-2025-09-16-at-10.36.47---AM.webp",
    url: "https://blog.roboflow.com/build-vision-applications-next-js-roboflow/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "How to Use Streamlit for Computer Vision with Roboflow",
    image: "/roboflow/Screenshot-2025-10-03-at-10.15.03---AM.webp",
    url: "https://blog.roboflow.com/streamlit-for-computer-vision-with-roboflow/",
    blog_status: "available",
  },
  {
    website: "roboflow.com",
    title: "AI-Powered Invoice Analysis for Detecting Price Markups",
    image: "/roboflow/Screenshot-2025-08-11-at-11.01.02---AM.webp",
    url: "https://blog.roboflow.com/automated-invoice-analysis/",
    blog_status: "available",
  },

  // Sieve Data Posts
  {
    website: "sievedata.com",
    title: "Building a robust ball tracking system for sports with SAM 2",
    image: "/sievedata/a-segmentation-map-of-sports-field-with-a-ball-bei.webp",
    url: "https://www.linkedin.com/posts/sievedata_ball-tracking-is-a-capability-that-enables-activity-7275544709190569985-m_2Q/",
    blog_status: "demo_only",
  },
  {
    website: "sievedata.com",
    title: "Building an Automated Background and Caption Effects Pipeline",
    image: "/sievedata/minimalist-silhouette-of-a-person-against-a-bold-w.webp",
    url: "https://github.com/sieve-community/auto-reel-edit",
    blog_status: "code_only",
  },
  {
    website: "sievedata.com",
    title: "Comparing the best methods for OCR on videos",
    image: "/sievedata/a-magnifying-glass-show-over-a-video-with-various-.webp",
    url: "https://www.linkedin.com/posts/sievedata_high-quality-text-recognition-on-video-has-ugcPost-7284590421781991425-FkQ_/",
    blog_status: "demo_only",
  },
  {
    website: "sievedata.com",
    title: "How to Build a Long Form Video Repurposing Tool",
    image: "/sievedata/a-roll-of-video-tape-with-a-knife-next-to-it.webp",
    url: "https://www.sievedata.com/resources/how-to-build-long-form-video-repurposing-tool",
    blog_status: "unavailable",
  },
  {
    website: "sievedata.com",
    title: "How to Build a Performant Background Blurring Tool",
    image: "/sievedata/a-mountain-landscape-with-a-blurry-screen-in-front.webp",
    url: "https://www.sievedata.com/resources/how-to-build-performant-background-blurring-tool",
    blog_status: "unavailable",
  },
  {
    website: "sievedata.com",
    title: "How to Automatically Blur Faces in Videos",
    image: "/sievedata/a-blurry-oval-shape.webp",
    url: "https://www.sievedata.com/resources/how-to-blur-faces-in-video",
    blog_status: "unavailable",
  },
  {
    website: "sievedata.com",
    title: "Exploring SAM 2 and its Variants for Video Object Segmentation",
    image: "/sievedata/a-segmentation-map.webp",
    url: "https://www.sievedata.com/resources/exploring-sam2-variants",
    blog_status: "unavailable",
  },
  {
    website: "sievedata.com",
    title: "Comparing Zero-Shot Object Detection Models: YOLO vs. Florence 2",
    image: "/sievedata/a-blurry-oval-shape (1).webp",
    url: "https://www.sievedata.com/resources/comparing-zero-shot-object-detection-yolo-florence",
    blog_status: "unavailable",
  },

  // Other
  {
    website: "medium.com",
    title: "Thought to Image: The Future of AI-Powered Mind Reading",
    image: "/others/Screenshot (60).png",
    url: "https://medium.com/@dikshant.shah2k/ai-a-new-frontier-87ca0c857898",
    blog_status: "available",
  },
];

const PALETTE = {
  bg: "#0b0f14",
  text: "#e5e7eb",
  subtext: "#9ca3af",
  muted: "#94a3b8",
  cardBg: "#0f172a",
  border: "#1f2937",
  shadow: "rgba(0,0,0,0.6)",
  accent: "#22d3ee",
  imgBg: "#0b1220",
};

function Post({ title, image, url, website, blog_status }) {
  const getStatusDisplay = (status) => {
    switch (status) {
      case "available":
        return { label: "Available", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
      case "demo_only":
        return { label: "Demo Only", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)" };
      case "code_only":
        return { label: "Code Only", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
      case "unavailable":
        return { label: "Unavailable", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
      default:
        return { label: status, color: PALETTE.subtext, bg: "rgba(156, 163, 175, 0.1)" };
    }
  };

  const status = getStatusDisplay(blog_status);

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
        boxShadow: `0 2px 8px ${PALETTE.shadow}`,
        background: PALETTE.cardBg,
        border: `1px solid ${PALETTE.border}`,
        transition: "transform 0.2s",
        flexShrink: 0,
        position: "relative",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      title={`${title} — ${website}`}
    >
      <div style={{ backgroundColor: PALETTE.imgBg }}>
        <img
          src={`${process.env.PUBLIC_URL}${image}`}
          alt={title}
          style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
        />
      </div>
      <div style={{ padding: "0.5rem 1rem" }}>
        {blog_status !== "available" && (
          <div
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "0.65rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
              backgroundColor: status.bg,
              color: status.color,
              border: `1px solid ${status.color}33`,
            }}
          >
            {status.label}
          </div>
        )}
        <h2 style={{ margin: 0, fontSize: "1rem", color: PALETTE.text }}>{title}</h2>
        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: PALETTE.subtext }}>
          {website}
        </p>
      </div>
    </a>
  );
}

export default function App() {
  useEffect(() => {
    document.title = "dikshantshah";
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* Global styles for body, html, and scrollbars */}
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          background: ${PALETTE.bg};
          color: ${PALETTE.text};
          width: 100%;
          height: 100%;
        }

        /* Vertical scrollbars */
        ::-webkit-scrollbar:vertical {
        width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track:vertical {
          background: ${PALETTE.bg};
        }
        ::-webkit-scrollbar-thumb:vertical {
          background-color: ${PALETTE.border};
          border-radius: 4px;
        }

        /* Horizontal scrollbars */
        ::-webkit-scrollbar:horizontal {
          height: 8px;
        }
        ::-webkit-scrollbar-track:horizontal {
          background: ${PALETTE.bg};
        }
        ::-webkit-scrollbar-thumb:horizontal {
          background-color: ${PALETTE.border};
          border-radius: 4px;
        }

        * { scrollbar-width: thin; scrollbar-color: ${PALETTE.border} ${PALETTE.bg}; }
      `}</style>

      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0, color: PALETTE.text }}>dikshant shah.</h1>
        <p style={{ color: PALETTE.subtext, marginTop: "0.25rem" }}>
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
              .sort((a, b) => (a.blog_status === "unavailable") - (b.blog_status === "unavailable"))
              .map(({ title, image, url, website, blog_status }) => (
                <Post
                  key={`${website}-${title}`}
                  title={title}
                  image={image}
                  url={url}
                  website={website}
                  blog_status={blog_status}
                />
              ))}
          </div>
        </section>
      </main>

      <footer
        style={{
          marginTop: "3rem",
          textAlign: "center",
          color: PALETTE.muted,
          fontSize: "0.9rem",
        }}
      >
        ☮︎
      </footer>
    </div>
  );
}
