import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase, SUPABASE_URL } from "./supabaseClient";

const PALETTE = {
    bg: "#0b0f14",
    text: "#e5e7eb",
    subtext: "#9ca3af",
    cardBg: "#0f172a",
    border: "#1f2937",
    accent: "#22d3ee",
    imgBg: "#0b1220",
};

const STATUS_OPTIONS = [
    { value: "online", label: "Online" },
    { value: "demo_only", label: "Demo Only" },
    { value: "code_only", label: "Code Only" },
    { value: "unavailable", label: "Unavailable" },
];

function extractWebsite(url) {
    try {
        const hostname = new URL(url).hostname.replace(/^www\./, "");
        // Get root domain: e.g. blog.roboflow.com -> roboflow.com
        const parts = hostname.split(".");
        if (parts.length > 2) {
            return parts.slice(-2).join(".");
        }
        return hostname;
    } catch {
        return "";
    }
}

const inputStyle = {
    padding: "0.75rem 1rem",
    borderRadius: 8,
    border: `1px solid ${PALETTE.border}`,
    background: PALETTE.bg,
    color: PALETTE.text,
    fontSize: "1rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
};

const btnStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: 8,
    border: "none",
    background: PALETTE.accent,
    color: PALETTE.bg,
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "opacity 0.2s",
};

export default function UpdatePage() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [blogStatus, setBlogStatus] = useState("online");
    const [website, setWebsite] = useState("");
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [loadingImages, setLoadingImages] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [blogs, setBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);

    // Drag state
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const [dragIndex, setDragIndex] = useState(null);

    const fetchBlogs = useCallback(async () => {
        setLoadingBlogs(true);
        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .order("display_order", { ascending: true });
        if (error) {
            console.error("Error fetching blogs:", error);
        } else {
            setBlogs(data || []);
        }
        setLoadingBlogs(false);
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    useEffect(() => {
        setWebsite(extractWebsite(url));
    }, [url]);

    async function handleFetchImages() {
        if (!url) return;
        setLoadingImages(true);
        setImages([]);
        setSelectedImage("");
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch(
                `${SUPABASE_URL}/functions/v1/scrape-images?url=${encodeURIComponent(url)}`
            );
            const data = await res.json();
            if (data.images && data.images.length > 0) {
                setImages(data.images);
            } else {
                setMessage({ text: "No images found on this page.", type: "warning" });
            }
        } catch (err) {
            console.error("Error fetching images:", err);
            setMessage({ text: "Failed to fetch images. Check the URL.", type: "error" });
        }
        setLoadingImages(false);
    }

    async function uploadImageToStorage(imageUrl) {
        const ext = imageUrl.split("?")[0].split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const res = await fetch(`${SUPABASE_URL}/functions/v1/download-image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl, fileName }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data.publicUrl;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title || !url || !selectedImage || !blogStatus) {
            setMessage({ text: "Please fill all fields and select a thumbnail.", type: "error" });
            return;
        }
        setSubmitting(true);
        setMessage({ text: "Uploading image...", type: "warning" });

        try {
            const storedImageUrl = await uploadImageToStorage(selectedImage);

            // Shift all existing blogs down by 1 so new blog goes to top
            if (blogs.length > 0) {
                await Promise.all(
                    blogs.map((b) =>
                        supabase.from("blogs").update({ display_order: (b.display_order || 0) + 1 }).eq("id", b.id)
                    )
                );
            }

            const { error } = await supabase.from("blogs").insert([
                {
                    title,
                    url,
                    website,
                    image: storedImageUrl,
                    blog_status: blogStatus,
                    display_order: 1,
                },
            ]);

            if (error) {
                console.error("Error inserting blog:", error);
                setMessage({ text: `Error: ${error.message}`, type: "error" });
            } else {
                setMessage({ text: "Blog added successfully!", type: "success" });
                setTitle("");
                setUrl("");
                setWebsite("");
                setBlogStatus("online");
                setImages([]);
                setSelectedImage("");
                fetchBlogs();
            }
        } catch (err) {
            console.error("Error uploading image:", err);
            setMessage({ text: `Image upload failed: ${err.message}`, type: "error" });
        }
        setSubmitting(false);
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this blog?")) return;
        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (error) {
            console.error("Error deleting blog:", error);
        } else {
            fetchBlogs();
        }
    }

    // Drag and drop handlers
    function handleDragStart(index) {
        dragItem.current = index;
        setDragIndex(index);
    }

    function handleDragEnter(index) {
        dragOverItem.current = index;
        if (dragItem.current === null || dragItem.current === index) return;

        // Reorder locally for visual feedback
        const reordered = [...blogs];
        const draggedItem = reordered.splice(dragItem.current, 1)[0];
        reordered.splice(index, 0, draggedItem);
        dragItem.current = index;
        setBlogs(reordered);
    }

    function handleDragEnd() {
        setDragIndex(null);
        dragItem.current = null;
        dragOverItem.current = null;

        // Persist new order to Supabase
        const updates = blogs.map((blog, i) => ({
            id: blog.id,
            display_order: i + 1,
        }));

        Promise.all(
            updates.map(({ id, display_order }) =>
                supabase.from("blogs").update({ display_order }).eq("id", id)
            )
        ).then(() => {
            fetchBlogs(); // re-fetch to confirm
        });
    }

    return (
        <div
            style={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                minHeight: "100vh",
                padding: "2rem",
                maxWidth: 800,
                margin: "0 auto",
            }}
        >
            <h1 style={{ color: PALETTE.text, marginBottom: "0.25rem" }}>Add New Blog</h1>
            <p style={{ color: PALETTE.subtext, marginTop: 0, marginBottom: "2rem" }}>
                Paste a blog URL, fetch images, select a thumbnail, and submit.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* URL + Fetch */}
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ color: PALETTE.subtext, fontSize: "0.85rem", marginBottom: 4, display: "block" }}>
                            Blog URL
                        </label>
                        <input
                            type="url"
                            placeholder="https://blog.roboflow.com/example/"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleFetchImages}
                        disabled={!url || loadingImages}
                        style={{
                            ...btnStyle,
                            opacity: !url || loadingImages ? 0.5 : 1,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {loadingImages ? "Fetching..." : "Fetch Images"}
                    </button>
                </div>

                {/* Website (auto) */}
                {website && (
                    <div>
                        <label style={{ color: PALETTE.subtext, fontSize: "0.85rem", marginBottom: 4, display: "block" }}>
                            Website (auto-detected)
                        </label>
                        <div
                            style={{
                                ...inputStyle,
                                background: "transparent",
                                border: `1px solid ${PALETTE.border}`,
                                color: PALETTE.accent,
                            }}
                        >
                            {website}
                        </div>
                    </div>
                )}

                {/* Title */}
                <div>
                    <label style={{ color: PALETTE.subtext, fontSize: "0.85rem", marginBottom: 4, display: "block" }}>
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="Blog title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>

                {/* Status */}
                <div>
                    <label style={{ color: PALETTE.subtext, fontSize: "0.85rem", marginBottom: 4, display: "block" }}>
                        Blog Status
                    </label>
                    <select
                        value={blogStatus}
                        onChange={(e) => setBlogStatus(e.target.value)}
                        style={{ ...inputStyle, cursor: "pointer" }}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Images grid */}
                {images.length > 0 && (
                    <div>
                        <label style={{ color: PALETTE.subtext, fontSize: "0.85rem", marginBottom: 8, display: "block" }}>
                            Select Thumbnail ({images.length} images found)
                        </label>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                                gap: "0.75rem",
                                maxHeight: 400,
                                overflowY: "auto",
                                padding: 4,
                            }}
                        >
                            {images.map((imgUrl, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImage(imgUrl)}
                                    style={{
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        border:
                                            selectedImage === imgUrl
                                                ? `3px solid ${PALETTE.accent}`
                                                : `2px solid ${PALETTE.border}`,
                                        cursor: "pointer",
                                        transition: "border 0.15s, transform 0.15s",
                                        transform: selectedImage === imgUrl ? "scale(1.03)" : "scale(1)",
                                        background: PALETTE.imgBg,
                                    }}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`option ${i + 1}`}
                                        style={{
                                            width: "100%",
                                            height: 100,
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected thumbnail preview */}
                {selectedImage && (
                    <div>
                        <label style={{ color: PALETTE.subtext, fontSize: "0.85rem", marginBottom: 4, display: "block" }}>
                            Selected Thumbnail
                        </label>
                        <img
                            src={selectedImage}
                            alt="Selected thumbnail"
                            style={{
                                width: 220,
                                height: 130,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: `2px solid ${PALETTE.accent}`,
                            }}
                        />
                    </div>
                )}

                {/* Message */}
                {message.text && (
                    <p
                        style={{
                            margin: 0,
                            color:
                                message.type === "success"
                                    ? "#10b981"
                                    : message.type === "warning"
                                        ? "#f59e0b"
                                        : "#ef4444",
                            fontSize: "0.9rem",
                        }}
                    >
                        {message.text}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting}
                    style={{ ...btnStyle, opacity: submitting ? 0.5 : 1 }}
                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.opacity = "1"; }}
                >
                    {submitting ? "Uploading & Adding..." : "Add Blog"}
                </button>
            </form>

            {/* Existing blogs */}
            <hr style={{ border: "none", borderTop: `1px solid ${PALETTE.border}`, margin: "3rem 0 2rem" }} />
            <h2 style={{ color: PALETTE.text, marginBottom: "0.5rem" }}>Existing Blogs ({blogs.length})</h2>
            <p style={{ color: PALETTE.subtext, marginTop: 0, marginBottom: "1rem", fontSize: "0.85rem" }}>
                Drag and drop to reorder. Changes are saved automatically.
            </p>

            {loadingBlogs ? (
                <p style={{ color: PALETTE.subtext }}>Loading...</p>
            ) : blogs.length === 0 ? (
                <p style={{ color: PALETTE.subtext }}>No blogs yet.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {blogs.map((blog, index) => (
                        <div
                            key={blog.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.55rem 0.75rem",
                                background: dragIndex === index ? PALETTE.border : PALETTE.cardBg,
                                border: `1px solid ${PALETTE.border}`,
                                borderRadius: 8,
                                cursor: "grab",
                                opacity: dragIndex === index ? 0.6 : 1,
                                transition: "background 0.15s, opacity 0.15s",
                                userSelect: "none",
                            }}
                        >
                            {/* Drag handle */}
                            <span style={{ color: PALETTE.subtext, fontSize: "1rem", flexShrink: 0, cursor: "grab" }}>
                                ⠿
                            </span>

                            {/* Order number */}
                            <span style={{ color: PALETTE.subtext, fontSize: "0.75rem", width: 20, textAlign: "center", flexShrink: 0 }}>
                                {index + 1}
                            </span>

                            {/* Thumbnail */}
                            <img
                                src={blog.image.startsWith("http") ? blog.image : `${process.env.PUBLIC_URL}${blog.image}`}
                                alt={blog.title}
                                style={{
                                    width: 60,
                                    height: 40,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    flexShrink: 0,
                                    background: PALETTE.imgBg,
                                }}
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        color: PALETTE.text,
                                        fontSize: "0.85rem",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {blog.title}
                                </div>
                                <div style={{ color: PALETTE.subtext, fontSize: "0.7rem" }}>
                                    {blog.website} · {blog.blog_status}
                                </div>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(blog.id); }}
                                style={{
                                    padding: "0.35rem 0.6rem",
                                    borderRadius: 6,
                                    border: `1px solid #ef444466`,
                                    background: "transparent",
                                    color: "#ef4444",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
