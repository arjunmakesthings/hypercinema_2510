// 0s and 1s to print on a6 sheets.

// a6 at 72*2 dpi.
let pw = 298 * 2;
let ph = 420 * 2;

let side_margins = 30 * 2;
let edge_margins = 100 * 2;

// font sizes:
const max_background = 4.5 * 2;

// font variables:
let serif; // noto.
let mono; // source.

// colour variables:
let red = "#c02126";
let grey = "#bcbec0";
let dark_grey = "#6d6e71";
let bg = 255;

let binaries = [];
let characters = [];

let pdf;
let pdf_shit = false; // change this to save as pdf.

// grid spacing
let gridStepX = max_background * 1.6;
let gridStepY = max_background * 1.9;

function preload() {
  serif = loadFont("/assets/noto-serif-hebrew_regular.ttf");
  mono = loadFont("/assets/source-code-pro_medium.ttf");
}

function setup() {
  createCanvas(pw, ph);
  noStroke();
  frameRate(12);

  make_grid();

  if (pdf_shit == true) {
    pdf = createPDF();
    pdf.beginRecord();
  }
}

function make_grid() {
  let left = side_margins;
  let right = width - side_margins;
  let top = edge_margins;
  let bottom = height - edge_margins;

  // generate grid of binary digits
  for (let x = left; x <= right; x += gridStepX) {
    for (let y = top; y <= bottom; y += gridStepY) {
      binaries.push(new Binary(x, y));
    }
  }

  // randomly choose one for "i" and one for "u"
  if (binaries.length >= 2) {
    let iIndex = int(random(binaries.length));
    let iBinary = binaries.splice(iIndex, 1)[0];

    let uIndex = int(random(binaries.length));
    let uBinary = binaries.splice(uIndex, 1)[0];

    characters.push(new Character(iBinary.x, iBinary.y, "i", max_background));
    characters.push(new Character(uBinary.x, uBinary.y, "u", max_background));
  }
}

function draw() {
  background(bg);

  // draw 0s and 1s
  for (let b of binaries) {
    b.display();
  }

  // draw the static "i" and "u"
  for (let c of characters) {
    c.display();
  }

  ui();

  if (pdf_shit == true) {
    pdf.save();
  }

  // // //this is for capturing the image to send to runway:
  // save("frame.jpeg");
  // noLoop();
}

function ui() {
  push();
  textAlign(CENTER, CENTER);
  textFont(serif);
  fill(dark_grey);
  text("i wonder — are we the only ones stuck with humanity?", width / 2, height - 50);
  pop();
}

class Binary {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.t = random(["0", "1"]);
  }

  display() {
    push();
    textAlign(CENTER, CENTER);
    fill(grey);
    textFont(mono);
    textSize(max_background);
    text(this.t, this.x, this.y);
    this.t = random(["0", "1"]);
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
    textAlign(CENTER, CENTER);
    fill(red);
    textFont(serif);
    textSize(this.t_size);
    text(this.t, this.x, this.y);
    pop();
  }
}
