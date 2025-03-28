const tomatoArea = document.getElementById("tomato-area");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const timerDisplay = document.getElementById("timer-display");
const durationInput = document.getElementById("duration");
const incrementButton = document.getElementById("increment");
const decrementButton = document.getElementById("decrement");
const timeUnitSelect = document.getElementById("timeUnit");

let timeLeft = 30;
let isRunning = false;
let animationFrameId = null;
let fragmentAnimations = [];
let startTime = 0;
let pausedTimeRemaining = null;

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const hundredths = Math.floor((ms % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${hundredths
      .toString()
      .padStart(2, "0")}`;
  }
  return `${seconds}.${hundredths.toString().padStart(2, "0")}s`;
}

function updateDisplay() {
  const timeUnit = timeUnitSelect.value;
  const value = parseInt(durationInput.value) || 0;

  if (timeUnit === "minutes") {
    timerDisplay.textContent = `${value}m`;
  } else {
    timerDisplay.textContent = `${value}s`;
  }
}

function incrementTime() {
  const currentValue = parseInt(durationInput.value) || 0;
  const timeUnit = timeUnitSelect.value;
  const maxValue = timeUnit === "minutes" ? 5 : 300;

  if (currentValue < maxValue) {
    durationInput.value = currentValue + 1;
    updateDisplay();
  }
}

function decrementTime() {
  const currentValue = parseInt(durationInput.value) || 0;
  if (currentValue > 1) {
    durationInput.value = currentValue - 1;
    updateDisplay();
  }
}

function createFragments() {
  tomatoArea.innerHTML = "";
  const fragmentSize = 0.5; // Even smaller fragments
  const numFragments = 750; // Many more fragments for blizzard effect
  const radius = 12;

  // Calculate how many fragments we need for each feature
  const circleFragments = Math.floor(numFragments * 0.65);
  const mouthFragments = Math.floor(numFragments * 0.15);
  const eyeFragments = Math.floor(numFragments * 0.1);
  const hairFragments = Math.floor(numFragments * 0.1); // More fragments for hair

  // Create fragments in a more controlled way
  for (let i = 0; i < numFragments; i++) {
    const fragment = document.createElement("div");
    fragment.classList.add("fragment");

    // Calculate initial position in a circle
    const angle = (i / numFragments) * Math.PI * 2;
    const distanceFromCenter = radius + (Math.random() - 0.5) * 1.2;
    const xPos = Math.cos(angle) * distanceFromCenter;
    const yPos = Math.sin(angle) * distanceFromCenter;

    // Random starting positions in a wider circle with more chaos
    const startAngle = Math.random() * Math.PI * 2;
    const startDistance = 25 + Math.random() * 15; // Even wider starting area
    const randomX = Math.cos(startAngle) * startDistance + "rem";
    const randomY = Math.sin(startAngle) * startDistance + "rem";

    // More chaotic mid-point positions
    const midAngle = (startAngle + angle) / 2 + (Math.random() - 0.5) * Math.PI;
    const midDistance =
      (startDistance + distanceFromCenter) / 2 + (Math.random() - 0.5) * 8;
    const midX = Math.cos(midAngle) * midDistance + "rem";
    const midY = Math.sin(midAngle) * midDistance + "rem";

    // Final positions
    let finalX, finalY;

    // Determine if this fragment should be part of a feature
    if (i < hairFragments) {
      // Hair fragments - create a curlicue pattern
      const t = i / hairFragments;
      const curlRadius = 2; // Size of curl
      const spiralT = t * 4 * Math.PI; // Number of spiral turns
      const shrinkFactor = 1 - t * 0.5; // Spiral gets smaller towards the end
      const hairX = Math.cos(spiralT) * curlRadius * shrinkFactor;
      const hairY = Math.sin(spiralT) * curlRadius * shrinkFactor - radius - 1;
      finalX = hairX + "rem";
      finalY = hairY + "rem";
    } else if (i < hairFragments + eyeFragments) {
      // Eye fragments - slightly scattered
      const isLeftEye = i % 2 === 0;
      const eyeAngle = Math.random() * Math.PI * 2;
      const eyeRadius = 0.6 + (Math.random() - 0.5) * 0.2;
      if (isLeftEye) {
        finalX =
          Math.cos(eyeAngle) * eyeRadius -
          3 +
          (Math.random() - 0.5) * 0.3 +
          "rem";
        finalY =
          Math.sin(eyeAngle) * eyeRadius -
          2 +
          (Math.random() - 0.5) * 0.3 +
          "rem";
      } else {
        finalX =
          Math.cos(eyeAngle) * eyeRadius +
          3 +
          (Math.random() - 0.5) * 0.3 +
          "rem";
        finalY =
          Math.sin(eyeAngle) * eyeRadius -
          2 +
          (Math.random() - 0.5) * 0.3 +
          "rem";
      }
    } else if (i < hairFragments + eyeFragments + mouthFragments) {
      // Mouth fragments - with slight variation
      const t = (i - (hairFragments + eyeFragments)) / mouthFragments;
      const mouthWidth = 4;
      const mouthHeight = 1.5;
      const mouthX = (t * 2 - 1) * mouthWidth + (Math.random() - 0.5) * 0.3;
      const mouthY =
        Math.sin(Math.PI * t) * mouthHeight + 2.5 + (Math.random() - 0.5) * 0.2;
      finalX = mouthX + "rem";
      finalY = mouthY + "rem";
    } else {
      // Circle outline fragments - with frilly edges
      const circleAngle =
        ((i - (hairFragments + eyeFragments + mouthFragments)) /
          circleFragments) *
        Math.PI *
        2;
      const frillyRadius =
        radius + Math.sin(circleAngle * 12) * 0.4 + (Math.random() - 0.5) * 0.4;
      finalX = Math.cos(circleAngle) * frillyRadius + "rem";
      finalY = Math.sin(circleAngle) * frillyRadius + "rem";
    }

    // More chaotic rotations
    const randomRotation = Math.random() * 1800 - 900 + "deg"; // Even more rotation
    const midRotation = Math.random() * 900 - 450 + "deg";

    fragment.style.setProperty("--animation-time", timeLeft + "s");
    fragment.style.setProperty("--random-x", randomX);
    fragment.style.setProperty("--random-y", randomY);
    fragment.style.setProperty("--mid-x", midX);
    fragment.style.setProperty("--mid-y", midY);
    fragment.style.setProperty("--final-x", finalX);
    fragment.style.setProperty("--final-y", finalY);
    fragment.style.setProperty("--random-rotation", randomRotation);
    fragment.style.setProperty("--mid-rotation", midRotation);

    tomatoArea.appendChild(fragment);
  }
}

function animateFragments() {
  const fragments = document.querySelectorAll(".fragment");
  fragmentAnimations = [];

  // Calculate timing for perfect finish
  const totalDuration = timeLeft * 1000;
  const fragmentDelay = 5; // 5ms between each fragment start
  const lastFragmentStart = fragments.length * fragmentDelay;

  // Adjust animation duration to ensure all fragments finish exactly at timer end
  fragments.forEach((frag, i) => {
    const animation = setTimeout(() => {
      // Calculate remaining time for this specific fragment
      const remainingTime = totalDuration - i * fragmentDelay;
      const adjustedDuration = remainingTime / 1000;
      frag.style.animation = `moveToSmiley ${adjustedDuration}s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
    }, i * fragmentDelay);
    fragmentAnimations.push(animation);
  });
}

function startTimer() {
  if (isRunning) return;

  const newDuration = parseInt(durationInput.value);
  const timeUnit = timeUnitSelect.value;

  if (timeUnit === "minutes") {
    timeLeft = newDuration * 60;
  } else {
    timeLeft = newDuration;
  }

  if (timeLeft >= 1 && timeLeft <= 300) {
    isRunning = true;

    if (pausedTimeRemaining !== null) {
      startTime = Date.now() - (timeLeft * 1000 - pausedTimeRemaining);
      pausedTimeRemaining = null;
    } else {
      startTime = Date.now();
    }

    const smiley = document.getElementById("smiley");
    smiley.style.display = "none";

    createFragments();
    animateFragments();
    updateTimer();
  }
}

function updateTimer() {
  if (!isRunning) return;

  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  const remainingTime = Math.max(0, timeLeft * 1000 - elapsedTime);

  timerDisplay.textContent = formatTime(remainingTime);

  if (remainingTime <= 0) {
    isRunning = false;
    const fragments = document.querySelectorAll(".fragment");
    fragments.forEach((frag) => {
      const computedStyle = window.getComputedStyle(frag);
      frag.style.transform = computedStyle.transform;
    });

    const smiley = document.getElementById("smiley");
    smiley.style.display = "block";
    smiley.classList.add("smiley-show");
  } else {
    animationFrameId = requestAnimationFrame(updateTimer);
  }
}

function stopTimer() {
  if (!isRunning) return;

  isRunning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  pausedTimeRemaining = timeLeft * 1000 - elapsedTime;
}

function resetTimer() {
  isRunning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  pausedTimeRemaining = null;
  const smiley = document.getElementById("smiley");
  smiley.style.display = "none";
  smiley.classList.remove("smiley-show");

  const fragments = document.querySelectorAll(".fragment");
  fragments.forEach((frag) => frag.remove());

  updateDisplay();
}

// Event Listeners
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);
incrementButton.addEventListener("click", incrementTime);
decrementButton.addEventListener("click", decrementTime);
timeUnitSelect.addEventListener("change", updateDisplay);
durationInput.addEventListener("input", updateDisplay);

// Initialize display
updateDisplay();
