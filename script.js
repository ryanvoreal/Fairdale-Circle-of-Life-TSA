// ========= SCROLL REVEAL (IntersectionObserver) =========
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.dataset.stagger !== undefined) {
        // Trigger staggered children when the container enters view
        Array.from(el.querySelectorAll('.reveal')).forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 100);
        });
        el.classList.add('visible');
      } else {
        el.classList.add('visible');
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Observe stagger containers directly
  document.querySelectorAll('[data-stagger]').forEach(el => observer.observe(el));

  // Observe individual reveal elements that are NOT inside a stagger container
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.closest('[data-stagger]')) observer.observe(el);
  });
})();

const toggleBtn = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

function openNav() {
  nav.classList.add('open');
  toggleBtn.classList.add('open');
  toggleBtn.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  nav.classList.remove('open');
  toggleBtn.classList.remove('open');
  toggleBtn.setAttribute('aria-expanded', 'false');
}

toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  nav.classList.contains('open') ? closeNav() : openNav();
});

// Close when a nav link is clicked
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Close when tapping outside the header
document.addEventListener('click', (e) => {
  if (!e.target.closest('.site-header')) {
    closeNav();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

// Highlight the active page link
(function markActivePage() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active-page');
    }
  });
})();

// ======= REVEAL ANIMATION ON SCROLL =======



// ========= DARK MODE TOGGLE =========
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;


if (themeToggle) {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  htmlElement.setAttribute('data-theme', currentTheme);
  themeToggle.checked = currentTheme === 'dark';

  themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}


// ========= FAQ ACCORDION FUNCTIONALITY =========
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item');
      const isOpen = faqItem.classList.contains('open');

      // Close all other FAQ items
      document.querySelectorAll('.faq-item.open').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('open');
        }
      });

      // Toggle the clicked item
      if (!isOpen) {
        faqItem.classList.add('open');
      } else {
        faqItem.classList.remove('open');
      }
    });
  });
}

// Initialize FAQ when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFAQ);
} else {
  initFAQ();
}


// ========= COUNTER ANIMATION ON SCROLL =========
const counters = document.querySelectorAll('.count');


counters.forEach(counter => {
  counter.textContent = '0';
  let hasAnimated = false;


  const updateCounter = () => {
    const target = +counter.dataset.target;
    const count = +counter.textContent;
    const increment = Math.ceil(target / 200);


    if (count < target) {
      counter.textContent = `${Math.min(count + increment, target)}`;
      requestAnimationFrame(updateCounter); // Smoother than setTimeout
    } else {
      counter.textContent = `${target}+`;
    }
  };


  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        updateCounter();
        observer.unobserve(counter); // Cleanup
      }
    });
  }, { threshold: 0.5 });


  observer.observe(counter);
});


// ========= VOLUNTEER FORM SUBMISSION HANDLING =========
const volunteerForm = document.getElementById('volunteerForm');


if (volunteerForm) {
  volunteerForm.addEventListener('submit', function(e) {
    // FormSubmit will handle the email sending
    // Show a success message to the user
    //This if for the get-involved page that I'm currently working on
    console.log('Volunteer form submitted successfully');
  });
}

// ========= PROJECT TABBED CARDS =========
document.querySelectorAll('.project-tabbed').forEach(wrapper => {
  const tablist = wrapper.querySelector('.project-tabs');
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('.project-tab'));
  const panels = Array.from(wrapper.querySelectorAll('.project-tab-panel'));
  let activeIndex = tabs.findIndex(t => t.classList.contains('active'));
  let animating = false;

  const ANIM_CLASSES = ['tab-enter-right', 'tab-enter-left', 'tab-exit-left', 'tab-exit-right'];

  function clearAnimClasses(panel) {
    panel.classList.remove(...ANIM_CLASSES);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (i === activeIndex || animating) return;
      animating = true;

      const direction = i > activeIndex ? 'forward' : 'backward';
      const prevIndex = activeIndex;
      activeIndex = i;

      // Update tab button states immediately
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tabs[i].classList.add('active');
      tabs[i].setAttribute('aria-selected', 'true');

      const outgoing = panels[prevIndex];
      const incoming = panels[i];

      // Prepare outgoing panel
      clearAnimClasses(outgoing);
      outgoing.classList.add(direction === 'forward' ? 'tab-exit-left' : 'tab-exit-right');

      // Prepare incoming panel — show it and animate in
      incoming.hidden = false;
      incoming.classList.add('active');
      clearAnimClasses(incoming);
      incoming.classList.add(direction === 'forward' ? 'tab-enter-right' : 'tab-enter-left');

      // After outgoing finishes, clean it up
      outgoing.addEventListener('animationend', function handler() {
        outgoing.removeEventListener('animationend', handler);
        outgoing.classList.remove('active');
        outgoing.hidden = true;
        clearAnimClasses(outgoing);
        animating = false;
      });

      // After incoming finishes, clean up animation classes
      incoming.addEventListener('animationend', function handler() {
        incoming.removeEventListener('animationend', handler);
        clearAnimClasses(incoming);
      });
    });
  });
});

document.getElementById('resourceSearch').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const cards = document.querySelectorAll('.efforts .card');
  let anyVisible = false;

  cards.forEach(function(card) {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.style.display = '';
      anyVisible = true;
    } else {
      card.style.display = 'none';
    }
  });
  document.getElementById('noResults').style.display = anyVisible ? 'none' : 'block';
});
