
// --------------------------------------------------
// Global Constants.
// --------------------------------------------------
// Store PI as global constant.
var MATH_PI = Math.PI;
// How often to run our update function? In milliseconds. so 33 would be around 30 frames per second.
var UPDATE_INTERVAL = 17;	
// Track gain value to adjust overall volume of the samples, ratio 0 to 1. This is first
// step in the mix, pre-panning and pre-compression.
var MASTER_GAIN = 0.9;
// Track panning. Left channel will go -n, Right channel will go +n. (0 to 1)
// ** This works but on phones it seems to be using the left speaker.
// Maybe should do a device detection and adjust?
var TRACK_PAN_NORMAL = 0.9;
var TRACK_PAN_MOBILE = 0.6;
var TRACK_PAN;
// Warmup time (seconds)
var TIME_WARMUP_TOTAL = 3.0;
// how often to overlay a rectangle (in millseconds) for fade out of old lines
var TIME_BETWEEN_DIMMING = 0.22;
// How many notes per batch of melody
var NOTES_PER_BATCH = 12;
// How many batches of twelve notes should the second pianist sit out for?
var SECOND_PIANIST_WAITS_FOR = 4;
// How many batches (12 notes each) do we speed up for?
var SECOND_PIANIST_SPEEDS_UP_FOR = 8;
// How many batches (12 notes each) do we hold tempo for?
var SECOND_PIANIST_HOLDS_FOR = 8;
// How many pianists do we have?
var PIANISTS = 2; 
// Tempo of the main pianist in left channel
var TEMPO_MASTER = 199;
//var TEMPO_MASTER = 110;
// Note length - e.g. 0.5 means eighth note.
var NOTE_LENGTH = 0.5;
// How many notes per second, based on that?
var NOTES_PER_SECOND = TEMPO_MASTER / 60 / NOTE_LENGTH;
// how many notes do you want to fit into the full clock rotation?
// make this a multiple of 12 so it lines up nicely.
var NOTES_IN_FULL_SPIN = 96;
// how many radians per note?
var RADIANS_PER_NOTE = ( 2*MATH_PI )  / NOTES_IN_FULL_SPIN;
// Calculate the ratio difference between tempos. Basically, just add 1 to the amount
// of notes we'd want to play. So say we set it to 4x12 = 48 notes for the "speed up" portion.
// That means pianist two needs to play 49 notes in the same time period, so the ratio of tempos
// is simply 49/48.		
var TEMPO_RATIO = ((SECOND_PIANIST_SPEEDS_UP_FOR * NOTES_PER_BATCH) + 1) / (SECOND_PIANIST_SPEEDS_UP_FOR * NOTES_PER_BATCH);
//var TEMPO_SPEED_UP = NOTES_PER_SECOND_DURING_SPEED_UP * 60 * NOTE_LENGTH;
var TEMPO_SPEED_UP = TEMPO_MASTER * TEMPO_RATIO;
// How much total time will the second pianist spend waiting?
var TIME_SPENT_WAITING = (SECOND_PIANIST_WAITS_FOR * NOTES_PER_BATCH * NOTE_LENGTH) / TEMPO_MASTER * 60;
// Force mobile mode to test how it would look on mobile.
var FORCE_MOBILE_FOR_TESTING = false;

// --------------------------------------------------
// Global variables
// --------------------------------------------------
// Array to store pianists.
var arrPianists = new Array();
// array of notes that we want to load - these correspond to piano_##.wav
// based on their midi value
var arrNotes = [40,42,47,49,50]; var notes = arrNotes.length;
// a lookup table based on midi value, since we only need a few files for this song
var arrMidiLookup = new Array(128);
// the Web Audio "context" object
var context = null;		
// width of the movie
var width, height;
// computer mute
var isComputerMuted = false;
// is the overlay currently showing?
var isAboutOverlayShowing = false;

// tMaster: global clock time position, in seconds, since the performance began.
// tBeganWarmup: time the warmup began.
// tBeganPerformance: time the performance started
var tMaster, tWarmup, tBeganPerformance, tBeganWarmup;
// for audio api
var contextClass, context, soundLoader;
// nodes for the auto-played computer notes
var nodeSplitAutoPianist1;
var nodeSplitAutoPianist2;
var nodeMergeAutoPianist1;
var nodeMergeAutoPianist2;
var nodeGainAutoPianist1L;
var nodeGainAutoPianist1R;
var nodeGainAutoPianist2L;
var nodeGainAutoPianist2R;
// nodes for the user-played notes
var nodeSplitUserPianist1;
var nodeSplitUserPianist2;
var nodeMergeUserPianist1;
var nodeMergeUserPianist2;		
var nodeGainUserPianist1L;
var nodeGainUserPianist1R;
var nodeGainUserPianist2L;
var nodeGainUserPianist2R;
// compressor node to bus the whole mix
var nodeCompressor;
// my array of sound buffers
var bufferList;
// world origin coordinates, center of the world
// future-proofing to translate the whole world
var worldOriginX = 0; var worldOriginY = 0;
// initialize timer variable and frame counter
var t0, t1;
// are we currently warming up
var isWarmingUp = true;
// first time running resize funciton?
var needToInitializeCanvas = true;
var cvo0, cv0, cvo1, cv1, cv2, cvo2;
// mobile check
var isMobile; var mobileOS;
// is splash screen showing
var isSplashShowing = false;
// use the splash screen? - set later, as it's needed for iOS only
var useSplash = false;

// ----------------------------------------------
// Initialize
// ----------------------------------------------
window.addEventListener('load', function() {

  // Check if we're on mobile - android, iOS, etc.
	if (FORCE_MOBILE_FOR_TESTING) isMobile = true;
	else isMobile = mobilecheck();
	mobileOS = getMobileOperatingSystem();
	if (mobileOS == 'iOS') useSplash = true;
  
  // create canvases
  cvo0 = document.getElementById("canvas0");
  cv0 = cvo0.getContext("2d");
  cvo1 = document.getElementById("canvas1");
  cv1 = cvo1.getContext("2d");  
  cvo2 = document.getElementById("canvas2"); // added second canvas to try css blending alternate
  cv2 = cvo1.getContext("2d");  
		
	// about link div item
	this.elmAbout = document.getElementById("about");
	this.elmOverlay = document.getElementById("overlay");
	this.elmOverlayInner = document.getElementById("overlay-inner");
	this.elmSplash = document.getElementById("splash");
	this.elmSplashInner = document.getElementById("splash-inner");
	this.elmSplashImage = document.getElementById("splash-image");
	
	if (useSplash) {
	  this.elmSplash.className = "show";
	  isSplashShowing = true;
	}
	  
	// Create Web Audio Context, future proofed for future browsers
	contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
	if (contextClass) {
		context = new contextClass();
	} else {
		// Web Audio API not available. Ask user to use a supported browser.
	}

	// nodes for the auto-played computer notes
	nodeSplitAutoPianist1 = context.createChannelSplitter(2);
	nodeSplitAutoPianist2 = context.createChannelSplitter(2);
	nodeMergeAutoPianist1 = context.createChannelMerger(2);
	nodeMergeAutoPianist2 = context.createChannelMerger(2);
	nodeGainAutoPianist1L = context.createGain();
	nodeGainAutoPianist1R = context.createGain();
	nodeGainAutoPianist2L = context.createGain();
	nodeGainAutoPianist2R = context.createGain();
	// nodes for the user-played notes
	nodeSplitUserPianist1 = context.createChannelSplitter(2);
	nodeSplitUserPianist2 = context.createChannelSplitter(2);
	nodeMergeUserPianist1 = context.createChannelMerger(2);
	nodeMergeUserPianist2 = context.createChannelMerger(2);			
	nodeGainUserPianist1L = context.createGain();
	nodeGainUserPianist1R = context.createGain();
	nodeGainUserPianist2L = context.createGain();
	nodeGainUserPianist2R = context.createGain();
	// compressor to control the mix output volume
	nodeCompressor = context.createDynamicsCompressor();
	nodeCompressor.threshold.value = -30;
	nodeCompressor.ratio.value = 2.0;
	nodeCompressor.attack.value = 0.002;
	nodeCompressor.release.value = 0.15;
	// chain and connect everything now. First the auto-played computer notes.
	nodeSplitAutoPianist1.connect(nodeGainAutoPianist1L, 0);
	nodeSplitAutoPianist1.connect(nodeGainAutoPianist1R, 1);
	nodeSplitAutoPianist2.connect(nodeGainAutoPianist2L, 0);
	nodeSplitAutoPianist2.connect(nodeGainAutoPianist2R, 1);
	nodeGainAutoPianist1L.connect(nodeMergeAutoPianist1, 0, 0);
	nodeGainAutoPianist1R.connect(nodeMergeAutoPianist1, 0, 1);
	nodeGainAutoPianist2L.connect(nodeMergeAutoPianist2, 0, 0);
	nodeGainAutoPianist2R.connect(nodeMergeAutoPianist2, 0, 1);
	// And now the user-generated notes.
	nodeSplitUserPianist1.connect(nodeGainUserPianist1L, 0);
	nodeSplitUserPianist1.connect(nodeGainUserPianist1R, 1);
	nodeSplitUserPianist2.connect(nodeGainUserPianist2L, 0);
	nodeSplitUserPianist2.connect(nodeGainUserPianist2R, 1);
	nodeGainUserPianist1L.connect(nodeMergeUserPianist1, 0, 0);
	nodeGainUserPianist1R.connect(nodeMergeUserPianist1, 0, 1);
	nodeGainUserPianist2L.connect(nodeMergeUserPianist2, 0, 0);
	nodeGainUserPianist2R.connect(nodeMergeUserPianist2, 0, 1);			
	// now connect all the mergers to the compressor.
	nodeMergeAutoPianist1.connect(nodeCompressor);
	nodeMergeAutoPianist2.connect(nodeCompressor);
	nodeMergeUserPianist1.connect(nodeCompressor);
	nodeMergeUserPianist2.connect(nodeCompressor);
	// And connect the compressor to the output.
	nodeCompressor.connect(context.destination);
	// Set the right gain values to simulate panning. This never changes.
	TRACK_PAN = isMobile ? TRACK_PAN_MOBILE : TRACK_PAN_NORMAL;
	
	nodeGainAutoPianist1L.gain.value = TRACK_PAN * MASTER_GAIN;
	nodeGainAutoPianist1R.gain.value = (1-TRACK_PAN) * MASTER_GAIN;
	nodeGainAutoPianist2L.gain.value = (1-TRACK_PAN) * MASTER_GAIN;
	nodeGainAutoPianist2R.gain.value = TRACK_PAN * MASTER_GAIN;
	// And now for the user's output.
	nodeGainUserPianist1L.gain.value = TRACK_PAN * MASTER_GAIN;
	nodeGainUserPianist1R.gain.value = (1-TRACK_PAN) * MASTER_GAIN;
	nodeGainUserPianist2L.gain.value = (1-TRACK_PAN) * MASTER_GAIN;
	nodeGainUserPianist2R.gain.value = TRACK_PAN * MASTER_GAIN;
	

	// create array of filenames to load
	var arrUrl = new Array(); var pre;
	// what file number do you want to start on?
	var num, suffix;
	// We make a giant array for all the notes. It's two sample sets
	// of the same notes. The first pianist mp3's are stored in 
	// 0 through n, second pianist goes from n + 1 through n*2-1 slots.
	for (var j = 0; j < 2; j++) {
  	// The files are named piano_##_a.mp3 or piano_##_b.mp3
	  suffix = j == 0 ? "a" : "b";
	  // Go through notes.
  	for (var i = 0; i < notes; i++) {
  		//if (num < 10) pre = '0'; else pre = '';
  		num = arrNotes[i];
  		arrMidiLookup[num] = i; // make a reverse lookup table
  		// try wav's for the audio capture?
  		arrUrl.push('audio/piano_dual_true_stereo/piano_' + num + '_' + suffix + '.mp3'); num++;
  	}
  }
	
	bufferLoader = new BufferLoader(context, arrUrl, finishedLoading);
	bufferLoader.load();
	
	// create PIANISTS
	for (var i = 0; i < PIANISTS; i++) {
		arrPianists[i] = new Pianist(i, notes);
	}	
	
  $('#splash')
  	.bind('mousedown', function(e) {
      userEngagedSplash();
    })
    //.bind('touchstart', function(e) {
    .bind('touchend', function(e) { // **** - tried switching to touchend to fix bugs on iOS
      userEngagedSplash();
    });
	
    rsize();	
});

// play a particular note number - based on midi value
var playNote = function(midiValue, indPianist, atTime, byComputer) {

	var note = arrMidiLookup[midiValue]; // find the position for that midi file
	var source = context.createBufferSource();
	var nodeSplit;
	source.buffer = bufferList[note]; // connect to the file
	if (byComputer) {
		nodeSplit = indPianist == 0 ? nodeSplitAutoPianist1 : nodeSplitAutoPianist2;
		source.connect(nodeSplit);				
	} else {
		nodeSplit = indPianist == 0 ? nodeSplitUserPianist1 : nodeSplitUserPianist2;
		source.connect(nodeSplit);				
	}
	source.start(atTime); // play it
};

var frequencyFromNoteNumber = function(note) {
	return 440 * Math.pow(2,(note-69)/12);
};

// what to do when we're done loading sounds
var finishedLoading = function(bufferListPm) {
	bufferList = bufferListPm;
	// if we're not using the splash screen, automatically begin the warm up -
	// otherwise beginWarmup is triggered when user clicks on the splash button
	if (!useSplash) beginWarmup();
};

/**
 * ------------------------------------------------	
 * User clicked the splash screen to begin.
 * ------------------------------------------------	
 */
var userEngagedSplash = function() {
  if (isSplashShowing) {
    // hack to try to force iOS to play a sound to enable web audio api
    // parameters: midi value, pianists number, atTime (sound offset), byComputer
    playNote(50, 0, 0, true);
    beginWarmup();
  
    // fade out the main text overlay
    $('#splash').className = "hide";
    $('#splash').fadeOut('fast');
    isSplashShowing = false;
  }
}
/**
 * ------------------------------------------------	
 * Update loop run via requestAnimationFrame.
 * ------------------------------------------------	
 */
var render = function() {
	t1 = context.currentTime;
	timeDelta = t1-t0;
	// clear entire canvas 0 (the one the dots are on)
	// *** optimize this later to only clear a rectangle around the dots
	var beacon0 = arrPianists[0].beacon;
	var beacon1 = arrPianists[1].beacon;
	var x0 = beacon0.getX(); var y0 = beacon0.getY();
	var x1 = beacon1.getX(); var y1 = beacon1.getY();
	var xMin, xMax, yMin, yMax;
	var radius = 20; // make this big enough that it will always cover
	if (x0 < x1) {
	  xMin = x0; xMax = x1;
	} else {
	  xMin = x1; xMax = x0;
	}
	if (y0 < y1) {
	  yMin = y0; yMax = y1;
	} else {
	  yMin = y1; yMax = y0;
	}
	//cv1.clearRect(0, 0, width, height);
	cv1.clearRect(xMin - radius, yMin - radius, xMax-xMin + radius*2, yMax-yMin + radius*2);
	
	// ---------------------------------
	// While we are in warmup mode.
	// ---------------------------------
	if (isWarmingUp) {
		tWarmup = t1 - tBeganWarmup ;
		// are we done warming up?
		if (tWarmup> TIME_WARMUP_TOTAL) {
			beginPerformance();
			isWarmingUp = false;
		} else {
			
		}
		
	// ---------------------------------
	// Normal mode.
	// ---------------------------------
	} else {
	
		// update global time keeper
		tMaster = t1 - tBeganPerformance;
		var elapsedSinceFade = t1 - tDimmedScreenLast;
		if (elapsedSinceFade > TIME_BETWEEN_DIMMING) {
			// draw a faint white rectangle over the whole canvas
			cv0.globalCompositeOperation = (isMobile && !(mobileOS == 'iOS')) ? 'normal' : 'screen';
			cv0.fillStyle = 'rgba(255, 255, 255, 0.05)';
			cv0.fillRect(0, 0, width, height);
			tDimmedScreenLast = t1;
		}		
	}
	
	// Update the tracks
	for (var i = 0; i < PIANISTS; i++) {
		arrPianists[i].upd(timeDelta, t1);
		arrPianists[i].track.upd(timeDelta);
		arrPianists[i].beacon.upd();
	}
	// increment for the next loop
	t0 = t1;			
	// next frame
	requestAnimFrame(render);
};

/**
 * ------------------------------------------------	
 * Clicked (or touched) about link.
 * ------------------------------------------------	
 */
var clickedAboutLink = function() {
  if (!isAboutOverlayShowing) {
    openOverlay();
    rsize();
  }  
};

/**
 * ------------------------------------------------	
 * Close the info overlay.
 * ------------------------------------------------	
 */
var closeOverlay = function() {
  // ***** - iOS bug - it's triggering closeOverlay somehow when
  // I click the ? link
	for (var i = 0; i < PIANISTS; i++) {
		arrPianists[i].resumePerformance();
	}
  
  // fade out the main text overlay
  $('#overlay').className = "hide";
  $('#overlay').fadeOut('fast');
  // fade the ? link back in
  $('#about').className = "show";
  $('#about').fadeIn('fast');
  isAboutOverlayShowing = false;
};

/**
 * ------------------------------------------------	
 * Open the info overlay.
 * ------------------------------------------------	
 */
var openOverlay = function() {

	for (var i = 0; i < PIANISTS; i++) {
		arrPianists[i].pausePerformance();
	}
  
  $('#overlay').className = "show";
  $('#overlay').fadeIn('slow');
  // fade out the ? link back in
  $('#about').className = "hide";
  $('#about').fadeOut('fast');
  isAboutOverlayShowing = true;        
};

/**
 * ------------------------------------------------	
 * Begin dots' warmup before the song begins.
 * ------------------------------------------------	
 */
var beginWarmup = function() {
	
  rsize();
  
  this.elmAbout.innerHTML = "<a id=\"aboutLink\" href=\"#\" >&nbsp;&nbsp;?&nbsp;</a>";
  // temporary - show the mobileOS for testing purposes
  //this.elmAbout.innerHTML = "<a id=\"aboutLink\" href=\"#\" >&nbsp;&nbsp;" + mobileOS + "&nbsp;</a>";

  // reveal the question mark now.
  $('#about').className = "show";

  // *** - trying to disable this on iOS because it seems to fire both mouse events and touch events on iOS
  if (mobileOS != 'iOS') { 
  	$('#aboutLink').click(function(e){
  	  clickedAboutLink();	  
    });  
    $('#overlay').on({
      'click' : function(){ closeOverlay(); }
    });
  }
  
  $('#aboutLink').on({
    'touchstart' : function(){ clickedAboutLink(); }
    //'touchend' : function(){ clickedAboutLink(); } // *** tried switching to touch end to fix bug on iOS
  });
  $('#overlay').on({
    'touchstart' : function(){ closeOverlay(); }
    //'touchend' : function(){ closeOverlay(); } // *** tried switching to touch end to fix bug on iOS
  });
  
  $('#dots-layer')
  	.bind('mousedown', function(e) {
  		// pause the performance.
  		for (var i = 0; i < PIANISTS; i++) {
  			arrPianists[i].pausePerformance();
  			arrPianists[i].beacon.startGrab();
  		}

  		mouse.set(e.clientX, e.clientY);
  		$(window)
  		.bind('mousemove', drag)
  		.bind('mouseup', dragEnd);
  	})
  	.bind('touchstart', function(e) {
      
  		// pause the performance.
  		for (var i = 0; i < PIANISTS; i++) {
  			arrPianists[i].pausePerformance();
  			arrPianists[i].beacon.startGrab();
  		}
  		e.preventDefault();
  		var touch = e.originalEvent.changedTouches[0];
  		mouse.set(touch.pageX, touch.pageY);
  	$(window)
  		.bind('touchmove', touchDrag)
  		.bind('touchend', touchEnd);
  	return false;
  	
  }); 
  
	//tBeganWarmup = context.currentTime;
	// *** Alex - I think I need to fix this too
	tBeganWarmup = context.currentTime;
	// Tell pianists to begin warming up.
	for (var i = 0; i < PIANISTS; i++) {
		arrPianists[i].beginWarmup();
	}
	// start the drawing loop.			
	requestAnimFrame(render);  
};

/**
 * ------------------------------------------------	
 * Begin performance of piece.
 * ------------------------------------------------	
 */
var beginPerformance = function() {
  
	// start the master clock for the song.
	tMaster = 0.0;
	// initialize the timers.
	// tDimmedScreenLast = tBeganPerformance = t0 = context.currentTime;
	tDimmedScreenLast = tBeganPerformance = t0 = context.currentTime;
	// Tell PIANISTS to begin.
	for (var i = 0; i < PIANISTS; i++) {
		arrPianists[i].beginPerformance();
	}
}

/**
 * ------------------------------------------------	
 * stop all the sounds being played by the computer.
 * ------------------------------------------------	
 */		
var muteComputer = function() {
	// nodeGainComputer.gain.value = 0.0;
	nodeGainAutoPianist1L.gain.value = 0.0;
	nodeGainAutoPianist1R.gain.value = 0.0;
	nodeGainAutoPianist2L.gain.value = 0.0;
	nodeGainAutoPianist2R.gain.value = 0.0;
	isComputerMuted = true;
}

/**
 * ------------------------------------------------	
 * Restore sounds played by computer.
 * ------------------------------------------------	
 */		
var unmuteComputer = function() {
	nodeGainAutoPianist1L.gain.value = TRACK_PAN * MASTER_GAIN;
	nodeGainAutoPianist1R.gain.value = 1-TRACK_PAN * MASTER_GAIN;
	nodeGainAutoPianist2L.gain.value = 1-TRACK_PAN * MASTER_GAIN;
	nodeGainAutoPianist2R.gain.value = TRACK_PAN * MASTER_GAIN;
	isComputerMuted = false;
}
		
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60); // it's not using this, it's just the fallback.
          };
})();

var finishedFile = function(bufferPm) {
  bufferLoader.finishedFile(bufferPm);
};

// ------------------------------------------------------
// Interactivity. (From two.js samples.)
// ------------------------------------------------------
var xUser, yUser, mouse = new Two.Vector(), randomness = 2;

var drag = function(e) {
      xUser = e.clientX;
      yUser = e.clientY;			
	mouse.set(xUser, yUser);
};

var dragEnd = function(e) {
	// resume the performance.
	for (var i = 0; i < PIANISTS; i++) {
		arrPianists[i].resumePerformance();
		arrPianists[i].beacon.stopGrab();				
	}

	$(window)
		.unbind('mousemove', drag)
		.unbind('mouseup', dragEnd);
};

var touchDrag = function(e) {
	e.preventDefault();
	var touch = e.originalEvent.changedTouches[0];
	drag({
		clientX: touch.pageX,
		clientY: touch.pageY
	});
	return false;
};
var touchEnd = function(e) {  
	// resume the performance.
	for (var i = 0; i < PIANISTS; i++) {
		arrPianists[i].resumePerformance();
		arrPianists[i].beacon.stopGrab();				
	}			
	e.preventDefault();
	$(window)
		.unbind('touchmove', touchDrag)
		.unbind('touchend', touchEnd);
	return false;
};

// ------------------------------------------------------
// More universal functions.
// ------------------------------------------------------
    function makePoint(x, y) {
      if (arguments.length <= 1) {
        y = x.y;
        x = x.x;
      }

      var v = new Two.Vector(x, y);
      v.position = new Two.Vector().copy(v);
      return v;
    }

// convert color - rgba format
function getColor(color) {
	var r = Math.round(color[0]);
	var g = Math.round(color[1]);
	var b = Math.round(color[2]);
	var a = (color[3]);
	return 'rgba('+r+','+g+','+b+','+a+')';
}
// convert color - rgba format, but ignore alpha, set to custom alpha
function getColorMinusAlpha(color, alp) {
	var r = Math.round(color[0]);
	var g = Math.round(color[1]);
	var b = Math.round(color[2]);
	var a = alp;
	return 'rgba('+r+','+g+','+b+','+a+')';
}		
// linear extrapolate
function lerp(a, b, t) {
	return a + (b-a)*t;
}
function lerpColor(a, b, t) { 
	var c1 = lerp(a[0], b[0], t);
	var c2 = lerp(a[1], b[1], t);
	var c3 = lerp(a[2], b[2], t);
	var c4 = lerp(a[3], b[3], t);
	return [c1, c2, c3, c4];
}		
// limit to range
function lim(n, n0, n1) {
	if (n < n0) { return n0; } else if (n >= n1) { return n1; } else { return n; }
}
// return the sign of a number. -1 if negative, 1 if it's zero or positive.
function sign(n) {
	if (n < 0) return -1;
	else return 1;
}

// When window is resized
function rsize(e) {
  
  var lastWidth = width;
  var lastHeight = height;
  
	width = window.innerWidth;
	height = window.innerHeight;
	// did it not change?
  var isSameSize = (lastWidth == width) && (lastHeight == height);
  
	xCenter = Math.round(width / 2);
	yCenter = Math.round(height / 2);
  
	// make the canvas objects match window size
	if ((cvo0 != null) && (!isSameSize || needToInitializeCanvas)) {
	  if (needToInitializeCanvas) needToInitializeCanvas = false;
	  cvo0.width = cvo1.width = window.innerWidth;
    cvo0.height = cvo1.height = window.innerHeight;
  // set line style (for some reason it needed to be done here...)
    cv0.lineCap = cv1.lineCap = 'butt';
  }

  if (this.elmAbout != null) {
  	// move the about ? box
  	this.elmAbout.style.left = (width - 45) + "px";
  	this.elmAbout.style.top = (height - 42) + "px";
  	// width of the overlay about text
  	var maxWidth = 550;
  	if (width > maxWidth) {
  	  this.elmOverlayInner.style.width = maxWidth + "px";
  	  this.elmOverlayInner.style.left = Math.round((width - maxWidth)/2) + "px";
  	} else {
  	  this.elmOverlayInner.style.width = width + "px";
  	  this.elmOverlayInner.style.left = 0 + "px";
  	}  	
  	var overlayTextHeight = document.getElementById('overlay-inner').clientHeight;
  	this.elmOverlayInner.style.top = (height - overlayTextHeight) / 2 + "px";
  	
  	// width of the enter arrow
  	var splashWidthIdeal = 100;
  	var splashWidthMax = Math.round(width * 0.7);
  	var splashWidthUse;
  	if (splashWidthMax < splashWidthIdeal) {
  	  splashWidthUse = splashWidthMax;
  	} else {
  	  splashWidthUse = splashWidthIdeal;
  	}
    this.elmSplashInner.style.width = this.elmSplashInner.style.height = splashWidthUse + "px";
    this.elmSplashImage.style.width = this.elmSplashImage.style.height = splashWidthUse + "px";
    this.elmSplashInner.style.left = (width - splashWidthUse)*0.5 + "px";
  	// enter arrow
  	var splashHeight = document.getElementById('splash-inner').clientHeight;
  	this.elmSplashInner.style.top = (height - splashHeight) / 2 + "px";
  	
  }  

	
	for (var i = 0; i < PIANISTS; i++) {
		if (arrPianists[i]) {
		  arrPianists[i].track.updateRadius();
		  // makes alpha 0 so we don't have weird glitch
		  // marks during the resize.
		  arrPianists[i].track.resetStroke(0.8); 
		  arrPianists[i].beacon.updateSize();
	  }
	}
}
// Check if it's mobile because it doesn't render right on mobile
function mobilecheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

/**
 * Determine the mobile operating system.
 * This function either returns 'iOS', 'Android' or 'unknown'
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    return 'iOS';
  }
  else if( userAgent.match( /Android/i ) )
  {
    return 'Android';
  }
  else
  {
    return 'Other';
  }
}

window.addEventListener('resize', rsize, false);
rsize();
