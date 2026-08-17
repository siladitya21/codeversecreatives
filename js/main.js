(function () {
  "use strict";

  /* Theme toggle (initial theme is set inline in <head> to avoid flash) */
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var root = document.documentElement;
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("cvc-theme", next);
      } catch (err) {
        /* localStorage unavailable (private mode) — theme just won't persist */
      }
    });
  }

  /* Mobile nav toggle */
  var navbar = document.querySelector("[data-navbar]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  if (navbar && navToggle) {
    navToggle.addEventListener("click", function () {
      navbar.classList.toggle("is-open");
    });
    navbar.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        navbar.classList.remove("is-open");
      });
    });
  }

  /* Courses dropdown */
  var courseDropdown = document.querySelector("[data-nav-dropdown]");
  var courseDropdownTrigger = document.querySelector("[data-nav-dropdown-trigger]");
  if (courseDropdown && courseDropdownTrigger) {
    courseDropdownTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = courseDropdown.getAttribute("data-open") === "true";
      courseDropdown.setAttribute("data-open", isOpen ? "false" : "true");
      courseDropdownTrigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
    document.addEventListener("click", function () {
      courseDropdown.setAttribute("data-open", "false");
      courseDropdownTrigger.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        courseDropdown.setAttribute("data-open", "false");
        courseDropdownTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Expand-all / collapse-all for curriculum week accordions */
  var expandAllBtn = document.querySelector("[data-expand-all]");
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", function () {
      var weeks = document.querySelectorAll(".week-item");
      var shouldExpand = expandAllBtn.textContent.trim().indexOf("Expand") === 0;
      weeks.forEach(function (week) {
        week.open = shouldExpand;
      });
      expandAllBtn.textContent = shouldExpand ? "Collapse all weeks" : "Expand all weeks";
    });
  }

  /* Footer "Back to top" */
  document.querySelectorAll("[data-back-to-top]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* Reveal-on-scroll for generic sections and timeline items */
  var revealTargets = document.querySelectorAll(".reveal, .timeline-item");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
