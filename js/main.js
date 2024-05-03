(function ($) {
    "use strict";

    $(document).ready(function() {
      var phoneInput = window.intlTelInput(document.querySelector("#phone"), {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js", // For utilities
        autoPlaceholder: "aggressive",  // Automatically adjust the placeholder
        initialCountry: "auto",         // Auto-detect user's country
        geoIpLookup: function(success, failure) {
            $.get("https://ipinfo.io", function() {}, "jsonp").always(function(resp) {
              var countryCode = (resp && resp.country) ? resp.country : "";
              success(countryCode);
            });
        }
      });
    });
  
    // RSVP
    $(document).ready(function () {
      const iti = intlTelInput(document.querySelector("#phone"));

      const apiBaseUrl = 'https://script.google.com/macros/s/AKfycbxo0qg5RF1g-Al_eLZjbDXP4bKHwQgJ8sCaCjQ3xB6KqE-J73oytFtniAr4mOS6VnY/exec'; // Base URL without path params
      const rsvpForm = document.getElementById('rsvpForm'); // Still get a reference to the form
      const submitButton = document.querySelector('#rsvpForm button');  // Get the button
      
      submitButton.addEventListener('click', (event) => {
        event.preventDefault();
  
        const formData = new FormData(rsvpForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const attending = formData.get('attending');
        const numAttending = formData.get('numAttending');
        const message = formData.get('message');
        const phone = iti.getNumber();

        const queryParams = new URLSearchParams({
          name,
          email,
          attending,
          numAttending,
          message, 
          phone
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
            alert(`Error: ${data.message}`);
          } else {
            alert('RSVP submitted successfully!');
          }
        })
        .catch(error => {
           alert('Error submitting RSVP. Please check your connection and try again.');
        });
      });
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
      $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
      return false;
    });
  })(jQuery);
  
  