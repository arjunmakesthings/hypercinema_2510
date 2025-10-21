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

let characters = [];
let beams = []; // store all active beams

let pdf;
let pdf_shit = false; //change this to save as pdf.

let lastLaunchTime = 0;
let launchInterval = 5000; // 5 seconds
let nextCharacterIndex = 0; // alternate between 0 and 1

function preload() {
  serif = loadFont("/assets/noto-serif-hebrew_regular.ttf");
  mono = loadFont("/assets/source-code-pro_medium.ttf");
}

function setup() {
  createCanvas(pw, ph);
  frameRate(12);
  noStroke();

  make_characters();
  launchBeamFrom(characters[nextCharacterIndex]);

  if (pdf_shit == true) {
    pdf = createPDF();
    pdf.beginRecord();
  }
}

function make_characters() {
  characters[0] = new Character(side_margins, height - edge_margins - foreground, "i", foreground);
  characters[1] = new Character(width - side_margins, height - edge_margins - foreground, "u", foreground);
}

// function to create a new beam from a character
function launchBeamFrom(char) {
  beams.push(new Beam(char.x, char.y, nextCharacterIndex));
  // alternate
  nextCharacterIndex = (nextCharacterIndex + 1) % 2;
}

function draw() {
  background(bg);

  // launch a new beam every 5 seconds
  if (millis() - lastLaunchTime > launchInterval) {
    launchBeamFrom(characters[nextCharacterIndex]);
    lastLaunchTime = millis();
  }

  // update and draw all beams
  for (let beam of beams) {
    beam.update();
    beam.display();
  }

  // draw characters
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
  text("but my words never seem to reach you.", width / 2, height - 50);
  pop();
}

//======================
// Binary Class
//======================
class Binary {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.t = random(["0", "1"]);
  }

  display() {
    push();
    textAlign(LEFT, TOP);
    fill(grey);
    textFont(mono);
    textSize(max_background);
    text(this.t, this.x, this.y);
    if (random() < 0.1) this.t = random(["0", "1"]);
    pop();
  }
}

//======================
// Beam Class
//======================
class Beam {
  constructor(x, y, fromIndex) {
    this.binaries = [];
    this.x = x;
    this.y = y;

    this.fromIndex = fromIndex;
    this.length = 20; // number of binaries per beam
    this.speed = 10;

    // pick an initial angle so it heads roughly across the canvas
    let minAngle = radians(-60);
    let maxAngle = radians(60);
    let baseDir = fromIndex === 0 ? 1 : -1; // right or left
    this.vx = this.speed * baseDir * cos(random(minAngle, maxAngle));
    this.vy = this.speed * sin(random(minAngle, maxAngle));

    this.buildInitial();
  }

  buildInitial() {
    for (let i = 0; i < this.length; i++) {
      this.binaries.push(new Binary(this.x, this.y));
    }
  }

  update() {
    // bounds using margins
    let leftBound = side_margins;
    let rightBound = width - side_margins;
    let topBound = edge_margins;
    let bottomBound = height - edge_margins - foreground * 1.5; // invisible ground above characters

    // move head
    this.x += this.vx;
    this.y += this.vy;

    // bounce horizontally
    if (this.x <= leftBound || this.x >= rightBound) {
      this.vx *= -1;
      this.x = constrain(this.x, leftBound, rightBound);
    }

    // bounce vertically
    if (this.y <= topBound || this.y >= bottomBound) {
      this.vy *= -1;
      this.y = constrain(this.y, topBound, bottomBound);
    }

    // shift positions of binaries (like a trail)
    this.binaries.unshift(new Binary(this.x, this.y));
    if (this.binaries.length > this.length) {
      this.binaries.pop();
    }
  }

  display() {
    for (let b of this.binaries) {
      b.display();
    }
  }
}

//======================
// Character Class
//======================
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
