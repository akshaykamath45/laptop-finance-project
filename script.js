// Theme Toggle Functionality
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle")
    this.themeIcon = document.getElementById("theme-icon")
    this.currentTheme = localStorage.getItem("theme") || "dark"

    this.init()
  }

  init() {
    // Set initial theme
    this.setTheme(this.currentTheme)

    // Add event listener
    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme()
    })
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    this.currentTheme = theme

    // Update icon
    if (theme === "dark") {
      this.themeIcon.className = "fas fa-sun"
    } else {
      this.themeIcon.className = "fas fa-moon"
    }

    // Save to localStorage
    localStorage.setItem("theme", theme)
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark"
    this.setTheme(newTheme)
  }
}

// Mobile Menu Functionality
class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById("mobile-menu-toggle")
    this.navMenu = document.getElementById("nav-menu")

    this.init()
  }

  init() {
    this.menuToggle.addEventListener("click", () => {
      this.toggleMenu()
    })

    // Close menu when clicking on links
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMenu()
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.menuToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
        this.closeMenu()
      }
    })
  }

  toggleMenu() {
    this.navMenu.classList.toggle("active")
    this.menuToggle.classList.toggle("active")
  }

  closeMenu() {
    this.navMenu.classList.remove("active")
    this.menuToggle.classList.remove("active")
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    this.init()
  }

  init() {
    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll(".feature-card, .step, .testimonial-card")
    animatedElements.forEach((el) => {
      el.classList.add("fade-in")
    })

    // Create intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    }, this.observerOptions)

    // Observe elements
    animatedElements.forEach((el) => {
      this.observer.observe(el)
    })
  }
}

// Navbar Scroll Effect
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector(".navbar")
    this.init()
  }

  init() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        this.navbar.style.background = "rgba(15, 23, 42, 0.98)"
        this.navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
      } else {
        this.navbar.style.background = "rgba(15, 23, 42, 0.95)"
        this.navbar.style.boxShadow = "none"
      }
    })
  }
}

// Smooth Scroll for Navigation Links
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    const navLinks = document.querySelectorAll('a[href^="#"]')
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 70 // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })
  }
}

// Floating Animation Controller
class FloatingAnimations {
  constructor() {
    this.init()
  }

  init() {
    // Add staggered delays to floating icons
    const floatingIcons = document.querySelectorAll(".floating-icon")
    floatingIcons.forEach((icon, index) => {
      icon.style.animationDelay = `${index * 0.5}s`
    })
  }
}

// Button Interactions
class ButtonInteractions {
  constructor() {
    this.init()
  }

  init() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll(".btn, .nav-btn")
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.createRipple(e, button)
      })
    })
  }

  createRipple(event, button) {
    const ripple = document.createElement("span")
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init()
  }

  init() {
    // Lazy load images when they come into view
    this.lazyLoadImages()

    // Debounce scroll events
    this.debounceScrollEvents()
  }

  lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]")
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute("data-src")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }

  debounceScrollEvents() {
    let ticking = false

    const updateScrollEffects = () => {
      // Update any scroll-based effects here
      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollEffects)
        ticking = true
      }
    }

    window.addEventListener("scroll", requestTick)
  }
}

// --- AUTH & NAVBAR LOGIC ---
function renderNavbar() {
  const navMenu = document.getElementById("nav-menu");
  const navControls = document.querySelector(".nav-controls");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Build menu links
  let menuHtml = '';
  menuHtml += '<a href="index.html" class="nav-link">Home</a>';
  menuHtml += '<a href="products.html" class="nav-link">Products</a>';

  if (currentUser) {
    if (currentUser.email === 'admin@demo.com') {
      menuHtml += '<a href="dashboard.html" class="nav-link">Dashboard</a>';
    } else {
      menuHtml += '<a href="all-applications.html" class="nav-link">My Applications</a>';
    }
  } else {
    menuHtml += '<a href="login.html" class="nav-link">Login</a>';
    menuHtml += '<a href="signup.html" class="nav-link">Sign Up</a>';
  }
  menuHtml += '<a href="products.html" class="nav-btn">Explore Laptops</a>';
  navMenu.innerHTML = menuHtml;

  // User avatar & dropdown
  let avatarHtml = '';
  if (currentUser) {
    const email = currentUser.email;
    const maskedPw = '********';
    avatarHtml += `
      <div class="user-avatar" id="user-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-dropdown" id="user-dropdown" style="display:none;">
        <div class="dropdown-email"><strong>${email}</strong></div>
        <div class="dropdown-password">Password: ${maskedPw}</div>
        <button class="btn btn-secondary" id="logout-btn">Logout</button>
      </div>
    `;
  }
  // Remove any existing avatar/dropdown
  const oldAvatar = document.getElementById("user-avatar");
  if (oldAvatar) oldAvatar.remove();
  const oldDropdown = document.getElementById("user-dropdown");
  if (oldDropdown) oldDropdown.remove();
  // Insert avatar before theme toggle
  if (avatarHtml) {
    navControls.insertAdjacentHTML('afterbegin', avatarHtml);
  }

  // Avatar dropdown logic
  const avatar = document.getElementById("user-avatar");
  const dropdown = document.getElementById("user-dropdown");
  if (avatar && dropdown) {
    avatar.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
    // Logout
    document.getElementById("logout-btn").onclick = () => {
      localStorage.removeItem("currentUser");
      window.location.reload();
    };
  }
}

// Export for use in other scripts
window.renderNavbar = renderNavbar;

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager()
  new MobileMenu()
  new ScrollAnimations()
  new NavbarScroll()
  new SmoothScroll()
  new FloatingAnimations()
  new ButtonInteractions()
  new PerformanceOptimizer()

  // Add loading animation
  document.body.classList.add("loaded")
})

// Add CSS for ripple effect
const rippleCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

body {
    opacity: 0;
    transition: opacity 0.3s ease;
}

body.loaded {
    opacity: 1;
}
`

// Inject ripple CSS
const style = document.createElement("style")
style.textContent = rippleCSS
document.head.appendChild(style)

// Add error handling for external resources
window.addEventListener("error", (e) => {
  console.warn("Resource failed to load:", e.target.src || e.target.href)
})

// Preload critical resources
const preloadResources = () => {
  const criticalResources = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  ]

  criticalResources.forEach((resource) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "style"
    link.href = resource
    document.head.appendChild(link)
  })
}

// Initialize preloading
preloadResources()
