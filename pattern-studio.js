document.addEventListener("DOMContentLoaded", () => {
  const studio = document.querySelector("[data-pattern-studio]");
  const art = studio?.querySelector("[data-studio-art]");
  const svg = studio?.querySelector("[data-studio-svg]");
  if (!art || !svg) return;

  const root = document.documentElement;
  const toggle = studio.querySelector("[data-studio-toggle]");
  const controls = studio.querySelector("#studio-controls");
  const density = studio.querySelector("#studio-density");
  const curve = studio.querySelector("#studio-curve");
  const lineStyle = studio.querySelector("#studio-line-style");
  const status = studio.querySelector("[data-studio-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const defaults = { pattern: "waves", palette: "prism", density: 26, curve: 65, style: "segments" };
  let settings = { ...defaults };
  const palettes = {
    prism: { dark: ["#bd9aff", "#747bff", "#45cbb5", "#d5db74", "#f9aa79", "#ef718e"], light: ["#8655c5", "#5754c9", "#1f907c", "#858a28", "#c46f35", "#bf476c"] },
    aurora: { dark: ["#8bd4c1", "#67aedc", "#b8a5e8"], light: ["#267963", "#386caa", "#8459b5"] },
    sunset: { dark: ["#ffd38c", "#f49a80", "#ed7c99", "#b492dd"], light: ["#a87a23", "#c16b40", "#bd486f", "#7950a8"] },
  };
  const paths = [];
  const pointer = { x: 0, y: 0, strength: 0, tx: 0, ty: 0, target: 0 };
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastTime = 0;
  let visible = true;

  const enabled = () => visible && !document.hidden && hoverPointer.matches
    && !reducedMotion.matches && root.dataset.motion !== "off";

  const colorAt = (position) => {
    const colors = palettes[settings.palette][root.dataset.theme === "light" ? "light" : "dark"];
    const step = position * (colors.length - 1);
    const index = Math.min(colors.length - 2, Math.floor(step));
    const fraction = step - index;
    const channels = [1, 3, 5].map((offset) => {
      const start = parseInt(colors[index].slice(offset, offset + 2), 16);
      const end = parseInt(colors[index + 1].slice(offset, offset + 2), 16);
      return Math.round(start + (end - start) * fraction);
    });
    return `rgb(${channels.join(",")})`;
  };

  // Geometry is cached between configuration changes. Only the nearby curve bends.
  const pathData = (points, deform = false) => {
    const radius = Math.min(width * 0.48, 230);
    return points.map(([baseX, baseY], index) => {
      let x = baseX;
      let y = baseY;
      if (deform && pointer.strength) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / radius);
        const force = influence * influence * pointer.strength;
        // A soft twist plus outward pressure creates a local, elastic ripple.
        x += (dx * 0.4 - dy * 0.8) * force;
        y += (dy * 0.4 + dx * 0.8) * force;
      }
      return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + (settings.pattern === "orbits" ? " Z" : "");
  };

  const render = () => {
    paths.forEach((path) => path.node.setAttribute("d", pointer.strength ? pathData(path.points, true) : path.rest));
    studio.dataset.interacting = String(pointer.strength > 0);
  };

  const resetMotion = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    pointer.strength = pointer.target = 0;
    render();
  };

  const build = () => {
    resetMotion();
    width = art.clientWidth;
    height = art.clientHeight;
    if (!width || !height) return;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    paths.length = 0;
    const fragment = document.createDocumentFragment();
    const amplitude = settings.curve / 65;
    const samples = settings.pattern === "orbits" ? 144 : Math.max(60, Math.ceil(width / 12));
    const strokeWidth = settings.style === "continuous" ? 2.2 : Math.min(5, height / settings.density * 0.34);
    const segment = width < 500 ? 13 : 23;
    for (let row = 0; row < settings.density; row += 1) {
      const fraction = row / (settings.density - 1);
      const spread = fraction * 2 - 1;
      const points = [];
      for (let sample = 0; sample <= samples; sample += 1) {
        const t = sample / samples;
        if (settings.pattern === "orbits") {
          const angle = t * Math.PI * 2;
          const ripple = 1 + Math.sin(angle * 3 + fraction * 1.6) * 0.12 * amplitude;
          const x = width * 0.5 + Math.cos(angle) * width * (0.06 + fraction * 0.41) * ripple;
          const y = height * 0.5 + Math.sin(angle) * height * (0.08 + fraction * 0.33) * ripple;
          points.push([x, y]);
        } else {
          const u = t * 1.16 - 0.08;
          const envelope = 0.6 + 0.4 * Math.sin(Math.PI * Math.max(0, Math.min(1, u)));
          const y = height * 0.5 + Math.sin(u * Math.PI * 2 - 0.6) * height * 0.14 * amplitude
            + spread * height * 0.28 * envelope
            + Math.cos(u * Math.PI * 3 + spread * 0.9) * height * 0.06 * amplitude;
          points.push([u * width, y]);
        }
      }
      const node = document.createElementNS("http://www.w3.org/2000/svg", "path");
      node.setAttribute("stroke", colorAt(fraction));
      node.setAttribute("stroke-width", String(strokeWidth));
      if (settings.style !== "continuous") {
        node.setAttribute("stroke-dasharray", settings.style === "dots" ? `0.1 ${strokeWidth * 3}` : `${segment} ${segment * 0.7}`);
        node.setAttribute("stroke-dashoffset", String(row * -7));
      }
      const rest = pathData(points);
      node.setAttribute("d", rest);
      paths.push({ node, points, rest });
      fragment.appendChild(node);
    }
    svg.replaceChildren(fragment);
    studio.dataset.pattern = settings.pattern;
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
    lineStyle.value = settings.style;
  };

  const update = () => { syncControls(); build(); };
  studio.querySelectorAll("[data-studio-pattern]").forEach((button) => button.addEventListener("click", () => {
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
    update();
    status.textContent = "Default pattern restored.";
  });
  studio.querySelector("[data-studio-random]").addEventListener("click", () => {
    const pick = (options) => options[Math.floor(Math.random() * options.length)];
    settings = {
      pattern: pick(["waves", "orbits"]),
      palette: pick(Object.keys(palettes).filter((palette) => palette !== settings.palette)),
      density: 16 + Math.floor(Math.random() * 11) * 2,
      curve: 30 + Math.floor(Math.random() * 15) * 5,
      style: pick(["segments", "continuous", "dots"]),
    };
    update();
    status.textContent = `New pattern: ${settings.pattern}, ${settings.palette} palette, ${settings.density} lines.`;
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
    if (open) resetMotion();
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

  const animate = (time) => {
    frame = 0;
    if (!enabled()) { resetMotion(); return; }
    const elapsed = lastTime ? Math.min(time - lastTime, 48) : 16;
    const ease = 1 - Math.exp(-elapsed / 85);
    lastTime = time;
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    pointer.strength += (pointer.target - pointer.strength) * ease;
    const moving = Math.abs(pointer.target - pointer.strength) > 0.001
      || Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.1;
    if (!moving) {
      pointer.x = pointer.tx;
      pointer.y = pointer.ty;
      pointer.strength = pointer.target;
      lastTime = 0;
    }
    render();
    if (moving) frame = window.requestAnimationFrame(animate);
  };
  const start = () => { if (!frame && enabled()) frame = window.requestAnimationFrame(animate); };
  art.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || !enabled()) return;
    const bounds = art.getBoundingClientRect();
    pointer.tx = event.clientX - bounds.left;
    pointer.ty = event.clientY - bounds.top;
    if (!pointer.strength) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
    pointer.target = 1;
    start();
  }, { passive: true });
  art.addEventListener("pointerleave", () => { pointer.target = 0; start(); });
  art.addEventListener("pointercancel", resetMotion);
  window.addEventListener("blur", resetMotion);
  document.addEventListener("visibilitychange", resetMotion);

  const syncPreference = () => {
    studio.dataset.reactive = String(hoverPointer.matches && !reducedMotion.matches && root.dataset.motion !== "off");
    if (!enabled()) resetMotion();
  };
  reducedMotion.addEventListener("change", syncPreference);
  hoverPointer.addEventListener("change", syncPreference);
  new MutationObserver((mutations) => {
    syncPreference();
    if (mutations.some((mutation) => mutation.attributeName === "data-theme")) build();
  }).observe(root, { attributes: true, attributeFilter: ["data-motion", "data-theme"] });
  if (typeof IntersectionObserver === "function") {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) resetMotion();
    }).observe(art);
  }
  studio.hidden = false;
  update();
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(() => {
      if (art.clientWidth !== width || art.clientHeight !== height) build();
    }).observe(art);
  } else window.addEventListener("resize", build, { passive: true });
  syncPreference();
});
