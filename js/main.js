(function ($) {
  "use strict";

  // RSVP
  $(document).ready(function () {
    const apiBaseUrl = 'https://script.google.com/macros/s/AKfycbyGdpLQPhMJlbvlHkKKrtICact_Q9atyZRFG-9vnAQ6HuXGr8Ov9F5jJ7NvKzDv8ourQQ/exec'; // Base URL without path params
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

      const queryParams = new URLSearchParams({
        name,
        email,
        attending,
        numAttending,
        message
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

