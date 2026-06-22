(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-project][data-category]");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const sectionLinks = document.querySelectorAll(".nav-links a");
  const revealItems = document.querySelectorAll(".reveal");

  function setActiveFilter(activeButton) {
    const filter = activeButton.dataset.filter;

    filterButtons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveFilter(button));
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    sectionLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function markVisible(element) {
    element.classList.add("is-visible");
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(markVisible);
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const linkById = new Map([...sectionLinks].map((link) => [link.getAttribute("href").slice(1), link]));

  function activateNav(id) {
    sectionLinks.forEach((link) => link.classList.remove("active"));
    const activeLink = linkById.get(id);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateNav(entry.target.id);
        }
      });
    }, {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0,
    });

    sections.forEach((section) => navObserver.observe(section));
  }
})();
