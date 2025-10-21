//0s and 1s to print on a6 sheets.

//a6 at 72*2 dpi.
let pw = 298 * 2;
let ph = 420 * 2;

let side_margins = 30 * 2;
let edge_margins = 100 * 2;

//font sizes:
const foreground = 10 * 2;
const max_background = 4.5 * 2;

//font variables:
let serif; //noto.
let mono; // source.

//colour variables:
let red = "#c02126";
let grey = "#bcbec0";
let dark_grey = "#6d6e71";
let bg = 255;
let black = 0;

let binaries = [];
let characters = [];

let pdf;
let pdf_shit = false; //change this to save as pdf.

let vanishingY; // horizon / vanishing point height

function preload() {
  serif = loadFont("/assets/noto-serif-hebrew_regular.ttf");
  mono = loadFont("/assets/source-code-pro_medium.ttf");
}

function setup() {
  createCanvas(pw, ph);
  frameRate(12);
  noStroke();

  // horizon just above the top edge for full-screen depth
  vanishingY = -height * 0.2;

  make_binaries();
  make_characters();

  if (pdf_shit == true) {
    pdf = createPDF();
    pdf.beginRecord();
  }
}

function make_binaries() {
  // dense full-screen population
  let numBinaries = 600;
  for (let i = 0; i < numBinaries; i++) {
    let dir = random(["toward", "away"]);
    binaries.push(new Binary(random(0, width), random(0, height), dir));
  }
}

//character-constructor: constructor(x, y, t, t_size).
function make_characters() {
  let iX = width / 2 - foreground / 4;
  let iY = height - edge_margins - foreground;
  characters[0] = new Character(iX, iY, "i", foreground);
}

function draw() {
  background(bg);

  // update and display binaries:
  for (let i = binaries.length - 1; i >= 0; i--) {
    binaries[i].update();
    binaries[i].display();

    // remove and replace offscreen binaries
    if (binaries[i].isOffscreen()) {
      binaries.splice(i, 1);
      let dir = random(["toward", "away"]);
      binaries.push(new Binary(random(0, width), dir === "toward" ? height + 20 : -20, dir));
    }
  }

  //display characters:
  for (let character of characters) {
    character.display();
  }

  if (pdf_shit == true) {
    pdf.save();
  }

  ui();
}

function ui() {
  push();
  textAlign(CENTER, CENTER);
  textFont(serif);
  fill(dark_grey);
  text("i live in a world full of binaries.", width / 2, height - 50);
  pop();
}

class Binary {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.t = random(["0", "1"]);
    this.baseSize = max_background;
    this.speed = random(3, 6);
    this.reset();
  }

  reset() {
    // compute size by depth but never exceed baseSize (max_background)
    let computed = this.baseSize * map(this.y, vanishingY, height, 0.3, 2.4);
    this.size = min(computed, this.baseSize);
  }

  update() {
    // vector toward vanishing point (center top)
    let vx = width / 2 - this.x;
    let vy = vanishingY - this.y;
    let len = sqrt(vx * vx + vy * vy);
    vx /= len;
    vy /= len;

    // reverse vertical direction depending on flow
    if (this.direction === "toward") {
      this.x += vx * this.speed;
      this.y += vy * this.speed;
    } else {
      this.x -= vx * this.speed;
      this.y -= vy * this.speed;
    }

    // resize based on depth but clamp to baseSize
    let computed = this.baseSize * map(this.y, vanishingY, height, 0.3, 2.4);
    this.size = min(computed, this.baseSize);

    this.t = random(["0", "1"]);
  }

  isOffscreen() {
    return this.y < -40 || this.y > height + 40;
  }

  display() {
    push();
    textAlign(CENTER, CENTER);
    fill(grey);
    textFont(mono);
    textSize(this.size);
    text(this.t, this.x, this.y);
    pop();
  }
}

class Character {
  constructor(x, y, t, t_size) {
    this.x = x;
    this.y = y;
    this.t = t;
    this.t_size = t_size;
  }
  display() {
    push();
    textAlign(LEFT, TOP);
    fill(red);
    textFont(serif);
    textSize(this.t_size);
    text(this.t, this.x, this.y);
    pop();
  }
}
