/* =========================================================
   HELPERS
========================================================= */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const hasFinePointer = window.matchMedia(
    "(pointer: fine)"
).matches;


/* =========================================================
   PRELOADER / PAGE READY
========================================================= */

const preloader = document.getElementById("preloader");

function markPageAsLoaded() {
    document.body.classList.add("loaded");
}

if (preloader) {

    window.addEventListener("load", () => {

        const delay = prefersReducedMotion ? 0 : 850;

        window.setTimeout(() => {

            preloader.classList.add("is-hidden");
            markPageAsLoaded();

        }, delay);

    });

} else {

    /* As páginas autónomas não têm preloader. */
    markPageAsLoaded();

}


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

    if (!header) return;

    if (window.scrollY > 40) {
        header.classList.add("is-scrolled");
    } else {
        header.classList.remove("is-scrolled");
    }

}

if (header) {

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();

}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

function setMenuState(isOpen) {

    if (!menuButton || !mobileMenu) return;

    mobileMenu.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
    );

    const lines = menuButton.querySelectorAll("span");

    if (lines.length >= 2) {

        if (isOpen) {

            lines[0].style.transform =
                "translateY(4px) rotate(45deg)";

            lines[1].style.transform =
                "translateY(-4px) rotate(-45deg)";

        } else {

            lines[0].style.transform = "";
            lines[1].style.transform = "";

        }

    }

}

function toggleMenu() {

    if (!mobileMenu) return;

    setMenuState(
        !mobileMenu.classList.contains("is-open")
    );

}

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", toggleMenu);

    mobileMenu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener("click", () => {
                setMenuState(false);
            });

        });

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            mobileMenu.classList.contains("is-open")
        ) {
            setMenuState(false);
        }

    });

}


/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length) {

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

    } else {

        const revealObserver = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

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

    }

}


/* =========================================================
   HERO PARALLAX
========================================================= */

const heroBackground =
    document.querySelector(".hero__background");

function heroParallax() {

    if (
        !heroBackground ||
        prefersReducedMotion
    ) return;

    const scrollY = window.scrollY;

    if (scrollY < window.innerHeight * 1.2) {

        heroBackground.style.transform =
            `scale(1.03) translateY(${scrollY * 0.08}px)`;

    }

}

if (heroBackground) {

    window.addEventListener(
        "scroll",
        heroParallax,
        { passive: true }
    );

    heroParallax();

}


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursorDot =
    document.querySelector(".cursor-dot");

const cursorRing =
    document.querySelector(".cursor-ring");

if (
    hasFinePointer &&
    cursorDot &&
    cursorRing &&
    !prefersReducedMotion
) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    document.addEventListener("mousemove", event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left =
            `${mouseX}px`;

        cursorDot.style.top =
            `${mouseY}px`;

    });


    function animateCursor() {

        ringX +=
            (mouseX - ringX) * 0.13;

        ringY +=
            (mouseY - ringY) * 0.13;

        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;

        requestAnimationFrame(
            animateCursor
        );

    }

    animateCursor();


    document
        .querySelectorAll(
            "a, button, input, textarea, select, label"
        )
        .forEach(element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursorRing.classList.add(
                        "is-active"
                    );

                }
            );

            element.addEventListener(
                "mouseleave",
                () => {

                    cursorRing.classList.remove(
                        "is-active"
                    );

                }
            );

        });

}


/* =========================================================
   MAGNETIC BUTTON EFFECT
========================================================= */

if (
    hasFinePointer &&
    !prefersReducedMotion
) {

    document
        .querySelectorAll(".magnetic")
        .forEach(button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;

                    button.style.transform =
                        `translate(
                            ${x * 0.13}px,
                            ${y * 0.13}px
                        )`;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "translate(0px, 0px)";

                }
            );

        });

}


/* =========================================================
   CONTACT FORM
========================================================= */

/*
   O formulário continua visual até existir um endpoint real.

   Pode depois ser ligado, por exemplo, a:

   - PHP
   - Formspree
   - Netlify Forms
   - Brevo
   - Resend
   - API própria
*/

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            const submitButton =
                contactForm.querySelector(
                    ".submit-button"
                );

            const submitButtonText =
                submitButton?.querySelector(
                    "span"
                );


            if (submitButton) {
                submitButton.disabled = true;
            }


            if (submitButtonText) {

                submitButtonText.textContent =
                    "A processar...";

            }


            if (formMessage) {
                formMessage.textContent = "";
            }


            window.setTimeout(() => {

                if (submitButtonText) {

                    submitButtonText.textContent =
                        "Enviar mensagem";

                }

                if (submitButton) {
                    submitButton.disabled = false;
                }


                if (formMessage) {

                    formMessage.textContent =
                        "O formulário está preparado visualmente, mas o envio ainda necessita de ligação a um serviço de e-mail ou backend.";

                }

            }, 500);

        }
    );

}


/* =========================================================
   SAME-PAGE NAVIGATION
========================================================= */

/*
   A versão anterior tratava qualquer href do menu
   como se fosse um ID da própria página.

   Agora existem páginas autónomas, pelo que só
   analisamos links que tenham realmente uma âncora #.
*/

const navigationLinks =
    document.querySelectorAll(
        ".desktop-nav a"
    );

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


function getHashFromHref(href) {

    if (
        !href ||
        !href.includes("#")
    ) {
        return "";
    }

    return href
        .split("#")
        .pop();

}


function updateNavigation() {

    if (
        !navigationLinks.length ||
        !sections.length
    ) return;


    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 200;

        if (
            window.scrollY >=
            sectionTop
        ) {

            currentSection =
                section.id;

        }

    });


    navigationLinks.forEach(link => {

        const href =
            link.getAttribute("href") || "";

        const target =
            getHashFromHref(href);


        /*
           Links para páginas autónomas ficam intactos.

           O aria-current="page" definido no HTML
           continua a identificar Perspetivas,
           Responsabilidade Social e Contactos.
        */

        if (!target) {

            link.style.opacity = "";

            return;

        }


        link.style.opacity =
            target === currentSection
                ? "1"
                : ".55";

    });

}


if (
    navigationLinks.length &&
    sections.length
) {

    window.addEventListener(
        "scroll",
        updateNavigation,
        { passive: true }
    );

    updateNavigation();

}