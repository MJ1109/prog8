import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA Pregnant,Glucose,Bp,Skin,Insulin,bmi,Pedigree,Age,Label
//
const csvFile = "./data/stroke.csv" //data ingeladen
const trainingLabel = "stroke" //label van deze dataset heet stroke, deze kijkt of er een stroke is (1) of niet (0)
const ignoredColumns = ['id']  //wil ik negeren

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, { //inladen van de file
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => trainModel(results.data) // gebruik deze data om te trainen
    })
}


//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    
    // todo : splits data in traindata en testdata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    console.log(data);
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignoredColumns,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 1000, 800, decisionTree.toJSON())

    // todo : maak een prediction met een sample uit de testdata
    // DATA id,gender,age,hypertension,heart_disease,ever_married,work_type,Residence_type,avg_glucose_level,bmi,smoking_status,stroke
     let stroke = {
        id: "",
        gender:"",
        age:"",
        hypertension: "",
        heart_disease: "",
        ever_married: "",
        work_type: "",
        Residence_type: "",
        avg_glucose_level:"",
        bmi:"",
        smoking_status:""

        //stroke: "0"
    }

    // todo : bereken de accuracy met behulp van alle test data
    testStroke(testData, decisionTree)

}

function testStroke(testData, decisionTree){
    const patientWithoutLabel = Object.assign({}, testData)
    delete patientWithoutLabel.stroke

    let correctPredictions = 0;
    let totalPredictions = testData.length;

    let predictedAndActualDb = 0; 
    let predHealthyActualDb = 0;
    let actualHealthyPredDb = 0;
    let actualHealtyPredHealthy = 0;

    for (let i = 0; i < testData.length; i++) {
        let prediction = decisionTree.predict(patientWithoutLabel[i])
        console.log(`The prediction is: ${prediction}`)
        
        if (prediction == testData[i].stroke){
            correctPredictions++
            console.log('This prediction was correct!')
            
            if (testData[i].stroke == 1){
                console.log("predicted stroke & actual stroke")
                predictedAndActualDb++
                // document.getElementById("predAndFrDiabetes").innerHTML = `${predictedAndActualDb}`
            }

            if (testData[i].stroke == 0){
                console.log("predicted healty and actually healthy")
                actualHealtyPredHealthy++
                
            }

        }
        else {
            console.log('The prediction was incorrect :(')
            
            if(testData[i].stroke == 1){
                console.log("predicted no stroke, but had stroke")
                predHealthyActualDb++
                
            }

            if(testData[i].stroke == 0){
                console.log("predicted stroke, but had no stroke")
                actualHealthyPredDb
                
            }

        }
        console.log(predictedAndActualDb)
        console.log(actualHealtyPredHealthy)
        console.log(predHealthyActualDb)
        console.log(actualHealthyPredDb)
    }
    let accuracy = correctPredictions/totalPredictions *100;
    accuracy = Math.round(accuracy * 100)/100 //afronden op 2 getallen achter de komma
    console.log (`${accuracy}`)
    
    document.getElementById("accuracy").innerHTML = `Accuracy is ${accuracy}%`    
}

loadData()