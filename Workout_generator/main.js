
// MODEL  

const intro = introJs()

intro.setOptions({
    steps: [
        {
            intro: 'It\'s time to workout. Let\'s go!'
        },
        {
            element: '#step-one',
            intro: 'Select a mode (P.S. You can change it later)'
        },
        {
            element: '#step-two',
            intro: 'Click on a muscle group'
        },
        {
            element: '#step-three',
            intro: 'Adjust the difficulty'
        }
    ]
})

const rememberUser = () => {
    localStorage.setItem('hasVisited', 'user')
}

const showIntro = () => {
    const hasVisited = localStorage.getItem('hasVisited')
    
    hasVisited ? null : intro.start()
}


const modeTitle = document.getElementById('mode-title')
const modeContainer = document.getElementById('mode-container')
const screenContainer = document.getElementById('screen-container')

const cardDiv = document.querySelector('.card-div')
const sliderEl = document.querySelector(".slider")

const slider = document.querySelector(".level-slider")
let toggled = false;

let exercisesListDiv = document.querySelector('.exercises-list-div')

const Mode = document.getElementsByClassName("mode")
const modeInner = document.querySelectorAll('.mode-inner')
const modeLines = document.querySelectorAll('.mode-line')


const levelDiv = document.querySelector('.level-div')


const anterior = {
   chest: ['Bench Press', 'Incline Press', 'Flies', 'Pushups'],
   shoulders: ['Military Press', 'Lateral Laises', 'Front Raises'],
   biceps: ['Barbell Curl', 'Waiter Curl', 'Spider Curl'],
   forearms: ['Forearm Flexions', 'Forearm Extension', 'Kettellbell Carry'],
   abs: ['Crunch', 'Reverse Crunch', 'Starfish Getup', 'Mountain Climbers'],
   quads: ['Front Squat', 'Deadlift', 'VSit Extensions', 'Platz Squat'],
   adductors: ['Elevated Adductors', 'Lateral Lunges'],
}

const posterior = {
   traps: ['Shrugs', 'Prone Elevations', 'Overhead Press'],
   romboids: ['Cable Pulley', 'Reverse Flies', 'Barbell Row'],
   triceps: ['Kickbacks', 'Overhead Extensions', 'Strict Press', 'Diamond Pushups'],
   lats: ['Pullups', 'Lat Pulldown', 'Chin Ups', 'Dumbell Pullover'],
   glutes: ['Backsquat', 'Front Lunges', 'Cable Extensions', 'Abductions'],
   hamstrings: ['Romanian Deadlift', 'Bridge Slides'],
   calves: ['Calf Raises', 'Chicken Walk'],
}

const rest = {
   veryShort: 2,
   short: 2.30,
   medium: 3,
   long: 5
}


let exerciseCard = {
   exerciseMode: null,
   exerciseName: null,
   structure: {
      sets: 0,
      reps: 0,
      rest: 0,
   }
}

let finalExerciseCard = {}


function randomRange(min, max) {
   return Math.floor(Math.random() * (max-min) + min)
}


let sliderValue = '3'

slider.addEventListener('mouseup', function() {
    sliderValue = this.value
    selectDifficulty(this.value)
})


let cardCount = 1
let cardId = 1

// VIEW 

document.onload = showIntro()
document.onload = rememberUser()

/* for( var i = 0; i < Mode.length; i++ ){
   (function(){
      Mode[i].addEventListener('click', function() {
         
         $(Mode).removeClass('is-active');
         this.classList.toggle('is-active');

         console.log(this)
      })
   })(i)
} */


modeInner.forEach(mode => {
    mode.addEventListener('mousedown', ()=>{
        mode.style.opacity = '.9';
    })
    mode.addEventListener('mouseup', ()=>{
        mode.style.opacity = '1';
    })
    mode.addEventListener('mouseover', ()=>{
        mode.style.opacity = '.95'
        mode.firstElementChild.nextElementSibling.nextElementSibling.style.opacity = '.8'
    })
    mode.addEventListener('mouseout', ()=>{
        mode.style.opacity = '1'
        mode.firstElementChild.nextElementSibling.nextElementSibling.style.opacity = '.6'
    })
});


function selectModeVisually(target, targetParent) {
    modeLines.forEach(line => {
        line.classList.remove('is-active')
        line.nextElementSibling.style.color = 'var(--mode-color)'
    });

    targetParent.className === 'mode' ? 
    (target.firstElementChild.classList.toggle('is-active'),
    target.firstElementChild.nextElementSibling.style.color = 'var(--active-mode-color)') 
    :
    (targetParent.firstElementChild.classList.toggle('is-active'),
    targetParent.firstElementChild.nextElementSibling.style.color = 'var(--active-mode-color)') 

}


sliderEl.addEventListener('click', () => {

    toggled ? (
        document.querySelector('.card-front').style.paddingLeft = '0',
        toggled = false
    ) : (
        setTimeout(() => {
            document.querySelector('.card-front').style.paddingLeft = '30vw'
        }, 500), 
        toggled = true
    )

    cardDiv.classList.toggle('is-flipped');

})


function elementFromHtml(html) {
   const template = document.createElement('template')

   template.innerHTML = html.trim()

   return template.content.firstElementChild
}


function templateRender() {

    if (exerciseCard.exerciseName !== null && exerciseCard.exerciseMode !== null) {
   
    const template = elementFromHtml(`
    <div class="final-card">
        <div class="final-card-inner">
            <div class="final-card-line" style="background-color: var(--${exerciseCard.exerciseMode});
            box-shadow: 0 0 .6rem var(--${exerciseCard.exerciseMode});">
            </div>
            <a onclick="deleteCard(this)" class="delete-final-card-btn">
                <i class="bi bi-x-circle-fill btn-icon"></i>
            </a>
            <article class="data">
            <p class="p-difficulty" id="${cardId}"></p>
            <p id="p-exercise-name">${exerciseCard.exerciseName}</p>
            <ul id="ul-finalcard">
                <li id="li-finalcard">Sets: ${finalExerciseCard.sets}</li>
                <li id="li-finalcard">Reps: ${finalExerciseCard.reps}</li>
                <li id="li-finalcard">Rest: ${finalExerciseCard.rest}</li>
            </ul>
            </article>
        </div>
    </div> 
    `)

    exercisesListDiv.appendChild(template)
    }
}


function waitTemplateRender() {

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(renderLevel())
        }, 1)
    })
}

function renderLevel() {
    difficultyP = document.getElementById(`${cardId}`)
    
    let i = 0;
    
    while ( i < parseInt(sliderValue)) {
        difficultyP.innerHTML += `<i class="bi bi-fire"></i>`
        i++
    }
}

function updateCardCount() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(cardCount++, cardId++)
        }, 1)
    })
}

async function renderFinalcard() {
    cardCount > 8 ? 
    showAlertBox() 
    : 
    (
    templateRender(),
    await waitTemplateRender(),
    await updateCardCount()
    )
}


function deleteCard(buttonClicked) {
    buttonClicked.parentElement.parentElement.style.display = 'none'
}


function showAlertBox() {
    document.querySelector('.alert-box').style.display = 'grid'
    document.querySelector('.alert-box').focus()
    document.querySelector('.alert-box').scrollIntoView()
}

function deleteBox(buttonClicked) {
    buttonClicked.parentElement.style.display = 'none'
    cardCount--
}
 

//CONTROL

function clickRecognizer(event) {
    results = [
        event.target.id, 
        event.target.parentElement.id, 
        event.target.className,
        event.target.parentElement.className, 
        event.target,
        event.target.parentElement,
    ] 
     
    if (results[2] === 'mode-inner' || results[3] === 'mode-inner') {
        workoutMode(results[0], results[1])
        selectModeVisually(results[4], results[5])
    } else if (results[1] === 'front-map' || results[1] === 'back-map') {
       selectRandomExercise(results[1], results[0])
    }
}


function workoutMode(mode, parentMode) {

    if (mode === 'strenght' || parentMode === 'strenght') {
       exerciseCard.exerciseMode = 'Strenght'
       exerciseCard.structure.sets = (randomRange(4,6)), 
       exerciseCard.structure.reps = (randomRange(4,7)),
       exerciseCard.structure.rest = rest.long 
    } else if (mode === 'hypertrophy' || parentMode === 'hypertrophy') {
       exerciseCard.exerciseMode = 'Hypertrophy'
       exerciseCard.structure.sets = (randomRange(3,5)), 
       exerciseCard.structure.reps = (randomRange(8,13)),
       exerciseCard.structure.rest = rest.medium 
    } else if (mode === 'resistance' || parentMode === 'resistance') {
       exerciseCard.exerciseMode = 'Resistance'
       exerciseCard.structure.sets = (randomRange(4,6)), 
       exerciseCard.structure.reps = (randomRange(12,16)),
       exerciseCard.structure.rest = rest.short 
    } 
}


function selectRandomExercise(Map, Area) {
    if (Map === 'front-map') {
        const listLenght = anterior[Area].length;
        const exercisesList = anterior[Area];
        i = Math.floor(Math.random() * listLenght);
        exerciseCard.exerciseName = (exercisesList[i]);
  
        selectDifficulty(sliderValue);

    } else if (Map === 'back-map') {
        const listLenght = posterior[Area].length;
        const exercisesList = posterior[Area];
        i = Math.floor(Math.random() * listLenght);
        exerciseCard.exerciseName = (exercisesList[i]);
  
        selectDifficulty(sliderValue);
    }
}


/* for ( let i = 0; i < AreaNodes.length; i++ ){
   (function(){
      AreaNodes[i].onclick = function(){
         
         if (this.parentElement.id == 'front-map') {
            const listLenght = anterior[this.id].length;
            const exercisesList = anterior[this.id];
            i = Math.floor(Math.random() * listLenght);
            exerciseCard.exerciseName = (exercisesList[i]);
         } else {
            const listLenght = posterior[this.id].length;
            const exercisesList = posterior[this.id];
            i = Math.floor(Math.random() * listLenght);
            exerciseCard.exerciseName = (exercisesList[i]);
         }
      };
   })(i)
} */


function selectDifficulty(sliderValue) {

    if (sliderValue === '1') {
        finalExerciseCard.sets = exerciseCard.structure.sets -1, 
        finalExerciseCard.reps = exerciseCard.structure.reps -2,
        finalExerciseCard.rest = rest.long
    } else if (sliderValue === '2') {
        finalExerciseCard.sets = exerciseCard.structure.sets, 
        finalExerciseCard.reps = exerciseCard.structure.reps,
        finalExerciseCard.rest = rest.medium
    } else if (sliderValue === '3') {
        finalExerciseCard.sets = exerciseCard.structure.sets, 
        finalExerciseCard.reps = (exerciseCard.structure.reps + 1),
        finalExerciseCard.rest = exerciseCard.structure.rest
    } else if (sliderValue === '4') {
        finalExerciseCard.sets = (exerciseCard.structure.sets + 1), 
        finalExerciseCard.reps = (exerciseCard.structure.reps + 2),
        finalExerciseCard.rest = rest.short
    } else if (sliderValue === '5') {
        finalExerciseCard.sets = (exerciseCard.structure.sets + 2), 
        finalExerciseCard.reps = (exerciseCard.structure.reps + 2),
        finalExerciseCard.rest = rest.veryShort
    }
  
    renderFinalcard();
}