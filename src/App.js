import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import AdminLogin from "./AdminLogin";
import UpdatePage from "./UpdatePage";

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
      <div style={{ backgroundColor: PALETTE.imgBg }}>
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

  useEffect(() => {
    document.title = "dikshantshah";
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



  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
        padding: "2rem",
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
          height: 100%;
        }
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
          {loading ? (
            <p style={{ color: PALETTE.subtext, textAlign: "center" }}>Loading blogs...</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "1rem",
                overflowX: "auto",
                padding: "1rem 0",
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
