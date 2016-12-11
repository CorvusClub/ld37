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

var fs = { 
  "miln 1" : 
    `1 zaaz faa
    kov yze uln`,
  "kov faa": {
    "kov": "kov image|./assets/Textures/desk.JPG"
  }
};

var path = "";

var camera = document.querySelector("a-camera");

var currentInput = [];

function writeCharacter(char, type) {
  if(!isNaN(char)) {
    var digits = char.split("");
    digits.forEach(function() {
      writeCharacter("number" + char, type);
    });
    return;
  }
  if(char.match(/image\|/)) {
    var image_path = char.split("|")[1];
    var img = document.createElement("img");
    img.src = image_path;
    screen.appendChild(img);
    screen.scrollTop = screen.scrollHeight;
    return;
  }
  var character = document.createElement("span");
  character.className = "symbol " + char;
  if(type != undefined)
  {
    character.classList.add(type);
  }
  screen.appendChild(character);
  screen.scrollTop = screen.scrollHeight;
}

function writeLine(string, type) {
  string.split("\n").forEach(function(line) {
    writeSentence(line, type);
    newLine();
  });
}

function writeSentence(string, type) {
  string.split(" ").forEach(function(character) {
    writeCharacter(character, type);
  });
}

function renderInput() {
  screen.innerHTML = initScreen;
  var character;
  for(var i=0;i<currentInput.length;i++)
  {
    var type = currentInput[i];
    if(typeof type === "number") {
      let digits = type.toString().split("");
      digits.forEach(function(digit) {
        character = document.createElement("span");
        character.className = "symbol number" + digit;
        screen.appendChild(character);
      });
    }
    else {
      character = document.createElement("span");
      character.className = "symbol " + currentInput[i];
      screen.appendChild(character);
    }
  }
  screen.appendChild(cursor);
  renderScreen();
  screen.scrollTop = screen.scrollHeight;
}

function writeInput(char) {
  var click = Sound.Click().playSound();
  
  if(char === "number") {
    var lastInput = currentInput[currentInput.length - 1];
    if(typeof lastInput === "number") {
      currentInput[currentInput.length - 1]++;
    }
    else {
      currentInput.push(0);
    }
  }
  else {
    currentInput.push(char);
  }
  renderInput();
}

function deleteLastInput(char) {
  currentInput.pop();
  renderInput();
}

function newLine() {
  screen.appendChild(document.createElement("br"));
}


function commandNotFound() {
  Sound.Error.playSound();
  writeCharacter("ju", "error");
  writeCharacter("zaaz", "error");
  newLine();
  writeCharacter("sig");
  writeCharacter("ha", "command");
  writeCharacter("sig", "command");
}

function help() {
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
  newLine();
  screen.innerHTML += "- "
  writeCharacter("duk", "command");
  writeCharacter("sef", "command");
  newLine();
  screen.innerHTML += "- "
  writeCharacter("duk", "command");
  writeCharacter("sef", "command");
  writeSentence("uln", "file");
  
  return true;
}

function ls() {
  writeCharacter("zaaz", "success");
  var dir = navigateFs(path);
  for(var name in dir)
  {
    newLine();
    var file = dir[name];
    // folder
    if(typeof file === "object") {
      writeSentence("duk sef", "command");
      writeSentence(name, "file");
    }
    else {
      writeCharacter("blank ", "command");
      writeCharacter("sef", "command");
      writeSentence(name, "file");
    }
  }
  
  return true;
}

function readFile() {
  let readTime = 5000 + Math.random() * 3000;
  var currentDir = navigateFs(path);
  return new Promise(function(resolve) {
    var fileName = currentInput.slice(1).join(" ");
    var file = currentDir[fileName];
    if(file && typeof file === "string") {
      writeCharacter("zaaz", "success");
      newLine();
      renderScreen();
      Sound.Success.playSound();
      Sound.Disk.playSound();
      writeSentence(fileName, "file");
      newLine();
      writeLine(file);
      setTimeout(function() {
        renderScreen();
      
        resolve("nosound");
        Sound.Disk.stopSound();
      }, readTime);
    }
    else {
      writeSentence("ju zaaz", "error");
      newLine();
      writeSentence(fileName, "file");
      writeSentence("ha ju sef", "error");
      
      resolve(false);
    }
  });
}

function navigateFs(path) {
  var parts = path.split("/");
  var dir = fs;
  parts.forEach(function(part) {
    if(!dir) {
      return undefined;
    }
    if(part !== "") {
      dir = dir[part];
    }
  });
  return dir;
}

function cd() {
  var dirName = currentInput.slice(2).join(" ");
  var currentDir = navigateFs(path);
  var dir = currentDir[dirName];
  if(!dir) {
    writeLine("ju zaaz", "error");
    writeSentence(dirName, "file");
    writeLine("ha ju duk sef");
    return;
  }
  if(typeof dir === "string") {
    writeLine("ju zaaz", "error");
    writeSentence(dirName, "file");
    writeLine("ha sef", "error");
    return;
  }
  if(typeof dir === "object") {
    path = path + "/" + dirName;
    writeCharacter("zaaz", "success");
    return true;
  }
}
function upDir() {
  if(path === "") {
    writeLine("ju zaaz", "error");
    writeLine("kov yze", "error");
    return;
  }
  path = path.split("/");
  path = path.slice(0, path.length - 1).join("/");
  writeCharacter("zaaz", "success");
  return true;
}

var commands = {
  "^ha sig$": help,
  "^ha kov$": ls,
  "^sef (.*)$": readFile,
  "^duk sef (.*)$": cd,
  "^duk sef$": upDir,
};


function parseInput() {
  screen.removeChild(cursor);
  newLine();
  var inputString = currentInput.join(" ");
  var matched = false;
  var commandStatus = false;
  for(var regex in commands) {
    var match = inputString.match(regex);
    if(match) {
      commandStatus = commands[regex]();
      matched = true;
      break;
    }
  }
  Promise.resolve(commandStatus).then(function(result) {
    if(matched && result) {
      if(result !== "nosound") {
        Sound.Success.playSound();
      }
    }
    else if(matched && !result) {
      Sound.Error.playSound();
    }
    else {
      commandNotFound();
    }
    newLine();
    if(path !== "") {
      writeSentence(path.split("/").join(" path_sep "), "command");
    }
    screen.innerHTML += "> ";
    initScreen = screen.innerHTML;
    currentInput = [];
    renderInput();
  });
}

document.body.addEventListener("keypress", function(event) {
  console.log(event.code);
  if(event.code === "Numpad0" || event.code === "Digit0") {
    writeInput("duk");
  }
  if(event.code === "Numpad1" || event.code === "Digit1") {
    writeInput("ha");
  }
  if(event.code === "Numpad2" || event.code === "Digit2") {
    writeInput("ju");
  }
  if(event.code === "Numpad3" || event.code === "Digit3") {
    writeInput("kov");
  }
  if(event.code === "Numpad4" || event.code === "Digit4") {
    writeInput("miln");
  }
  if(event.code === "Numpad5" || event.code === "Digit5") {
    writeInput("sef");
  }
  if(event.code === "Numpad6" || event.code === "Digit6") {
    writeInput("sig");
  }
  if(event.code === "Numpad7" || event.code === "Digit7") {
    writeInput("uln");
  }
  if(event.code === "Numpad8" || event.code === "Digit8") {
    writeInput("vit");
  }
  if(event.code === "Numpad9" || event.code === "Digit9") {
    writeInput("zaaz");
  }
  if(event.code === "NumpadDecimal" || event.code === "Minus") {
    writeInput("nuug");
  }
  if(event.code === "NumpadDivide" || event.code === "Equals") {
    writeInput("yze");
  }
  if(event.code === "NumpadMultiply" || event.code === "BracketLeft") {
    writeInput("faa");
  }
  if(event.code === "NumpadAdd" || event.code === "BracketRight") {
    writeInput("number");
  }
  if(event.code === "NumpadSubtract" || event.code === "Backslash") {
    writeInput("eib");
  }
  if(event.code === "NumpadEnter" || event.code === "Enter") {
    parseInput();
  }
  event.preventDefault();
});

document.body.addEventListener("keydown", function(event) {
  if(event.code === "Backspace") {
    deleteLastInput();
  }
});