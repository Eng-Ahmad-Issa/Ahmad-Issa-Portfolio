document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const navlist = document.querySelector(".navlist");
  const aboutButtons = document.querySelectorAll(".about-btn button");
  const aboutContents = document.querySelectorAll(".content");
  const text = document.querySelector(".text p");
  const firstSkill = document.querySelector(".skill:first-child");
  const skillCounters = document.querySelectorAll(".counter span");
  const progressBars = document.querySelectorAll(".skills svg circle");
  const scrollProgress = document.getElementById("progress");
  const menuLinks = document.querySelectorAll("header ul li a");
  const sections = document.querySelectorAll("section");
  const documentElement = document.documentElement;
  const projectModal = document.getElementById("project-modal");
  const projectModalCategory = document.getElementById("project-modal-category");
  const projectModalTitle = document.getElementById("project-modal-title");
  const projectModalContent = document.getElementById("project-modal-content");
  const projectModalCloseButtons = document.querySelectorAll("[data-project-modal-close]");
  const portfolioGallery = document.querySelector(".portfolio-gallery");

  let skillsPlayed = false;
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
      title: "Esri Support & Platform Diagnostics",
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

  const setupMenu = () => {
    if (!menuIcon || !navlist) return;

    menuIcon.addEventListener("click", () => {
      menuIcon.classList.toggle("active");
      navlist.classList.toggle("active");
      document.body.classList.toggle("open");
    });

    navlist.addEventListener("click", () => {
      navlist.classList.remove("active");
      menuIcon.classList.remove("active");
      document.body.classList.remove("open");
    });
  };

  const setupRotatingText = () => {
    if (!text) return;

    text.innerHTML = text.textContent
      .split("")
      .map((char, i) => `<b style="transform: rotate(${i * 6.3}deg)">${char}</b>`)
      .join("");
  };

  const setupAboutTabs = () => {
    if (!aboutButtons.length || !aboutContents.length) return;

    aboutButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        aboutContents.forEach((content) => {
          content.style.display = "none";
        });

        if (aboutContents[index]) {
          aboutContents[index].style.display = "block";
        }

        aboutButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  };

  const setupPortfolioFilter = () => {
    if (typeof mixitup !== "function") return;

    mixitup(".portfolio-gallery", {
      selectors: {
        target: ".portfolio-box",
      },
      animation: {
        duration: 250,
        nudge: false,
        easing: "ease-out",
        effects: "fade",
      },
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

    if (project.media?.length) {
      const mediaGrid = document.createElement("div");
      mediaGrid.className = "project-modal-media";

      project.media.forEach((item) => {
        const figure = document.createElement("figure");

        if (item.type === "video") {
          const video = document.createElement("video");
          video.controls = true;
          video.preload = "metadata";

          const source = document.createElement("source");
          source.src = item.src;
          source.type = "video/mp4";

          video.appendChild(source);
          figure.appendChild(video);
        } else {
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
      const closeButton = projectModal.querySelector(".project-modal-close");
      closeButton?.focus();
    });
  };

  const trapProjectModalFocus = (event) => {
    if (!projectModal || event.key !== "Tab") return;

    const focusable = projectModal.querySelectorAll(
      'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
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

    projectModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeProjectModal();
        return;
      }

      trapProjectModalFocus(event);
    });
  };

  const setupSwiper = () => {
    if (typeof Swiper !== "function") return;

    new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    });
  };

  const hasReached = (el) => {
    if (!el) return false;
    const topPosition = el.getBoundingClientRect().top;
    return window.innerHeight >= topPosition + el.offsetHeight;
  };

  const updateCount = (counter, maxNum) => {
    const currentNum = Number(counter.innerText);

    if (currentNum < maxNum) {
      counter.innerText = String(currentNum + 1);
      setTimeout(() => {
        updateCount(counter, maxNum);
      }, 12);
    }
  };

  const runSkillsCounter = () => {
    if (skillsPlayed || !hasReached(firstSkill)) return;

    skillsPlayed = true;

    skillCounters.forEach((counter, i) => {
      const target = Number(counter.dataset.target);
      const strokeValue = 465 - 465 * (target / 100);

      if (progressBars[i]) {
        progressBars[i].style.setProperty("--target", strokeValue);
        progressBars[i].style.animation = "progress 2s ease-in-out forwards";
      }

      setTimeout(() => {
        updateCount(counter, target);
      }, 400);
    });
  };

  const updateScrollProgress = () => {
    if (!scrollProgress) return;

    const pos = documentElement.scrollTop;
    const calcHeight =
      documentElement.scrollHeight - documentElement.clientHeight;
    const scrollValue =
      calcHeight > 0 ? Math.round((pos * 100) / calcHeight) : 0;

    scrollProgress.style.display = pos > 100 ? "grid" : "none";
    scrollProgress.style.background = `conic-gradient(#fff ${scrollValue}%, #e6006d ${scrollValue}%)`;
  };

  const updateActiveMenu = () => {
    if (!menuLinks.length || !sections.length) return;

    let len = sections.length;
    while (--len && window.scrollY + 97 < sections[len].offsetTop) {
      // intentional empty loop
    }

    menuLinks.forEach((link) => link.classList.remove("active"));

    if (menuLinks[len]) {
      menuLinks[len].classList.add("active");
    }
  };

  const onScroll = () => {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(() => {
      runSkillsCounter();
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

  const setupSkillsObserver = () => {
    if (!firstSkill || skillsPlayed || typeof IntersectionObserver !== "function") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runSkillsCounter();
          observer.disconnect();
        });
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    observer.observe(firstSkill);
  };

  const setupScrollReveal = () => {
    if (typeof ScrollReveal !== "function") return;

    ScrollReveal({
      distance: "90px",
      duration: 2000,
      delay: 200,
    });

    ScrollReveal().reveal(".hero-info,.main-text,.proposal,.heading", {
      origin: "top",
    });
    ScrollReveal().reveal(".about-img,.fillter-buttons,.contact-info", {
      origin: "left",
    });
    ScrollReveal().reveal(".about-content,.skills,.experience", { origin: "right" });
  };

  setupMenu();
  setupRotatingText();
  setupAboutTabs();
  setupPortfolioFilter();
  setupProjectModal();
  setupSwiper();
  setupScrollToTop();
  setupSkillsObserver();
  setupScrollReveal();

  runSkillsCounter();
  updateScrollProgress();
  updateActiveMenu();

  window.addEventListener("scroll", onScroll, { passive: true });
});
