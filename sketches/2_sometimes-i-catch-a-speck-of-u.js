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

let gridCols = 10; // number of windows horizontally
let gridRows = 8; // number of windows vertically
let windowPadding = 5; // space between windows
let windowOffsetY = 200; // 10px above 'i' baseline

let showU = true; // track if "u" should currently be shown
let uTimer = 0; // counts frames for "u" on/off timing
let uDuration = 12; // show for 1 sec at 12fps
let uGap = 12; // stay hidden for 1 sec
let uIndex = -1; // which binary currently holds the "u"

let uProbability = 0.75; // 75% chance per cycle to show a "u"

function preload() {
  serif = loadFont("/assets/noto-serif-hebrew_regular.ttf");
  mono = loadFont("/assets/source-code-pro_medium.ttf");
}

function setup() {
  createCanvas(pw, ph);
  frameRate(12);
  noStroke();

  make_windows();
  make_characters();

  // place "u" immediately
  placeNewU();

  if (pdf_shit == true) {
    pdf = createPDF();
    pdf.beginRecord();
  }
}

function make_windows() {
  let baselineY = height - edge_margins - foreground;
  let topStart = baselineY - gridRows * (max_background * 3) - windowOffsetY;

  let windowWidth = (width - 2 * side_margins - (gridCols - 1) * windowPadding) / gridCols;
  let windowHeight = (baselineY - topStart - windowPadding) / gridRows;

  for (let c = 0; c < gridCols; c++) {
    for (let r = 0; r < gridRows; r++) {
      let xStart = side_margins + c * (windowWidth + windowPadding);
      let yStart = topStart + r * (windowHeight + windowPadding);

      let numAcross = int(windowWidth / (max_background * 1.5));
      let numDown = int(windowHeight / (max_background * 1.8));

      for (let i = 0; i < numAcross; i++) {
        for (let j = 0; j < numDown; j++) {
          let x = xStart + i * (max_background * 1.5);
          let y = yStart + j * (max_background * 1.8);
          binaries.push(new Binary(x, y));
        }
      }
    }
  }
}

//character-constructor: constructor(x, y, t, t_size).
function make_characters() {
  // “i” in its original spot
  let iX = width / 2 - foreground / 4;
  let iY = height - edge_margins - foreground;
  characters.push(new Character(iX, iY, "i", foreground));
}

function draw() {
  background(bg);

  // update timer
  uTimer++;
  if (showU && uTimer > uDuration) {
    // hide "u" and restore that binary
    restoreBinary();
    showU = false;
    uTimer = 0;
  } else if (!showU && uTimer > uGap) {
    // decide probabilistically whether to show "u" again
    if (random() < uProbability) {
      showU = true;
      placeNewU();
    }
    uTimer = 0;
  }

  // draw all binaries (the one holding 'u' will handle itself)
  for (let binary of binaries) {
    binary.display();
  }

  // draw “i”
  for (let character of characters) {
    character.display();
  }

  ui();

  if (pdf_shit == true) {
    pdf.save();
  }
}

function placeNewU() {
  // randomly choose one Binary
  if (binaries.length === 0) return;
  uIndex = int(random(binaries.length));
  binaries[uIndex].becomeU();
}

function restoreBinary() {
  if (uIndex >= 0 && uIndex < binaries.length) {
    binaries[uIndex].restore();
  }
  uIndex = -1;
}

function ui() {
  push();
  textAlign(CENTER, CENTER);
  textFont(serif);
  fill(dark_grey);
  text("sometimes, i catch a speck of u", width / 2, height - 50);
  pop();
}

class Binary {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.t = random(["0", "1"]);
    this.isU = false;
  }

  becomeU() {
    this.isU = true;
  }

  restore() {
    this.isU = false;
    this.t = random(["0", "1"]);
  }

  display() {
    push();
    textAlign(LEFT, TOP);
    textFont(this.isU ? serif : mono);
    textSize(max_background);
    if (this.isU) {
      fill(red);
      text("u", this.x, this.y);
    } else {
      fill(grey);
      this.t = random(["0", "1"]);
      text(this.t, this.x, this.y);
    }
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
