/**
 * ------------------------------------------------	
 * Builds a new Track.
 * @pianistPm the pianist I'm linked to.
 * ------------------------------------------------	
 */
var Track = function(pianistPm, indPm) {
  // link to my Pianist and index number
  this.pianist = pianistPm;
  this.ind = indPm;
  // highest and lowest midi notes in the song
  // this.noteMin = 0; this.noteMax = 4; // - range for reich piece
  // lowest and highest midi value data to normalize
  this.noteMin = 40; this.noteMax = 50;  
  // line width - stroke width - stored as both actual value and ratio 0 to 1
  // This is the range based on window size.
  this.strMin = 3; this.strMax = 6;
  this.strCurr = this.strMax;
  // color range - r, g, b, a - stored as both current color and ratio 0 to 1
  // colors for each pianist
  var arrColNorm = [
    [
      [200, 20, 20, 0.0], // pianist 0: min color
      [200, 20, 20, 1.0]  // pianist 0: max color
    ],
    [
      [0, 170, 170, 0.0], // pianist 1: min color
      [0, 170, 170, 1.0]  // pianist 1: max color
    ]
  ];
  // alternate colors for mobile - greyscale
  var arrColAlt = [
    [
      [70, 60, 60, 0.0], // pianist 0: min color
      [70, 60, 60, 0.7]  // pianist 0: max color
    ],
    [
      [50, 80, 80, 0.0], // pianist 1: min color
      [50, 80, 80, 0.5]  // pianist 1: max color
    ]
  ];
  // which colors to use? If mobile, use the mobile.
  var arrCol = (isMobile && !(mobileOS == 'iOS')) ? arrColAlt : arrColNorm;
  // assign the colors.
	this.colMin = arrCol[(this.ind % arrCol.length)][0];
	this.colMax = arrCol[(this.ind % arrCol.length)][1];
	this.colCurr = this.colMin;
	// colors for pianist 1
	this.ratCol = 0;
  // storing values of stroke for animation
  this.ratColPrev = this.ratColNext = this.colMax;
	// length of time to preroll up to each note (seconds)
	// this essentially gives it some smoothness so the ink
	// blends/eases into the note instead of suddenly skipping
	this.tPreNote = 0.1;
	// a temporary toggle to turn off the pre-roll function completely
	// to make hard edges
	this.usePreRoll = false;
  // array to store all radius values we'll need
  this.arrRadius = new Array();
  // my index number
  // this.ind = indPm;
  // my current and previous points
  this.v0; this.v1; this.v2; this.v3;
  // the position of the true driver
  this.beacon;
  // how many vertices we have
  this.ctPts = 0;
  // my current rotation value
  this.rotation = 0;
  // target rotation during grabbed mode when I ease towards it
  this.rotationTarg = 0;
  // current radius value, target radius value, previous radius value
  this.radius = this.radiusNext = 0;
  // Maximum value for the radius, in pixels - We don't want it to get huge on
  // giant monitors.
  this.radiusLimitMax = 330;
  // Minimum limit = we actually let the radius get as small as we want,
  // but this is is the pixel size where we treat it as smallest, for the stroke width
  this.radiusLimitMin = 150;
  // ratio as 0 to 1, of my radius size. Use this to lerp interpolate
  // the appropriate stroke width.
  this.radiusRatio = 1;
  // Start in warmup mode.
  this.isWarmingUp = true;  
  // stores the last note we played
  this.noteInd;
  // Are we currently in a preroll mode leading up to a note
  this.isPreRolling = false;
  // Hide tracks initially
  this.isVisible = false;
  // store last position of the beacon
  this.xDrawCurr; this.yDrawCurr;
  this.xDrawPrev; this.yDrawPrev;

  // How quickly the stroke fades from zero alpha back up.
  // Note we also set this dynamically, see the resetStroke function.
  this.fadeInSpd = 0.6;
  //
  this.init();
}

/**
 * ------------------------------------------------	
 * Initialize.
 * ------------------------------------------------	
 */
Track.prototype.init = function() {
  
  // set the canvas I draw to
  this.cv = cv0;
  // global settings that don't change
  this.cv.lineCap = 'round';
  // initialize my radius size based on window
  this.updateRadius();
  
  // initialize points
  this.v0 = makePoint(xCenter, yCenter);
  this.v1 = makePoint(xCenter, yCenter);
  this.v2 = makePoint(xCenter, yCenter);
  this.v3 = makePoint(xCenter, yCenter);
  this.xDrawPrev = xCenter; this.yDrawPrev = yCenter;
  
}

/**
 * ------------------------------------------------	
 * a noteOn event happens every time a note is hit,
 * triggered by Pianist object.
 * ------------------------------------------------	
 */
Track.prototype.noteOn = function(notePm) {
  // store as the last note played
  this.noteInd = arrMidiLookup[notePm];
  // look up radius for that note
  this.radiusNext = this.arrRadius[this.noteInd];
  // store change in value
  this.radiusPrev = this.radius;
  // switch to preroll mode?
  if (!this.usePreRoll) {
    // not if we hard-coded it to off, to give hard edges.
    this.isPreRolling = false; this.radius = this.radiusNext;   
  } else {
    this.isPreRolling = true; this.tPreNote0 = tMaster;
  }
  // store value of stroke and alpha we want to get to
  this.ratColPrev = this.ratCol; this.ratColNext = lim(1.0, 0, 1);
}

/**
 * ------------------------------------------------	
 * Update function.
 * ------------------------------------------------	
 */
Track.prototype.upd = function(timeDelta) {
    
  // -----------------------------------
  // are we in preroll mode leading up to a note
  // -----------------------------------
  if (this.isPreRolling) {
    // This eases into notes, creating softer edges.
    this.tPreNote1 = tMaster;
    var t = this.tPreNote1 - this.tPreNote0;
    // are we done?
    if (t >= this.tPreNote) {
      this.radius = this.radiusNext; this.mode = 0;
    } else {
      // set radius
      this.radius = jQuery.easing.easeInOutQuart(null, t, this.radiusPrev, this.radiusNext - this.radiusPrev, this.tPreNote);
      // set alpha
      this.ratCol = jQuery.easing.easeInQuad(null, t, this.ratColPrev, this.ratColNext - this.ratColPrev, this.tPreNote);
    }
  }
  
  // calculate color and stroke
	var colNext = lerpColor(this.colMin, this.colMax, this.ratCol);
	// set new color and stroke width
	this.colCurr = colNext;
	// set color of my beacon too
	this.beacon.setColor(this.colCurr);
  var xb, yb;
  
  // --------------------------------------
  // Grabbed mode, when user is holding them.
  // --------------------------------------
  if (this.beacon.isGrabbed) {
    // mouse position in relation to the center of the canvas.
    var xMouseCenter = mouse.x-xCenter;
    var yMouseCenter = mouse.y-yCenter;
    // what radius value would we be playing in this space?
    var radTrue = Math.sqrt(xMouseCenter*xMouseCenter + yMouseCenter*yMouseCenter);
    var radClosest = this.radiusMax;
    var radClosestInd = 0;
    // find the closest value in the radius list
    for (var i = this.arrRadius.length-1; i >= 0; i--) {
      if (radTrue > this.arrRadius[i]) {
        radClosest = this.arrRadius[i]; radClosestInd = i; break;
      } else {
        // else just continue looking
      }
    }
    // Offset the two dots so they're not playing the same note.
    // Is it at the highest radius value?
    if (radClosestInd == arrNotes.length - 1) {
      // set one to the highest, one to the second highest
      if (this.ind == 0) { radClosestInd = arrNotes.length - 1; }
      else { radClosestInd = arrNotes.length - 2; }
    } else {
      // else just set the second one at one higher than the first one.
      if (this.ind == 0) radClosestInd = radClosestInd + 1;
    }
    // is it different from current radius?
    if (radClosestInd != this.noteInd) {
      this.noteOn(arrNotes[radClosestInd]);
      this.beacon.noteOn();
      if (this.isVisible) playNote(arrNotes[radClosestInd], this.ind, 0, false);
    }    
    // Now ease towards rotation
    var ease = 0.02 + this.ind*0.02;
    // what rotation do we want to be at, to feel like it's held by user?
    this.rotationTarg = (Math.atan2(yMouseCenter, xMouseCenter)) % (MATH_PI*2);
    this.rotation = (this.rotation + ((this.rotationTarg - this.rotation) * ease)) % (MATH_PI*2);
    // calculate x, y position for this note
    xb = xCenter + Math.cos(this.rotation) * this.radius;
    yb = yCenter + Math.sin(this.rotation) * this.radius;
    
  // --------------------------------------
  // Normal mode when music is playing.
  // --------------------------------------
  } else {
    
    // are we warming up?
    if (this.isWarmingUp) {
      // target rotation for where we're trying to get to to start the piece
      // start at the top, at 12:00
      var rotTarg = MATH_PI/2;
      // how far are we in the warmup process?
      var r = tWarmup / TIME_WARMUP_TOTAL;
      // raise the r to a value so it eases out a little bit.
      this.rotation = lerp(this.rotationWarmupStart, rotTarg, Math.pow(r,0.8));
      
    // else follow the normal pace of the song
    } else {
      // Note that it's counter-intuitive, but both pianists are always at the SAME rotation, 
      // based on the master tempo. rotation is simply a constant time marker. So we use the main pianist
      // how many total notes should I have played by this point?
      var notesPlayedByNow = NOTES_PER_SECOND * tMaster;
      // what position on the clock does that put me at? Subtract a quarter so it starts at the top like a clock.
      this.rotation = (MATH_PI * 2) * notesPlayedByNow / NOTES_IN_FULL_SPIN + MATH_PI/2;
    }
    
    // calculate x, y position for this note
    xb = xCenter + Math.cos(this.rotation) * this.radius;
    yb = yCenter + Math.sin(this.rotation) * this.radius;
  }
  
  // set it to the new position
  this.beacon.setPos(xb, yb);
  
  // how far did we move?
  var dx = xb - this.xDrawPrev;
  var dy = yb - this.yDrawPrev;
  var distSqrd = dx*dx + dy*dy;
  // don't draw if we haven't moved very far
  if (distSqrd < 2) {
    return;
  }
  
  // store previous point and new point
  this.v0 = this.v1; 
  this.v1 = this.v2;
  this.v2 = makePoint(xb, yb);
  // calculate next midpoint
	var xmi0 = this.v0.x + 0.5*(this.v1.x-this.v0.x); var ymi0 = this.v0.y + 0.5*(this.v1.y-this.v0.y); 
	var xmi1 = this.v1.x + 0.5*(this.v2.x-this.v1.x); var ymi1 = this.v1.y + 0.5*(this.v2.y-this.v1.y); 
  
  // wait until we have two points
  if (this.ctPts <= 2) {
    this.ctPts++; return;
  } else {
      if (this.isVisible) {
        // Firefox only works with the word "multiply."
        // Chrome seems fine with either 'darker' or 'multiply' - both show same.        
        this.cv.globalCompositeOperation = (isMobile && !(mobileOS == 'iOS')) ? 'normal' : 'multiply';
        this.cv.beginPath();
        this.cv.moveTo(xmi0, ymi0);
        
      	// draw line to new node - control pt x y, then actual point x y
      	this.cv.quadraticCurveTo(this.v1.x, this.v1.y, xmi1, ymi1);
        //if (this.ind == 0) console.log("curveTo : " + this.v1.x + ", " + this.v1.y + ", " + xmi1 + ", " + ymi1);
      	this.cv.strokeStyle = getColor(this.colCurr);
      	this.cv.lineWidth = this.strCurr;
        this.cv.stroke();
        this.cv.closePath();
      }
  } 
  this.ratCol = lim(this.ratCol + this.fadeInSpd * timeDelta, 0, 1);
  
  // store for next update
  this.xDrawPrev = xb; this.yDrawPrev = yb;
}

/**
 * ------------------------------------------------	
 * Reset stroke to lowest value so it fades in from zero.
 * ------------------------------------------------	
 */
Track.prototype.resetStroke = function(fadeInSpdPm) {
  this.fadeInSpd = fadeInSpdPm;
  this.ratCol = 0;
}

/**
 * ------------------------------------------------	
 * Update my radius values based on window size.
 * ------------------------------------------------	
 */
Track.prototype.updateRadius = function() {
  // link me to the beacon object
  // is the window portrait (phones) or wide (browser)
  var shorterSide = width < height ? width : height;
  // radius values for lowest and highest notes (px)  
  this.radiusMax = shorterSide*0.43;
  if (this.radiusMax > this.radiusLimitMax) {
    this.radiusMax = this.radiusLimitMax;
  }
  this.radiusMin = this.radiusMax*0.33;
  // set 0 to 1 ratio of how the radius is in our appropriate range.
  if (this.radiusMax <= this.radiusLimitMin) {
    this.radiusRatio = 0;
  } else {
    this.radiusRatio = (this.radiusMax - this.radiusLimitMin) / (this.radiusLimitMax - this.radiusLimitMin);
  }
  // Set stroke width appropriate to widnow size
  this.strCurr = lerp(this.strMin, this.strMax, this.radiusRatio);
  // initialize radius on the first run?
  // construct the radius values
  var steps = this.noteMax - this.noteMin + 1;
  var stepSize = (this.radiusMax - this.radiusMin) / (steps - 1);
  var r = this.radiusMin;
  var r;
  for (var i = 0; i < arrNotes.length; i++) {
    if (i > 0) {
      // how many steps away is this new note?
      r += stepSize * (arrNotes[i] - arrNotes[i-1]);
    }
    this.arrRadius[i] = r;
  }
}

/**
 * ------------------------------------------------	
 * Begin warmup.
 * ------------------------------------------------	
 */
Track.prototype.beginWarmup = function() {
  // start on the primary pianist on the largest radius, outside.
  this.radius = this.arrRadius[arrNotes.length-1];
  // start at a random'ish rotation
  this.rotationWarmupStart = this.rotation = 0.25*MATH_PI - Math.random()*0.1;
}

/**
 * ------------------------------------------------	
 * Triggered the moment the second pianist is entering.
 * ------------------------------------------------	
 */
Track.prototype.secondPianistEntered = function() {
  this.radius = this.arrRadius[0];
  // Start stroke at alpha. Give it a ratio 0 to 1 of how quickly
  // it will fade up to full alpha.
  this.resetStroke(0.95);
}


/**
 * ------------------------------------------------	
 * Set my visibility.
 * ------------------------------------------------	
 */
Track.prototype.setVisible = function(bool) {
  this.isVisible = bool;
}

/**
 * ------------------------------------------------	
 * Link me to my Beacon object.
 * ------------------------------------------------	
 */
Track.prototype.linkTo = function(beaconPm) {
  // link me to the beacon object
  this.beacon = beaconPm;
}



