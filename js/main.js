/* =========================================================
   HELPERS
========================================================= */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
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
   RESPONSABILIDADE SOCIAL — CARTÕES INTERATIVOS
========================================================= */

const socialCards = document.querySelectorAll(".social-card");
const touchLikePointer = window.matchMedia(
    "(hover: none), (pointer: coarse)"
);

function closeOtherSocialCards(activeCard) {
    socialCards.forEach(card => {
        if (card !== activeCard) {
            card.classList.remove("is-flipped");
            card.setAttribute("aria-pressed", "false");
        }
    });
}

socialCards.forEach(card => {

    const setFlipped = shouldFlip => {
        card.classList.toggle("is-flipped", shouldFlip);
        card.setAttribute(
            "aria-pressed",
            shouldFlip ? "true" : "false"
        );
    };

    card.addEventListener("click", () => {
        if (!touchLikePointer.matches) return;

        const nextState = !card.classList.contains("is-flipped");

        if (nextState) {
            closeOtherSocialCards(card);
        }

        setFlipped(nextState);
    });

    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            const nextState = !card.classList.contains("is-flipped");

            if (nextState) {
                closeOtherSocialCards(card);
            }

            setFlipped(nextState);
        }
    });

    card.addEventListener("blur", () => {
        if (!touchLikePointer.matches) {
            setFlipped(false);
        }
    });

});

if (socialCards.length) {

    document.addEventListener("click", event => {
        if (
            touchLikePointer.matches &&
            !event.target.closest(".social-card")
        ) {
            closeOtherSocialCards(null);
        }
    });

    const resetSocialCards = () => {
        socialCards.forEach(card => {
            card.classList.remove("is-flipped");
            card.setAttribute("aria-pressed", "false");
        });
    };

    if (typeof touchLikePointer.addEventListener === "function") {
        touchLikePointer.addEventListener("change", resetSocialCards);
    } else if (typeof touchLikePointer.addListener === "function") {
        touchLikePointer.addListener(resetSocialCards);
    }

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