const video = document.getElementById("webcam");
const label = document.getElementById("label");
const birdLabelBtn = document.querySelector("#birdLabel");
const catLabelBtn = document.querySelector("#catLabel");
const trainbtn = document.querySelector("#train");

let classifier;
let mobilenet; 
let score = 0;

birdLabelBtn.addEventListener("click", () => (addBird()));
catLabelBtn.addEventListener("click", () => addCat());
trainbtn.addEventListener("click", () => train());

// turn on webcam
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

label.innerText = "Ready when you are!";

// Initialize the Image Classifier method with MobileNet
mobilenet = ml5.featureExtractor('MobileNet', modelLoaded);
classifier = mobilenet.classification(video, videoReady)

function modelLoaded()
{
    console.log('Model is loaded.');
    // classifier.load('./model.json', customModelReady)
    // classifier.classify(classifyingProcess)
}

function customModelReady()
{
    console.log("Custom model loaded")
}

function videoReady()
{
    console.log('Video is ready.')
}

function addBird()
{
    classifier.addImage(video, "birdy", addedImage);
}

function addCat()
{
    classifier.addImage(video, "el gato", addedImage);
}

function train(){
    console.log("start training...")
    classifier.train((lossValue) => {
        console.log(lossValue)
        if(lossValue == null){
            classifyingProcess()
        }
    })
}

function classifyingProcess(){
    setInterval(()=>{
        classifier.classify(video, (err, result)=>{
            if(err) console.log(err)
            console.log(result)
            label.innerHTML = result[0].label
        })
    }, 1000)
}

function addedImage(){
    console.log("added image to network")
}

// speak functionality
function speak(message) 
{
    let synth = window.speechSynthesis

    //make it speak!
    let utterThis = new SpeechSynthesisUtterance(message)
    synth.speak(utterThis) 
    
}

document.getElementById("correct").addEventListener('click',()=>{
    score++
    document.getElementById("score").innerHTML=`score = ${score}`

    speak("Tuurlijk heb ik het goed, ik weet alles.")
})

document.getElementById("incorrect").addEventListener('click',()=>{
    score--
    document.getElementById("score").innerHTML=`score = ${score}`
    speak("Uhh zelfs de beste mensen maken foutjes")
})

// save the model
document.getElementById("save").addEventListener('click',()=>{
    classifier.save();
    console.log("model saved")
    speak("Model opgeslagen voor in de toekomst baas!")
})