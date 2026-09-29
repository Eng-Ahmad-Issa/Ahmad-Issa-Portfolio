document.addEventListener("DOMContentLoaded", () => {
  const workbench = document.querySelector("[data-workbench]");
  if (!workbench) return;

  const root = document.documentElement;
  const motionToggle = workbench.querySelector("[data-motion-toggle]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionKey = "ahmad-issa-motion";
  let motionDisabled = false;
  try {
    motionDisabled = window.localStorage.getItem(motionKey) === "off";
  } catch {
    // The demos remain usable when browser storage is unavailable.
  }

  const applyMotion = () => {
    const off = motionDisabled || reducedMotion.matches;
    root.dataset.motion = off ? "off" : "on";
    motionToggle.setAttribute("aria-pressed", String(off));
    motionToggle.title = reducedMotion.matches ? "Reduced motion follows your system preference" : "Turn reduced motion on or off";
    motionToggle.disabled = reducedMotion.matches;
  };

  motionToggle.addEventListener("click", () => {
    motionDisabled = !motionDisabled;
    applyMotion();
    try {
      window.localStorage.setItem(motionKey, motionDisabled ? "off" : "on");
    } catch {
      // Keep the current session preference even without persistent storage.
    }
  });
  reducedMotion.addEventListener("change", applyMotion);
  applyMotion();

  const tabs = [...workbench.querySelectorAll("[data-workbench-tab]")];
  const selectTab = (tab) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    });
  });

  const filters = [...workbench.querySelectorAll("[data-demo-filter]")];
  const products = [...workbench.querySelectorAll("[data-demo-product]")];
  const inventory = { all: { count: 3, stock: 26 }, desk: { count: 2, stock: 18 }, travel: { count: 1, stock: 8 } };
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.demoFilter;
      filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      products.forEach((product) => {
        product.hidden = category !== "all" && product.dataset.demoProduct !== category;
      });
      const { count, stock } = inventory[category];
      workbench.querySelector("[data-demo-request]").textContent = `/api/products${category === "all" ? "" : `?category=${category}`}`;
      workbench.querySelector("[data-demo-result]").textContent = `${count} ${count === 1 ? "item" : "items"} / ${stock} units in stock. Simulated response.`;
    });
  });

  const sites = {
    north: { name: "North site", detail: "Inspection complete / 12 assets", id: "FT-001" },
    central: { name: "Central site", detail: "Review scheduled / 8 assets", id: "FT-002" },
    south: { name: "South site", detail: "Maintenance planned / 6 assets", id: "FT-003" },
  };
  const pins = [...workbench.querySelectorAll("[data-demo-site]")];
  pins.forEach((pin) => {
    pin.addEventListener("click", () => {
      pins.forEach((item) => item.setAttribute("aria-pressed", String(item === pin)));
      const site = sites[pin.dataset.demoSite];
      workbench.querySelector("[data-site-name]").textContent = site.name;
      workbench.querySelector("[data-site-detail]").textContent = site.detail;
      workbench.querySelector("[data-site-id]").textContent = site.id;
    });
  });

  const stages = {
    scope: { label: "01 / Define the task", title: "Context before code.", description: "Set file boundaries, requirements, and acceptance criteria before assigning work to an agent." },
    build: { label: "02 / Coordinate the work", title: "Focused tasks. Shared context.", description: "Coordinate implementation, testing, and documentation with scoped assignments and explicit handoffs." },
    verify: { label: "03 / Review the result", title: "Evidence before delivery.", description: "Review generated code, run tests, inspect browser behavior, and resolve findings before delivery." },
  };
  const steps = [...workbench.querySelectorAll("[data-demo-step]")];
  steps.forEach((button) => {
    button.addEventListener("click", () => {
      steps.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      const stage = stages[button.dataset.demoStep];
      workbench.querySelector("[data-step-label]").textContent = stage.label;
      workbench.querySelector("[data-step-title]").textContent = stage.title;
      workbench.querySelector("[data-step-description]").textContent = stage.description;
    });
  });
});
