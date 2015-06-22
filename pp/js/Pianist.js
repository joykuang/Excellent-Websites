// class:	Pianist
// ------------------------------------------------	
var Pianist = function(indPm, notesPm) {
  // my index number
  this.ind = indPm;
  // how many notes can i play
  this.notes = notesPm;
  // How far ahead to schedule audio (sec)
  // This is calculated from lookahead, and overlaps 
  // with next interval (in case the timer is late)
  this.scheduleAheadTime = 0.1;  
  // my note pattern sequence
  //this.sequence = [0, 1, 2, 3, 4, 1, 0, 3, 2, 1, 4, 3];
  this.sequence = [40, 42, 47, 49, 50, 42, 40, 49, 47, 42, 50, 49];
  // position in the sequence
  this.pos = 0;
  // my panning value, from -1 (full left) to 1 (full right)
  this.pan = indPm == 0 ? -0.8 : 0.8;
  // what time is the next note due
  this.nextBatchTime;
  // how far in advance to run the pre-scheduler checker (in milliseconds)
  this.lookahead = 25.0;
  // paused performance.
  this.isPaused = false;
  // Am I the second pianist?
  this.isSecond = this.ind == 1 ? true : false;
  // Have the secondary pianist start by waiting
  this.isWaiting = this.isSecond ? true : false;
  //this.isWaiting = false;
  // For the secondary pianist, I alternate between speed up mode, and simply
  // holding the regular tempo. Start in speed up mode.
  this.isSpeedingUp = false;
  // How many batches have I played?
  this.batchesPlayed = 0;
  // When will I toggle next from speed up mode to regular mdoe
  this.toggleModeAtBatchNumber = SECOND_PIANIST_WAITS_FOR;
  //this.toggleModeAtBatchNumber = SECOND_PIANIST_WAITS_FOR + SECOND_PIANIST_SPEEDS_UP_FOR;
  // How many times have I skipped forward a note, for the second pianist
  this.skippedForwardNotes = 0;
  // Start in warmup mode.
  this.isWarmingUp = true;
  //
  this.timerID = 0; // a timer for the scheduler look ahead
  //
  this.init();
}

// function:	init
// ------------------------------------------------	
Pianist.prototype.init = function() {
    
  // for each pianist, make a track object linked to me
  this.track = new Track(this, this.ind);
  this.beacon = new Beacon(this, this.track, this.ind);
  this.track.linkTo(this.beacon);
  // If I'm the secondary pianist, start me sped up.
  // **** this may be messed up due to the pre-waiting period.
  if (this.ind == 0) {
    this.setTempo(TEMPO_MASTER);
  } else {
    //this.setTempo(TEMPO_SPEED_UP); //arrTempo[this.ind];
    this.setTempo(TEMPO_MASTER); //arrTempo[this.ind];
  }
}

/**
 * ------------------------------------------------	
 * Begin warmup.
 * ------------------------------------------------	
 */
Pianist.prototype.beginWarmup = function() {
  this.noteIndWarmup = 0;
  this.track.beginWarmup();
}

/**
 * ------------------------------------------------	
 * Begin performance.
 * ------------------------------------------------	
 */
Pianist.prototype.beginPerformance = function() {
  this.isWarmingUp = false;
  this.track.isWarmingUp = false;
  this.nextBatchTime = 0.0;
  // begin by scheduling a batch of notes.
  this.scheduleNextBatch();
  this.noteOn(arrNotes[0]);
}

/**
 * ------------------------------------------------	
 * Schedule the next batch of notes.
 * ------------------------------------------------	
 */
Pianist.prototype.scheduleNextBatch = function() {
  
  //var t = context.currentTime;
  var t = tMaster;
  // is it time to schedule another batch?
  if ((t + this.scheduleAheadTime) >= this.nextBatchTime) {
    var atTime;
    //
    this.batchesPlayed++;
    // The second pianist has a lot of complicated logic to think about.
    if (this.isSecond) {
      // is that the last batch for the secondary pianist to wait it out?
      if ((this.batchesPlayed == SECOND_PIANIST_WAITS_FOR + 1)) {
        this.isWaiting = false;
        // and show it now too.
        this.track.setVisible(true); this.beacon.setVisible(true);
        this.track.secondPianistEntered();
      //
      }
       // Am i in speed up mode?
      if (this.isSpeedingUp) {
        // How many batches have I played? Switch to hold mode?
        if ((this.batchesPlayed == this.toggleModeAtBatchNumber + 1)) {
          this.setTempo(TEMPO_MASTER);
          this.isSpeedingUp = false;
          this.skippedForwardNotes++;
          // when I will switch modes next?
          this.toggleModeAtBatchNumber += SECOND_PIANIST_HOLDS_FOR;
        }
      // Else I'm in holding mode.
      } else {
        // How many batches have I played? Switch to speed up mode?
        if ((this.batchesPlayed == this.toggleModeAtBatchNumber + 1)) {
          this.setTempo(TEMPO_SPEED_UP);
          this.isSpeedingUp = true;
          // when I will switch modes next?
          this.toggleModeAtBatchNumber += SECOND_PIANIST_SPEEDS_UP_FOR;
        }
        
      }
    }
    
    // Go through each of the 12 notes and schedule them.
    for (var i = 0; i < this.sequence.length; i++) {
      // remember that the playNote scheduler uses the total time of context.currentTime,
      // it is not like "schedule this far from NOW" like setTimeOut.
      atTime = (this.nextBatchTime + this.timePerNote * i) + tBeganPerformance;
      // If I'm the secondary pianist and still during my "wait" period, don't play notes.
      if ((!this.isWaiting) && (this.track.isVisible)) {
        playNote(this.sequence[i % this.sequence.length], this.ind, atTime, true);
      }
    }

    // when is the next time we'll schedule a batch?
    this.nextBatchTime = this.nextBatchTime + this.timePerNote * this.sequence.length;
  }
  // prepare a timeout to check this scheduler function again.
  this.timerID = window.setTimeout( this.scheduleNextBatch.bind(this), this.lookAhead );
}

/**
 * ------------------------------------------------	
 * Update function. This only handles graphics, not the sound.
 * The sound is triggered via scheduled batches of 12 notes 
 * in the functions above.
 * ------------------------------------------------	
 */
Pianist.prototype.upd = function(timeDelta, timeCurrent) {
  
  // -----------------------------------
  // Update during warmup mode.
  // -----------------------------------
  if (this.isWarmingUp) {
    // how far are we in the warmup process?
    var r = tWarmup / TIME_WARMUP_TOTAL;
    // Only have the left piano warm up, ignore the other one.
    if (this.ind == 0) {
      // play a few notes
      if ((r >= 0.1) && (this.noteIndWarmup <= 0)) {
        this.track.setVisible(true);
        this.track.resetStroke(0.2);
        this.beacon.setVisible(true);
        this.noteOn(arrNotes[4]); this.noteIndWarmup++;
        // don't play the first note if we use the splash screen,
        // because tapping the thing on mobile triggers the splash
        if (!useSplash) playNote(arrNotes[4], this.ind, 0, true);
      } else if ((r > 0.3) && (this.noteIndWarmup <= 1)) {
        this.noteOn(arrNotes[3]); this.noteIndWarmup++;
        playNote(arrNotes[3], this.ind, 0, true);
      } else if ((r > 0.5) && (this.noteIndWarmup <= 2)) {
        this.noteOn(arrNotes[2]); this.noteIndWarmup++;
        playNote(arrNotes[2], this.ind, 0, true);
      } else if ((r > 0.75) && (this.noteIndWarmup <= 3)) {
        this.noteOn(arrNotes[1]); this.noteIndWarmup++;
        playNote(arrNotes[1], this.ind, 0, true);
      }
    }
    
  // -----------------------------------
  // Update during normal mode.
  // -----------------------------------
  } else {
  
    // figure out posProper, what position within the 12 note sequence I'm at right now.
    var posProper;
    if (this.isPaused) return;

    // If I'm the second pianist, I need to calculate my position more complicated
    if (this.isSecond) {
      if (this.isSpeedingUp) {
        // what position should I currently on out of the sequence, based on the global clock?
        // Note it uses this.tempo, which is changing - It's the sped up tempo when it's in
        // speed up mode, or the master tempo when it's in regular hold mode.
        
        // Fix one bad case in the very beginning when it comes out negative, just hang on.
        if (tMaster < TIME_SPENT_WAITING) {
          posProper = 0;
        } else {
          // The problem is here: The first second pianist first enters, it thinks it has
          // spent time speeding up. So we subtract TIME_SPENT_WAITING to treat its entrance
          // like the zero time.
          // I have not sped up at all, this.tempo is the FASTER tempo, so it thinks I have sped up
          // and my position value is off. So that's why 
          posProper = Math.floor(((tMaster - TIME_SPENT_WAITING) * this.tempo / 60 / NOTE_LENGTH));
        }
        posProper -= this.skippedForwardNotes;
      } else {
        // I'm in a holding pattern. use the MASTER tempo, but add the appropriate amount
        // of notes to make it adjust.
        posProper = Math.floor((tMaster * this.tempo / 60 / NOTE_LENGTH));
        posProper += this.skippedForwardNotes;
      }
    // first pianist is simpler to handle.
    } else {
      // what position should I currently on out of the sequence, based on the global clock?
      posProper = Math.floor((tMaster * this.tempo / 60 / NOTE_LENGTH));
    }
    // Figure out what note that means within the 12 note sequence.
    posProper = posProper % this.sequence.length;
    // is it a new note?
    if (posProper != this.pos) {
      this.pos = posProper;
      if (this.isWaiting) {
        // don't trigger anything.
      } else {
        this.noteOn(this.sequence[this.pos]);
      }
    }
  }
}

/**
 * ------------------------------------------------	
 * Set tempo;
 * ------------------------------------------------	
 */
Pianist.prototype.setTempo = function(t) {
  this.tempo = t;
  // store timePerNote as a constant.
  this.timePerNote = 1 / this.tempo * NOTE_LENGTH * 60;  
}
/**
 * ------------------------------------------------	
 * Return current tempo.
 * ------------------------------------------------	
 */
Pianist.prototype.getTempo = function() {
  return this.tempo;
}

/**
 * ------------------------------------------------	
 * Pause performance. Time continues though,
 * they just stop playing.
 * ------------------------------------------------	
 */
Pianist.prototype.pausePerformance = function() {
  muteComputer();
  this.isPaused = true;
}

/**
 * ------------------------------------------------	
 * Resume performance.
 * ------------------------------------------------	
 */
Pianist.prototype.resumePerformance = function() {
  unmuteComputer();  
  this.isPaused = false;
}

/**
 * ------------------------------------------------	
 * a noteOn event happens every time a note is hit
 * @midiValue is the note, as a midi value.
 * ------------------------------------------------	
 */
Pianist.prototype.noteOn = function(midiValue) {
  // tell global function to make a sound - ** we no longer
  // trigger this here, because now we pre-schedule batches
  // of 12 notes for better timing accuracy.
  // tell Track that we hit a note
  this.track.noteOn(midiValue);
  this.beacon.noteOn();
}