// Pattern studio: a generative canvas piece below the hero.
// Terrain draws contour lines with marching squares over a drifting noise field,
// with shaded relief and spot heights. Waves and Orbits draw flowing line families.
// Every pattern reacts to the pointer and to click or tap ripples, pauses while
// off screen, and renders one static frame when motion is reduced.
document.addEventListener("DOMContentLoaded", () => {
  const studio = document.querySelector("[data-pattern-studio]");
  const art = studio?.querySelector("[data-studio-art]");
  const canvas = art?.querySelector("canvas");
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;

  const root = document.documentElement;
  const toggle = studio.querySelector("[data-studio-toggle]");
  const controls = studio.querySelector("#studio-controls");
  const density = studio.querySelector("#studio-density");
  const curve = studio.querySelector("#studio-curve");
  const curveLabel = studio.querySelector("[data-studio-curve-label]");
  const lineStyle = studio.querySelector("#studio-line-style");
  const status = studio.querySelector("[data-studio-status]");
  const readout = studio.querySelector("[data-studio-readout]");
  const rippleButton = studio.querySelector("[data-studio-ripple]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const defaults = { pattern: "terrain", palette: "prism", density: 26, curve: 65, style: "continuous", seed: 7 };
  let settings = { ...defaults };
  const palettes = {
    prism: { dark: ["#bd9aff", "#747bff", "#45cbb5", "#d5db74", "#f9aa79", "#ef718e"], light: ["#8655c5", "#5754c9", "#1f907c", "#858a28", "#c46f35", "#bf476c"] },
    aurora: { dark: ["#8bd4c1", "#67aedc", "#b8a5e8"], light: ["#267963", "#386caa", "#8459b5"] },
    sunset: { dark: ["#ffd38c", "#f49a80", "#ed7c99", "#b492dd"], light: ["#a87a23", "#c16b40", "#bd486f", "#7950a8"] },
    ember: { dark: ["#6d2b35", "#b33a45", "#f07b88", "#f6c1a6", "#f4f1ed"], light: ["#c79a94", "#b0505a", "#8f2530", "#5b0505"] },
  };

  const RIPPLE_SPEED = 250;
  const RIPPLE_WIDTH = 74;
  const RIPPLE_LIMIT = 5;
  const LUT_SIZE = 128;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 };
  const ripples = [];
  const lutRgb = new Uint8Array(LUT_SIZE * 3);
  const lutCss = new Array(LUT_SIZE);
  const ink = { text: "#fff", muted: "#999", mono: "monospace" };
  const wash = document.createElement("canvas");
  const washCtx = wash.getContext("2d");
  let washPixels = null;
  let heights = new Float32Array(0);
  let width = 0;
  let height = 0;
  let cell = 10;
  let cols = 0;
  let rows = 0;
  let dpr = 1;
  let lightTheme = false;
  let frame = 0;
  let lastTime = 0;
  let clock = 0;
  let intro = 1;
  let visible = typeof IntersectionObserver !== "function";
  let seen = false;
  let readoutText = "";
  let readoutTime = 0;
  // Quality steps down when frames run slow: 2 = glow at up to 2x, 1 = no glow at 1.5x, 0 = 1x.
  let quality = 2;
  let slowFrames = 0;

  // Seeded gradient noise. Shuffle picks a new seed, so each terrain is repeatable.
  const perm = new Uint8Array(512);
  const gradX = [1, -1, 1, -1, 1, -1, 0, 0];
  const gradY = [1, 1, -1, -1, 0, 0, 1, -1];
  const reseed = (seed) => {
    let state = (seed * 2654435761) >>> 0 || 1;
    const random = () => {
      state ^= state << 13; state >>>= 0;
      state ^= state >>> 17;
      state ^= state << 5; state >>>= 0;
      return state / 4294967296;
    };
    const order = Array.from({ length: 256 }, (_, index) => index);
    for (let index = 255; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [order[index], order[swap]] = [order[swap], order[index]];
    }
    for (let index = 0; index < 512; index += 1) perm[index] = order[index & 255];
  };
  const noise = (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    const X = xi & 255;
    const Y = yi & 255;
    const aa = perm[perm[X] + Y] & 7;
    const ab = perm[perm[X] + Y + 1] & 7;
    const ba = perm[perm[X + 1] + Y] & 7;
    const bb = perm[perm[X + 1] + Y + 1] & 7;
    const top = (gradX[aa] * xf + gradY[aa] * yf) * (1 - u) + (gradX[ba] * (xf - 1) + gradY[ba] * yf) * u;
    const bottom = (gradX[ab] * xf + gradY[ab] * (yf - 1)) * (1 - u) + (gradX[bb] * (xf - 1) + gradY[bb] * (yf - 1)) * u;
    return top * (1 - v) + bottom * v;
  };

  const motionAllowed = () => !reducedMotion.matches && root.dataset.motion !== "off";
  const canRun = () => visible && !document.hidden && motionAllowed();
  const colorAt = (fraction) => lutCss[Math.round(clamp(fraction, 0, 1) * (LUT_SIZE - 1))];
  // Lines appear from the lowest level upward while the intro runs.
  const reveal = (fraction) => {
    const value = clamp(intro * 1.7 - fraction * 0.7, 0, 1);
    return value * value * (3 - 2 * value);
  };

  const buildColors = () => {
    lightTheme = root.dataset.theme === "light";
    const stops = palettes[settings.palette][lightTheme ? "light" : "dark"]
      .map((hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)));
    for (let index = 0; index < LUT_SIZE; index += 1) {
      const step = (index / (LUT_SIZE - 1)) * (stops.length - 1);
      const from = Math.min(stops.length - 2, Math.floor(step));
      const channels = [0, 1, 2].map((channel) => Math.round(stops[from][channel] + (stops[from + 1][channel] - stops[from][channel]) * (step - from)));
      lutRgb.set(channels, index * 3);
      lutCss[index] = `rgb(${channels.join(",")})`;
    }
    const styles = getComputedStyle(root);
    ink.text = styles.getPropertyValue("--text").trim() || ink.text;
    ink.muted = styles.getPropertyValue("--muted").trim() || ink.muted;
    ink.mono = styles.getPropertyValue("--mono").trim() || ink.mono;
  };

  const resize = () => {
    width = art.clientWidth;
    height = art.clientHeight;
    if (!width || !height) return;
    dpr = Math.min(window.devicePixelRatio || 1, [1, 1.5, 2][quality]);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    cell = clamp(Math.round(width / 110), 8, 12);
    cols = Math.ceil(width / cell) + 1;
    rows = Math.ceil(height / cell) + 1;
    heights = new Float32Array(cols * rows);
    wash.width = cols;
    wash.height = rows;
    washPixels = washCtx.createImageData(cols, rows);
  };

  // A ripple is a travelling ring. Its profile is zero at both edges of the band.
  const ringProfile = (distance, ripple) => {
    const offset = (distance - ripple.age * RIPPLE_SPEED) / RIPPLE_WIDTH;
    if (offset <= -1 || offset >= 1) return 0;
    return Math.sin(offset * Math.PI) * (1 - offset * offset) * (1 - ripple.age / ripple.life) ** 1.5;
  };

  const fillHeights = () => {
    const frequency = (0.6 + settings.curve / 100) / clamp(width * 0.34, 220, 460);
    const detail = frequency * 2.3;
    const ax = clock * 0.03;
    const ay = clock * 0.018;
    const bx = 31.7 - clock * 0.046;
    const by = 12.3 + clock * 0.027;
    const sigma = clamp(width * 0.09, 70, 130);
    const spread = 2 * sigma * sigma;
    const reach = 9 * sigma * sigma;
    const hill = 0.4 * pointer.strength;
    for (let row = 0; row < rows; row += 1) {
      const y = row * cell;
      for (let col = 0; col < cols; col += 1) {
        const x = col * cell;
        let value = 0.5 + 0.86 * noise(x * frequency + ax, y * frequency + ay) + 0.3 * noise(x * detail + bx, y * detail + by);
        if (hill > 0.001) {
          const distance = (x - pointer.x) ** 2 + (y - pointer.y) ** 2;
          if (distance < reach) value += hill * Math.exp(-distance / spread);
        }
        for (const ripple of ripples) value += 0.15 * ringProfile(Math.hypot(x - ripple.x, y - ripple.y), ripple);
        heights[row * cols + col] = value;
      }
    }
  };

  // Shaded relief: a tiny image, one pixel per grid vertex, scaled up under the lines.
  const drawWash = () => {
    const data = washPixels.data;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const index = row * cols + col;
        const value = clamp(heights[index], 0, 1);
        const slope = heights[index + (col < cols - 1 ? 1 : 0)] - heights[index - (col > 0 ? 1 : 0)]
          + heights[index + (row < rows - 1 ? cols : 0)] - heights[index - (row > 0 ? cols : 0)];
        const lit = clamp(0.5 + slope * 4.5, 0, 1);
        const color = Math.round(value * (LUT_SIZE - 1)) * 3;
        const pixel = index * 4;
        data[pixel] = lutRgb[color];
        data[pixel + 1] = lutRgb[color + 1];
        data[pixel + 2] = lutRgb[color + 2];
        data[pixel + 3] = 255 * (lightTheme ? 0.2 + 0.8 * (1 - lit) : 0.1 + 0.9 * lit) * (0.4 + 0.6 * value);
      }
    }
    washCtx.putImageData(washPixels, 0, 0);
    ctx.globalAlpha = (lightTheme ? 0.2 : 0.26) * intro;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(wash, -cell / 2, -cell / 2, cols * cell, rows * cell);
  };

  const drawContours = () => {
    const count = settings.density;
    const step = 1 / count;
    const dots = settings.style === "dots";
    const dashed = settings.style === "segments";
    const paths = Array.from({ length: count }, () => new Path2D());
    const px = [0, 0, 0, 0];
    const py = [0, 0, 0, 0];
    const segment = (path, from, to) => {
      const middleX = (px[from] + px[to]) / 2;
      const middleY = (py[from] + py[to]) / 2;
      if (dots) {
        path.moveTo(middleX, middleY);
        path.lineTo(middleX + 0.01, middleY);
        return;
      }
      const keep = dashed ? 0.56 : 1;
      path.moveTo(middleX + (px[from] - middleX) * keep, middleY + (py[from] - middleY) * keep);
      path.lineTo(middleX + (px[to] - middleX) * keep, middleY + (py[to] - middleY) * keep);
    };

    for (let row = 0; row < rows - 1; row += 1) {
      const y = row * cell;
      for (let col = 0; col < cols - 1; col += 1) {
        const index = row * cols + col;
        const topLeft = heights[index];
        const topRight = heights[index + 1];
        const bottomLeft = heights[index + cols];
        const bottomRight = heights[index + cols + 1];
        const low = Math.ceil(Math.min(topLeft, topRight, bottomLeft, bottomRight) / step - 0.5);
        const high = Math.floor(Math.max(topLeft, topRight, bottomLeft, bottomRight) / step - 0.5);
        if (low > high) continue;
        const x = col * cell;
        for (let level = low; level <= high; level += 1) {
          const threshold = (level + 0.5) * step;
          const a = topLeft > threshold;
          const b = topRight > threshold;
          const c = bottomRight > threshold;
          const d = bottomLeft > threshold;
          let crossings = 0;
          if (a !== b) { px[crossings] = x + cell * (threshold - topLeft) / (topRight - topLeft); py[crossings] = y; crossings += 1; }
          if (b !== c) { px[crossings] = x + cell; py[crossings] = y + cell * (threshold - topRight) / (bottomRight - topRight); crossings += 1; }
          if (d !== c) { px[crossings] = x + cell * (threshold - bottomLeft) / (bottomRight - bottomLeft); py[crossings] = y + cell; crossings += 1; }
          if (a !== d) { px[crossings] = x; py[crossings] = y + cell * (threshold - topLeft) / (bottomLeft - topLeft); crossings += 1; }
          // Heights above the top level reuse the last colour, so a raised hill keeps its rings.
          const path = paths[clamp(level, 0, count - 1)];
          if (crossings === 2) segment(path, 0, 1);
          else if (crossings === 4) {
            // Saddle: the cell centre decides which pair of corners stays connected.
            const centre = (topLeft + topRight + bottomLeft + bottomRight) / 4 > threshold;
            if (centre === a) { segment(path, 0, 1); segment(path, 2, 3); }
            else { segment(path, 0, 3); segment(path, 1, 2); }
          }
        }
      }
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let level = 0; level < count; level += 1) {
      const fraction = count > 1 ? level / (count - 1) : 0;
      const shown = reveal(fraction);
      if (!shown) continue;
      const indexLine = level % 5 === 0;
      const color = colorAt(fraction);
      ctx.strokeStyle = color;
      ctx.globalAlpha = shown * (indexLine ? 1 : lightTheme ? 0.74 : 0.6);
      ctx.lineWidth = dots ? (indexLine ? 2.8 : 2) : dashed ? (indexLine ? 2.2 : 1.5) : (indexLine ? 1.8 : 1);
      ctx.shadowColor = color;
      ctx.shadowBlur = indexLine && !lightTheme && quality === 2 ? 9 : 0;
      ctx.stroke(paths[level]);
    }
    ctx.shadowBlur = 0;
  };

  // Spot heights mark the highest local summits, placed between vertices with a parabolic fit.
  const drawSummits = () => {
    const summits = [];
    for (let row = 1; row < rows - 1; row += 1) {
      for (let col = 1; col < cols - 1; col += 1) {
        const index = row * cols + col;
        const value = heights[index];
        if (value < 0.68) continue;
        if (value <= heights[index - 1] || value < heights[index + 1] || value <= heights[index - cols] || value < heights[index + cols]) continue;
        if (value <= heights[index - cols - 1] || value <= heights[index - cols + 1] || value < heights[index + cols - 1] || value < heights[index + cols + 1]) continue;
        summits.push(index);
      }
    }
    summits.sort((first, second) => heights[second] - heights[first]);
    ctx.font = `10px ${ink.mono}`;
    ctx.textBaseline = "middle";
    for (const index of summits.slice(0, 6)) {
      const value = heights[index];
      const bendX = heights[index - 1] - 2 * value + heights[index + 1];
      const bendY = heights[index - cols] - 2 * value + heights[index + cols];
      const x = ((index % cols) + (bendX < 0 ? clamp(0.5 * (heights[index - 1] - heights[index + 1]) / bendX, -0.5, 0.5) : 0)) * cell;
      const y = (Math.floor(index / cols) + (bendY < 0 ? clamp(0.5 * (heights[index - cols] - heights[index + cols]) / bendY, -0.5, 0.5) : 0)) * cell;
      const edge = Math.min(x - 24, width - 64 - x, y - 14, height - 14 - y);
      const shown = clamp((value - 0.68) / 0.1, 0, 1) * clamp(edge / 30, 0, 1) * intro * intro;
      if (shown < 0.02) continue;
      ctx.globalAlpha = shown;
      ctx.fillStyle = ink.text;
      ctx.beginPath();
      ctx.moveTo(x, y - 4.5);
      ctx.lineTo(x + 4.2, y + 3);
      ctx.lineTo(x - 4.2, y + 3);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = shown * 0.85;
      ctx.fillStyle = ink.muted;
      ctx.fillText(String(Math.round(value * 1000)), x + 9, y);
    }
  };

  const drawLines = () => {
    const count = settings.density;
    const amplitude = settings.curve / 65;
    const orbits = settings.pattern === "orbits";
    const samples = orbits ? 168 : Math.max(60, Math.ceil(width / 10));
    const lineWidth = settings.style === "continuous" ? 1.7 : Math.min(4.5, (height / count) * 0.32);
    const dash = width < 500 ? 13 : 23;
    const reach = Math.min(width * 0.48, 230);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    for (let row = 0; row < count; row += 1) {
      const fraction = count > 1 ? row / (count - 1) : 0;
      const shown = reveal(fraction);
      if (!shown) continue;
      const spreadY = fraction * 2 - 1;
      ctx.beginPath();
      for (let sample = 0; sample <= samples; sample += 1) {
        const t = sample / samples;
        let x;
        let y;
        if (orbits) {
          const angle = t * Math.PI * 2 + clock * 0.05 * (0.4 + fraction);
          const wobble = 1 + Math.sin(angle * 3 + fraction * 1.6 - clock * 0.32) * 0.12 * amplitude;
          x = width * 0.5 + Math.cos(angle) * width * (0.06 + fraction * 0.41) * wobble;
          y = height * 0.5 + Math.sin(angle) * height * (0.08 + fraction * 0.33) * wobble;
        } else {
          const u = t * 1.16 - 0.08;
          const envelope = 0.6 + 0.4 * Math.sin(Math.PI * clamp(u, 0, 1));
          x = u * width;
          y = height * 0.5 + Math.sin(u * Math.PI * 2 - 0.6 + clock * 0.22) * height * 0.14 * amplitude
            + spreadY * height * 0.28 * envelope
            + Math.cos(u * Math.PI * 3 + spreadY * 0.9 - clock * 0.16) * height * 0.06 * amplitude;
        }
        if (pointer.strength > 0.001) {
          // A soft twist plus outward pressure creates a local, elastic bend.
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const influence = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
          const force = influence * influence * pointer.strength;
          x += (dx * 0.4 - dy * 0.8) * force;
          y += (dy * 0.4 + dx * 0.8) * force;
        }
        for (const ripple of ripples) {
          const dx = x - ripple.x;
          const dy = y - ripple.y;
          const distance = Math.hypot(dx, dy) || 1;
          const push = 18 * ringProfile(distance, ripple);
          x += (dx / distance) * push;
          y += (dy / distance) * push;
        }
        if (sample) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      if (orbits) ctx.closePath();
      if (settings.style === "continuous") ctx.setLineDash([]);
      else {
        ctx.setLineDash(settings.style === "dots" ? [0.1, lineWidth * 3] : [dash, dash * 0.7]);
        ctx.lineDashOffset = row * -7 - clock * 9;
      }
      ctx.strokeStyle = colorAt(fraction);
      ctx.globalAlpha = shown * (settings.style === "continuous" ? 0.9 : 1);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const drawPointer = () => {
    if (pointer.strength < 0.02) return;
    ctx.strokeStyle = ink.text;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.85 * pointer.strength;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, 3.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.28 * pointer.strength;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, 9 + 5 * Math.sin(clock * 2.4), 0, Math.PI * 2);
    ctx.stroke();
  };

  const heightAt = (x, y) => {
    const col = clamp(x / cell, 0, cols - 1.001);
    const row = clamp(y / cell, 0, rows - 1.001);
    const index = Math.floor(row) * cols + Math.floor(col);
    const fx = col - Math.floor(col);
    const fy = row - Math.floor(row);
    return (heights[index] * (1 - fx) + heights[index + 1] * fx) * (1 - fy)
      + (heights[index + cols] * (1 - fx) + heights[index + cols + 1] * fx) * fy;
  };

  const syncState = () => {
    const interacting = String(pointer.strength > 0.02 || ripples.length > 0);
    if (studio.dataset.interacting !== interacting) studio.dataset.interacting = interacting;
    const now = performance.now();
    if (now - readoutTime < 110 && readoutText) return;
    readoutTime = now;
    const subject = settings.pattern === "terrain" ? "terrain" : "pattern";
    let text = finePointer.matches ? `Move across the ${subject}. Click to send a ripple.` : `Tap the ${subject} to send a ripple.`;
    if (!motionAllowed()) text = "Static view. Motion is reduced.";
    else if (pointer.strength > 0.3 && settings.pattern === "terrain") text = `Elevation ${Math.round(clamp(heightAt(pointer.x, pointer.y), 0, 1.6) * 1000)} / click to send a ripple`;
    if (text !== readoutText) readout.textContent = readoutText = text;
  };

  const draw = () => {
    if (!width || !height) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    if (settings.pattern === "terrain") {
      fillHeights();
      drawWash();
      drawContours();
      drawSummits();
    } else drawLines();
    drawPointer();
    ctx.globalAlpha = 1;
    syncState();
  };

  const halt = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    studio.dataset.running = "false";
    // Nothing can be mid-interaction while the loop is stopped, so the frame settles.
    pointer.strength = pointer.target = 0;
    ripples.length = 0;
    if (!motionAllowed()) intro = 1;
    draw();
  };
  const tick = (time) => {
    frame = 0;
    if (!canRun()) { halt(); return; }
    const interval = time - lastTime;
    const elapsed = clamp(interval / 1000, 0, 0.05);
    lastTime = time;
    // About a second of frames slower than 40fps lowers the quality. Long gaps are tab switches.
    slowFrames = interval > 25 && interval < 250 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 40 && quality > 0) {
      quality -= 1;
      slowFrames = 0;
      studio.dataset.quality = String(quality);
      resize();
    }
    clock += elapsed;
    intro = Math.min(1, intro + elapsed / 1.4);
    const follow = 1 - Math.exp(-elapsed / 0.09);
    pointer.x += (pointer.tx - pointer.x) * follow;
    pointer.y += (pointer.ty - pointer.y) * follow;
    pointer.strength += (pointer.target - pointer.strength) * (1 - Math.exp(-elapsed / 0.2));
    if (!pointer.target && pointer.strength < 0.004) pointer.strength = 0;
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      ripples[index].age += elapsed;
      if (ripples[index].age >= ripples[index].life) ripples.splice(index, 1);
    }
    draw();
    frame = window.requestAnimationFrame(tick);
  };
  const start = () => {
    if (frame || !canRun()) return;
    lastTime = performance.now();
    studio.dataset.running = "true";
    frame = window.requestAnimationFrame(tick);
  };
  const replay = () => { if (motionAllowed()) intro = 0; };

  const addRipple = (x, y) => {
    if (!motionAllowed()) return;
    if (ripples.length >= RIPPLE_LIMIT) ripples.shift();
    ripples.push({ x, y, age: 0, life: clamp(Math.hypot(width, height) / RIPPLE_SPEED, 1.6, 4.2) });
    start();
  };

  const syncControls = () => {
    studio.querySelectorAll("[data-studio-pattern]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.studioPattern === settings.pattern)));
    studio.querySelectorAll("[data-studio-palette]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.studioPalette === settings.palette)));
    density.value = String(settings.density);
    density.setAttribute("aria-valuetext", `${settings.density} lines`);
    studio.querySelector("[data-studio-density-output]").value = `${settings.density} lines`;
    curve.value = String(settings.curve);
    curve.setAttribute("aria-valuetext", `${settings.curve} percent`);
    studio.querySelector("[data-studio-curve-output]").value = `${settings.curve}%`;
    curveLabel.textContent = settings.pattern === "terrain" ? "Relief" : "Curve strength";
    lineStyle.value = settings.style;
    Object.assign(studio.dataset, { pattern: settings.pattern, palette: settings.palette, lines: settings.density, lineStyle: settings.style, seed: settings.seed });
  };
  const update = () => {
    syncControls();
    buildColors();
    reseed(settings.seed);
    readoutText = "";
    if (!frame) draw();
  };

  studio.querySelectorAll("[data-studio-pattern]").forEach((button) => button.addEventListener("click", () => {
    if (settings.pattern !== button.dataset.studioPattern) replay();
    settings.pattern = button.dataset.studioPattern;
    update();
  }));
  studio.querySelectorAll("[data-studio-palette]").forEach((button) => button.addEventListener("click", () => {
    settings.palette = button.dataset.studioPalette;
    update();
  }));
  density.addEventListener("input", () => { settings.density = Number(density.value); update(); });
  curve.addEventListener("input", () => { settings.curve = Number(curve.value); update(); });
  lineStyle.addEventListener("change", () => { settings.style = lineStyle.value; update(); });
  studio.querySelector("[data-studio-reset]").addEventListener("click", () => {
    settings = { ...defaults };
    replay();
    update();
    status.textContent = "Default pattern restored.";
  });
  studio.querySelector("[data-studio-random]").addEventListener("click", () => {
    const pick = (options) => options[Math.floor(Math.random() * options.length)];
    settings = {
      pattern: pick(["terrain", "terrain", "waves", "orbits"]),
      palette: pick(Object.keys(palettes).filter((palette) => palette !== settings.palette)),
      density: 16 + Math.floor(Math.random() * 11) * 2,
      curve: 30 + Math.floor(Math.random() * 15) * 5,
      style: pick(["continuous", "continuous", "segments", "dots"]),
      seed: 1 + Math.floor(Math.random() * 9999),
    };
    replay();
    update();
    status.textContent = `New pattern: ${settings.pattern}, ${settings.palette} palette, ${settings.density} lines.`;
  });
  rippleButton.addEventListener("click", () => {
    addRipple(width * (0.3 + Math.random() * 0.4), height * (0.35 + Math.random() * 0.3));
    status.textContent = "Ripple sent across the pattern.";
  });

  const closeControls = (restoreFocus = false) => {
    controls.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener("click", () => {
    const open = controls.hidden;
    controls.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });
  studio.querySelector("[data-studio-close]").addEventListener("click", () => closeControls(true));
  studio.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !controls.hidden) {
      event.stopPropagation();
      closeControls(true);
    }
  });
  studio.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !studio.contains(event.relatedTarget)) closeControls();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!controls.hidden && !controls.contains(event.target) && !toggle.contains(event.target)) {
      closeControls(controls.contains(document.activeElement));
    }
  });

  const release = () => { pointer.target = 0; };
  art.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || !motionAllowed()) return;
    const bounds = art.getBoundingClientRect();
    pointer.tx = event.clientX - bounds.left;
    pointer.ty = event.clientY - bounds.top;
    if (!pointer.strength) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
    pointer.target = 1;
    start();
  }, { passive: true });
  art.addEventListener("pointerleave", release);
  art.addEventListener("pointercancel", release);
  art.addEventListener("click", (event) => {
    const bounds = art.getBoundingClientRect();
    addRipple(event.clientX - bounds.left, event.clientY - bounds.top);
  });
  window.addEventListener("blur", release);

  const syncMotion = () => {
    const allowed = motionAllowed();
    studio.dataset.reactive = String(allowed);
    rippleButton.disabled = !allowed;
    readoutText = "";
    if (canRun()) start();
    else halt();
  };
  reducedMotion.addEventListener("change", syncMotion);
  finePointer.addEventListener("change", () => { readoutText = ""; if (!frame) draw(); });
  document.addEventListener("visibilitychange", syncMotion);
  new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === "data-theme")) buildColors();
    syncMotion();
  }).observe(root, { attributes: true, attributeFilter: ["data-motion", "data-theme"] });
  if (typeof IntersectionObserver === "function") {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !seen) { seen = true; replay(); }
      syncMotion();
    }).observe(art);
  }

  studio.hidden = false;
  studio.dataset.quality = String(quality);
  resize();
  update();
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(() => {
      if (art.clientWidth === width && art.clientHeight === height) return;
      resize();
      if (!frame) draw();
    }).observe(art);
  } else window.addEventListener("resize", () => { resize(); if (!frame) draw(); }, { passive: true });
  syncMotion();
});
