/* Noura's Dev Blog — interactions */
(function () {
    "use strict";

    /* ---------- Theme ---------- */
    var root = document.documentElement;
    var toggle = document.getElementById("themeToggle");
    var stored = null;
    try { stored = localStorage.getItem("noura-theme"); } catch (e) {}

    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(stored || (prefersDark ? "dark" : "light"));

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (toggle) {
            toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
        }
        try { localStorage.setItem("noura-theme", theme); } catch (e) {}
    }

    if (toggle) {
        toggle.addEventListener("click", function () {
            setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
        });
    }

    /* ---------- Mobile menu ---------- */
    var navToggle = document.getElementById("navToggle");
    var navLinks = document.querySelector(".nav__links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            var open = navLinks.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(open));
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        navLinks.addEventListener("click", function (e) {
            if (e.target.tagName === "A") closeMenu();
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest(".nav__inner")) closeMenu();
        });
    }

    function closeMenu() {
        if (!navLinks) return;
        navLinks.classList.remove("is-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    }

    /* ---------- Sticky nav shadow ---------- */
    var nav = document.getElementById("nav");
    function onScroll() {
        if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll reveal ---------- */
    var revealables = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealables.forEach(function (el) { io.observe(el); });
    } else {
        revealables.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ---------- Active nav link ---------- */
    var sections = document.querySelectorAll("section[id]");
    var links = document.querySelectorAll(".nav__links a");

    if ("IntersectionObserver" in window && sections.length && links.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (a) {
                    a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, { threshold: 0.4 });

        sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Subscribe form (front-end only) ---------- */
    var form = document.getElementById("subscribeForm");
    var input = document.getElementById("emailInput");
    var note = document.getElementById("formNote");

    if (form && input && note) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var value = input.value.trim();
            var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

            note.textContent = valid
                ? "Thanks! You're on the list 💜"
                : "Please enter a valid email address.";
            note.style.opacity = valid ? "1" : ".9";

            if (valid) { input.value = ""; }
            else { input.focus(); }
        });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    /* ---------- Article counter ---------- */
    var statArticles = document.getElementById("statArticles");
    if (statArticles) statArticles.textContent = String(document.querySelectorAll(".post").length);
})();
