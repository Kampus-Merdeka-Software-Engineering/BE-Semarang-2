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


const buttonSell = document.querySelector('.button-b-s-7-1');
const buttonBuy = document.querySelector('.button-b-s-7-2');

buttonSell.addEventListener('mouseover', () => {
    buttonSell.value = 'Start Selling';
    buttonSell.style.width = '200px';
    buttonSell.style.boxShadow = '-2px 2px 5px rgba(0, 0, 0, 0.8)';
    buttonSell.style.background = 'linear-gradient(90deg, #f9e9de 0, #e7c5ae 100%)';
});

buttonSell.addEventListener('mouseout', () => {
    buttonSell.value = 'Sell';
    buttonSell.style.width = '70px';
    buttonSell.style.boxShadow = 'none';
    buttonSell.style.background = '#f9e9de';
});

buttonBuy.addEventListener('mouseover', () => {
    buttonBuy.value = 'Start Buying';
    buttonBuy.style.width = '200px';
    buttonBuy.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.8)';
    buttonBuy.style.background = 'linear-gradient(270deg, #f9e9de 0, #e7c5ae 100%)';
});

buttonBuy.addEventListener('mouseout', () => {
    buttonBuy.value = 'Buy';
    buttonBuy.style.width = '70px';
    buttonBuy.style.boxShadow = 'none';
    buttonBuy.style.background = '#f9e9de';
});

  
const pop = document.querySelectorAll('.dampak-b-s-4-1, .dampak-b-s-4-2, .dampak-b-s-4-3, .dampak-b-s-4-4');

pop.forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
        element.style.transitionDuration = '0.3s';
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
        element.style.transitionDuration = '0.3s';
    });
});


const image1 = document.querySelector('.gambar-beranda-s-1-1');
const image2 = document.querySelector('.gambar-beranda-s-1-2');

let showImage1 = true;

function toggleImages() {
  if (showImage1) {
    image1.style.opacity = '1';
    image2.style.opacity = '0';
  } else {
    image1.style.opacity = '0';
    image2.style.opacity = '1';
  }

  showImage1 = !showImage1;
}

setInterval(toggleImages, 8000);

