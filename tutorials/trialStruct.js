//    SET UP
var imgList = ['c1.jpg', 'c2.jpg', 'c3.jpg', 'c4.jpg', 'c5.jpg', 'd1.jpg', 'd2.jpg', 'd3.jpg', 'd4.jpg', 'd5.jpg']

// INITIALIZES VARIABLES
trialNum = 0;
totalTrials = 10; // imgList.length()

// READY FUNCTION = SET UP PAGE
$(document).ready(function(){

  // When you click the start button, run startTask function
  $("#startButton").click(function(){startTask()})

});


//    TRIALS
function startTask(){

  // Hide start button
  $("#startButton").hide()

  // Run trials
  runTrial();

}

function runTrial(){

  trialNum++;

  // select stimulus for this trial
  selectedImgNum = Math.floor(Math.random()*10) // randomly selects integer
  selectedImg = imgList[selectedImgNum] // grabs img name at integer value
  console.log('trial: ' + trialNum + ' img: ' + selectedImg)

  // change image in html
  $("#stimImg").attr("src",selectedImg); // id for the img & change the source

  // if you haven't hit last trial, continue
  if (trialNum < totalTrials) {

    setTimeout(function(){
      runTrial()}, 1000);

    }

  else{ // if you have hit last trial, stop
    $("#stimImg").hide()
  }
}
