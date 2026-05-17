import cors from "cors";
import fs from "node:fs";
import "dotenv/config";
import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { summarizeEmail } from "./agent.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const port = Number(process.env.PORT ?? 3001);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPathCandidate = path.resolve(
  __dirname,
  "../client-angular/dist/client-angular",
);
const publicPath = fs.existsSync(publicPathCandidate)
  ? publicPathCandidate
  : path.resolve(__dirname, "../public");

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/summarize", upload.single("emailFile"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error:
          "OPENAI_API_KEY is missing. Add it to a .env file before running the app.",
      });
    }

    const pastedEmail =
      typeof req.body.email === "string" ? req.body.email : "";
    const uploadedEmail = req.file?.buffer.toString("utf8") ?? "";
    const emailText = [pastedEmail, uploadedEmail].filter(Boolean).join("\n\n");

    const summary = await summarizeEmail(emailText);
    return res.json({ summary });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong while summarizing the email.";

    return res.status(500).json({ error: message });
  }
});

app.use(express.static(publicPath));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Email Summarizer Agent API running on http://localhost:${port}`);
});
