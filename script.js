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
    "retail-inventory": {
      "category": "Personal project / 2025 to 2026",
      "title": "Retail and Inventory Application",
      "summary": [
        "Built a React and TypeScript storefront with a NestJS backend, PostgreSQL, and Prisma. The application supports product variants, branch inventory, search, filters, cart state, and persistent orders.",
        "Development includes a read-only connection to an external inventory platform. Orders await stock confirmation, and the application is under development."
      ],
      "sections": [
        {
          "title": "Contributions",
          "items": [
            "Implemented product APIs, database models, and migrations for inventory transactions, orders, and order-line snapshots.",
            "Added paginated imports and scheduled synchronization with duplicate-safe transaction updates and protection against overlapping runs.",
            "Validated prices, discounts, shipping, and cached branch stock on the server. Used idempotency keys to prevent duplicate orders.",
            "Documented APIs with Swagger/OpenAPI and added frontend, backend, and API tests."
          ]
        }
      ],
      "tags": [
        "React",
        "TypeScript",
        "NestJS",
        "PostgreSQL",
        "Prisma"
      ]
    },
    "audit-activity": {
      "category": "Client team project / Aug to Sep 2026",
      "title": "Audit and Activity Console",
      "summary": [
        "Developed an audit service and React/TypeScript console within a government spatial data portal project. ASP.NET Core, Entity Framework Core, and SQL Server combine webhook events and portal audit records into a searchable activity history.",
        "Implemented and tested the service, deployed a development build to IIS, and prepared technical handover documentation."
      ],
      "sections": [
        {
          "title": "Contributions",
          "items": [
            "Migrated persistence from SQLite to SQL Server and separated the owned schema from read access to the portal database.",
            "Implemented webhook signature checks, event deduplication, user attribution, and background processing.",
            "Built server-side pagination, filtering, Arabic/English localization, RTL layouts, polling, and JSON export.",
            "Added xUnit tests using SQL Server LocalDB, including database behavior and migration checks."
          ]
        }
      ],
      "tags": [
        "ASP.NET Core",
        "SQL Server",
        "React",
        "TypeScript",
        "xUnit"
      ]
    },
    "react-testing": {
      "category": "Client team project / Aug 2026",
      "title": "React Application Test Suite",
      "summary": [
        "Created an isolated test workspace for an existing React administration application. Tests read the application source without modifying the owning team's code.",
        "The recorded local run passed 458 tests across 19 files, with 97.44% statement coverage and 92.57% branch coverage."
      ],
      "sections": [
        {
          "title": "Contributions",
          "items": [
            "Prepared a risk-ranked test plan around application behavior and user workflows.",
            "Used Vitest, React Testing Library, user-event, MSW, and jsdom for component and API behavior checks.",
            "Included accessibility checks with axe-core and documented 13 defects for the owning developers."
          ]
        }
      ],
      "tags": [
        "Vitest",
        "React Testing Library",
        "MSW",
        "axe-core"
      ]
    },
    "asset-desktop": {
      "category": "Client application / Apr to Sep 2026",
      "title": "Asset Management Desktop Application",
      "summary": [
        "Maintained and extended a C#/.NET WPF application for equipment, personnel, and mobilization records connected to ArcGIS feature services.",
        "Work covered client-reported defects, data loading, attachment workflows, and MSI installer releases."
      ],
      "sections": [
        {
          "title": "Contributions",
          "items": [
            "Added paging beyond the 2,000-record service limit for full-data search and export.",
            "Fixed attachment upload, replacement, deletion, field mapping, and refresh behavior.",
            "Used cached identifier lookup and cancellable, versioned loads to prevent stale data appearing during table changes.",
            "Reviewed runtime configuration, packaged release files, installer dependencies, and endpoint-security launch issues."
          ]
        }
      ],
      "tags": [
        "C#",
        ".NET",
        "WPF",
        "ArcGIS REST",
        "MSI"
      ]
    },
    "experience-builder": {
      "category": "Client applications / Web GIS development",
      "title": "ArcGIS Experience Builder Workflows",
      "summary": [
        "Developed and maintained custom Experience Builder widgets for operational GIS applications, using React, TypeScript, and ArcGIS services.",
        "Extended inherited applications with request-management dashboards, forms, assignment controls, document-upload interfaces, and bilingual layouts."
      ],
      "sections": [
        {
          "title": "Contributions",
          "items": [
            "Unified status classification across request lists, counters, charts, and map features, with focused tests.",
            "Synchronized map and table filters and guarded asynchronous tab changes against outdated results.",
            "Worked on PDF certificates, date handling, portal migration, and API field mappings.",
            "Compared source, release packages, and deployed files to investigate inconsistent application behavior."
          ]
        }
      ],
      "tags": [
        "React",
        "TypeScript",
        "Experience Builder",
        "ArcGIS REST"
      ]
    },
    "company-portal": {
      "category": "Internal tool / Sep 2026",
      "title": "Company Intelligence Portal",
      "summary": [
        "Built a single-page directory over an Excel master workbook, with search, filters, organization details, comparisons, and saved shortlists.",
        "The reviewed dataset contains 2,208 organizations. Python and JavaScript tooling supports enrichment, duplicate matching, and validation."
      ],
      "sections": [
        {
          "title": "Contributions",
          "items": [
            "Kept the workbook as the source of truth and stored shortlist selections in the browser.",
            "Added overview charts, printable meeting briefs, and backup and restore for saved workspace selections.",
            "Consolidated branches and normalized records while preserving identifiers and relationships."
          ]
        }
      ],
      "tags": [
        "JavaScript",
        "Python",
        "SheetJS",
        "Data validation"
      ]
    },
    "ai-workflows": {
      "category": "Applied AI tools and automation",
      "title": "AI Agent Workflows and Automation",
      "summary": [
        "Use OpenAI Codex, Claude Code, and Antigravity across software development and research. Prepare structured prompts, reusable project instructions, shared context, and implementation handoffs.",
        "Coordinate agents across backend, frontend, QA, and documentation, and compare results across AI systems through code review and application checks."
      ],
      "sections": [
        {
          "title": "Contributions",
          "items": [
            "Define the business problem, architecture, file scope, constraints, acceptance criteria, and verification steps before implementation.",
            "Use shared files and staged handoffs to coordinate agents across development tasks.",
            "Review generated code through tests, browser checks, build output, and follow-up corrections.",
            "Maintain a Git-backed collection of reusable instructions, configuration, and adapted third-party skills."
          ]
        },
        {
          "title": "Automation prototyping",
          "items": [
            "Explored n8n in Docker, local AI model runtimes, Telegram workflows, and an MCP gateway connecting automation tools with a coding agent."
          ]
        }
      ],
      "tags": [
        "Codex",
        "Claude Code",
        "Antigravity",
        "Prompt engineering",
        "Agent orchestration"
      ]
    },
    "esri-support": {
      "category": "Esri Support Center EMEA",
      "title": "Esri Support and Platform Diagnostics",
      "summary": [
        "Supported ArcGIS Online and ArcGIS Enterprise customers through the Esri Support Center EMEA at gistec, covering Europe, the Middle East, and Africa.",
        "Received multiple Excellent customer satisfaction survey ratings. Feedback highlighted quick diagnosis, clear explanations, and practical troubleshooting guidance."
      ],
      "sections": [
        {
          "title": "Contributions",
          "items": [
            "Investigated services, data, configuration, authentication, and permissions using logs and API responses.",
            "Prioritized cases against service-level agreements and coordinated escalation and customer follow-up.",
            "Documented root causes, resolution steps, and reusable technical guidance.",
            "Prepared knowledge-sharing material on ArcGIS Enterprise antivirus configuration, platform stability, and Experience Builder."
          ]
        }
      ],
      "tags": [
        "ArcGIS Enterprise",
        "ArcGIS Online",
        "RCA",
        "SLA",
        "CSAT"
      ]
    },
    "virtual-assistant-safety": {
      "category": "Research Publication",
      "title": "Evaluating a Virtual Assistant's Effectiveness in Enhancing in-Vehicle Safety: A Comparative Study",
      "summary": [
        "IEEE-published ASET 2025 conference paper on multimodal in-vehicle safety interfaces for driver attention, response, and compliance.",
        "The study compared static visual alerts, natural voice alerts, and avatar-based guidance under simulated driving conditions."
      ],
      "sections": [
        {
          "title": "Publication Details",
          "items": [
            "Authors include Luqman Ali, Hamad Aljassmi, Ahmad Ghaleb Issa, Fahed Saghir, Omar Aldhaheri, Mohamad Razouk, Zayed Alhammadi, and Fady Alnajjar.",
            "Published in 2025 Advances in Science and Engineering Technology International Conferences, ASET.",
            "Conference location: Dubai, United Arab Emirates.",
            "DOI: 10.1109/ASET66891.2025.11427955."
          ]
        },
        {
          "title": "Research Focus",
          "items": [
            "Evaluated driver reaction time, compliance, user satisfaction, and communication mode effectiveness.",
            "Connected AI virtual assistant design with safer in-vehicle human-machine interaction."
          ]
        }
      ],
      "links": [
        {
          "label": "Open DOI: 10.1109/ASET66891.2025.11427955",
          "href": "https://doi.org/10.1109/ASET66891.2025.11427955"
        }
      ],
      "tags": [
        "IEEE",
        "ASET 2025",
        "AI",
        "In-Vehicle Safety",
        "Human-Machine Interaction"
      ]
    },
    "smart-city": {
      "category": "Research",
      "title": "Smart City Optimization Platform",
      "summary": [
        "Applied research project using IoT sensors and machine learning concepts for urban planning, environmental sensing, and decision support.",
        "The project used sensor data, cloud communication, and a simple user interface to present environmental insights."
      ],
      "sections": [
        {
          "title": "Project Highlights",
          "items": [
            "Collected sensor readings with IoT evaluator kits and embedded hardware.",
            "Designed a system architecture using Waspmote boards, ATmega1281, and Digi XBee modules.",
            "Applied machine learning concepts for predictive analysis and resource planning.",
            "Built a user-facing interface to visualize readings and support urban decisions."
          ]
        }
      ],
      "media": [
        {
          "type": "image",
          "src": "img/portfolio/project3A.webp",
          "alt": "Smart city optimization research poster",
          "caption": "Research poster for the IoT and machine learning smart city platform."
        },
        {
          "type": "image",
          "src": "img/portfolio/project3B.webp",
          "alt": "IoT evaluator kit hardware",
          "caption": "IoT hardware used for sensing and data collection."
        }
      ],
      "tags": [
        "IoT",
        "Machine Learning",
        "Python",
        "Waspmote IDE",
        "Digi XCTU"
      ]
    },
    "autonomous-car": {
      "category": "Embedded Systems",
      "title": "Autonomous Smart Car Robot",
      "summary": [
        "Embedded robotics prototype for line following and obstacle avoidance using real-time computer vision and motor control.",
        "The project combined camera input, OpenCV processing, centroid tracking, and robot movement logic."
      ],
      "sections": [
        {
          "title": "Project Highlights",
          "items": [
            "Processed a live video feed to detect path edges and navigation direction.",
            "Adjusted motor control based on path position and obstacle behavior.",
            "Used OpenCV for grayscale conversion, thresholding, contour detection, and decision logic.",
            "Tested embedded robotics behavior under changing path and obstacle conditions."
          ]
        }
      ],
      "media": [
        {
          "type": "image",
          "src": "img/portfolio/project2A.webp",
          "alt": "Autonomous car coding setup",
          "caption": "Development setup for computer vision and robot control."
        },
        {
          "type": "video",
          "src": "img/portfolio/project2C.mp4",
          "caption": "Prototype demonstration video."
        }
      ],
      "tags": [
        "Python",
        "OpenCV",
        "Embedded Systems",
        "Robotics",
        "Computer Vision"
      ]
    },
    "portfolio-site": {
      "category": "Web",
      "title": "Frontend Portfolio System",
      "summary": [
        "Built and maintained this portfolio using HTML, CSS, and JavaScript, with responsive layouts, theme switching, project filters, and reusable project dialogs.",
        "Project details, course certificates, and PDF and Word CV downloads share one page."
      ],
      "sections": [
        {
          "title": "Features",
          "items": [
            "Responsive navigation, keyboard-accessible project dialogs, and saved theme preferences.",
            "Project filters for full stack development, frontend, GIS, AI, testing, support, and research.",
            "Updated professional history, customer feedback excerpts, and training certificates."
          ]
        }
      ],
      "media": [
        {
          "type": "video",
          "src": "img/portfolio/project6.mp4",
          "caption": "Walkthrough of an earlier portfolio version."
        }
      ],
      "tags": [
        "HTML",
        "CSS",
        "JavaScript",
        "Responsive UI",
        "Portfolio"
      ]
    }
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

        filterButtons.forEach((item) => {
          item.classList.remove("filter-active");
          item.setAttribute("aria-pressed", String(item === button));
        });
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
