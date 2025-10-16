//0s and 1s to print on a6 sheets.

//a6 at 300 dpi.
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
let bg = 255;
let black = 0;

let binaries = [];

let pdf;

function preload() {
  serif = loadFont("./noto-serif-hebrew_regular.ttf");
  mono = loadFont("./source-code-pro_medium.ttf");
}

function setup() {
  createCanvas(pw, ph);

  //set defaults:
  noStroke();

  //create binaries:
  for (let x = side_margins; x <= width - side_margins; x += max_background) {
    for (let y = edge_margins; y <= height - edge_margins; y += max_background) {
      binaries.push(new Binary(x, y));
    }
  }

  pdf = createPDF();
  pdf.beginRecord();
}

function draw() {
  background(bg);

  //frame:
  push();
  stroke(190);
  rect(0, 0, width, height);
  pop();

  //display all binaries:
  for (let binary of binaries) {
    binary.display();
  }
  pdf.save();

  noLoop();
}

class Binary {
  constructor(x, y, w, h) {
    //construction is the same as a rectangle.
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.t = random(["0", "1"]);
  }
  display() {
    // push();

    //set defaults:
    textAlign(LEFT, TOP);

    fill(grey);

    textFont(mono);
    textSize(max_background);
    text(this.t, this.x, this.y);

    // pop();
  }
}
