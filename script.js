import sourdoughPieCalc from './helpers/pizza.js'


// scramble animation for welcome text
gsap.registerPlugin(ScrambleTextPlugin);

gsap.to('h1', {
  duration: 3,
  scrambleText: {
    text: "Hey I'm Josh, welcome to my website!", 
    chars: "rada",       
    speed: 0.5,
    preserveSpaces:true
  },
  repeat: -1,
  // repeatDelay: 3,
  yoyo: true,
  yoyoEase: "power1.in" 
});


const drawer = document.getElementById('calc-drawer');
const pizzaButton = document.getElementById('calc-btn');

// dimming and movement for modal
const dim = document.getElementById('dim')
function toggleDrawer() {
  drawer.classList.toggle('open')
  dim.classList.toggle('open')
  pizzaButton.classList.toggle('drawer-open')
}
pizzaButton.addEventListener('click', toggleDrawer)
dim.addEventListener('click', toggleDrawer)

// -/+ buttons for inputs
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach((input) => {
    input.addEventListener("command", (event) => {
        if (event.command === "--increment") {
        input.stepUp();
        } else if (event.command === "--decrement") {
        input.stepDown();
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
});



// real time calcuation
function animateNumber(el, to, { suffix = 'g', decimals = 0 } = {}) {
  gsap.to(el, {
    duration: 0.5,
    overwrite: true,
    scrambleText: {
      text: to.toFixed(decimals), // + suffix,
      chars: 'rada',     
      speed: 0.6
    }
  });
}

function calculate() {
  if (sizeRow.classList.contains('untouched') || Number.isNaN(document.getElementById('pie-quantity').valueAsNumber)) {
    document.querySelectorAll('#calc [id^="output-"]').forEach(el => el.textContent = 'NIL');
    return;
  };

  // inputs
  const pieQuantity = document.getElementById('pie-quantity').valueAsNumber;
  const pieSize = document.getElementById('pie-size').valueAsNumber;
  const pieHydration = document.getElementById('pie-hydration').valueAsNumber / 100;
  const pieSalt = document.getElementById('pie-salt').valueAsNumber / 100;
  const pieBF = document.getElementById('pie-bf').valueAsNumber / 100;
  const pieStarter = document.getElementById('pie-starter').valueAsNumber /100;
  const pieLS = document.getElementById('levain-ratio-s').valueAsNumber;
  const pieLF = document.getElementById('levain-ratio-f').valueAsNumber;
  const pieLW = document.getElementById('levain-ratio-w').valueAsNumber;

  // output
  const result = sourdoughPieCalc(pieQuantity, pieSize, pieHydration, pieSalt, pieBF, pieStarter, pieLS, pieLF, pieLW);
  console.log(result);

  animateNumber(document.querySelector('#output-calories'), result.calories, {suffix: ''});

  animateNumber(document.querySelector('#output-levain'), result.totalLevain);
  animateNumber(document.querySelector('#output-levain-starter'), result.starterAdded);
  animateNumber(document.querySelector('#output-levain-flour'), result.levainFlourAdded);
  animateNumber(document.querySelector('#output-levain-water'), result.levainWaterAdded);

  document.querySelector('#output-total-flour').innerHTML = result.pizzaFlourAdded + result.breadFlourAdded;
  document.querySelector('#output-pizza-flour').innerHTML = result.pizzaFlourAdded;
  document.querySelector('#output-bread-flour').innerHTML = result.breadFlourAdded;

  document.querySelector('#output-water').innerHTML = result.waterAdded;
  document.querySelector('#output-salt').innerHTML = result.saltAdded;
  document.querySelector('#output-total-weight').innerHTML = result.totalWeight;  

}

document.querySelectorAll('#calc-drawer input').forEach(el => el.addEventListener('input', calculate));

const sizeRow = document.querySelector('.row-size');
const slider  = document.getElementById('pie-size');
const sizeOut = document.getElementById('size-out');
const SIZE_NAMES = { 100: 'Dog', 220: 'S', 270: 'Med', 300: 'L' };
sizeRow.style.setProperty('--min', slider.min);
sizeRow.style.setProperty('--max', slider.max);

function updateSlider() {
  const v = slider.valueAsNumber;
  const PIZZA_MIN = 2, PIZZA_MAX = 3.5;   // rem; PIZZA_MAX must be <= --thumb (4rem)
  const frac = (v - slider.min) / (slider.max - slider.min);
  slider.style.setProperty('--frac', frac);
  slider.style.setProperty('--pizza', `${PIZZA_MIN + (PIZZA_MAX - PIZZA_MIN) * Math.sqrt(frac)}rem`);
  if (!sizeRow.classList.contains('untouched')) {
    sizeOut.value = `${v}g` + (SIZE_NAMES[v] ? ` (${SIZE_NAMES[v]})` : '');
  }
  
}

function unlockSize() {
  sizeRow.classList.remove('untouched');
  updateSlider();
  calculate();
}

slider.addEventListener('pointerdown', unlockSize, { once: true });
slider.addEventListener('keydown', unlockSize, { once: true });
slider.addEventListener('input', updateSlider);
updateSlider();

calculate();


toggleDrawer(); // temp