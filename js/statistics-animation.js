function animatedValue(element, start, end, duration) {
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) {
      startTime = timestamp;
    }

    const progress = timestamp - startTime;
    const currentValue =
      Math.min(progress / duration, 1) * (end - start) + start;

    element.textContent = Math.floor(currentValue);

    if (currentValue < end) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function initObserver() {
  const options = {
    root: null,
    threshold: 0.8,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statsValues = entry.target.querySelectorAll(".stat-value");

        statsValues.forEach((stat) => {
          const endValue = parseInt(stat.getAttribute("data-target"));

          animatedValue(stat, 0, endValue, 3000);
        });
      }
      observer.unobserve(entry.target);
    });
  }, options);

  const targetSection = document.querySelector(".statistics-section");
  observer.observe(targetSection);
}

initObserver();
