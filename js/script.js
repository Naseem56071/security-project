/**
 * ROYAL ENAN SECURITY SERVICES (RESS)
 * Interactive Scripting & Form Validation
 * Vanilla JavaScript (ES6+) - No External Framework Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Sticky Navigation & Header Transitions
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.main-navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const handleScroll = () => {
    const scrollPosition = window.scrollY;

    // Navbar background change on scroll
    if (navbar) {
      if (scrollPosition > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back-to-top button display
    if (backToTopBtn) {
      if (scrollPosition > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top click event
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Collapse on Link Click
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.querySelector('.navbar-collapse');
  const navbarToggler = document.querySelector('.navbar-toggler');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show') && navbarToggler) {
        navbarToggler.click();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Scrollspy / Active Navigation State
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.fade-up-element');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 5. Dynamic Modal Service Pre-fill
  // --------------------------------------------------------------------------
  const quoteModal = document.getElementById('quoteModal');
  const quoteServiceSelect = document.getElementById('modalServiceSelect');

  if (quoteModal) {
    quoteModal.addEventListener('show.bs.modal', (event) => {
      const triggerBtn = event.relatedTarget;
      if (triggerBtn && triggerBtn.hasAttribute('data-service')) {
        const serviceName = triggerBtn.getAttribute('data-service');
        if (quoteServiceSelect) {
          for (let i = 0; i < quoteServiceSelect.options.length; i++) {
            if (quoteServiceSelect.options[i].value === serviceName) {
              quoteServiceSelect.selectedIndex = i;
              break;
            }
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Security Assessment & Staffing Estimator
  // --------------------------------------------------------------------------
  const calcFacility = document.getElementById('calcFacility');
  const calcPosts = document.getElementById('calcPosts');
  const calcPostsVal = document.getElementById('calcPostsVal');
  const calcShifts = document.getElementById('calcShifts');
  const estGuardsTotal = document.getElementById('estGuardsTotal');
  const estSupervisors = document.getElementById('estSupervisors');
  const estResponseTime = document.getElementById('estResponseTime');

  function calculateSecurityPlan() {
    if (!calcPosts || !calcShifts || !estGuardsTotal) return;

    const posts = parseInt(calcPosts.value, 10) || 1;
    const shiftMultiplier = calcShifts.value === '24x7' ? 3 : (calcShifts.value === '12h' ? 2 : 1);
    
    // Total guards recommended including reliever allowance (~10-15%)
    let totalGuards = posts * shiftMultiplier;
    if (shiftMultiplier >= 2) {
      totalGuards += Math.ceil(totalGuards * 0.15); // Statutory reliever margin
    }

    // Recommended field supervisors
    const supervisors = Math.max(1, Math.floor(posts / 4));

    // Update UI
    if (calcPostsVal) calcPostsVal.textContent = posts;
    if (estGuardsTotal) estGuardsTotal.textContent = totalGuards;
    if (estSupervisors) estSupervisors.textContent = supervisors;
    if (estResponseTime) {
      estResponseTime.textContent = calcFacility && calcFacility.value === 'Industrial' ? 'Immediate / Under 10 Mins' : 'Dedicated On-Site 24/7';
    }
  }

  if (calcPosts) {
    calcPosts.addEventListener('input', calculateSecurityPlan);
  }
  if (calcShifts) {
    calcShifts.addEventListener('change', calculateSecurityPlan);
  }
  if (calcFacility) {
    calcFacility.addEventListener('change', calculateSecurityPlan);
  }
  calculateSecurityPlan(); // Run on initialization

  // --------------------------------------------------------------------------
  // 7. Toast Notification Utility
  // --------------------------------------------------------------------------
  function showNotificationToast(title, message) {
    const toastEl = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    if (toastEl && window.bootstrap && window.bootstrap.Toast) {
      if (toastTitle) toastTitle.textContent = title;
      if (toastMessage) toastMessage.textContent = message;
      const toast = new bootstrap.Toast(toastEl, { delay: 6000 });
      toast.show();
    } else {
      alert(`${title}\n\n${message}`);
    }
  }

  // --------------------------------------------------------------------------
  // 8. Contact Form Validation & Submission Handler
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const phone = document.getElementById('contactPhone');
      const service = document.getElementById('contactService');
      const message = document.getElementById('contactMessage');

      // Helper validation function
      function validateField(field, condition, errorMsg) {
        const errorContainer = field.nextElementSibling;
        if (!condition) {
          field.classList.add('is-invalid');
          field.classList.remove('is-valid');
          if (errorContainer && errorContainer.classList.contains('invalid-feedback')) {
            errorContainer.textContent = errorMsg;
          }
          isValid = false;
        } else {
          field.classList.remove('is-invalid');
          field.classList.add('is-valid');
        }
      }

      // Name validation
      if (name) {
        validateField(name, name.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters).');
      }

      // Phone validation (10 to 15 digits / standard telephone format)
      if (phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        validateField(phone, phoneRegex.test(phone.value.trim().replace(/\s/g, '')), 'Please enter a valid telephone number.');
      }

      // Email validation
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(email, emailRegex.test(email.value.trim()), 'Please enter a valid email address.');
      }

      // Service selection
      if (service) {
        validateField(service, service.value !== '', 'Please select a security service.');
      }

      // Message validation
      if (message) {
        validateField(message, message.value.trim().length >= 10, 'Please provide details about your security requirements (min 10 characters).');
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing Inquiry...`;

        // Simulate secure submission & connection to client endpoint
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          contactForm.reset();

          // Clear validation classes
          const validatedInputs = contactForm.querySelectorAll('.is-valid');
          validatedInputs.forEach(input => input.classList.remove('is-valid'));

          showNotificationToast(
            'Inquiry Received Successfully',
            'Thank you for reaching out to Royal Enan Security Services. Our operations coordinator in Hyderabad will review your requirements and contact you within 2 hours.'
          );
        }, 850);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Modal Quote Form Validation & Submission Handler
  // --------------------------------------------------------------------------
  const modalQuoteForm = document.getElementById('modalQuoteForm');
  if (modalQuoteForm) {
    modalQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const modalName = document.getElementById('modalName');
      const modalPhone = document.getElementById('modalPhone');
      const modalEmail = document.getElementById('modalEmail');
      const modalService = document.getElementById('modalServiceSelect');

      function validateField(field, condition) {
        if (!condition) {
          field.classList.add('is-invalid');
          field.classList.remove('is-valid');
          isValid = false;
        } else {
          field.classList.remove('is-invalid');
          field.classList.add('is-valid');
        }
      }

      if (modalName) validateField(modalName, modalName.value.trim().length >= 2);
      if (modalPhone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        validateField(modalPhone, phoneRegex.test(modalPhone.value.trim().replace(/\s/g, '')));
      }
      if (modalEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(modalEmail, emailRegex.test(modalEmail.value.trim()));
      }
      if (modalService) validateField(modalService, modalService.value !== '');

      if (isValid) {
        const submitBtn = modalQuoteForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating Quote...`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          modalQuoteForm.reset();

          // Hide modal
          const modalInstance = bootstrap.Modal.getInstance(quoteModal);
          if (modalInstance) {
            modalInstance.hide();
          }

          showNotificationToast(
            'Security Quote Requested',
            'Your security proposal request has been logged. Our Hyderabad supervisory branch will prepare a custom proposal and reach out directly.'
          );
        }, 850);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
