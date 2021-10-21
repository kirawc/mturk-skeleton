// ---------------------------
//    SETTING UP
// ---------------------------

// Data structure (how the data will be saved)
var thisData = {
	"subjID":[],
	"experimentName":[],
	"versionName":[],
	"startDate":[],
	"startTime":[],
	"trialNum":[],
	"keyPress":[],
};

// Subject info
var subjID = randomIntFromInterval(100000, 999999);
var exptName = "SkeletonExample"

// Task structure (stimuli, condition ns, etc)
var visStim = {"cats":["c1","c2", "c3", "c4", "c5"], "dogs":["d1", "d2", "d3", "d4", "d5"]}
var totalTrials = 10;
var stimTime = 1000;

// Initialize time
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// Initialize variables
var trialNum = 1;
var currTrial = 0;
var endExpTime, startExpTime, cond;
var keyDict = {"c": "left", "m": "right", "none": "none"}

// Ready function -- how it loads up at start
$(document).ready(function(){

  $("#landingButton").click(function(){showInstr()})

});

// ---------------------------
//    SHOW INSTRUCTIONS + TEST AUDIO
// ---------------------------

// Show start instructions
function showInstr(){

  $("#landingPage").hide();
  $("#exptBox").hide();
  $("#taskExpl").show();
  $("#startButton").click(function(){startTask()})

}

// ---------------------------
//    TASK ITSELF
// ---------------------------

// Hide instructions & then run trials
function startTask(){

  // set up to start expt
  $(".instructions").hide();
  $(".exptButtons").hide();
  $("#exptBox").show();

  runTrial()

}

// Run through nTrials trials
function runTrial(){

	// select random stimuli for this trial (one from each category)
	var categories = shuffle(Object.keys(visStim)); //

	opt1_cat = shuffle(visStim[categories[0]]); // shuffles stim from category #1
	opt2_cat = shuffle(visStim[categories[1]]); // shuffles stim from category #2
	trialStim = [opt1_cat[0], opt2_cat[0]]; // take new 1st stim in shuffled stim lists

	// writes to console what trial & stimuli selected; helpful for debugging
	console.log(trialNum);
	console.log(trialStim);

	// calls the function with the selected stimuli
  showStim(trialStim);

	// continue looping through trials until the last trial
	if (trialNum < totalTrials){

		// wait until keypress to progress to next trial
		$(document).keypress(function(){
			trialNum++;
			$(document).unbind("keypress");
			runTrial();
		})
	}

	else {
		endExpt()
	}

  }

// Actual stimuli
function showStim(trialStim){

  // Change prompt audio + options to selected images for this trial
	$("#opt1Img").attr("src","stimuli/" + trialStim[0] + ".jpg");
  $("#opt2Img").attr("src","stimuli/" + trialStim[1] + ".jpg");

  // Show everything
  $("#promptBox").show();
  $("#option1Box").show();
  $("#option2Box").show();
  $("#opt1Img").show();
  $("#opt2Img").show();

	// Listen for keypress
	detectKeyPress();
}

// Collect response
function detectKeyPress(){

	// add event listener for keypress
	$(document).bind("keypress", function(event){
		if (event.which == 99){ //99 is js keycode for c
			key = "c";
			console.log(key);
		}
		else if (event.which == 109){ //109 is js keycode for m
			key = "m";
			console.log(key);
		}
	});
}

// ---------------------------
//    FINISH UP + SAVE + SEND TO SERVER
// ---------------------------
// Show end instructions
function endExpt(){

  $("#exptBox").hide();
  $(".expt").hide();
  $("#endPage").show();

}

// Add in specific save functions after this point

// ---------------------------
//    USEFUL FUNCTIONS
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
