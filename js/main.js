document.getElementById('background-video').play();

(function ($) {
    "use strict";
    document.getElementById('background-video').play();
    const rsvpForm = document.getElementById('rsvpForm');
    const attendingRadios = document.querySelectorAll('input[name="attendingOptions"]');
    const optionalRSVP = document.getElementById('optionalRSVP');
    const messageInput = document.getElementById('message');
  
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
      const apiBaseUrl = 'https://script.google.com/macros/s/AKfycbxo0qg5RF1g-Al_eLZjbDXP4bKHwQgJ8sCaCjQ3xB6KqE-J73oytFtniAr4mOS6VnY/exec'; // Base URL without path params
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
  
  