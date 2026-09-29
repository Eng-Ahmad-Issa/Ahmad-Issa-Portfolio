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
  const filterStatus = document.getElementById("project-filter-status");
  const revealItems = document.querySelectorAll(".reveal");
  const header = document.querySelector("[data-header]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const mobileMenu = window.matchMedia("(max-width: 680px)");

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

  const closeMenu = (restoreFocus = false) => {
    if (!menuIcon || !navlist) return;

    menuIcon.classList.remove("active");
    navlist.classList.remove("active");
    navlist.parentElement?.classList.remove("active");
    document.body.classList.remove("open");
    menuIcon.setAttribute("aria-expanded", "false");
    menuIcon.setAttribute("aria-label", "Open menu");
    navlist.parentElement.inert = mobileMenu.matches;
    document.querySelector("main").inert = false;
    document.querySelector("footer").inert = false;
    if (restoreFocus) menuIcon.focus();
  };

  const setupMenu = () => {
    if (!menuIcon || !navlist) return;
    closeMenu();

    menuIcon.addEventListener("click", () => {
      if (document.body.classList.contains("open")) {
        closeMenu(true);
        return;
      }
      navlist.classList.add("active");
      navlist.parentElement.classList.add("active");
      navlist.parentElement.inert = false;
      menuIcon.classList.add("active");
      document.body.classList.add("open");
      menuIcon.setAttribute("aria-expanded", "true");
      menuIcon.setAttribute("aria-label", "Close menu");
      document.querySelector("main").inert = true;
      document.querySelector("footer").inert = true;
      menuLinks[0]?.focus();
    });

    header.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link?.getAttribute("href")?.startsWith("#") || !document.body.classList.contains("open")) return;
      closeMenu();
      const target = document.querySelector(link.getAttribute("href"));
      target?.setAttribute("tabindex", "-1");
      target?.focus({ preventScroll: true });
    });

    overlay?.addEventListener("click", () => closeMenu(true));
    mobileMenu.addEventListener("change", () => {
      const wasOpen = document.body.classList.contains("open");
      closeMenu();
      if (wasOpen && !mobileMenu.matches) menuLinks[0]?.focus();
    });
    document.addEventListener("keydown", (event) => {
      if (!document.body.classList.contains("open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
      if (event.key === "Tab") {
        const controls = [...header.querySelectorAll("a[href], button"), themeToggle]
          .filter((element) => element && element.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
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

    const applyFilter = (button) => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.toggle("filter-active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });

      cards.forEach((card) => {
        const categories = card.dataset.category?.split(" ") ?? [];
        const shouldShow = filter === "all" || categories.includes(filter);
        card.classList.toggle("is-hidden", !shouldShow);
      });

      if (filterStatus) {
        const visibleCount = Array.from(cards).filter((card) => !card.classList.contains("is-hidden")).length;
        const label = button.textContent?.trim() || "selected";
        const noun = visibleCount === 1 ? "project" : "projects";
        filterStatus.textContent = filter === "all"
          ? `Showing all ${visibleCount} ${noun}.`
          : `${label}: ${visibleCount} ${noun}.`;
      }
    };

    filterButtons.forEach((button) => {
      button.setAttribute("aria-controls", "project-gallery");
      button.addEventListener("click", () => applyFilter(button));
    });
    applyFilter(document.querySelector('[data-filter][aria-pressed="true"]') || filterButtons[0]);
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
          video.controls = true;
          video.preload = "metadata";
          video.playsInline = true;
          video.setAttribute("playsinline", "");
          video.setAttribute("aria-label", item.caption || `${project.title} demonstration`);
          video.muted = true;
          video.defaultMuted = true;

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
    projectModal?.close();
  };

  const openProjectModal = (projectKey, trigger) => {
    const project = projectDetails[projectKey];
    if (!project || !projectModal) return;

    lastProjectTrigger = trigger;
    renderProjectDetails(project);
    document.body.classList.add("modal-open");
    projectModal.showModal();
    projectModal.querySelector(".project-modal-dialog").scrollTop = 0;
  };

  const setupProjectModal = () => {
    if (!projectModal) return;

    document.querySelectorAll("[data-project-modal]").forEach((button) => {
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", "project-modal");
      button.addEventListener("click", () => {
        openProjectModal(button.dataset.projectModal, button);
      });
    });

    projectModalCloseButtons.forEach((button) => {
      button.addEventListener("click", closeProjectModal);
    });

    let backdropPointerDown = false;
    projectModal.addEventListener("pointerdown", (event) => {
      backdropPointerDown = event.target === projectModal;
    });
    projectModal.addEventListener("click", (event) => {
      if (event.target === projectModal && backdropPointerDown) closeProjectModal();
      backdropPointerDown = false;
    });
    projectModal.addEventListener("close", () => {
      projectModal.querySelectorAll("video").forEach((video) => video.pause());
      document.body.classList.remove("modal-open");
      lastProjectTrigger?.focus({ preventScroll: true });
      lastProjectTrigger = null;
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
    scrollProgress.style.background = `conic-gradient(var(--accent-text) ${scrollValue}%, var(--line-soft) ${scrollValue}%)`;
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
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
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
      const reduceMotion = documentElement.dataset.motion === "off" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
    });
  };

  const setupReveal = () => {
    if (!revealItems.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
