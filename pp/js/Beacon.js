/**
 * ------------------------------------------------	
 * Builds a new Beacon.
 * @pianistPm the pianist I'm linked to.
 * @trackPm the track I'm linked to.
 * ------------------------------------------------	
 */
var Beacon = function(pianistPm, trackPm, indPm) {
  // link to my Track and index number
  this.pianist = pianistPm;
  this.track = trackPm;
  this.ind = indPm;
  // normal radius size - range, based on window size.
  this.radNormMin = 3; this.radNormMax = 6;
  this.radNorm = this.radNormMax;
  // radius when I hit a note
  this.radHitMin = 10; this.radHitMax = 19;
  this.radHit = this.radHitMax;
  // easing value (0 to 1) after I hit a note
  this.easeRadius = 0.2;
  // normally use 100% alpha - for mobile like Android, except iOS,
  // set to use where they're grey, set to slightly faded
  this.alpha = (isMobile && !(mobileOS == 'iOS')) ? 0.6 : 1.0;
  // my current color
  this.colCurr;
  // are they being dragged
  this.isGrabbed = false;
  // are they hovered over by mouse
  this.isHovered = false;
  // Hide initially
  this.isVisible = false;  
  // actual size
  this.rad = this.radNorm;
  //
  this.init();
}

/**
 * ------------------------------------------------	
 * Initialize.
 * ------------------------------------------------	
 */
Beacon.prototype.init = function() {
  
  // set the canvas I draw to
  this.cv = cv1;
  // global settings that don't change
  //this.cv.lineCap = 'round';
  // my position
  this.xp; this.yp;
}

/**
 * ------------------------------------------------	
 * Set my color.
 * @colPm given as an [r,g,b,a] array.
 * ------------------------------------------------	
 */
Beacon.prototype.setColor = function(colPm) {
  
}

/**
 * ------------------------------------------------	
 * Update function.
 * ------------------------------------------------	
 */
Beacon.prototype.noteOn = function() {
  this.rad = this.radHit;
}

/**
 * ------------------------------------------------	
 * Update function.
 * ------------------------------------------------	
 */
Beacon.prototype.upd = function() {
  
  if (this.isVisible) {
    this.cv.beginPath();
    // *** 'darker' mode is the culprit of many bizzare bugs on chrome mobile
    // when some overlap too much they just vanish
    // Firefox only works with the word "multiply."
    // Chrome seems fine with either 'darker' or 'multiply' - both show same.
    this.cv.globalCompositeOperation = (isMobile && !(mobileOS == 'iOS')) ? 'normal' : 'multiply';
    // always decay back towards the regular size
    this.rad = this.rad + (this.radNorm - this.rad) * this.easeRadius;
    //this.cv.fillStyle = '#000000';

    this.cv.fillStyle = getColorMinusAlpha(this.colCurr, this.alpha);
    this.cv.arc(this.xp1 + worldOriginX, this.yp1 + worldOriginY, this.rad, 0, 2*MATH_PI);
    this.cv.fill();
    this.cv.closePath();
  }
}

/**
 * ------------------------------------------------	
 * Start drag by user.
 * ------------------------------------------------	
 */
Beacon.prototype.startGrab = function() {
  // reset the stroke to zero alpha so it doesn't have huge
  // chaotic lines
  this.track.resetStroke(0.1); 
  this.isGrabbed = true;
}

/**
 * ------------------------------------------------	
 * Stop drag by user.
 * ------------------------------------------------	
 */
Beacon.prototype.stopGrab = function() {
  // reset the stroke to zero alpha so it doesn't have huge
  // chaotic lines
  this.track.resetStroke(0.7);   
  this.isGrabbed = false;
}

/**
 * ------------------------------------------------	
 * Set my color
 * ------------------------------------------------	
 */
Beacon.prototype.setColor = function(colPm) {
  this.colCurr = colPm;
}


/**
 * ------------------------------------------------	
 * Update my size limits based on ratio radiusRatio
 * set inside Track.js.
 * ------------------------------------------------	
 */
Beacon.prototype.updateSize = function() {
  var r = this.track.radiusRatio;
  this.radNorm = lerp(this.radNormMin, this.radNormMax, r);
  this.radHit = lerp(this.radHitMin, this.radHitMax, r);
  //this.radNorm = this.radNormMax;
  //this.radHit = this.radHitMax;
}

/**
 * ------------------------------------------------	
 * Set my visibility.
 * ------------------------------------------------	
 */
Beacon.prototype.setVisible = function(bool) {
  this.isVisible = bool;
}
/**
 * ------------------------------------------------	
 * Set position to @x, @y.
 * ------------------------------------------------	
 */
Beacon.prototype.setPos = function(x,y) {
  this.xp1 = x;
  this.yp1 = y;
};

Beacon.prototype.getX = function() {
  return this.xp1;
};
Beacon.prototype.getY = function() {
  return this.yp1;
};

