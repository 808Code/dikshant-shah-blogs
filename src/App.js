import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import AdminLogin from "./AdminLogin";
import UpdatePage from "./UpdatePage";

// Self-hosted fonts (no external CDN requests)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/700-italic.css";

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
      case "online":
        return { label: "Online", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
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
      <div style={{ backgroundColor: PALETTE.imgBg, width: "100%", height: 130 }}>
        <img
          src={image.startsWith("http") ? image : `${process.env.PUBLIC_URL}${image}`}
          alt={title}
          style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>
      <div style={{ padding: "0.5rem 1rem" }}>
        {(
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

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  useEffect(() => {
    document.title = "dikshant shah — resume";
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const SectionTitle = ({ children }) => (
    <h2
      style={{
        fontSize: "0.85rem",
        color: PALETTE.muted,
        borderBottom: `1px solid ${PALETTE.border}`,
        paddingBottom: "0.5rem",
        marginTop: "2.5rem",
        marginBottom: "1rem",
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: "400",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
      }}
    >
      {children}
    </h2>
  );

  const ContentWrapper = ({ children, style }) => (
    <div style={{ padding: "0 1.5rem", width: "100%", boxSizing: "border-box", ...style }}>
      {children}
    </div>
  );

  const ProjectItem = ({ title, description, url, subtitle }) => (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginBottom: "0.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "500", margin: 0, color: PALETTE.text }}>
          {title}
        </h3>
        {subtitle && <span style={{ fontSize: "0.9rem", color: PALETTE.muted, fontFamily: "'JetBrains Mono', monospace" }}>{subtitle}</span>}
      </div>
      <p style={{ fontSize: "0.95rem", color: PALETTE.subtext, margin: 0 }}>{description}</p>
    </div>
  );


  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        minHeight: "100vh",
        lineHeight: "1.6",
      }}
    >
      {/* Global styles */}
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          background: ${PALETTE.bg};
          color: ${PALETTE.text};
          width: 100%;
        }
        a { color: ${PALETTE.accent}; text-decoration: none; transition: opacity 0.2s; border-bottom: 1px solid transparent; }
        a:hover { opacity: 0.8; border-bottom: 1px solid ${PALETTE.accent}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${PALETTE.bg}; margin: 0 1.5rem; }
        ::-webkit-scrollbar-thumb { background: ${PALETTE.border}; border-radius: 4px; }
        ul { margin: 0.5rem 0; padding-left: 1.2rem; color: ${PALETTE.subtext}; fontSize: 0.95rem; }
        li { margin-bottom: 0.25rem; }
        @font-face { font-family: 'Inter'; font-display: block; }
        @font-face { font-family: 'JetBrains Mono'; font-display: block; }
        @font-face { font-family: 'Playfair Display'; font-display: block; }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .emoji-tip {
          position: relative;
          cursor: default;
        }
        .emoji-tip::after {
          content: attr(data-tip);
          position: absolute;
          bottom: 120%;
          left: 50%;
          transform: translateX(-50%);
          background: #1e293b;
          color: #e5e7eb;
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.1s;
        }
        .emoji-tip:hover::after {
          opacity: 1;
        }
      `}</style>

      <div style={{ padding: "3rem 0", opacity: fontsLoaded ? 1 : 0, transition: "opacity 0.15s ease-in" }}>
        <ContentWrapper>
          <header style={{ textAlign: "left", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "3.5rem", fontWeight: "700", margin: "0 0 0.5rem 0", color: PALETTE.text, letterSpacing: "-0.02em", fontFamily: "'Times New Roman', Times, serif" }}>Dikshant Shah</h1>
            <p style={{ color: PALETTE.subtext, fontSize: "1.1rem", margin: "0 0 1rem 0", fontWeight: "500" }}>
              AI Developer Advocate, B.E. in Software Engineering (Pokhara University, GPA: 3.44)
            </p>
            <div style={{ display: "inline-block" }}>
              <div style={{ display: "flex", justifyContent: "left", flexWrap: "wrap", gap: "1rem", color: PALETTE.subtext, fontSize: "0.95rem" }}>
                <a href="mailto:dikshant.shah2k@gmail.com">dikshant.shah2k@gmail.com</a>
                <span>•</span>
                <a href="https://www.linkedin.com/in/dikshant-shah-b3353324b/" target="_blank" rel="noreferrer">LinkedIn</a>
                <span>•</span>
                <a href="https://github.com/808Code" target="_blank" rel="noreferrer">GitHub</a>
                <span>•</span>
                <a href="https://x.com/DikshantSh8620/status/2004156195591082000" target="_blank" rel="noreferrer">Twitter(X)</a>
                <span>•</span>
                <span><span className="emoji-tip" data-tip="Namaste">🙏</span> <span className="emoji-tip" data-tip="Mt. Everest">🏞️</span> <span className="emoji-tip" data-tip="Chitwan Rhino">🦏</span> Kathmandu, Nepal</span>
                <span>•</span>
                <a
                  href={`${process.env.PUBLIC_URL}/Dikshant Shah Resume.pdf`}
                  download="Dikshant_Shah_Resume.pdf"
                  style={{ color: PALETTE.accent }}
                >
                  View my Resume 📄
                </a>
              </div>
              <div style={{ borderTop: `1px solid ${PALETTE.border}`, marginTop: "1rem", width: "100%" }} />
            </div>
          </header>
        </ContentWrapper>

        <main style={{ marginTop: "0.5rem" }}>
          <ContentWrapper>
            <p style={{ color: PALETTE.subtext, fontSize: "1rem", lineHeight: "1.8", marginTop: "0", marginBottom: "0" }}>
              Hi, I’m Dikshant Shah. I have 2 years of experience in Machine Learning, Computer Vision, and LLM pipelines. I create tutorials that help developers build AI agents in areas like sports, document understanding, and video editing.
            </p>

            <p style={{ color: PALETTE.subtext, fontSize: "1rem", lineHeight: "1.8", marginTop: "1rem", marginBottom: "0" }}>
              Previously, I worked at <a href="https://www.sieve.ai/" target="_blank" rel="noreferrer">Sieve</a> (Dec 2024 - Apr 2025) as an AI Developer Relations engineer and currently work as an ML blog contributor at <a href="https://roboflow.com/" target="_blank" rel="noreferrer">Roboflow</a> (Jul 2025 - Present).
              <span style={{
                color: "#ffffff",
                fontWeight: "500",
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "1.1rem",
                marginLeft: "0.4rem"
              }}>
                I’m currently looking to apply my skills at the intersection of gaming and AI.
              </span>
            </p>
            <p style={{ color: PALETTE.subtext, fontSize: "1rem", lineHeight: "1.8", marginTop: "1rem", marginBottom: "0" }}>
              Feel free to reach out via <a href="mailto:dikshant.shah2k@gmail.com">email</a>.
            </p>

            <SectionTitle>Articles</SectionTitle>
          </ContentWrapper>

          <div style={{ width: "100%", minHeight: 230 }}>
            {loading ? (
              <ContentWrapper>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 230, width: "100%" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      border: `3px solid ${PALETTE.border}`,
                      borderTopColor: PALETTE.accent,
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                </div>
              </ContentWrapper>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: "1rem",
                  overflowX: "auto",
                  padding: "0.5rem 0 1rem 0",
                  /* Align with left-aligned ContentWrapper padding */
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                }}
              >
                {posts.map(({ id, title, image, url, website, blog_status }) => (
                  <Post
                    key={id}
                    title={title}
                    image={image}
                    url={url}
                    website={website}
                    blog_status={blog_status}
                  />
                ))}
              </div>
            )}
          </div>

          <ContentWrapper>
            <SectionTitle>Projects</SectionTitle>
            <ProjectItem
              title={
                <>
                  AI Powered Gameplay Commentary (
                  <a href="https://www.youtube.com/watch?v=tEiDzAKA7NQ" target="_blank" rel="noreferrer" style={{ color: PALETTE.accent }}>demo</a>)
                </>
              }
              description="An AI-powered gameplay commentary pipeline using ElevenLabs, LipSync, and an LLM that takes a gameplay video and adds commentary in the style of a chosen celebrity."
            />
            <ProjectItem
              title={
                <>
                  Screenshot Editor (
                  <a href="https://screenshoteditor.live/" target="_blank" rel="noreferrer" style={{ color: PALETTE.accent }}>screenshoteditor.live</a>)
                </>
              }
              description="Web-based tool for annotating and editing screenshots, particularly useful for developer advocates, technical writers, educators, and anyone who needs to create clear, shareable visual content."
            />
          </ContentWrapper>
        </main>

        <ContentWrapper>
          <footer
            style={{
              marginTop: "2rem",
              paddingTop: "1rem",
              textAlign: "center",
              color: PALETTE.muted,
              fontSize: "0.9rem",
            }}
          >
            <div style={{ display: "inline-block", borderTop: `1px solid ${PALETTE.border}`, paddingTop: "1rem", paddingLeft: "4rem", paddingRight: "4rem" }}>
              hobbies: music production, reading history, and zombies.
              ☮︎
            </div>


          </footer>
        </ContentWrapper>
      </div>
    </div>
  );
}

function AdminRoute() {
  const [authed, setAuthed] = useState(sessionStorage.getItem("admin_auth") === "true");

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return <UpdatePage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/update" element={<AdminRoute />} />
    </Routes>
  );
}
