// Fade observer: toggles visible class when an element enters central view
(function () {
  const fadeTargets = document.querySelectorAll(".intro, .frame, footer");
  const options = {
    root: null,
    rootMargin: "0px 0px -15% 0px",
    threshold: 0.15,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0.15) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, options);
  fadeTargets.forEach((t) => observer.observe(t));
})();

// Lazy-load sketches (iframes) when left column enters view
(function () {
  const containers = document.querySelectorAll(".sketch-container");
  const options = {
    root: null,
    rootMargin: "100px 0px 100px 0px",
    threshold: 0.15,
  };
  const loader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const container = entry.target;
        if (!container.dataset.loaded) {
          const src = container.dataset.src;
          if (src) {
            const iframe = document.createElement("iframe");
            iframe.src = src;
            iframe.loading = "lazy";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            const box = container.querySelector("[data-placeholder]") || container;
            box.innerHTML = "";
            box.appendChild(iframe);
            container.dataset.loaded = "true";
          }
        }
      }
    });
  }, options);
  containers.forEach((c) => loader.observe(c));
})();

// Pause videos when section not visible
(function () {
  const frames = document.querySelectorAll(".frame");
  const options = { root: null, threshold: 0.25, rootMargin: "0px" };
  const vidObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const vid = entry.target.querySelector("video");
      if (!vid) return;
      if (entry.intersectionRatio > 0.25) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, options);
  frames.forEach((f) => vidObserver.observe(f));
})();
