import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mock API for Artworks
  const artworks = [
    {
      id: "1",
      title: "Ethereal Whispers",
      slug: "ethereal-whispers",
      artist: "Elena Vance",
      price: 1250,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1000",
      description: "A deep exploration of silence and light, capturing the fleeting moments of dawn in an abstract landscape.",
      category: "Abstract",
      style: "Contemporary",
      colors: ["Blue", "Gold", "White"],
      width: 80,
      height: 100,
      medium: "Oil on Canvas",
      year: 2024,
      status: "available",
      featured: true,
      stock: 1
    },
    {
      id: "2",
      title: "Urban Pulse",
      slug: "urban-pulse",
      artist: "Marcus Thorne",
      price: 850,
      image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1000",
      description: "The vibrant energy of the city captured through bold strokes and contrasting textures.",
      category: "Urban",
      style: "Expressionism",
      colors: ["Red", "Black", "Grey"],
      width: 60,
      height: 60,
      medium: "Acrylic on Wood",
      year: 2023,
      status: "sold",
      featured: false,
      stock: 0
    },
    {
      id: "3",
      title: "Serenity Flow",
      slug: "serenity-flow",
      artist: "Elena Vance",
      price: 1500,
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1000",
      description: "A calming composition inspired by the movement of water and the tranquility of nature.",
      category: "Nature",
      style: "Minimalism",
      colors: ["Teal", "Beige", "White"],
      width: 120,
      height: 90,
      medium: "Mixed Media",
      year: 2024,
      status: "available",
      featured: true,
      stock: 1
    },
    {
      id: "4",
      title: "Crimson Horizon",
      slug: "crimson-horizon",
      artist: "Julian Rossi",
      price: 2100,
      image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1000",
      description: "An intense study of color and emotion, depicting a sunset that feels both apocalyptic and hopeful.",
      category: "Landscape",
      style: "Impressionism",
      colors: ["Red", "Orange", "Purple"],
      width: 150,
      height: 100,
      medium: "Oil on Canvas",
      year: 2024,
      status: "reserved",
      featured: false,
      stock: 1
    },
    {
      id: "5",
      title: "Markos",
      slug: "mark",
      artist: "Julian Rossi",
      price: 52100,
      image: "https://homemarkt.lhscdn.com/uploads/resources/165165/pinakas-toixoy-hm4565-korniza-mavri-kamvas-ektyp.gynaikeia-figoura-82x4-5x82yek.-normal.jpg?lm=f3dd35377a8e8732164dff49dd79b39f",
      description: "aaaaa",
      category: "Landscape",
      style: "Impressionism",
      colors: ["Red", "Orange", "Purple"],
      width: 150,
      height: 100,
      medium: "Oil on Canvas",
      year: 2024,
      status: "reserved",
      featured: false,
      stock: 1
    }
  ];

  app.get("/api/artworks", (req, res) => {
    res.json(artworks);
  });

  app.get("/api/artworks/:slug", (req, res) => {
    const artwork = artworks.find(a => a.slug === req.params.slug);
    if (artwork) {
      res.json(artwork);
    } else {
      res.status(404).json({ message: "Artwork not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
