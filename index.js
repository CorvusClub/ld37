var screen = document.querySelector("#screen");

var cursor = document.querySelector("#screen .cursor");
setInterval(function() {
  cursor.classList.toggle("hidden");
}, 1000);

var camera = document.querySelector("a-camera");

AFRAME.registerComponent('clickable', {
  init: function () {
    this.el.addEventListener('click', function () {
      camera.setAttribute('position', { x: 0, y: 1.6, z: -2.5 });
    });
  }
});

// TODO: logic to add images instead of characters
// use something like createElement("span"), span.class="symbol zaaz" or something
function writeCharacter(char) {
  screen.removeChild(cursor);
  screen.innerHTML += char;
  screen.appendChild(cursor);
}

document.body.addEventListener("keypress", function(event) {
  if(event.code === "Numpad0") {
    writeCharacter("0");
  }
  if(event.code === "Numpad1") {
    
  }
  if(event.code === "Numpad2") {
    
  }
  if(event.code === "Numpad3") {
    
  }
  if(event.code === "Numpad4") {
    
  }
  if(event.code === "Numpad5") {
    
  }
  if(event.code === "Numpad6") {
    
  }
  if(event.code === "Numpad7") {
    
  }
  if(event.code === "Numpad8") {
    
  }
  if(event.code === "Numpad9") {
    
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
  if(event.code === "NumpadEnter") {
    
  }
});