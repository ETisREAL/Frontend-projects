// MODEL

const kits = ["hi-hat", "cymbal", "snare", "kick", "tom"];

const containerEl = document.querySelector(".container");
const sliderEl = document.querySelector(".slider");

let toggle = false;
let folder = "kit2/";


// VIEW

window.onload = render();


// CONSOLE 

sliderEl.addEventListener('click', () => {
    if (toggle === true) {
        containerEl.innerHTML= '';

        toggle = false;
        folder = "kit2/";

        render();
    } else {
        containerEl.innerHTML= '';

        toggle = true;
        folder = "kit1/";

        render();
    };
});


function render() {
    kits.forEach((kit) => {
        
        const btnEl = document.createElement("button");
        btnEl.classList.add("btn");
        btnEl.innerText = kit;
        btnEl.style.backgroundImage = "url(images/" + folder + kit + ".png)";
        containerEl.appendChild(btnEl);
    
        const soundEl = document.createElement("audio");
        soundEl.src = "sounds/" + folder + kit + ".mp3";
        containerEl.appendChild(soundEl);
        btnEl.addEventListener("click", () => {
            soundEl.play();
        });
    
        window.addEventListener("keydown", (event) => {
            if (event.key === kit.slice(0, 1)) {
                soundEl.play();
                btnEl.style.transform = "scale(.9)";
                setTimeout(() => {
                    btnEl.style.transform = "scale(1)";
                }, 10);
            }
        });
    });
};