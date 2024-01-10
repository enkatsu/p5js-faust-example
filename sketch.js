class Drop {
    constructor(pos) {
        this.pos = pos;
        this.rad = 0;
        this.life = 255;
    }

    update() {
        this.rad++;
        this.life -= 3;
    }

    draw() {
        push();
        stroke(255, this.life);
        noFill();
        circle(this.pos.x, this.pos.y, this.rad * 2);
        pop();
    }
}


const audioContext = new AudioContext();
let dropNode = null;
let drops = [];


function setup() {
    createCanvas(600, 600);
    drop.createDSP(audioContext, 1024)
        .then(node => {
            dropNode = node;
            dropNode.connect(audioContext.destination);
            console.log('params: ', dropNode.getParams());
        });
}

function draw() {
    background(0);

    for (const drop of drops) {
        drop.update();
        drop.draw();
    }
    drops = drops.filter(b => b.life > 0);
}

function mousePressed() {
    if (!dropNode) {
        return;
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    dropNode.setParamValue('/drop/drop', 1.0);
    // dropNode.setParamValue('/drop/Freeverb/Wet', random());
    // dropNode.setParamValue('/drop/Freeverb/0x00/Damp', random());
    // dropNode.setParamValue('/drop/Freeverb/0x00/RoomSize', random());
    // dropNode.setParamValue('/drop/Freeverb/0x00/Stereo_Spread', random());
    dropNode.setParamValue('/drop/freq/0x00', random(440, 880));
    drops.push(new Drop(createVector(mouseX, mouseY)));
}

function mouseReleased() {
    if (!dropNode) {
        return;
    }
    dropNode.setParamValue('/drop/drop', 0.0);
}
