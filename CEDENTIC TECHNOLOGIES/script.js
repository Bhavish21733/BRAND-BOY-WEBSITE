// WhatsApp form integration
document.addEventListener('DOMContentLoaded', function() {
  // Find the first form on the page (customize selector as needed)
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // You may need to update these selectors if your fields use different names/ids
      const name = form.querySelector('input[name="name"], input#name, input[data-name]')?.value || '';
      const email = form.querySelector('input[name="email"], input#email, input[data-email]')?.value || '';
      const message = form.querySelector('textarea[name="message"], textarea#message, textarea[data-message]')?.value || '';

      const waNumber = '918688641066';
      let waText = "Hello Cedentic Technologies%0A";
      waText += "Name: " + encodeURIComponent(name) + "%0A";
      waText += "Email: " + encodeURIComponent(email) + "%0A";
      waText += "Message: " + encodeURIComponent(message);

      const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
      window.open(waUrl, '_blank');
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const scrollTo = document.getElementById(targetId);
      if (scrollTo) {
        e.preventDefault();
        scrollTo.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initialize AOS animations
  if (typeof AOS !== 'undefined' && AOS.init) {
    AOS.init();
  }

  // =====================
  // 2. Counter Animation for Stats Section
  // =====================
  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);

      if (element.dataset.symbol && value === end) {
        element.textContent = end + element.dataset.symbol;
      } else if (element.dataset.symbol) {
        element.textContent = value + element.dataset.symbol;
      } else {
        element.textContent = value;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // animation done
      }
    };
    window.requestAnimationFrame(step);
  }

  function triggerCounters() {
    // Select all stat-value elements (update selector as needed)
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
      const raw = counter.getAttribute('data-target') || counter.textContent.trim();
      const symbolMatch = raw.match(/^(\d+)[^\d]+(.+)?$/); // e.g. 200+
      let end = 0, symbol = "";
      if (symbolMatch) {
        end = parseInt(symbolMatch[1], 10);
        symbol = symbolMatch[2] || "";
      } else {
        end = parseInt(raw, 10);
      }
      counter.dataset.symbol = symbol;
      animateCounter(counter, 0, end, 1400);
    });
  }

  // Animate stats when they scroll into view (Intersection Observer)
  function observeStatsSection() {
    const statSection = document.querySelector('.stats-section');
    if (!statSection) return;

    let animated = false;
    const observer = new window.IntersectionObserver(
      function(entries, observerInstance) {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            triggerCounters();
            animated = true;
            observerInstance.disconnect();
          }
        });
      },
      { threshold: 0.34 }
    );
    observer.observe(statSection);
  }
  observeStatsSection();

  // =====================
  // 3. Improved Smooth Scrolling
  // =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const scrollTo = document.getElementById(targetId);
      if (scrollTo) {
        e.preventDefault();
        // Adjust for sticky/fixed header if needed:
        const yOffset = -20;
        const y = scrollTo.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
        // Optionally update hash in URL (not doing by default)
      }
    });
  });

  // =====================
  // 4. Initialize AOS if Not Already Done
  // =====================
  if (typeof AOS !== 'undefined' && AOS.init && !document.body.classList.contains('aos-initialized')) {
    AOS.init();
    document.body.classList.add('aos-initialized');
  }