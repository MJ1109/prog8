const video = document.getElementById("webcam");
const label = document.getElementById("label");

let classifier;
let mobilenet; 
let score = 0;

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
    classifier.load('./model.json', customModelReady)
    classifier.classify(classifyingProcess)
}

function customModelReady()
{
    console.log("Custom model loaded")
}

function videoReady()
{
    console.log('Video is ready.')
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
