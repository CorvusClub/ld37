var Sound = {};
Sound.Click = function() {
    var index  = Math.round(Math.random() * 2) + 1;
    console.log(index);
    return Sound["Click" + index];
};

scene.addEventListener("loaded", function() {
    Sound.Error = document.querySelector("#error_sound").components.sound;
    Sound.Success = document.querySelector("#success_sound").components.sound;
    Sound.Boot = document.querySelector("#boot_sound").components.sound;
    Sound.Fan = document.querySelector("#fan_sound").components.sound;
    Sound.Click1 = document.querySelector("#click1_sound").components.sound;
    Sound.Click2 = document.querySelector("#click2_sound").components.sound;
    Sound.Click3 = document.querySelector("#click3_sound").components.sound;
    Sound.Disk = document.querySelector("#disk_spin_sound").components.sound;
    
    Sound.Boot.playSound();
});


