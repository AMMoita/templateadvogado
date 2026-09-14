/* =========================================================
   PRELOADER
========================================================= */

const preloader = document.getElementById("preloader");

window.addEventListener("load", () => {

    setTimeout(() => {

        preloader.classList.add("is-hidden");
        document.body.classList.add("loaded");

    }, 850);

});


/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   HEADER SCROLL
========================================================= */

const header = document.getElementById("header");

function updateHeader() {

    if (window.scrollY > 40) {
        header.classList.add("is-scrolled");
    } else {
        header.classList.remove("is-scrolled");
    }

}

window.addEventListener("scroll", updateHeader);

updateHeader();


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu() {

    const isOpen = mobileMenu.classList.toggle("is-open");

    document.body.classList.toggle("menu-open", isOpen);

    menuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
    );

    const lines = menuButton.querySelectorAll("span");

    if (isOpen) {

        lines[0].style.transform = "translateY(4px) rotate(45deg)";
        lines[1].style.transform = "translateY(-4px) rotate(-45deg)";

    } else {

        lines[0].style.transform = "";
        lines[1].style.transform = "";

    }

}

menuButton.addEventListener("click", toggleMenu);


document.querySelectorAll("#mobileMenu a").forEach(link => {

    link.addEventListener("click", () => {

        if (mobileMenu.classList.contains("is-open")) {
            toggleMenu();
        }

    });

});


/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("is-visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.13,
        rootMargin: "0px 0px -50px 0px"
    }

);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   HERO PARALLAX
========================================================= */

const heroBackground = document.querySelector(".hero__background");

function heroParallax() {

    if (!heroBackground) return;

    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight * 1.2) {

        heroBackground.style.transform =
            `scale(1.03) translateY(${scrollY * 0.08}px)`;

    }

}

window.addEventListener("scroll", heroParallax);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");


if (window.matchMedia("(pointer: fine)").matches) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    document.addEventListener("mousemove", event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

    });


    function animateCursor() {

        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;

        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);

    }

    animateCursor();


    document
        .querySelectorAll("a, button, input, textarea")
        .forEach(element => {

            element.addEventListener("mouseenter", () => {

                cursorRing.classList.add("is-active");

            });

            element.addEventListener("mouseleave", () => {

                cursorRing.classList.remove("is-active");

            });

        });

}


/* =========================================================
   MAGNETIC BUTTON EFFECT
========================================================= */

if (window.matchMedia("(pointer: fine)").matches) {

    document.querySelectorAll(".magnetic").forEach(button => {

        button.addEventListener("mousemove", event => {

            const rect = button.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;


            button.style.transform =
                `translate(${x * 0.13}px, ${y * 0.13}px)`;

        });


        button.addEventListener("mouseleave", () => {

            button.style.transform =
                "translate(0px, 0px)";

        });

    });

}


/* =========================================================
   CONTACT FORM
========================================================= */

/*
   Neste momento é apenas um formulário visual.

   Para enviar mensagens de verdade podes ligar isto a:

   - PHP
   - Formspree
   - Netlify Forms
   - Brevo
   - Resend
   - API própria
*/

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");


if (contactForm) {

    contactForm.addEventListener("submit", event => {

        event.preventDefault();

        const submitButton =
            contactForm.querySelector(".submit-button span");


        submitButton.textContent = "A enviar...";


        setTimeout(() => {

            submitButton.textContent = "Enviar mensagem";

            formMessage.textContent =
                "Mensagem preparada. Configure o backend do formulário para ativar o envio.";

        }, 700);

    });

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("main section[id]");

const navigationLinks =
    document.querySelectorAll(".desktop-nav a");


function updateNavigation() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 200;

        if (window.scrollY >= sectionTop) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navigationLinks.forEach(link => {

        const target =
            link.getAttribute("href").replace("#", "");

        if (target === currentSection) {

            link.style.opacity = "1";

        } else {

            link.style.opacity = ".55";

        }

    });

}


window.addEventListener("scroll", updateNavigation);

updateNavigation();