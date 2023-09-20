let navScroll = window.pageYOffset;

window.onscroll = function() {
    let currentNavScroll = window.pageYOffset;
    if (navScroll > currentNavScroll) {
        document.querySelector('.header').style.top = '0';
    } else {
        document.querySelector('.header').style.top = '-100px';
    }
    navScroll = currentNavScroll;
}
function myFunction() {
    var x = document.getElementById("navbarRight");
    if (x.className === "navbar-right") {
        x.className += " responsive";
    } else {
        x.className = "navbar-right";
    }
}

// const teamHover = document.querySelectorAll('.isi-t-s-3-1-1, .isi-t-s-3-1-2, .isi-t-s-3-1-3, .isi-t-s-3-1-4, .isi-t-s-3-1-5, .isi-t-s-3-1-6');

//     teamHover.forEach(teamMember => {
//         teamMember.addEventListener('mouseover', () => {
//             teamMember.style.transform = 'scale(1.1)';
//             teamMember.style.transition = '0.3s';
//         });

//         teamMember.addEventListener('mouseout', () => {
//             teamMember.style.transform = 'scale(1)';
//         });
//     });
