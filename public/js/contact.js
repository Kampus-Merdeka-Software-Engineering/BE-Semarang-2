/* Define colors */
var colors = {
    validColorHex: "#00aaff",
    invalidColorHex: "#ff0000",
    defaultColorHex: "#333",
    validColorRGB: "rgb(255, 0, 0)",
    invalidColorRGB: "rgb(0, 170, 255)",
    defaultColorRGB: "rgb(51, 51, 51)",
};

/* Define variable */
const form = document.getElementById('formContact');
var formNewsLetter = document.getElementById('formNewsLetter');
const noHP = document.getElementById("noHp");

/* Define email validation emailPattern */
var emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* Function to set border color of email input */
function setBorderColorEmail() {
    const emailInput = document.getElementById("email");
    const borderColor = window.getComputedStyle(emailInput).borderColor;

    document.getElementById("btnSubmit").disabled = borderColor === colors.validColorRGB ? true : false;
}

/* Function to reset form inputs and text */
function resetInputContact() {
    const form = document.getElementById('formContact');
    const inputs = form.querySelectorAll('input[type=text], input[type=number], textarea');
    let text = document.getElementById('text');
    inputs.forEach(input => {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = ''
            inputs[i].style.borderColor = colors.defaultColorHex
        }
        text.innerHTML = ""
    });
}

/* Function to validate email input in form contact */
function handleEmailInputContact(event) {
    const value = event.target.value;
    const text = document.getElementById('text');

    /* email validation */
    if (value.length > 0) {
        if (value.match(emailPattern)) {
            event.target.classList.add("valid");
            event.target.classList.remove("invalid");
            text.innerHTML = "";
            event.target.style.borderColor = colors.validColorHex;
        } else {
            event.target.classList.remove("valid");
            event.target.classList.add("invalid");
            text.innerHTML = "Please Enter Valid Email";
            text.style.color = colors.invalidColorHex;
            event.target.style.borderColor = colors.invalidColorHex;
        }
    } else {
        event.target.classList.remove("valid");
        event.target.classList.remove("invalid");
        text.innerHTML = "";
        text.style.color = colors.validColorHex;
        event.target.style.borderColor = colors.defaultColorHex;
    }
}

/* Function to set border color input in form contact */
function setBorderColorInputChange(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        if (i === 2) {
            continue; /* Skip index 2 */
        }

        inputs[i].style.borderColor = inputs[i].value.length > 0 ? colors.validColorHex : colors.defaultColorHex;
    }
}

/* Function to update submit button in form contact */
function updateSubmitButton(input) {
    const computedStyle = getComputedStyle(input);
    const borderColor = computedStyle.getPropertyValue('border-color');
    const btnSubmit = document.getElementById("btnSubmit");

    const isValid = borderColor === colors.invalidColorRGB;

    if (isValid) {
        btnSubmit.removeAttribute("disabled");
    } else {
        btnSubmit.disabled = true;
    }
}

/* Function to get border-color `noHp` in form contact */
function checkBorderColorNoHp(noHp) {
    const computedStyleNoHpInput = getComputedStyle(noHp);
    const borderNoHp = computedStyleNoHpInput.getPropertyValue('border-color');

    return borderNoHp === colors.defaultColorRGB;
}

/* Function to disabled button send in form contact */
function disableSubmitButton() {
    document.getElementById("btnSubmit").setAttribute("disabled", "true");
}

/* Function to enable button send in form contact */
function enableSubmitButton() {
    document.getElementById("btnSubmit").removeAttribute("disabled");
}

/* Function to get value input in form contact */
function getFormContactValues() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const noHPValue = noHP.value;
    const message = document.getElementById("message").value;

    return { firstName, lastName, email, noHPValue, message };
}

/* Function to post data contact to server in form contact */
async function postDataContactToServer(data) {
    const url = '/postContact';
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create contact");
    }

    return response.json();
}

/* Function to handle while success fetch in form contact */
function handleSuccessContact() {
    // window.location.href = '/contact';
    window.location.href = 'kontak.html'; /* Navigate to the contact page */
}

/* Function to handle while error fetch in form contact */
function handleErrorContact() {
    resetInputContact();
    window.location.href = 'kontak.html';
}

/* Function to validate email input in form newsletter */
// function handleEmailInputNewsletter(event) {
//     const value = event.target.value;

//     /* email validation */
//     if (value.length > 0) {
//         /* Conditions for email input */
//         if (value.match(emailPattern)) {
//             formNewsLetter.classList.add("valid")
//             formNewsLetter.classList.remove("invalid")
//             formNewsLetter.style.borderColor = colors.validColorHex
//             document.getElementById("btnNewsLetter").removeAttribute("disabled");
//         } else {
//             formNewsLetter.classList.remove("valid")
//             formNewsLetter.classList.add("invalid")
//             formNewsLetter.style.borderColor = colors.invalidColorHex
//             document.getElementById("btnNewsLetter").setAttribute("disabled", "true");
//         }
//     } else {
//         formNewsLetter.classList.remove("valid")
//         formNewsLetter.classList.remove("invalid")
//         formNewsLetter.style.borderColor = colors.defaultColorHex
//         document.getElementById("btnNewsLetter").removeAttribute("disabled");
//     }
// }

/* Function to post data contact to server in form newsletter */
// async function postDataNewsletterToServer(email) {
//     // const url = '/newsLetter';
//     const url = 'http://httpbin.org/post';

//     const response = await fetch(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//     });

//     if (!response.ok) {
//         throw new Error("Failed to create NewsLetter");
//     }

//     return response.json();
// }

/* Function to handle while success fetch in form newsletter */
// function handleSuccessNewsletter() {
//     // window.location.href = '/contact';
//     window.location.href = 'kontak.html'; /* Navigate to the contact page */
// }

/* Function to handle while error fetch in form newsletter */
// function handleErrorNewsletter() {
//     const emailInput = document.getElementById('emailNewsLetter');
//     emailInput.value = '';
//     formNewsLetter.style.borderColor = colors.defaultColorHex;
//     window.location.href = 'kontak.html';
// }

/* `keydown` trigger for forms with id `formContact` */
form.addEventListener('keydown', () => {
    const emailInput = document.getElementById('email');
    const noHp = document.getElementById('noHp');
    const inputs = form.querySelectorAll('input[type=text], input[type=number], textarea');

    /* `input` trigger for forms with id `formContact` in email input */
    emailInput.addEventListener('input', handleEmailInputContact)

    /* Gives border-color to inputs that have value*/
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            setBorderColorInputChange(inputs)

            updateSubmitButton(input)

            setBorderColorEmail();
        });

        input.addEventListener('blur', () => {
            setBorderColorEmail();
        });
    });

    /* border-color check of the `noHp` input boxes to disable the button with id `btnSubmit` */
    if (checkBorderColorNoHp(noHp)) disableSubmitButton();
    else enableSubmitButton();
})

/* Submit a form with the id `formContact` for the process of saving new Contact data to the database */
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // const captchaResponse = grecaptcha.getResponse()
    // if (!captchaResponse.length > 0) {
    //     throw new Error("Captcha not complete")
    // }
    
    try {
        const formData = getFormContactValues();
        await postDataContactToServer(formData);
        handleSuccessContact();
    } catch (error) {
        handleErrorContact();
    }

    resetInputContact()
    window.location.href = 'kontak.html';
})

noHP.addEventListener('keydown', (event) => {
    const disallowedKeys = [69, 43, 101, 190];

    if (disallowedKeys.includes(event.keyCode)) {
        event.preventDefault();
    }
})

/* `keydown` trigger for forms with id `formNewsLetter` */
// formNewsLetter.addEventListener('keydown', () => {
//     const emailInput = document.getElementById('emailNewsLetter');

//     /* email validation */
//     emailInput.addEventListener('input', handleEmailInputNewsletter)
// })

/* Submit a form with the id `formNewsLetter` for the process of saving new NewsLetter data to the database */
// formNewsLetter.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const emailNewsLetter = document.getElementById('emailNewsLetter').value;

//     try {
//         await postDataNewsletterToServer(emailNewsLetter);
//         handleSuccessNewsletter();
//     } catch (error) {
//         handleErrorNewsletter();
//     }
    
// })

// function onSubmit(token) {}