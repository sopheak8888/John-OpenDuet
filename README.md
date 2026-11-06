# HANDWRITTEN

HANDWRITTEN is an original trap track and music video. Code makes all of it: the beat, the scenes and the lyrics. It uses no samples and no stock footage.

The style is a dark terminal with neon green text and a 140 BPM trap beat. The song makes fun of developers who are afraid of AI and refuse to use it. It also shows how AI review tools now find security bugs in old human-written code.

## Files

| File | What it does |
| --- | --- |
| `handwritten.mp4` | The rendered video: 1280x720, 30 fps, about 74 seconds. |
| `index.html` | The player. It makes the beat with the Web Audio API and draws the video on a canvas. |
| `render.cjs` | Records `index.html` frame by frame and makes `handwritten.mp4` with ffmpeg. |

## Watch it

1. Open `handwritten.mp4` in a video player.
2. Or open `index.html` in a browser and click **PLAY**. Turn the sound on.

## Render the MP4 again

You need Node.js, Playwright with Chromium, and ffmpeg.

```bash
node render.cjs handwritten.mp4
```

To save some test frames as JPEG files, give the times in seconds:

```bash
node render.cjs out/test.mp4 --shots=4,24,38
```

## Song structure

| Section | Bars | Scene |
| --- | --- | --- |
| Intro | 4 | A legacy server terminal. The developer refuses AI tools. |
| Verse 1 | 8 | The developer types insecure `auth.php` code by hand. |
| Hook | 8 | "HAND-WRITTEN" title and a pull request that the author approved alone. |
| Verse 2 | 8 | An AI review tool reads the code and finds 47 issues in under a second. |
| Bridge | 4 | Human and AI review patch the code together. |
| Hook | 8 | The same pull request, now blocked by the AI review. |
| Outro | 2 | The fixed code passes CI. |

The message: AI is not the enemy. Unread code is.
