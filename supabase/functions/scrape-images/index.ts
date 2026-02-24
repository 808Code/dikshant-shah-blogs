import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "*",
            },
        });
    }

    const url = new URL(req.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
        return new Response(JSON.stringify({ error: "Missing 'url' parameter" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: `Failed to fetch URL: ${response.status}` }),
                {
                    status: 502,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        }

        const html = await response.text();

        // Extract image sources from <img> tags
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
        const images: string[] = [];
        let match;

        while ((match = imgRegex.exec(html)) !== null) {
            let src = match[1];

            // Skip data URIs, SVGs, tiny tracking pixels, and icons
            if (
                src.startsWith("data:") ||
                src.endsWith(".svg") ||
                src.includes("1x1") ||
                src.includes("pixel") ||
                src.includes("favicon")
            ) {
                continue;
            }

            // Resolve relative URLs
            if (src.startsWith("//")) {
                src = "https:" + src;
            } else if (src.startsWith("/")) {
                const base = new URL(targetUrl);
                src = base.origin + src;
            } else if (!src.startsWith("http")) {
                const base = new URL(targetUrl);
                src = new URL(src, base.href).href;
            }

            if (!images.includes(src)) {
                images.push(src);
            }
        }

        // Also extract from og:image and twitter:image meta tags
        const metaRegex =
            /<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
        while ((match = metaRegex.exec(html)) !== null) {
            let src = match[1];
            if (!src.startsWith("http")) {
                const base = new URL(targetUrl);
                src = new URL(src, base.href).href;
            }
            if (!images.includes(src)) {
                images.unshift(src); // prioritize og/twitter images
            }
        }

        // Also handle reversed meta tag attribute order (content before property)
        const metaRegex2 =
            /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi;
        while ((match = metaRegex2.exec(html)) !== null) {
            let src = match[1];
            if (!src.startsWith("http")) {
                const base = new URL(targetUrl);
                src = new URL(src, base.href).href;
            }
            if (!images.includes(src)) {
                images.unshift(src);
            }
        }

        return new Response(JSON.stringify({ images }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: `Error scraping: ${err.message}` }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }
});
