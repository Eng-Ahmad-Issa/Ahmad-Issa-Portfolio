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

  let skillsPlayed = false;
  let scrollTicking = false;

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
  setupSwiper();
  setupScrollToTop();
  setupSkillsObserver();
  setupScrollReveal();

  runSkillsCounter();
  updateScrollProgress();
  updateActiveMenu();

  window.addEventListener("scroll", onScroll, { passive: true });
});
