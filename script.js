
/* =====================================
   1. SELECT HTML ELEMENTS
===================================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const typingText = document.getElementById("typingText");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");


/* =====================================
   2. MOBILE NAVIGATION
===================================== */

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

// Close menu after clicking a navigation link
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});


/* =====================================
   3. DARK / LIGHT THEME
===================================== */

themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");

    themeToggle.innerHTML = isLight
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );

    // Save theme preference in the browser
    try {
        localStorage.setItem(
            "portfolio-theme",
            isLight ? "light" : "dark"
        );
    } catch (error) {
        console.warn("Theme preference could not be saved.");
    }
});

// Restore previously selected theme
try {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        themeToggle.setAttribute("aria-label", "Switch to dark theme");
    }
} catch (error) {
    console.warn("Theme preference could not be loaded.");
}


/* =====================================
   4. TYPING ANIMATION
===================================== */

const roles = [
    "Web Developer",
    "Python Programmer",
    "Creative Learner",
    "Future AI/ML Engineer"
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (deleting) {
        characterIndex--;
    } else {
        characterIndex++;
    }

    typingText.textContent = currentRole.substring(
        0,
        characterIndex
    );

    let delay = deleting ? 45 : 90;

    if (!deleting && characterIndex === currentRole.length) {
        deleting = true;
        delay = 1200;
    } else if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
    }

    setTimeout(typeEffect, delay);
}

typeEffect();


/* =====================================
   5. PROJECT FILTER
===================================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        // Update active filter button
        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        // Show matching projects
        projectCards.forEach(card => {
            const category = card.dataset.category;

            if (
                selectedFilter === "all" ||
                category === selectedFilter
            ) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });
    });
});


/* =====================================
   6. SCROLL REVEAL ANIMATION
===================================== */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    // Fallback for older browsers
    revealElements.forEach(element => {
        element.classList.add("visible");
    });
}


/* =====================================
   7. ACTIVE NAVIGATION ON SCROLL
===================================== */

const pageSections = document.querySelectorAll("main section");
const navigationItems = document.querySelectorAll(".nav-link");

function updateActiveLink() {
    let currentSection = "home";

    pageSections.forEach(section => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navigationItems.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });
}

window.addEventListener("scroll", updateActiveLink);


/* =====================================
   8. BACK TO TOP BUTTON
===================================== */

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/* =====================================
   9. CONTACT FORM VALIDATION
===================================== */

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    // Read and trim form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Check required fields
    if (!name || !email || !subject || !message) {
        formStatus.textContent = "Please fill in all the fields.";
        return;
    }

    // Check name length
    if (name.length < 2) {
        formStatus.textContent =
            "Please enter a name with at least 2 characters.";
        return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        formStatus.textContent =
            "Please enter a valid email address.";
        return;
    }

    // Check message length
    if (message.length < 10) {
        formStatus.textContent =
            "Message must contain at least 10 characters.";
        return;
    }

    // Replace this with your real email address
    const recipient = "your.email@example.com";

    const emailSubject = encodeURIComponent(subject);
    const emailBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const mailtoLink =
        `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

    formStatus.textContent =
        "Opening your email application to send the message...";

    // Opens the visitor's configured email application
    window.location.href = mailtoLink;
});


/* =====================================
   10. AUTOMATIC COPYRIGHT YEAR
===================================== */

document.getElementById("currentYear").textContent =
    new Date().getFullYear();
