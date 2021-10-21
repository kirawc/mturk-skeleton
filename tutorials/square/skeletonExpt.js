// ---------------------------
//   SET UP
// ---------------------------
// CREATE DATA ARRAY - these are the column names for the data saved at the end
var thisData = {
  "subjID":[],
  "experimentName":[],
  "versionName":[],
  "trialNum":[],
  "trialStim":[],
  "keyPress":[],
  "RT":[],
}

// INITIALIZE GLOBAL VARIABLES
// subject id, a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// trial counters - this is defined before task starts so starts at 0
var trialNum = 0; // main
var pracNum = 0; // practice

// set how many trials total
var totalTrials = 10; // main
var totalPrac = 2; // practice

// start time variables (this will be used to calculate RTs, etc)
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// list out stimuli & locations
var stimList = ['c1.jpg', 'c2.jpg', 'c3.jpg', 'c4.jpg', 'c5.jpg', 'd1.jpg', 'd2.jpg', 'd3.jpg', 'd4.jpg', 'd5.jpg']
var locList = [[400, 100], [250, 250],[550, 250],[400, 400]];

// FUNCTION TO PRELOAD
function preloadStimuli(){
	// loads all stimuli into document under hidden div so there is no lag when calling them

	for (var stimNum=0; stimNum<stimList.length; stimNum++){
			var img = document.createElement("img");
			img.src = "stimuli/" + stimList[stimNum]; // look in "stimuli" folder for each item in imgList
			document.getElementById("preload").appendChild(img); // attach each img to hidden div
	}
}

// ---------------------------
//  STEPS OF THE EXPERIMENT
// ---------------------------
// 1. Ready page
$(document).ready(function(){

  $("#landingPage").show() // show welcome page
  preloadStimuli(); // loaded into *hidden* div, shouldn't see anything

  // make landing page button start showInstr() function
  $("#landingButton").click(function(){showInstr()}); // move to next step on click

})

// 2. Show instructions
function showInstr(){
  // hide landing page & it's objects
  $("#landingPage").hide();
  // show instructions div
  $("#taskInstr").show();
  // make Start Practice button start runPractice() function
  $("#practiceButton").click(function(){runPractice()})
}

// 3. Show practice trials
function runPractice(){

  // Write into the console where we are (for debugging)
  console.log("practice " + pracNum);

  // hide instructions + practice button
  $("#taskInstr").hide()
  // show main experiment
  $("#exptBox").show()

  // Pick practice stimuli
  pracStim = shuffle(["c1.jpg", "c2.jpg"])
  pracLoc = shuffle([[400, 100], [250, 250]])
  showStim(pracStim, pracLoc)
  detectKeyPress(0); // 0 indicate this is practice

}

// 4. Show main trials
function startTask(){

  // hide the practice trial stimuli & show end practice note
  $("#exptBox").hide();
  $("#endpracticePage").show()

  // automatically start real trials after 1 sec
  sleep(1000).then(() => {
    $("#endpracticePage").hide()
    $("#exptBox").show();
    runTrial()
  })

}

function runTrial(){
  // Write into the console where we are (for debugging)
  console.log("trial " + trialNum);

  // Show expt box but hide the actual images at the start
  $("#exptBox").show();

  // Set up trial
  [trialStim, trialLoc] = setTrialInfo();

  // Put stimuli in console so you know what was picked
  console.log(trialStim)
  console.log(trialLoc)

  // actually put up stimuli
  showStim(trialStim,trialLoc)

  // Wait for keypress until continue
  detectKeyPress(1) // 1 because this isn't practice

}

// 5. Save & finish (ignore this for now)
function endExpt(){

}


// ---------------------------
//  FUNCTIONS USED IN MAIN TRIAL LOOP
// ---------------------------
function setTrialInfo(){

  // pick what stimuli you want at each location
  randomizedList = shuffle(stimList);
  stimuli = [randomizedList[0], randomizedList[1]]

  // set where the stimuli should go
  randomizedLoc = shuffle(locList);
  locations = [randomizedLoc[0], randomizedLoc[1]];

  // return so that you can save it later in trial info
  return [stimuli, locations]

}

function showStim(currentStim, currentLoc){
  // currentStim is a list with each img you want to show
  stim1 = currentStim[0];
  stim2 = currentStim[1];

  // currentLoc is a list with where you want each img1
  loc1 = currentLoc[0];
  loc2 = currentLoc[1];

  // change source images for each image item
  $("#img1").attr("src","stimuli/" + stim1);
  $("#img2").attr("src","stimuli/" + stim2);

  // change locations for each image item
  document.getElementById("img1").style.left=(loc1[0]+"px");
  document.getElementById("img1").style.top=(loc1[1]+"px");
  document.getElementById("img2").style.left=(loc2[0]+"px");
  document.getElementById("img2").style.top=(loc2[1]+"px");

  // Get start of trial time, to calcuate RT
  startTrialTime = new Date;

  // Actually show the imgs!
  $("#img1").show()
  $("#img2").show()

}


function nextTrial(){

  $(document).unbind("keydown");
  endTrialTime = new Date;
  RT = endTrialTime - startTrialTime;

  saveTrialData(trialStim);

  if (trialNum < totalTrials-1){  //subtract 1 because count starts at 0
  // Go to next trial num & start over
  trialNum++; // increase trial num
  runTrial(); // rerun trial function
}
  else {
    $("#exptBox").hide()
    $("#endPage").show()
  }

}

function nextPractice(){

  $(document).unbind("keydown");
  endTrialTime = new Date;
  RT = endTrialTime - startTrialTime;

  if (pracNum < totalPrac-1){ //subtract 1 because count starts at 0
  // Go to next trial num & start over
  pracNum++; // increase trial num
  runPractice(); // rerun trial function
}
  else {
    startTask()
  }
}

function detectKeyPress(practiceOrNot){

		$(document).keydown(function(event){
      // if press c
       if (event.keyCode == 37){ //37 is js keycode for left arrow
				key = "left";
				console.log(key);
        if (practiceOrNot == 0) { nextPractice()}
        else if (practiceOrNot == 1) { nextTrial()}
			}

			else if (event.keyCode == 39){ //39 is js keycode for right arrow
				key = "right";
				console.log(key);

        $(document).unbind("keydown");

        if (practiceOrNot == 0) { nextPractice()}
        else if (practiceOrNot == 1) { nextTrial()}

			}
		});
};


// ---------------------------
//    SAVING // ignore this for now
// ---------------------------
function saveTrialData(trialStim){

}

function saveAllData(){

}

function sendToServer(){

}

// ---------------------------
//    OTHER USEFUL FUNCTIONS
// ---------------------------
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkArrayValuesInCommon(arr1, arr2){
	for (var i=0; i < arr1.length; i++){
		var overlap = arr2.includes(arr1[i]);
		if (overlap == true){
			break;
		}
	}
	return overlap
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
