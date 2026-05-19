import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

// Simple JSON DB
const DB_FILE = path.join(process.cwd(), "database.json");

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    return { users: [], transactions: [], settings: {} };
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // --- API Routes ---

  app.get("/api/data", (req, res) => {
    const db = readDB();
    res.json(db);
  });

  app.post("/api/data", (req, res) => {
    writeDB(req.body);
    res.json({ success: true });
  });

  app.post("/api/transactions", (req, res) => {
    const db = readDB();
    db.transactions.push(req.body);
    writeDB(db);
    res.json({ success: true, transactions: db.transactions });
  });

  app.delete("/api/transactions/:id", (req, res) => {
    const db = readDB();
    db.transactions = db.transactions.filter((t: any) => t.id !== req.params.id);
    writeDB(db);
    res.json({ success: true, transactions: db.transactions });
  });

  app.put("/api/settings", (req, res) => {
    const db = readDB();
    db.settings = { ...db.settings, ...req.body };
    writeDB(db);
    res.json({ success: true, settings: db.settings });
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
