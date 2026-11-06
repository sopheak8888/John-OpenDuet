// Renders index.html to an MP4 file (1280x720, 30 fps, AAC audio).
// Usage: node render.cjs [out.mp4] [--frames=N] [--shots=t1,t2,...]
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

(async () => {
  const args = process.argv.slice(2);
  const out = path.resolve(args.find(a => !a.startsWith("--")) || "handwritten.mp4");
  const opt = k => (args.find(a => a.startsWith(`--${k}=`)) || "").split("=")[1];
  const fps = 30;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on("pageerror", e => { console.error("page error:", e); process.exit(1); });
  await page.goto("file://" + path.resolve(__dirname, "index.html"));
  await page.waitForFunction(() => window.HW && window.HW.ready);

  if (opt("shots")) {
    for (const t of opt("shots").split(",").map(Number)) {
      const b64 = await page.evaluate(t => window.HW.frame(t), t);
      fs.writeFileSync(path.join(path.dirname(out), `shot-${t}.jpg`), Buffer.from(b64, "base64"));
    }
    await browser.close();
    return;
  }

  console.log("rendering audio...");
  const wavPath = out.replace(/\.mp4$/, "") + ".wav";
  fs.writeFileSync(wavPath, Buffer.from(await page.evaluate(() => window.HW.renderWav()), "base64"));

  const duration = await page.evaluate(() => window.HW.duration);
  const n = Number(opt("frames")) || Math.ceil(duration * fps);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-i", wavPath, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "21",
    "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out],
    { stdio: ["pipe", "inherit", "inherit"] });

  for (let i = 0; i < n; i++) {
    const b64 = await page.evaluate(t => window.HW.frame(t), i / fps);
    if (!ff.stdin.write(Buffer.from(b64, "base64"))) await new Promise(r => ff.stdin.once("drain", r));
    if (i % 300 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  const code = await new Promise(r => ff.on("close", r));
  fs.unlinkSync(wavPath);
  await browser.close();
  if (code !== 0) { console.error("ffmpeg failed"); process.exit(1); }
  console.log("done:", out);
})();
