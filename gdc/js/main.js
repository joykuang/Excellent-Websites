$(function() {
	  $('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 1500);
	        return false;
	      }
	    }
	  });
});

$('.noback').waypoint(function(direction) {
    document.getElementById('mainnav').style.opacity = 0;
    document.getElementById('stephanie-detail').style.opacity = 0;
    $('#mainnav').css('visibility','hidden');
    $('.arrow-wrap').css('visibility','visible');
});


$('#stephanie').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(1) a').css('color','#000000');
  $('#mainnav').css('visibility','visible');
  document.getElementById('stephanie-hide').style.opacity = 1;
  document.getElementById('stephanie-title').style.opacity = 1;
  document.getElementById('mainnav').style.opacity = 1;
  document.getElementById('stephanie-detail').style.opacity = 1;
  }, {
   offset: 300
});

$('#stephanie').waypoint(function(up) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(1) a').css('color','#000000');
}, {
   offset: -1
});


$('#robert').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(2) a').css('color','#000000');
  document.getElementById('robert-hide').style.opacity = 1;
  document.getElementById('robert-title').style.opacity = 1;
  $('.arrow-wrap').css('visibility','hidden');
  }, {
   offset: 300
});

$('#robert').waypoint(function(up) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(2) a').css('color','#000000');
}, {
   offset: -1
});

$('#frank').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(4) a').css('color','#000000');
  document.getElementById('frank-hide').style.opacity = 1;
  document.getElementById('frank-title').style.opacity = 1;
  document.getElementById('frank-hide-sequel').style.opacity = 1;
  }, {
   offset: 300
});

$('#frank').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(4) a').css('color','#000000');
}, {
   offset: -1
});

$('#kevin').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(3) a').css('color','#000000');
  document.getElementById('kevin-hide').style.opacity = 1;
  document.getElementById('kevin-title').style.opacity = 1;
  document.getElementById('kevin-hide-sequel').style.opacity = 1;
  }, {
   offset: 300
});

$('#kevin').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(3) a').css('color','#000000');
}, {
   offset: -1
});

$('#ian').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(5) a').css('color','#000000');
  document.getElementById('ian-hide').style.opacity = 1;
  document.getElementById('ian-title').style.opacity = 1;
  document.getElementById('ian-hide-sequel').style.opacity = 1;
  }, {
   offset: 300
});

$('#ian').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(5) a').css('color','#000000');
}, {
   offset: -1
});

$('#ron').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(6) a').css('color','#000000');
  document.getElementById('ron-hide').style.opacity = 1;
  document.getElementById('ron-title').style.opacity = 1;
  document.getElementById('ron-hide-sequel').style.opacity = 1;
  }, {
   offset: 300
});

$('#ron').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(6) a').css('color','#000000');
}, {
   offset: -1
});

$('#dave').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(7) a').css('color','#000000');
  document.getElementById('dave-hide').style.opacity = 1;
  document.getElementById('dave-title').style.opacity = 1;
  document.getElementById('dave-hide-sequel').style.opacity = 1;
  }, {
   offset: 300
});

$('#dave').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(7) a').css('color','#000000');
}, {
   offset: -1
});

$('#silvie').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(8) a').css('color','#000000');
  document.getElementById('silvie-hide').style.opacity = 1;
  document.getElementById('silvie-title').style.opacity = 1;
  document.getElementById('silvie-hide-sequel').style.opacity = 1;
  }, {
   offset: 300
});

$('#silvie').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(8) a').css('color','#000000');
}, {
   offset: -1
});

$('#paul-andrea').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(9) a').css('color','#000000');
  document.getElementById('paul-andrea-hide').style.opacity = 1;
  document.getElementById('paul-andrea-title').style.opacity = 1;
  document.getElementById('paul-andrea-hide-sequel').style.opacity = 1;
  }, {
   offset: 300
});

$('#paul-andrea').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(9) a').css('color','#000000');
}, {
   offset: -1
});
$('#end').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(9) a').css('color','#000000');
  }, {
   offset: 300
});
$('#end').waypoint(function(direction) {
  $('#mainnav ul li a').css('color','#ffffff');
  $('#mainnav ul li:nth-child(10) a').css('color','#000000');
}, {
   offset: 10
});
