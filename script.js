document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const navlist = document.querySelector(".navlist");
  const overlay = document.querySelector("[data-menu-close]");
  const aboutButtons = document.querySelectorAll(".about-btn button");
  const aboutContents = document.querySelectorAll(".content");
  const scrollProgress = document.getElementById("progress");
  const menuLinks = document.querySelectorAll("header nav a");
  const sections = document.querySelectorAll("main section[id]");
  const documentElement = document.documentElement;
  const projectModal = document.getElementById("project-modal");
  const projectModalCategory = document.getElementById("project-modal-category");
  const projectModalTitle = document.getElementById("project-modal-title");
  const projectModalContent = document.getElementById("project-modal-content");
  const projectModalCloseButtons = document.querySelectorAll("[data-project-modal-close]");
  const portfolioGallery = document.querySelector(".portfolio-gallery");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const revealItems = document.querySelectorAll(".reveal");
  const header = document.querySelector("[data-header]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const cursorSmoke = document.querySelector("[data-cursor-smoke]");
  const cursorRing = document.querySelector("[data-cursor-ring]");

  let scrollTicking = false;
  let lastProjectTrigger = null;
  const themeStorageKey = "ahmad-issa-theme";

  const projectDetails = {
    "government-gis": {
      category: "GIS Development",
      title: "Government GIS Dashboards",
      summary: [
        "Frontend delivery for ArcGIS dashboard and web mapping workflows. This summary stays client-neutral because project data and screenshots are confidential.",
        "The work focused on interface structure, map interaction, filtering, responsive layouts, and ArcGIS service integration for operational users.",
      ],
      sections: [
        {
          title: "Work Summary",
          items: [
            "Customized ArcGIS Experience Builder interfaces for dashboard workflows.",
            "Connected ArcGIS REST services, Feature Layers, and Web Maps to interactive views.",
            "Built layouts for desktop and mobile use across office and field contexts.",
            "Cleaned frontend components to improve maintenance and reduce unnecessary load behavior.",
          ],
        },
        {
          title: "Privacy Boundary",
          items: [
            "No client names, data records, screenshots, coordinates, or internal workflows appear in this portfolio.",
          ],
        },
      ],
      tags: [
        "ArcGIS Experience Builder",
        "ArcGIS REST services",
        "JavaScript",
        "TypeScript",
        "React",
      ],
    },
    "experience-builder": {
      category: "Frontend and Web GIS",
      title: "Custom Experience Builder Widgets",
      summary: [
        "Reusable React and TypeScript widget development for ArcGIS Experience Builder Developer Edition, focused on filtering, map interaction, and service-driven UI behavior.",
        "The work aligns with Esri widget patterns while keeping client delivery details private.",
      ],
      sections: [
        {
          title: "Key Contributions",
          items: [
            "Built modular widget logic with React, TypeScript, JSX, and Jimu conventions.",
            "Connected widgets with ArcGIS data sources, Web Maps, and Feature Layer workflows.",
            "Supported filtering, query behavior, and map-centric user interactions.",
            "Organized components and styles for reuse across GIS applications.",
          ],
        },
      ],
      tags: [
        "Experience Builder Developer Edition",
        "Jimu",
        "React",
        "TypeScript",
        "Web Maps",
      ],
    },
    "esri-support": {
      category: "Technical Support",
      title: "Esri Support and Platform Diagnostics",
      summary: [
        "Technical support work from Esri Support Center workflows at gistec, focused on diagnosing platform issues and restoring reliable access.",
        "This experience connects development work with production behavior, access control, service health, data reliability, and supportability.",
      ],
      sections: [
        {
          title: "Support Scope",
          items: [
            "Investigated issues across ArcGIS Online, ArcGIS Enterprise, data access, configuration, maps, and services.",
            "Managed tickets through prioritization, customer communication, escalation, and follow-up.",
            "Reviewed logs, authentication behavior, permissions, data sources, and service responses.",
            "Prepared case notes, RCA summaries, operational reports, and reusable technical guidance.",
          ],
        },
      ],
      tags: [
        "ArcGIS Online",
        "ArcGIS Enterprise",
        "ArcGIS services",
        "Logs",
        "RCA",
      ],
    },
    "virtual-assistant-safety": {
      category: "Research Publication",
      title: "Evaluating a Virtual Assistant's Effectiveness in Enhancing in-Vehicle Safety: A Comparative Study",
      summary: [
        "IEEE-published ASET 2025 conference paper on multimodal in-vehicle safety interfaces for driver attention, response, and compliance.",
        "The study compared static visual alerts, natural voice alerts, and avatar-based guidance under simulated driving conditions.",
      ],
      sections: [
        {
          title: "Publication Details",
          items: [
            "Authors include Luqman Ali, Hamad Aljassmi, Ahmad Ghaleb Issa, Fahed Saghir, Omar Aldhaheri, Mohamad Razouk, Zayed Alhammadi, and Fady Alnajjar.",
            "Published in 2025 Advances in Science and Engineering Technology International Conferences, ASET.",
            "Conference location: Dubai, United Arab Emirates.",
            "DOI: 10.1109/ASET66891.2025.11427955.",
          ],
        },
        {
          title: "Research Focus",
          items: [
            "Evaluated driver reaction time, compliance, user satisfaction, and communication mode effectiveness.",
            "Connected AI virtual assistant design with safer in-vehicle human-machine interaction.",
          ],
        },
      ],
      links: [
        {
          label: "Open DOI: 10.1109/ASET66891.2025.11427955",
          href: "https://doi.org/10.1109/ASET66891.2025.11427955",
        },
      ],
      tags: [
        "IEEE",
        "ASET 2025",
        "AI",
        "In-Vehicle Safety",
        "Human-Machine Interaction",
      ],
    },
    "smart-city": {
      category: "Research",
      title: "Smart City Optimization Platform",
      summary: [
        "Applied research project using IoT sensors and machine learning concepts for urban planning, environmental sensing, and decision support.",
        "The project used sensor data, cloud communication, and a simple user interface to present environmental insights.",
      ],
      sections: [
        {
          title: "Project Highlights",
          items: [
            "Collected sensor readings with IoT evaluator kits and embedded hardware.",
            "Designed a system architecture using Waspmote boards, ATmega1281, and Digi XBee modules.",
            "Applied machine learning concepts for predictive analysis and resource planning.",
            "Built a user-facing interface to visualize readings and support urban decisions.",
          ],
        },
      ],
      media: [
        {
          type: "image",
          src: "img/portfolio/project3A.webp",
          alt: "Smart city optimization research poster",
          caption: "Research poster for the IoT and machine learning smart city platform.",
        },
        {
          type: "image",
          src: "img/portfolio/project3B.webp",
          alt: "IoT evaluator kit hardware",
          caption: "IoT hardware used for sensing and data collection.",
        },
      ],
      tags: [
        "IoT",
        "Machine Learning",
        "Python",
        "Waspmote IDE",
        "Digi XCTU",
      ],
    },
    "autonomous-car": {
      category: "Embedded Systems",
      title: "Autonomous Smart Car Robot",
      summary: [
        "Embedded robotics prototype for line following and obstacle avoidance using real-time computer vision and motor control.",
        "The project combined camera input, OpenCV processing, centroid tracking, and robot movement logic.",
      ],
      sections: [
        {
          title: "Project Highlights",
          items: [
            "Processed a live video feed to detect path edges and navigation direction.",
            "Adjusted motor control based on path position and obstacle behavior.",
            "Used OpenCV for grayscale conversion, thresholding, contour detection, and decision logic.",
            "Tested embedded robotics behavior under changing path and obstacle conditions.",
          ],
        },
      ],
      media: [
        {
          type: "image",
          src: "img/portfolio/project2A.webp",
          alt: "Autonomous car coding setup",
          caption: "Development setup for computer vision and robot control.",
        },
        {
          type: "video",
          src: "img/portfolio/project2C.mp4",
          caption: "Prototype demonstration video.",
        },
      ],
      tags: [
        "Python",
        "OpenCV",
        "Embedded Systems",
        "Robotics",
        "Computer Vision",
      ],
    },
    "portfolio-site": {
      category: "Web",
      title: "Frontend Portfolio System",
      summary: [
        "Static HTML, CSS, and JavaScript portfolio refined around a full stack developer story, senior front-end strength, and practical delivery.",
        "The project section now uses a single-page modal flow, which reduces page sprawl and keeps selected work easier to maintain.",
      ],
      sections: [
        {
          title: "Current Improvements",
          items: [
            "Updated content around full stack development, front-end delivery, GIS experience, and support depth.",
            "Moved project details into one reusable modal pattern.",
            "Kept confidential client work general while preserving the technical value.",
            "Improved the project section for faster scanning and simpler maintenance.",
          ],
        },
      ],
      media: [
        {
          type: "video",
          src: "img/portfolio/project6.mp4",
          caption: "Portfolio walkthrough media from the existing project assets.",
        },
      ],
      tags: [
        "HTML",
        "CSS",
        "JavaScript",
        "Responsive UI",
        "Portfolio",
      ],
    },
  };

  const closeMenu = () => {
    if (!menuIcon || !navlist) return;

    menuIcon.classList.remove("active");
    navlist.classList.remove("active");
    navlist.parentElement?.classList.remove("active");
    document.body.classList.remove("open");
    menuIcon.setAttribute("aria-expanded", "false");
  };

  const setupMenu = () => {
    if (!menuIcon || !navlist) return;

    menuIcon.addEventListener("click", () => {
      const isOpen = navlist.classList.toggle("active");
      navlist.parentElement?.classList.toggle("active", isOpen);
      menuIcon.classList.toggle("active", isOpen);
      document.body.classList.toggle("open", isOpen);
      menuIcon.setAttribute("aria-expanded", String(isOpen));
    });

    navlist.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    overlay?.addEventListener("click", closeMenu);
  };

  const getStoredTheme = () => {
    try {
      const storedTheme = window.localStorage.getItem(themeStorageKey);
      return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
    } catch {
      return "dark";
    }
  };

  const applyTheme = (theme) => {
    const nextTheme = theme === "light" ? "light" : "dark";
    documentElement.dataset.theme = nextTheme;

    if (!themeToggle) return;

    const isLight = nextTheme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  };

  const setupThemeToggle = () => {
    applyTheme(getStoredTheme());

    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {
      const nextTheme = documentElement.dataset.theme === "light" ? "dark" : "light";
      applyTheme(nextTheme);

      try {
        window.localStorage.setItem(themeStorageKey, nextTheme);
      } catch {
        return;
      }
    });
  };

  const setupAboutTabs = () => {
    if (!aboutButtons.length || !aboutContents.length) return;

    aboutButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        aboutButtons.forEach((btn) => {
          btn.classList.remove("active");
          btn.setAttribute("aria-selected", "false");
        });

        aboutContents.forEach((content) => {
          content.classList.remove("active");
        });

        button.classList.add("active");
        button.setAttribute("aria-selected", "true");
        aboutContents[index]?.classList.add("active");
      });
    });
  };

  const setupPortfolioFilter = () => {
    if (!filterButtons.length || !portfolioGallery) return;

    const cards = portfolioGallery.querySelectorAll(".portfolio-box");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("filter-active"));
        button.classList.add("filter-active");

        cards.forEach((card) => {
          const categories = card.dataset.category?.split(" ") ?? [];
          const shouldShow = filter === "all" || categories.includes(filter);
          card.classList.toggle("is-hidden", !shouldShow);
        });
      });
    });
  };

  const enforceMutedVideo = (video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute("muted", "");

    video.addEventListener("volumechange", () => {
      if (video.muted && video.volume === 0) return;
      video.muted = true;
      video.volume = 0;
      video.setAttribute("muted", "");
    });
  };

  const renderProjectDetails = (project) => {
    if (!projectModalCategory || !projectModalTitle || !projectModalContent) return;

    projectModalCategory.textContent = project.category;
    projectModalTitle.textContent = project.title;

    const fragment = document.createDocumentFragment();

    project.summary.forEach((textContent) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = textContent;
      fragment.appendChild(paragraph);
    });

    project.sections.forEach((section) => {
      const wrapper = document.createElement("div");
      wrapper.className = "project-modal-section";

      const heading = document.createElement("h4");
      heading.textContent = section.title;
      wrapper.appendChild(heading);

      const list = document.createElement("ul");
      section.items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
      });

      wrapper.appendChild(list);
      fragment.appendChild(wrapper);
    });

    if (project.links?.length) {
      const links = document.createElement("div");
      links.className = "project-modal-links";

      project.links.forEach((item) => {
        const link = document.createElement("a");
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item.label;
        links.appendChild(link);
      });

      fragment.appendChild(links);
    }

    if (project.media?.length) {
      const mediaGrid = document.createElement("div");
      mediaGrid.className = "project-modal-media";

      project.media.forEach((item) => {
        const figure = document.createElement("figure");

        if (item.type === "video") {
          figure.className = "is-video";

          const video = document.createElement("video");
          video.autoplay = true;
          video.controls = false;
          video.loop = true;
          video.preload = "auto";
          video.playsInline = true;
          video.removeAttribute("controls");
          video.setAttribute("autoplay", "");
          video.setAttribute("loop", "");
          video.setAttribute("playsinline", "");
          enforceMutedVideo(video);

          const source = document.createElement("source");
          source.src = item.src;
          source.type = "video/mp4";

          video.appendChild(source);
          figure.appendChild(video);
        } else {
          figure.className = "is-image";

          const image = document.createElement("img");
          image.src = item.src;
          image.alt = item.alt;
          image.loading = "lazy";
          image.decoding = "async";
          figure.appendChild(image);
        }

        if (item.caption) {
          const caption = document.createElement("figcaption");
          caption.textContent = item.caption;
          figure.appendChild(caption);
        }

        mediaGrid.appendChild(figure);
      });

      fragment.appendChild(mediaGrid);
    }

    if (project.tags?.length) {
      const tags = document.createElement("div");
      tags.className = "project-modal-tags";

      project.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag;
        tags.appendChild(tagElement);
      });

      fragment.appendChild(tags);
    }

    projectModalContent.replaceChildren(fragment);
  };

  const closeProjectModal = () => {
    if (!projectModal) return;

    projectModal.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });

    projectModal.classList.remove("is-open");
    projectModal.hidden = true;
    document.body.classList.remove("modal-open");

    if (lastProjectTrigger) {
      lastProjectTrigger.focus();
      lastProjectTrigger = null;
    }
  };

  const openProjectModal = (projectKey, trigger) => {
    const project = projectDetails[projectKey];
    if (!project || !projectModal) return;

    lastProjectTrigger = trigger;
    renderProjectDetails(project);
    projectModal.hidden = false;
    document.body.classList.add("modal-open");

    window.requestAnimationFrame(() => {
      projectModal.classList.add("is-open");
      projectModal.querySelectorAll("video").forEach((video) => {
        video.play().catch(() => {});
      });
      projectModal.querySelector(".project-modal-close")?.focus();
    });
  };

  const trapProjectModalFocus = (event) => {
    if (!projectModal || event.key !== "Tab") return;

    const focusable = projectModal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const setupProjectModal = () => {
    if (!projectModal || !portfolioGallery) return;

    portfolioGallery.addEventListener("click", (event) => {
      const button = event.target.closest("[data-project-modal]");

      if (button) {
        openProjectModal(button.dataset.projectModal, button);
      }
    });

    projectModalCloseButtons.forEach((button) => {
      button.addEventListener("click", closeProjectModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !projectModal.hidden) {
        closeProjectModal();
        return;
      }

      if (!projectModal.hidden) {
        trapProjectModalFocus(event);
      }
    });
  };

  const setupCursorEffect = () => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!cursorSmoke || !cursorRing || !finePointer || reducedMotion) return;

    const context = cursorSmoke.getContext("2d");
    if (!context) return;

    const particles = [];
    const pointer = {
      active: false,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      lastX: window.innerWidth / 2,
      lastY: window.innerHeight / 2,
      ringX: -120,
      ringY: -120,
    };

    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationFrame = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      cursorSmoke.width = Math.round(canvasWidth * dpr);
      cursorSmoke.height = Math.round(canvasHeight * dpr);
      cursorSmoke.style.width = `${canvasWidth}px`;
      cursorSmoke.style.height = `${canvasHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const moveRing = () => {
      const ringSize = cursorRing.offsetWidth || 30;
      cursorRing.style.transform = `translate3d(${pointer.ringX - ringSize / 2}px, ${pointer.ringY - ringSize / 2}px, 0)`;
    };

    const createParticle = (x, y, velocityX, velocityY, speed) => {
      const drift = Math.max(0.35, Math.min(speed / 38, 1.7));
      const maxLife = 46 + Math.random() * 24;
      particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        velocityX: -velocityX * 0.006 + (Math.random() - 0.5) * drift,
        velocityY: -velocityY * 0.006 + (Math.random() - 0.5) * drift,
        size: 20 + Math.random() * 34 + Math.min(speed * 0.07, 22),
        stretch: 1.7 + Math.random() * 2.2,
        angle: Math.atan2(velocityY || 0.01, velocityX || 0.01) + (Math.random() - 0.5) * 0.55,
        spin: (Math.random() - 0.5) * 0.012,
        life: maxLife,
        maxLife,
        alpha: 0.08 + Math.random() * 0.08,
      });

      if (particles.length > 100) {
        particles.splice(0, particles.length - 100);
      }
    };

    const emitParticles = (event) => {
      const velocityX = event.clientX - pointer.lastX;
      const velocityY = event.clientY - pointer.lastY;
      const speed = Math.hypot(velocityX, velocityY);
      const count = Math.min(4, Math.max(1, Math.ceil(speed / 34)));

      for (let index = 0; index < count; index += 1) {
        const step = count === 1 ? 1 : index / (count - 1);
        createParticle(
          pointer.lastX + velocityX * step,
          pointer.lastY + velocityY * step,
          velocityX,
          velocityY,
          speed
        );
      }

      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
    };

    const setPointer = (event) => {
      if (!pointer.active) {
        pointer.active = true;
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.ringX = event.clientX;
        pointer.ringY = event.clientY;
        moveRing();
        document.body.classList.add("cursor-active");
      }

      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.ringX = event.clientX;
      pointer.ringY = event.clientY;
      moveRing();
      emitParticles(event);
    };

    const isInteractiveTarget = (target) =>
      target instanceof Element &&
      Boolean(target.closest("a, button, [role='button'], input, textarea, select, summary"));

    const drawParticle = (particle, isLightTheme) => {
      const progress = Math.max(particle.life / particle.maxLife, 0);
      const alpha = particle.alpha * progress;
      const color = isLightTheme ? "22, 22, 22" : "255, 255, 255";
      const radius = particle.size * particle.stretch;
      const glow = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius);

      glow.addColorStop(0, `rgba(${color}, ${alpha * 0.7})`);
      glow.addColorStop(0.22, `rgba(${color}, ${alpha * 0.3})`);
      glow.addColorStop(0.6, `rgba(${color}, ${alpha * 0.08})`);
      glow.addColorStop(1, `rgba(${color}, 0)`);

      context.save();
      context.fillStyle = glow;
      context.beginPath();
      context.ellipse(
        particle.x,
        particle.y,
        radius,
        particle.size * 0.36,
        particle.angle,
        0,
        Math.PI * 2
      );
      context.fill();
      context.restore();
    };

    const drawCursorGlow = (isLightTheme) => {
      if (!pointer.active) return;

      const color = isLightTheme ? "22, 22, 22" : "255, 255, 255";
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 40);
      glow.addColorStop(0, `rgba(${color}, ${isLightTheme ? 0.14 : 0.28})`);
      glow.addColorStop(0.2, `rgba(${color}, ${isLightTheme ? 0.08 : 0.15})`);
      glow.addColorStop(0.52, `rgba(${color}, ${isLightTheme ? 0.03 : 0.06})`);
      glow.addColorStop(1, `rgba(${color}, 0)`);

      context.fillStyle = glow;
      context.beginPath();
      context.arc(pointer.x, pointer.y, 40, 0, Math.PI * 2);
      context.fill();
    };

    const draw = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const isLightTheme = documentElement.dataset.theme === "light";
      context.globalCompositeOperation = "source-over";

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life -= 1;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.angle += particle.spin;
        particle.velocityX *= 0.96;
        particle.velocityY *= 0.96;

        if (particle.life <= 0) {
          particles.splice(index, 1);
        } else {
          drawParticle(particle, isLightTheme);
        }
      }

      drawCursorGlow(isLightTheme);
      animationFrame = window.requestAnimationFrame(draw);
    };

    document.body.classList.add("has-cursor-effect");
    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", setPointer, { passive: true });
    window.addEventListener("pointerdown", () => document.body.classList.add("cursor-press"));
    window.addEventListener("pointerup", () => document.body.classList.remove("cursor-press"));
    window.addEventListener("pointerleave", () => {
      pointer.active = false;
      document.body.classList.remove("cursor-active", "cursor-link");
    });

    document.addEventListener("pointerover", (event) => {
      document.body.classList.toggle("cursor-link", isInteractiveTarget(event.target));
    });

    document.addEventListener("pointerout", (event) => {
      if (isInteractiveTarget(event.target)) {
        document.body.classList.remove("cursor-link");
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else {
        animationFrame = window.requestAnimationFrame(draw);
      }
    });
  };

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const updateScrollProgress = () => {
    if (!scrollProgress) return;

    const pos = documentElement.scrollTop;
    const calcHeight = documentElement.scrollHeight - documentElement.clientHeight;
    const scrollValue = calcHeight > 0 ? Math.round((pos * 100) / calcHeight) : 0;

    scrollProgress.style.display = pos > 100 ? "grid" : "none";
    scrollProgress.style.background = `conic-gradient(var(--cyan) ${scrollValue}%, rgba(255, 255, 255, 0.12) ${scrollValue}%)`;
  };

  const updateActiveMenu = () => {
    if (!menuLinks.length || !sections.length) return;

    let currentId = sections[0].id;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentId = section.id;
      }
    });

    menuLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  const onScroll = () => {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateHeader();
      updateScrollProgress();
      updateActiveMenu();
      scrollTicking = false;
    });
  };

  const setupScrollToTop = () => {
    if (!scrollProgress) return;

    scrollProgress.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const setupReveal = () => {
    if (!revealItems.length) return;

    revealItems.forEach((item) => item.classList.add("reveal-pending"));

    if (typeof IntersectionObserver !== "function") {
      revealItems.forEach((item) => {
        item.classList.remove("reveal-pending");
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  setupThemeToggle();
  setupCursorEffect();
  setupMenu();
  setupAboutTabs();
  setupPortfolioFilter();
  setupProjectModal();
  setupScrollToTop();
  setupReveal();
  updateHeader();
  updateScrollProgress();
  updateActiveMenu();

  window.addEventListener("scroll", onScroll, { passive: true });
});
