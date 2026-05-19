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

  let scrollTicking = false;
  let lastProjectTrigger = null;

  const projectDetails = {
    "government-gis": {
      category: "GIS Development",
      title: "Government GIS Dashboards",
      summary: [
        "ArcGIS dashboard and web mapping delivery for public-sector workflows. This summary stays client-neutral because project data and screenshots are confidential.",
        "The work focused on map interaction, filtering, responsive layouts, and ArcGIS service integration for operational users.",
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
      category: "Web GIS",
      title: "Custom Experience Builder Widgets",
      summary: [
        "Reusable GIS widget development for ArcGIS Experience Builder Developer Edition, focused on filtering, map interaction, and service-driven UI behavior.",
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
        "Technical support work from Esri Support Center workflows at gistec, focused on diagnosing GIS platform issues and helping users restore reliable ArcGIS access.",
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
      title: "Portfolio Website",
      summary: [
        "Static HTML, CSS, and JavaScript portfolio refined around GIS Developer positioning, Esri support experience, and Web GIS delivery.",
        "The project section now uses a single-page modal flow, which reduces page sprawl and keeps selected work easier to maintain.",
      ],
      sections: [
        {
          title: "Current Improvements",
          items: [
            "Updated content around ArcGIS Experience Builder, Web GIS, Esri support, and frontend delivery.",
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
    document.body.classList.remove("open");
    menuIcon.setAttribute("aria-expanded", "false");
  };

  const setupMenu = () => {
    if (!menuIcon || !navlist) return;

    menuIcon.addEventListener("click", () => {
      const isOpen = navlist.classList.toggle("active");
      menuIcon.classList.toggle("active", isOpen);
      document.body.classList.toggle("open", isOpen);
      menuIcon.setAttribute("aria-expanded", String(isOpen));
    });

    navlist.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    overlay?.addEventListener("click", closeMenu);
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
