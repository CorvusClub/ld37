var screen = document.querySelector("#screen");
var initScreen = screen.innerHTML;

var cursor = document.createElement("span");
cursor.className = "cursor";
screen.appendChild(cursor);

var scene = document.querySelector("a-scene");
var htmlRenderBehavior;
scene.addEventListener("loaded", function() {
  htmlRenderBehavior = scene.behaviors.find(function(behavior) {
    return behavior.__render
  });
})
function renderScreen() {
  if(htmlRenderBehavior) {
    htmlRenderBehavior.__render();
  }
}

var fs = { "sef" : "sef ha duk kov" };

var camera = document.querySelector("a-camera");

var currentInput = [];

function writeCharacter(char, type) {
  var character = document.createElement("span");
  character.className = "symbol " + char;
  if(type != undefined)
  {
    character.classList.add(type);
  }
  screen.appendChild(character);
  screen.scrollTop = screen.scrollHeight;
}

function renderInput() {
  screen.innerHTML = initScreen;
  var character;
  for(var i=0;i<currentInput.length;i++)
  {
    character = document.createElement("span");
    character.className = "symbol " + currentInput[i];
    screen.appendChild(character);
  }
  screen.appendChild(cursor);
  renderScreen();
  screen.scrollTop = screen.scrollHeight;
}

function writeInput(char) {
  currentInput.push(char);
  renderInput();
}

function deleteLastInput(char) {
  currentInput.pop();
  renderInput();
}

function newLine() {
  screen.appendChild(document.createElement("br"));
}


function error() {
  for(var i=0;i<currentInput.length;i++)
  {
    writeCharacter(currentInput[i], "command");
  }
  writeCharacter("ju", "error");
  writeCharacter("zaaz", "error");
  newLine();
  writeCharacter("sig");
  writeCharacter("ha", "command");
  writeCharacter("sig", "command");
}

function help() {
  for(var i=0;i<currentInput.length;i++)
  {
    writeCharacter(currentInput[i], "command");
  }
  writeCharacter("zaaz", "success");
  newLine();
  screen.innerHTML += "- "
  writeCharacter("ha", "command");
  writeCharacter("sig", "command");
  newLine();
  screen.innerHTML += "- "
  writeCharacter("ha", "command");
  writeCharacter("kov", "command");
  newLine();
  screen.innerHTML += "- "
  writeCharacter("sef", "command");
  writeCharacter("uln", "file");
}

function ls() {
  
  for(var name in fs)
  {
    for(var i=0;i<currentInput.length;i++)
    {
      writeCharacter(currentInput[i], "command");
    }
    writeCharacter("zaaz", "success");
    newLine();
    screen.innerHTML += "- "
    name = name.split(" ");
    for(var i in name)
    {
      writeCharacter(name[i], "file");
    }
  }
}

var commands = {
  "^ha sig$": help,
  "^ha kov$": ls,
};


function parseInput() {
  screen.removeChild(cursor);
  newLine();
  var inputString = currentInput.join(" ");
  var matched = false;
  for(var regex in commands) {
    var match = inputString.match(regex);
    if(match) {
      commands[regex]();
      matched = true;
      break;
    }
  }
  if(!matched) {
    error();
  }
  newLine();
  screen.innerHTML += ">";
  initScreen = screen.innerHTML;
  currentInput = [];
  renderInput();
}

document.body.addEventListener("keypress", function(event) {
  if(event.code === "Numpad0") {
    writeInput("duk");
  }
  if(event.code === "Numpad1") {
    writeInput("ha");
  }
  if(event.code === "Numpad2") {
    writeInput("ju");
  }
  if(event.code === "Numpad3") {
    writeInput("kov");
  }
  if(event.code === "Numpad4") {
    writeInput("miln");
  }
  if(event.code === "Numpad5") {
    writeInput("sef");
  }
  if(event.code === "Numpad6") {
    writeInput("sig");
  }
  if(event.code === "Numpad7") {
    writeInput("uln");
  }
  if(event.code === "Numpad8") {
    writeInput("vit");
  }
  if(event.code === "Numpad9") {
    writeInput("zaaz");
  }
  if(event.code === "NumpadDecimal") {
    
  }
  if(event.code === "NumpadDivide") {
    
  }
  if(event.code === "NumpadMultiply") {
    
  }
  if(event.code === "NumpadAdd") {
    
  }
  if(event.code === "NumpadSubtract") {
    
  }
  if(event.code === "NumpadEnter" || event.code === "Enter") {
    parseInput();
  }
  
});

document.body.addEventListener("keydown", function(event) {
  if(event.code === "Backspace") {
    deleteLastInput();
  }
});