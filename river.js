var main = document.getElementById("mainBox");
var size = document.getElementById("submitDiv");
var step = document.getElementById("step");
var gen = 0;
var rivSize;
var preLoad = new Array();
var imgList = ["bear.jpeg", "fish.jpg", "waves.jpg"];
var cList = ["bear", "fish", "riv"];
for(let i = 0; i < 3; i++){
    var img = new Image();
    img.src = imgList[i];
}

function resize() {
    main.style.left = ((window.innerWidth * .3) / 2) + "px";
    main.style.top = ((window.innerHeight * .3) / 2) + "px";
    size.style.width = (window.innerWidth * .25) + "px";
    size.style.marginLeft = (window.innerWidth * .375) + "px";
    size.style.marginTop = (window.innerHeight * .05) + "px";
    step.style.width = (window.innerWidth * .20) + "px";
    step.style.marginLeft = (window.innerWidth * .40) + "px";
    step.style.marginTop = (window.innerHeight * .05) + "px";
    if (gen > 0) {
        var height = (parseFloat(window.innerHeight) * .7 / rivSize) + "px";
        var width = (parseFloat(window.innerWidth) * .7 / rivSize) + "px";
        var bears = document.querySelectorAll(".bear");
        bears.forEach(b => {
            b.style.height = height;
            b.style.width = width;
        });
        var wavs = document.querySelectorAll(".riv");
        wavs.forEach(w => {
            w.style.height = height;
            w.style.width = width;
        });
        var fis = document.querySelectorAll(".fish");
        fis.forEach(f => {
            f.style.height = height;
            f.style.width = width;
        });
    }
}

function load() {
    document.getElementById("step").style.display = "none";
    resize();
    document.getElementById("generation").innerHTML = "Generation is: " + gen;
}

document.addEventListener("DOMContentLoaded", load);
window.addEventListener("resize", resize);

function grabSize() {
    rivSize = parseFloat(document.getElementById("size").value);
    size.style.display = "none";
    step.style.display = "initial";
    step.style.width = (window.innerWidth * .20) + "px";
    step.style.marginLeft = (window.innerWidth * .40) + "px";
    step.style.marginTop = (window.innerHeight * .05) + "px";
}
document.getElementById("sub").addEventListener("click", grabSize, false);

function generate() {
    var height = (parseFloat(window.innerHeight) * .7 / rivSize) + "px";
    var width = (parseFloat(window.innerWidth) * .7 / rivSize) + "px";
    for (let i = 0; i < rivSize; i++) {
        main.style.gridTemplateColumns += " 1fr";
        main.style.gridTemplateRows += " 1fr";
    }
    for (let i = 0; i < rivSize; i++) {
        for (let j = 0; j < rivSize; j++) {
            //probability that a bear, fish, or empty fish is spawned is as follows: bear=25%, fish=25%, empty=50%
            var randInt = Math.floor(Math.random() * 100);
            if (randInt < 80) {
                main.innerHTML += "<img src='waves.jpg' class='riv' style='height:" + height + "; width: " + width + ";'>";
            }
            else if (randInt < 90) {
                main.innerHTML += "<img src='bear.jpeg' class='bear' style='height:" + height + "; width: " + width + ";'>";
            }
            else {
                main.innerHTML += "<img src='fish.jpg' class='fish' style='height:" + height + "; width: " + width + ";'>";
            }
        }
    }
}

function grabNeighsIndex(index) {
    if (index === (rivSize * rivSize - 1)) {
        return [index - rivSize, index - 1];
    }
    else if (index === 0) {
        return [1, rivSize];
    }
    else if (index === (rivSize - 1)) {
        return [index - 1, index + rivSize];
    }
    else if (index === ((rivSize * rivSize) - rivSize)) {
        return [index - rivSize, index + 1];
    }
    else if (index % rivSize == 0) {
        //left side
        return [index + 1, index - rivSize, index + rivSize];
    }
    else if ((index + 1) % rivSize == 0) {
        //right side
        return [index - 1, index - rivSize, index + rivSize];
    }
    else if (index < rivSize - 1) {
        //top
        return [index - 1, index + 1, index + rivSize];
    }
    else if (index < rivSize * rivSize && index > ((rivSize * rivSize) - rivSize)) {
        //bottom
        return [index - 1, index + 1, index - rivSize];
    }
    else{
       return [index - 1, index + 1, index - rivSize, index + rivSize]; 
    }
}

function grabAllEmpty(){
    var all = document.querySelectorAll('img');
    var indices = new Array();
    for(let i = 0; i < all.length; i++){
        if(all[i].classList.contains("riv")){
            indices.push(i);
        }
    }
    return indices;
}

function iterate() {
    var copy = document.querySelectorAll('img');
    var imgArr = copy;
    var height = (parseFloat(window.innerHeight) * .7 / rivSize) + "px";
    var width = (parseFloat(window.innerWidth) * .7 / rivSize) + "px";
    for (let i = 0; i < imgArr.length; i++) {
        var neighs = grabNeighsIndex(i);
        var rand = Math.floor((neighs.length + 3) * Math.random());
        if (rand < neighs.length) {
            var chosen = neighs[rand];
            var temp = imgArr[i];
            if (imgArr[chosen].classList.contains("riv") && !temp.classList.contains("riv")) {
                imgArr[chosen] = new Image();
                imgArr[chosen].src = temp.src;
                imgArr[chosen].height = height;
                imgArr[chosen].width = width;
                imgArr[chosen].classList = temp.classList;
                imgArr[i] = new Image();
                imgArr[i].src = "waves.jpg";
                imgArr[i].height = height;
                imgArr[i].width = width;
                imgArr[i].classList = ["riv"];

            }
            else if (!temp.classList.contains("riv")) {
                if (temp.classList.contains("bear") && imgArr[chosen].classList.contains("fish")) {
                    console.log("bear at index ", i, "eats fish at index ", chosen);
                    imgArr[chosen] = new Image();
                    imgArr[chosen].src = "bear.jpeg";
                    imgArr[chosen].height = height;
                    imgArr[chosen].width = width;
                    imgArr[chosen].classList = ["bear"];
                    imgArr[i] = new Image();
                    imgArr[i].src = "waves.jpg";
                    imgArr[i].height = height;
                    imgArr[i].width = width;
                    imgArr[i].classList = ["riv"];
                }
                else if (temp.classList.contains("fish") && imgArr[chosen].classList.contains("bear")) {
                    console.log("fish at index ", i, "gets eaten by bear at index ", chosen);
                    imgArr[i] = new Image();
                    imgArr[i].src = "waves.jpg";
                    imgArr[i].height = height;
                    imgArr[i].width = width;
                    imgArr[i].classList = ["riv"];
                }
                else {
                    console.log("make a child for animal at index ", i, "and animal at index ", chosen);
                    //very important line, updates the DOM tree before grabbing all empty so that empty spots are actually grabbed
                    copy = imgArr;
                    var emp = grabAllEmpty();
                    var chil = emp[Math.floor(emp.length * Math.random())];
                    console.log("placing child at ", chil);
                    imgArr[chil] = new Image();
                    imgArr[chil].src = temp.src;
                    imgArr[chil].height = height;
                    imgArr[chil].width = width;
                    imgArr[chil].classList = temp.classList;
                    emp.splice(chil, 1);
                }
            }
        }
    }
    copy = imgArr;
}

function progress() {
    if (gen === 0) {
        generate();
        gen++;
        document.getElementById("generation").innerHTML = "Generation is: " + gen;
    }
    else {
        iterate();
        gen++;
        document.getElementById("generation").innerHTML = "Generation is: " + gen;
    }
}

document.getElementById("prog").addEventListener("click", progress, false);