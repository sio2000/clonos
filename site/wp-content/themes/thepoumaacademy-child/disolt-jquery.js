var $j = jQuery.noConflict();
$j(document).ready(function(){
  /* Change of Enfold - Kriesi Footer*/
  //	#socket > div > span > a
  $j('#socket > div > span > a').contents().filter(function() {
  		return this.nodeType == 3
  	}).each(function(){
  		this.textContent = this.textContent.replace('Enfold Theme by Kriesi','designed by Disolt');
  	});
  $j('#socket > div > span > a').attr("href", "https://disolt.com/").attr({target: "_blank", rel: "noopener noreferrer"});


if($j("body").hasClass("page-id-500")) {
  $j('#avia_4_1').attr('placeholder', 'Εάν ενδιαφέρεστε για επιλογή ώρας και ημέρας ή έχετε απορίες, παρακαλώ συμπληρώστε το μήνυμα σας εδώ.');
}
if($j("body").hasClass("page-id-3")) {
  $j('#pouma-oroi-sec > section > div > #main').addClass('change-pad-oroi');
}

if($j("body").hasClass("home")) {

  $j('#tetrada-icon-arxiki > div:nth-child(1)').on('click', function() {
      window.location.href = 'https://thepoumaacademy.com/agglika-epaggelmaties/'
	});
  $j('#tetrada-icon-arxiki > div:nth-child(2)').on('click', function() {
      window.location.href = 'https://thepoumaacademy.com/agglika-job-interview/'
	});
  $j('#tetrada-icon-arxiki > div:nth-child(3)').on('click', function() {
      window.location.href = 'https://thepoumaacademy.com/agglika-foitites/'
	});
  $j('#tetrada-icon-arxiki > div:nth-child(4)').on('click', function() {
      window.location.href = 'https://thepoumaacademy.com/agglika-proforiki-epikoinonia/'
	});

}

if ($j(window).width() < 900) {
  /*var replaceFoo3 = '<p>Έχετε απορίες; Παρακαλώ επικοινωνήστε με το The Pouma Academy μέσω email στο <a href="mailto:ask@thepoumaacademy.com"><strong>&nbsp; ask@thepoumaacademy.com</strong></a> ή στείλτε μας τις σκέψεις σας <a href="/contact/"><strong>εδώ</strong></a> και θα επικοινωνήσουμε μαζί σας.</p>';
  $j('#text-4 > div > p:nth-child(1)').html(replaceFoo3);*/

  var replaceFoo2 = '<p>Σου αρέσει να εκπαιδεύεις<br>με δημιουργικούς<br>και καινοτόμους τρόπους;</p>';

  $j('#text-2 > div > p:nth-child(1)').html(replaceFoo2);
}
/*if($j("body").hasClass("home")) {
  if ($j(window).width() < 900) {

    var keimeno = '<span id="press-st-fnt">@The Pouma Academy</span> σχεδιάζετε εσείς τα μαθήματα που ταιριάζουν<br>στο δικό σας στόχο μέσα<br>από την υπηρεσία Mix and Match.<br>Πατήστε το κουμπί Mix and Match και μάθετε περισσότερα.';

    $j('#mixmatch-plaisio > div > p').html(keimeno);

    var keimenoDim = 'Γιατί κάποιος να προτιμήσει το Pouma Academy;<br>Διότι μπορώ να κάνω τον μαθητή να αγαπήσει την Αγγλική γλώσσα, να συνδέσει τα Αγγλικά με την καθημερινότητα του. Πατήστε το κουμπί για περισσότερα.';

    $j('#av-layout-grid-2 > div.flex_cell.no_margin.av_two_third.avia-builder-el-60.el_after_av_cell_one_third.avia-builder-el-last > div > section > div > p').html(keimenoDim);

  }
}*/
/*if($j("body").hasClass("home")) {*/
  //$j('#mathites-arx > section > div').delay(5000).fadeIn(1500);
  //$j('#mathites-arx > section > div, #enilikes-arx > section > div').delay(5000).animate({opacity:1},3000);

  /*$j('#pou-diaferoume-icons > ul').delay(2000).animate({width: "100%"},2000);
  $j('#pou-diaferoume-icons > ul > li').delay(5000).animate({opacity:1},3000);
  $j('#testimonials-arxiki > div > div > div').delay(5000).animate({opacity:1},3000);*/

  //$j('#steps-arxiki > ul > li').delay(5000).animate({opacity:1},3000);

  /*
  window.setTimeout(function(){
    //$j('#mathites-arx > section > div').addClass('appearBelow');
    $j('#mathites-arx > section > div').fadeIn();
  }, 5000); //<-- Delay in milliseconds*/

//}
  /*if($j("body").hasClass("home")) {
     if ($j(window).width() > 990) {
      $j(window).on('scroll', function (e) {

        var top = $j(window).scrollTop() + $j(window).height(),
            isVisibleCircle = top > $j('#pouma-reveal').offset().top;

        //var top2 = $j(window).scrollTop() + $j(window).height(),
            //isVisibleCircle2 = top > $j('#enilikes-arx').offset().top;

        $j('#mathites-arx').toggleClass('reveal', isVisibleCircle);
        //$j('#pouma-low-bg > div > div').toggleClass('reveal-2', isVisibleCircle);
        $j('#enilikes-arx').toggleClass('reveal-3', isVisibleCircle);
        //$j('#pouma-low-bg-2 > div > div').toggleClass('reveal-4', isVisibleCircle2);
      });
    }
    else{
      $j('#mathites-arx').toggleClass('reveal');
      //$j('#pouma-low-bg > div > div').toggleClass('reveal-2');
      $j('#enilikes-arx').toggleClass('reveal-3');
      //$j('#pouma-low-bg-2 > div > div').toggleClass('reveal-4');
    }
  }*/
  //for call me now
/*  var $document = $j(document),
      $element = $j('.call-me-now'),
      className = 'hasScrolled';


  $document.scroll(function() {
    if ($document.scrollTop() >= 400) {
      // user scrolled 50 pixels or more;
      // do stuff
      $element.addClass(className);
      //$twitter.addClass(classNameTwitter);
    }
    else {
      $element.removeClass(className);

    }
  });*/

  //for twitter
  /*
  if($j("body").hasClass("home")) {
    var $documentTwitter = $j(document),
        $twitter = $j('.twitter-container-fixed'),
        $fb = $j('.fb-container-fixed'),
        classNameTwitter = 'hasScrolledTwitter';

    $documentTwitter.scroll(function() {
      if ($documentTwitter.scrollTop() >= 400) {
        // user scrolled 50 pixels or more;
        // do stuff
        if ($documentTwitter.scrollTop() >= 2900) {
          $twitter.removeClass(classNameTwitter);
          $fb.removeClass(classNameTwitter);
        }
        else{
          $twitter.addClass(classNameTwitter);
          $fb.addClass(classNameTwitter);
        }
      }
      else {
          $twitter.removeClass(classNameTwitter);
          $fb.removeClass(classNameTwitter);
        }
    });
  }
*/


  /*$j( ".mathites-btn" ).click(function(event) {
    event.preventDefault();
    $j('#mathites-text').text('Στο The Pouma Academy πραγματοποιούμε μαθήματα που στοχεύουν στην ουσιαστική χρήση της γλώσσας και στην απόκτηση πτυχίων σε επίπεδο B2,C2. Δίνουμε μεγάλη έμφαση στην προφορική επικοινωνία, την αξιοποίηση του gaming μέσα από ασκήσεις που καλλιεργούν τα προφορικά, τα γραπτά, τη γραμματική, τη φαντασία και την ομαδικότητα.');

    $j('.btn-ipiresion > a').attr('href', 'https://thepoumaacademy.com/agglika-gia-mathites/');
    $j(this).addClass('make-me-kroki');
    $j(this).removeClass('make-me-mov');
    $j(".enilikes-btn").removeClass('make-me-kroki');
  });

  $j( ".enilikes-btn" ).click(function(event) {
    event.preventDefault();
    $j('#mathites-text').text('Στο The Pouma Academy αναλαμβάνουμε μαθήματα για φοιτητές που στοχεύουν σε σπουδές του εξωτερικού, για ενήλικες που θέλουν να βελτιώσουν τον προφορικό και γραπτό λόγο, για ανθρώπους που χρειάζονται αγγλική ορολογία για Job Interviews, για επαγγελματίες που πρέπει να έχουν καθημερινή χρήση της αγγλικής γλώσσας αλλά ακόμα και ενήλικες που ήδη βρίσκονται στο εξωτερικό και θέλουν άμεση βελτίωση της γλώσσας.');

    $j('.btn-ipiresion > a').attr('href', 'https://thepoumaacademy.com/agglika-gia-enilikes/');
    $j(this).addClass('make-me-kroki');
    $j(".mathites-btn").removeClass('make-me-kroki');
    $j(".mathites-btn").addClass('make-me-mov');
  });*/

/*start of menu hover speed*/
/*
  //toogle hide/show for submenu items
  $j('.html_av-submenu-display-hover').on( 'mouseenter', '.av-width-submenu', function (e)
  {
    $j(this).children("ul.sub-menu").slideDown('slow');
  });

  $j('.html_av-submenu-display-hover').on( 'mouseleave', '.av-width-submenu', function (e)
  {
    $j(this).children("ul.sub-menu").slideUp('slow');
  });
  */
/*end of menu hover speed*/

  /*start of scroll down check*/
/*
  if($j("body").hasClass("home")) {
    var stIn = $j(this).scrollTop();
    if(stIn > 0)
    {
      $j('.header_color .av-hamburger-inner').addClass("make-me-blck");
    }

    var lastScrollTop = 0;
    $j(window).scroll(function(event){
       var st = $j(this).scrollTop();
       //alert(st);
       if (st > lastScrollTop){
         if(lastScrollTop > 50)
         {
           $j('.header_color .av-hamburger-inner').addClass("make-me-blck");
         }
         else if(lastScrollTop < 50)
         {
           $j('.header_color .av-hamburger-inner').removeClass("make-me-blck");
         }
           // downscroll code
           //alert(lastScrollTop);
       } else {
          // upscroll code
          //alert("up");
          if(lastScrollTop > 50)
          {
            $j('.header_color .av-hamburger-inner').addClass("make-me-blck");
          }
          else if(lastScrollTop < 50)
          {
            $j('.header_color .av-hamburger-inner').removeClass("make-me-blck");
          }
       }
       lastScrollTop = st;
    });
  }
  else{
    $j('.header_color .av-hamburger-inner').addClass("make-me-blck");
  }
*/
/*end of scroll down check*/

});
