/* HEADER */
let navScroll = window.pageYOffset;
let screenWidth = window.innerWidth;

window.onscroll = function() {
    let currentNavScroll = window.pageYOffset;
    screenWidth = window.innerWidth;
    if (navScroll > currentNavScroll) {
        document.querySelector('.header').style.top = '0';
    } else {
        document.querySelector('.header').style.top = '-260px';
    }
    navScroll = currentNavScroll;
}

const navLink = document.getElementById("toggleButton");

navLink.addEventListener("click", () => {
    let responsiv = document.getElementById("navbarRight");
    if (responsiv.className === "navbar-right") {
        responsiv.className += " responsive";
    } else {
        responsiv.className = "navbar-right";
    }
});

/* FOOTER */
/* Define colors */
var colors = {
    validColorHex: "#00aaff",
    invalidColorHex: "#ff0000",
    defaultColorHex: "#333",
};

/* Define variable */
var formNewsLetter = document.getElementById('formNewsLetter');

/* Define email validation emailPattern */
var emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* Function to validate email input in form newsletter */
function handleEmailInputNewsletter(event) {
    const value = event.target.value;

    /* email validation */
    if (value.length > 0) {
        /* Conditions for email input */
        if (value.match(emailPattern)) {
            formNewsLetter.classList.add("valid")
            formNewsLetter.classList.remove("invalid")
            formNewsLetter.style.borderColor = colors.validColorHex
            document.getElementById("btnNewsLetter").removeAttribute("disabled");
        } else {
            formNewsLetter.classList.remove("valid")
            formNewsLetter.classList.add("invalid")
            formNewsLetter.style.borderColor = colors.invalidColorHex
            document.getElementById("btnNewsLetter").setAttribute("disabled", "true");
        }
    } else {
        formNewsLetter.classList.remove("valid")
        formNewsLetter.classList.remove("invalid")
        formNewsLetter.style.borderColor = colors.defaultColorHex
        document.getElementById("btnNewsLetter").removeAttribute("disabled");
    }
}

/* Function to post data contact to server in form newsletter */
async function postDataNewsletterToServer(email) {
    // const url = '/newsLetter';
    const url = 'http://httpbin.org/post';

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Failed to create NewsLetter");
    }

    return response.json();
}

/* Function to handle while success fetch in form newsletter */
function handleSuccessNewsletter() {
    // window.location.href = '/contact';
    window.location.href = 'kontak.html'; /* Navigate to the contact page */
}

/* Function to handle while error fetch in form newsletter */
function handleErrorNewsletter() {
    const emailInput = document.getElementById('emailNewsLetter');
    emailInput.value = '';
    formNewsLetter.style.borderColor = colors.defaultColorHex;
    window.location.href = 'kontak.html';
}

/* `keydown` trigger for forms with id `formNewsLetter` */
formNewsLetter.addEventListener('keydown', () => {
    const emailInput = document.getElementById('emailNewsLetter');

    /* email validation */
    emailInput.addEventListener('input', handleEmailInputNewsletter)
})

/* Submit a form with the id `formNewsLetter` for the process of saving new NewsLetter data to the database */
formNewsLetter.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailNewsLetter = document.getElementById('emailNewsLetter').value;

    try {
        await postDataNewsletterToServer(emailNewsLetter);
        handleSuccessNewsletter();
    } catch (error) {
        handleErrorNewsletter();
    }
    
})

// function onSubmit(token) {}