// button display
const startbttn = document.getElementById('start');
const predictbttn = document.getElementById('predict');
const goodGuessbttn = document.getElementById('goodGuess');
const retrybttn = document.getElementById('retry');

startbttn.style.display = 'block';
predictbttn.style.display = 'none';
retrybttn.style.display = 'none';

document.getElementById('start').addEventListener('click', function () {
  // Controleren of button1 zichtbaar is
  if (startbttn.style.display === 'block') {
    // Button1 verbergen en button2 zichtbaar maken
    startbttn.style.display = 'none';
    predictbttn.style.display = 'block';
    retrybttn.style.display= 'block';
  }
});

// random letter img array
const letterImages = [
  { letter: "A", image: "letterA.png" },
  { letter: "B", image: "letterB.png" },
  { letter: "C", image: "letterC.png" },
  { letter: "D", image: "letterD.png" }
];

/*
/   generate random getal
*/
function getRandomLetter() {
  // Willekeurig indexnummer genereren
  const randomIndex = Math.floor(Math.random() * letterImages.length);

  // Willekeurige letter en showImg-object teruggeven
  return letterImages[randomIndex];
}

/*
/ koppel letter img aan het getal 
*/
function displayRandomLetterImage() {
  const letterContainer = document.getElementById("letter-container");

  // Willekeurige letter en showImg verkrijgen
  const randomLetterImage = getRandomLetter();

  // showImgselement maken en instellen
  const imageElement = document.createElement("img");
  imageElement.src = randomLetterImage.image;
  imageElement.alt = randomLetterImage.letter;
  imageElement.classList.add("letter-image");

  // add Letter and showImgselement to container
  letterContainer.innerHTML = ""; // Verwijder eventuele vorige inhoud
  letterContainer.appendChild(imageElement);
}

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) { // and class labels
    labelContainer.appendChild(document.createElement("classPrediction"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  window.requestAnimationFrame(loop);
}

/* 
/run the webcam image through the image model and guess the written letter
*/
async function predict() {

  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  const predictions = []; // save predictions in an array

  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2) + " ";
    predictions.push(classPrediction) // push predictions naar de array
    // labelContainer.childNodes[i].innerHTML = classPrediction; 
  }

  // Sorteer de gegevens van groot naar klein
  predictions.sort(function (a, b) {
    const probabilityA = parseFloat(a.split(":")[1]);
    const probabilityB = parseFloat(b.split(":")[1]);
    return probabilityB - probabilityA;
  });

  //  save prediction in variable
  const guess = predictions[0].split(":")[0].trim(); // haal de klassewaarde uit de voorspelling

  // add prediction to DOM
  const guessContainer = document.getElementById('guessContainer');
  guessContainer.innerHTML = guess;

  addImg(guess);
}

/*
/ display right img with the guesses 
*/
function addImg(guess){
  const imgContainer = document.getElementsByClassName('imgContainer')[0];
  const letterContainer = document.getElementById('letter-container');
  const imgElements = letterContainer.getElementsByTagName('img');

  if (imgElements.length > 0) {
    const src = imgElements[0].getAttribute('src');
    
    // fetch name of loaded img
    const imageName = src.substring(src.lastIndexOf('/') + 1);
    
    // retrieve the letter of the img (letterA.png -> A)
    wantedLetter = imageName.charAt(6);
  }

  //empty the container the imgs are in if they're there
  clearContainer(imgContainer);

  const showImg = document.createElement('img');
  if (guess === 'A' && wantedLetter == 'A') {
    showImg.src = 'img/monkey.jpeg';
    increaseScore();
  } else if (guess === 'B' && wantedLetter == 'B') {
    showImg.src = 'img/bear.jpg';
    increaseScore();
  } else if (guess === 'C' && wantedLetter == 'C') {
    showImg.src = 'img/citroen.jpeg';
    increaseScore();
  } else if (guess === 'D' && wantedLetter == 'D') {
    showImg.src = 'img/dolphin.jpeg';
    increaseScore();
  } else {
    showImg.src = 'img/again.png';
  }

// Voeg de nieuwe afbeelding toe aan de imgContainer
imgContainer.appendChild(showImg);
}

/*
/ clear container
*/
function clearContainer(container) {
  const imgElements = container.getElementsByTagName('img');
  while (imgElements.length > 0) {
    container.removeChild(imgElements[0]);
  }
}

/*
/Functie om het punt te verhogen en bij te werken op de pagina
*/
let score = 0;

function increaseScore() {
  score++;
  document.getElementById('score').innerText = score;
}

function retry(){
  const imgContainer = document.getElementsByClassName('imgContainer')[0];
  const letterContainer = document.getElementById('letter-container');

  // Clear the containers
  clearContainer(imgContainer);
  clearContainer(letterContainer);

  // add new random letter
  displayRandomLetterImage()

  console.log("retry button preeeessss");
}