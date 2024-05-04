document.getElementById('background-video').play();

(function ($) {
    "use strict";
    document.getElementById('background-video').play();

    function getCountryCodeFromIp(callback) {
      const cachedData = localStorage.getItem('ipData');
      const expiration = localStorage.getItem('ipDataExpiration'); 
    
      if (cachedData && expiration && Date.now() < parseInt(expiration, 10)) {
        const ipData = JSON.parse(cachedData);
        callback(ipData.country); // Return cached country code 
        return; 
      }
    
      // If no valid cached data, make the AJAX call
      $.get("https://ipinfo.io", function(response) { 
        const ipData = {
          ip: response.ip,
          hostname: response.hostname,
          city: response.city,
          region: response.region,
          country: response.country,
          loc: response.loc,
          org: response.org,
          postal: response.postal,
          timezone: response.timezone
        };
    
        localStorage.setItem('ipData', JSON.stringify(ipData));
        localStorage.setItem('ipDataExpiration', Date.now() + (60 * 60 * 1000)); // Cache for 1 hour
    
        callback(response.country);
      }, "jsonp");
    }

    const rsvpForm = document.getElementById('rsvpForm');
    const attendingRadios = document.querySelectorAll('input[name="attending"]');
    const optionalRSVP = document.getElementById('optionalRSVP');
    const messageInput = document.getElementById('message');
      // Set the date we're counting down to
    const countDownDate = new Date("Jun 22, 2024 10:30").getTime();

    // Update the count down every 1 second
    const x = setInterval(function() {

      // Get today's date and time
      const now = new Date().getTime();
      // Find the distance between now and the count down date
      const distance = countDownDate - now;
        
      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
      // Output the result in an element with id="demo"
      document.getElementById("timer").innerHTML = days + "days " + hours + "hours "
      + minutes + "minutes " + seconds + "seconds ";
        
      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
      }
    }, 1000);
    $(document).ready(function() {
      const phoneInput = window.intlTelInput(document.querySelector("#phone"), {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        autoPlaceholder: "aggressive", 
        initialCountry: "auto",        
        geoIpLookup: function(callback) {
          getCountryCodeFromIp(callback);  // Use the external function 
        }
      });

      function showAttendingFields() {
        optionalRSVP.style.display = 'block';
        setTimeout(() => {  // Slight delay to let display change take effect
          optionalRSVP.style.opacity = 1;
        }, 10);
      }
      
      function showMessageField() {
        messageInput.style.display = 'block';  
        setTimeout(() => { 
            messageInput.style.opacity = 1;
        }, 10);
      }
      // Event Listeners
      attendingRadios.forEach(radio => {
          radio.addEventListener('change', () => {
              if ((radio.id === 'attendingYes' || radio.id === 'attendingMaybe') && radio.checked) { // 'Yes' is checked
                  showAttendingFields();
                  showMessageField();
              } else { 
                optionalRSVP.style.display = 'none';
              }
      
              // If anything is checked, show the message field
              if (radio.checked) {
                  showMessageField();  
              }
          });
      });
    });
  
    // RSVP
    $(document).ready(function () {
      const iti = intlTelInput(document.querySelector("#phone"));
      const submitButton = document.getElementById('submitButton');
      const submittingButton = document.getElementById('submittingButton');
      const submittedButton = document.getElementById('submittedButton');
      const apiBaseUrl = 'https://script.google.com/macros/s/AKfycbyfriaWEZUQRMoRLL8usSUCkJWJ-EHLPDG_dry1CLg4lv0R4SXRb3azQFcIWxbamKA3Ig/exec'; // Base URL without path params
      const rsvpForm = document.getElementById('rsvpForm'); // Still get a reference to the form
      const rsvpSubmitModal = new bootstrap.Modal(document.getElementById("rsvpSubmitModal"), {});
      let modalHeader = '';
      let modalContent = '';

      submittedButton.style.display = 'none';
      submittingButton.style.display = 'none';
      submitButton.addEventListener('click', (event) => {
        submitButton.style.display = 'none';
        submittingButton.style.display = '';
        submittedButton.style.display = 'none';
        event.preventDefault();
        const formData = new FormData(rsvpForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const attending = formData.get('attending');
        const numAttending = formData.get('numAttending');
        const message = formData.get('message');
        const phone = iti.getNumber();
        const storedData = localStorage.getItem('ipData');
        let ip = '';
        let rawData = '';
        if (storedData) {
          const ipData = JSON.parse(storedData);
          ip = ipData.ip;
          rawData = encodeURIComponent(storedData);
        }

        const queryParams = new URLSearchParams({
          name,
          email,
          attending,
          numAttending,
          message, 
          phone,
          ip,
          rawData
        }).toString();
  
        const apiUrl = `${apiBaseUrl}?${queryParams}`;
  
        fetch(apiUrl, {
          method: 'POST',
        })
        .then(response => {
          if (!response.ok) { 
            throw new Error('Network response was not ok'); // Handle HTTP level errors
          }
          return response.json();  // Parse the JSON response
        })
        .then(data => {
          if (data.error) {
            // TODO
            modalHeader = 'Submit Error';
            modalContent = `Error: ${data.message}`;
            submitButton.style.display = '';
            submittingButton.style.display = 'none';
            submittedButton.style.display = 'none';
          } else {
            modalHeader = 'RSVP Submitted Successfully!';
            modalContent = data.message;

            submitButton.style.display = 'none';
            submittingButton.style.display = 'none';
            submittedButton.style.display = '';
          }
        })
        .catch(error => {
          modalHeader = 'Submit Error';
          modalContent = 'Error submitting RSVP. Please check your connection and try again.';
          
          submitButton.style.display = '';
          submittingButton.style.display = 'none';
          submittedButton.style.display = 'none';
        }).finally(e => {
          document.getElementById('modal-header').innerHTML = modalHeader;
          document.getElementById('modal-body').innerHTML = modalContent;
          rsvpSubmitModal.show();
        });
      });
    });

    $(document).on('click','.map-link',function() {
        let addrLoc = $(this).attr('data');
        let address = addrLoc === "wed" ? "St Augustine Forane Church, Ramapuram, Kerala, India" : "Michael Plaza Convention Center, Ramapuram, Kerala"
        address = encodeURIComponent(address);
        if ((navigator?.platform?.indexOf('iPhone') != -1) || (navigator?.platform?.indexOf('iPad') != -1) || (navigator?.platform?.indexOf('iPod') != -1)){/* if we're on iOS, open in Apple Maps */
            window.open('http://maps.apple.com/?q=' + address.replace('Forane', ''));
        } else { /* else use Google */
            window.open('https://maps.google.com/maps?q=' + address);
        }
    });                     
  
    // Back to top button
    $(window).scroll(function () {
      if ($(this).scrollTop() > 200) {
        $('.back-to-top').fadeIn('slow');
      } else {
        $('.back-to-top').fadeOut('slow');
      }
    });
    $('.back-to-top').click(function () {
      $("html, body").animate({scrollTop:0}, 500, 'swing', function() { 
        // alert("Finished animating");
      });
      return false;
    });
  })(jQuery);
  
  