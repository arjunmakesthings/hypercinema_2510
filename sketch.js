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
let bg = 255;
let black = 0;

let binaries = [];
let characters = [];

let pdf;
let pdf_shit = false; //change this to save as pdf.

function preload() {
  serif = loadFont("./noto-serif-hebrew_regular.ttf");
  mono = loadFont("./source-code-pro_medium.ttf");
}

function setup() {
  createCanvas(pw, ph);

  frameRate(12);

  //set defaults:
  noStroke();

  make_binaries();
  make_characters();

  if (pdf_shit == true) {
    pdf = createPDF();
    pdf.beginRecord();
  }
}

//binary-constructor(x, y, w, h).
function make_binaries() {
  for (let x = side_margins + foreground; x <= width - side_margins - foreground; x += max_background) {
    let y_pos = random(edge_margins, height - edge_margins);
    for (let y = y_pos; y <= height - edge_margins; y += max_background) {
      binaries.push(new Binary(x, y));
    }
  }
}

//character-constructor: constructor(x, y, t, t_size).
function make_characters() {
  characters[0] = new Character(side_margins, height - edge_margins - foreground, "i", foreground);
  characters[1] = new Character(width - side_margins, height - edge_margins - foreground, "u", foreground);
}

function draw() {
  background(bg);
  //frame:
  // push();
  // stroke(190);
  // noFill();
  // rect(0, 0, width, height);
  // pop();

  //display all binaries:
  for (let binary of binaries) {
    binary.display();
  }

  //display characters:
  for (let character of characters) {
    character.display();
  }

  if (pdf_shit == true) {
    pdf.save();
  }

  // noLoop();
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
    push();

    //set defaults:
    textAlign(LEFT, TOP);

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
    //construction is the same as a rectangle.
    this.x = x;
    this.y = y;

    this.t = t;
    this.t_size = t_size;
  }
  display() {
    push();

    //set defaults:
    textAlign(LEFT, TOP);

    fill(red);

    textFont(serif);
    textSize(this.t_size);
    text(this.t, this.x, this.y);

    pop();
  }
}
