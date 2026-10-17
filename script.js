(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const loader = $("#loader");
  const toast = $("#toast");
  let toastTimer;

  const defaultPrefs = { theme: "dark", accent: "#b8ff24", reduceMotion: false };
  let prefs = { ...defaultPrefs };

  try {
    const saved = localStorage.getItem("ywz-preferences");
    if (saved) prefs = { ...defaultPrefs, ...JSON.parse(saved) };
  } catch (error) {
    console.info("Saved display preferences are unavailable in this browser.");
  }

  function savePrefs() {
    try { localStorage.setItem("ywz-preferences", JSON.stringify(prefs)); } catch (_) {}
  }

  function hexToRgb(hex) {
    const cleaned = hex.replace("#", "");
    const value = cleaned.length === 3 ? cleaned.split("").map(c => c + c).join("") : cleaned;
    const n = parseInt(value, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }

  function applyPrefs() {
    root.dataset.theme = prefs.theme;
    root.style.setProperty("--accent", prefs.accent);
    root.style.setProperty("--accent-rgb", hexToRgb(prefs.accent));
    document.body.classList.toggle("reduce-motion", !!prefs.reduceMotion);
    const isDark = prefs.theme === "dark";
    const themeToggle = $("#themeToggle");
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    $(".theme-icon", themeToggle).textContent = isDark ? "☼" : "☾";
    $("#settingsTheme").setAttribute("aria-checked", String(isDark));
    $("#motionToggle").setAttribute("aria-checked", String(!!prefs.reduceMotion));
    $$(".swatch").forEach(button => button.classList.toggle("selected", button.dataset.accent.toLowerCase() === prefs.accent.toLowerCase()));
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = prefs.accent;
  }

  applyPrefs();

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function setTheme(theme) {
    prefs.theme = theme;
    applyPrefs();
    savePrefs();
  }

  $("#themeToggle").addEventListener("click", () => setTheme(prefs.theme === "dark" ? "light" : "dark"));
  $("#settingsTheme").addEventListener("click", () => setTheme(prefs.theme === "dark" ? "light" : "dark"));
  $("#motionToggle").addEventListener("click", () => {
    prefs.reduceMotion = !prefs.reduceMotion;
    applyPrefs();
    savePrefs();
  });
  $$(".swatch").forEach(button => button.addEventListener("click", () => {
    prefs.accent = button.dataset.accent;
    applyPrefs();
    savePrefs();
  }));
  $("#settingsReset").addEventListener("click", () => {
    prefs = { ...defaultPrefs };
    applyPrefs();
    savePrefs();
    showToast("Display preferences reset.");
  });

  const panel = $("#settingsPanel");
  const backdrop = $("#settingsBackdrop");
  let previousFocus = null;
  function openSettings() {
    previousFocus = document.activeElement;
    panel.classList.add("open");
    backdrop.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock-scroll");
    $("#settingsClose").focus();
  }
  function closeSettings() {
    panel.classList.remove("open");
    backdrop.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lock-scroll");
    if (previousFocus) previousFocus.focus();
  }
  $("#settingsOpen").addEventListener("click", openSettings);
  $("#settingsClose").addEventListener("click", closeSettings);
  backdrop.addEventListener("click", closeSettings);

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  function closeMenu() {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  $$("#mainNav a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });

  $$("[data-scroll]").forEach(button => button.addEventListener("click", () => {
    const target = $(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: prefs.reduceMotion ? "auto" : "smooth" });
  }));

  const programmeDetails = {
    substance: {
      title: "Drug abuse awareness",
      description: "Help young people access accurate prevention information, talk openly about pressure and risk, and seek support without shame. Activities should be age-appropriate and linked with qualified health professionals or trusted support services where needed."
    },
    safety: {
      title: "Child protection & safety",
      description: "Promote safe environments, respectful relationships and awareness of child protection. Concerns involving abuse should be handled sensitively, confidentially and through appropriate safeguarding and reporting channels. Never promise secrecy when a child may be at risk."
    },
    digital: {
      title: "Cyberbullying & peer pressure",
      description: "Encourage safer online behaviour, positive peer support and practical steps for responding to harassment. Young people should know how to preserve evidence, block or report harmful accounts, and talk to a trusted adult when they feel unsafe."
    },
    community: {
      title: "Care, dignity & belonging",
      description: "Connect willing volunteers and community partners with appropriate ways to support vulnerable young people and families. Any collection or distribution of donations should be transparent, respectful and coordinated with trusted local organizations."
    }
  };
  const dialog = $("#programmeDialog");
  $$(".card-action").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      const item = programmeDetails[button.dataset.openProgramme];
      if (!item) return;
      $("#dialogTitle").textContent = item.title;
      $("#dialogDescription").textContent = item.description;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else showToast(item.title + " — see the contact section to learn more.");
    });
  });
  $$(".programme-card").forEach(card => {
    card.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && event.target === card) {
        event.preventDefault();
        const button = $("[data-open-programme]", card);
        if (button) button.click();
      }
    });
  });
  $("#dialogClose").addEventListener("click", () => dialog.close());
  $("#dialogContact").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  const campaignVideo = $("#campaignVideo");
  $("#videoPlay").addEventListener("click", async () => {
    campaignVideo.hidden = false;
    campaignVideo.scrollIntoView({ behavior: prefs.reduceMotion ? "auto" : "smooth", block: "center" });
    try {
      await campaignVideo.play();
    } catch (_) {
      showToast("Add your campaign video at media/ywz-campaign.mp4, then press play.");
    }
  });
  campaignVideo.addEventListener("error", () => {
    showToast("Video not found. Add media/ywz-campaign.mp4 to your project.");
  });
  $("#campaignAudio").addEventListener("error", () => {
    showToast("Audio not found. Add media/ywz-message.mp3 to your project.");
  });

  $("#shareButton").addEventListener("click", async () => {
    const shareData = {
      title: "Youth Wamphamvu Organization",
      text: "Young minds. Powerful futures. Discover Youth Wamphamvu Organization.",
      url: window.location.href
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Website link copied.");
      } else {
        showToast("Copy the website address from your browser to share it.");
      }
    } catch (error) {
      if (error.name !== "AbortError") showToast("You can share the website using your browser's address bar.");
    }
  });

  const form = $("#contactForm");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const status = $("#formStatus");
    if (!form.reportValidity()) {
      status.textContent = "Please complete the required fields with valid information.";
      status.classList.remove("success");
      return;
    }
    const formData = new FormData(form);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const reason = String(formData.get("reason")).trim();
    const message = String(formData.get("message")).trim();
    const subject = encodeURIComponent(`Y.W.Z. website enquiry — ${reason}`);
    const body = encodeURIComponent(`Hello Youth Wamphamvu Organization,\n\nMy name is ${name}.\nEmail: ${email}\nTopic: ${reason}\n\n${message}\n\nSent from the Y.W.Z. website.`);
    status.classList.add("success");
    status.textContent = "Your message is ready. Choose OK to open your email app; the website itself does not send or store it.";
    const openEmail = window.confirm("Your message is ready to open in your default email app. No message has been sent yet. Continue?");
    if (openEmail) {
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  });

  $("#year").textContent = new Date().getFullYear();

  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !prefs.reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  const navLinks = $$("#mainNav a");
  const sections = navLinks.map(link => $(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(section => navObserver.observe(section));
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      if (panel.classList.contains("open")) closeSettings();
    }
  });

  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("done"), 450);
  });
  // Fallback in case a remote image or font keeps the load event waiting.
  setTimeout(() => loader.classList.add("done"), 2200);
})();
