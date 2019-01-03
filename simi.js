
var gameCountries = [];
var backgroundMap = [];
var currCountry;
var svg;
var array;

//Game Init
window.onload=function() {

  // Get the Object by ID
  var svgDocument = document.getElementById("countries");
	var svgDocContent = svgDocument.contentDocument;
  // Get array of objects from SVG document
  array = svgDocContent.getElementsByClassName("country");

  initializePuzzle(array, false); //Load map background
  initializePuzzle(array, true); //Load draggable objects
  updateScore();

  var gameZone = document.getElementById("gameZone");
  gameZone.removeChild(svgDocument);

  makeCurrentGameObjectVisible();
  startTimer();
}

function reset() {
  document.getElementById("gameMap").innerHTML = "";
  gameCountries = [];
  backgroundMap = [];
  initializePuzzle(array, false); //Load map background
  initializePuzzle(array, true); //Load draggable objects
  updateScore();

  var gameZone = document.getElementById("gameZone");

  makeCurrentGameObjectVisible();

  updateHint();
  stopTimer();
  startTimer();
}

function makeCurrentGameObjectVisible() {
  currCountry = gameCountries[Math.floor(Math.random()*gameCountries.length)];
  currCountry.style.display ="block";
}

function deleteCurrentGameObject(selectedElement) {
  selectedElement.remove();
  var elementToDelete = gameCountries.indexOf(selectedElement);
  gameCountries.splice(elementToDelete, 1);
  if (gameCountries.length > 0) {
    makeCurrentGameObjectVisible();
  }
}

function checkIfPlacedRight(selectedElement) {
  var currentID = selectedElement.getAttribute('id');
  var mapElement = backgroundMap.filter(x => x.id === currentID);
  mapElement = getCurrentObjectFromCollection(mapElement);
  var pos1 = getCurrentPosition(selectedElement);
  var pos2 = getCurrentPosition(mapElement);
  if (getpositionDiference(pos1.x, pos2.x) < 10 && getpositionDiference(pos1.y, pos2.y) < 10) {
    mapElement.setAttribute("fill", "lime");
    deleteCurrentGameObject(selectedElement);
    updateScore();
    updateHint();
  } else {
    console.log("Netrafil si správne miesto na mape");
  }
}

function getpositionDiference(position1, position2) {
  if (position1 > position2) {
    return position1 - position2;
  } else {
    return position2 - position1;
  }
}

function initializePuzzle(originalSVG, isDragabble) {
  for (var i = 0; i < originalSVG.length; i++) {
    var clone = originalSVG[i].cloneNode(true);
    if (isDragabble === true) {
      clone.style.display="none";
      clone.setAttribute('d', setStartPath(clone));
      clone.setAttribute('cursor', "move");
      clone.setAttribute('class', "draggable");
      clone.setAttribute("fill", "grey");
      gameCountries.push(clone);
    } else {
      backgroundMap.push(clone);
    }
    document.getElementById("gameMap").appendChild(clone);
  }
}

function setStartPath(element) {
  var oldPath = element.getAttribute('d');
  var res = oldPath.split((/[\s,]+/), 3);
  oldPath = oldPath.replace(res[1], "400");
  oldPath = oldPath.replace(res[2], "180");
  return oldPath;
}

function makeDraggable(evt) {
  svg = evt.target;
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);
  var selectedElement = false;
  function startDrag(evt) {
  if (evt.target.classList.contains('draggable')) {
    selectedElement = evt.target;
    offset = getMousePosition(evt);
    var rect = selectedElement.getBoundingClientRect(); // get the bounding rectangle
    offset.x -= rect.left;
    offset.y -= (rect.height / 2);
  }
}
function drag(evt) {
if (selectedElement) {
  evt.preventDefault();
  var temp = getCurrentObject();
  temp.setAttribute('d', moveObject(evt, temp));
}
}
function endDrag(evt) {
  if (selectedElement) {
    checkIfPlacedRight(selectedElement);
  }
  selectedElement = null;
}
}

function getCurrentObject() {
  var temp = $(".draggable:visible");
  return temp[0];
}

function getCurrentObjectFromCollection(collection) {
  return collection[0];
}

function getCurrentPosition(svgElement, elementPath) {
  var position = [];
  var res = elementPath.split((/[\s,]+/), 3);
  position.x = res[1];
  position.y = res[2];
  return position;
}

function getCurrentPosition(svgElement) {
  var position = [];
  var elementPath = svgElement.getAttribute('d');
  var res = elementPath.split((/[\s,]+/), 3);
  position.x = res[1];
  position.y = res[2];
  return position;
}

function moveObject(event, element) {
  var oldPath = element.getAttribute('d');
  var position = getCurrentPosition(element, oldPath);
  var coord = getMousePosition(event);
  oldPath = oldPath.replace(position.x, coord.x);
  oldPath = oldPath.replace(position.y, coord.y);
  return oldPath;
}

function getMousePosition(evt) {
  var CTM = svg.getScreenCTM();
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d
  };
}

function updateScore() {
  var total = backgroundMap.length;
  var current = total - gameCountries.length;
  document.getElementById("score").innerHTML = current +"/"+total;
  if (current == total) {
    document.getElementById("score").innerHTML += " HOTOVO!!!";
    stopTimer();
  }
}

function getHint() {
  var isChecked = document.getElementById('hint-checkbox');
  var hint = document.getElementById("game-hint");
  if (isChecked.checked == true){
    hint.style.display = "block";
    hint.innerHTML = currCountry.getAttribute("title");
  } else {
     hint.style.display = "none";
  }
}

function updateHint() {
  var isChecked = document.getElementById('hint-checkbox');
  var hint = document.getElementById("game-hint");
  if (isChecked.checked == true){
    hint.style.display = "none";
    hint.style.display = "block";
    hint.innerHTML = currCountry.getAttribute("title");
  }
}

function switchBorders() {
  var isChecked = document.getElementById('borders-checkbox');
  var gameMap = document.getElementById("gameMap");
  if (isChecked.checked == true){
    gameMap.style.stroke = "black";
  } else {
     gameMap.style.stroke = "none";
  }
}

var w = null; // initialize variable
// function to start the timer
function startTimer()
{
   // First check whether Web Workers are supported
   if (typeof(Worker)!=="undefined"){
      // Check whether Web Worker has been created. If not, create a new Web Worker based on the Javascript file simple-timer.js
      if (w==null){
         w = new Worker("simple-timer.js");
      }
      // Update timer div with output from Web Worker
      w.onmessage = function (event) {
         document.getElementById("timer").innerHTML = event.data;
      };
   } else {
      // Web workers are not supported by your browser
      document.getElementById("timer").innerHTML = "Sorry, your browser does not support Web Workers ...";
   }
}
// function to stop the timer
function stopTimer()
{
  if (w) {
    w.terminate();
    timerStart = true;
    w = null;
  }
}
