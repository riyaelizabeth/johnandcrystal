(function ($) {
  "use strict";

  $(document).ready(function () {
    setupUploadForm();
    playVideo();
    recordIPData();
    setupCountdown();
    setupInputFields();
    setupRSVP();
    setupMapLinks();
    setupScrollButtons();
    loadVideo();
  });

  function loadVideo() {
    $("video.background-video source").each(function() {
      var sourceFile = $(this).attr("data-src");
      $(this).attr("src", sourceFile);
      var video = this.parentElement;
      video.load();
      video.play();
    });
  }

  function setupUploadForm() {
    const urlHash = window.location.hash;

    if (urlHash === "#upload") {
      $('#uploadModal').modal('show');
    }

    $("#imageInput").change(function(e) {
      displayImages(e.target.files);
    });
  
    if (urlHash === "#upload") {
      $('#uploadModal').modal('show');
    }

    const uploadURL = 'https://script.google.com/macros/s/AKfycbwScFxpleFR1OAGsl9kkTcskwYctJYvkNiL3ibfV4aJAbGQRf6xvVGSXFKRsYsUe0pX4w/exec';
    let filesToUpload = []; // Array to store files for later upload
    // Image format lookup table
    const imageFormats = {
      BMP: 'bmp',
      GIF: 'gif',
      JPEG: 'jpeg',
      JPG: 'jpeg', 
      PNG: 'png',
      SVG: 'svg',
      HEIC: 'heic'
    };

    $("#imageInput").on("change", function() {
        filesToUpload = this.files; // Store selected files
    });

    $("#uploadButton").click(function() {
      $('#loadingOverlay').removeClass('d-none'); // Show loading spinner

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const reader = new FileReader();
        let completedUploads = 0; // Counter for completed uploads
        const extension = file.name.split('.').pop().toUpperCase(); // Get file extension


        reader.onload = function(e) {
          const imageData = e.target.result.replace(/^.*,/, '');
          const formData = new FormData();

          formData.append('filename', file.name);
          formData.append('imageformat', imageFormats[extension] || 'unknown'); // Default to unknown if not found
          formData.append('file', imageData);

          fetch(uploadURL, {
            method: 'POST',
            body: formData
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Upload error for ${file.name}: Network response was not ok.`);
            }
            return response.text(); // Or response.json()
          })
          .then(data => {
            console.log(`Upload of ${file.name} successful:`, data);
            completedUploads++;
            $("#loadingOverlayText").text(`Uploaded ${completedUploads} of ${filesToUpload.length} files`);
            // Check if all uploads are done
            if (completedUploads === filesToUpload.length) {
              $('#uploadModal').modal('hide');
              $('#uploadModal').on('hidden.bs.modal', function (e) {
                $('#uploadModal').off('hidden.bs.modal');
                $('#uploadModal').modal('dispose');
              });
              $('#loadingOverlay').addClass('d-none'); // Hide loading spinner
              document.getElementById('rsvp-modal-header').innerHTML = "Uploaded Successfully!";
              document.getElementById('rsvp-modal-body').innerHTML = "Thank you for sharing your favorite pictures with us!";
              const rsvpSubmitModal = new bootstrap.Modal(document.getElementById("rsvpSubmitModal"), {});
              rsvpSubmitModal.show();
            }
          })
          .catch(error => {
            console.error(`Upload error for ${file.name}:`, error);
          });
        };

        reader.readAsDataURL(file);
      }
    });
    
    function displayImages(files) {
      $("#imagePreview").empty();
      for (let i = 0; i < files.length; i++) {
        let reader = new FileReader();
        reader.onload = function(e) {
          $("#imagePreview").append(`<img src="${e.target.result}" class="img-thumbnail">`);
        }
        reader.readAsDataURL(files[i]);
      }
    }
  }

  function playVideo() {
    document.body.addEventListener('click', function () {
      document.getElementById('background-video').play();
    });
  }

  async function recordIPData() {
    let rawData = await getIPInfo();
    const ip = rawData?.ip;
    const uuid = getUuid();
    rawData = JSON.stringify(rawData);
    
    const apiBaseUrl = 'https://script.google.com/macros/s/AKfycbzPcyANp4nw1o4FuN7DM4gsE71u2Qwi3EMz9gMR1cZzC3ECHyqhnLUFhTbdSl1d5Qxb/exec';
    const queryParams = new URLSearchParams({uuid, ip, rawData }).toString();
    const apiUrl = `${apiBaseUrl}?${queryParams}`;

    fetch(apiUrl, { method: 'POST'}).then(response => { "THANK YOU!" });
  }

  function getUuid() {
    let uuid = localStorage.getItem('uuid');
    if(!uuid){
      uuid = '';
      if (self && self.crypto && typeof self.crypto.randomUUID === 'function') {
        uuid = self.crypto.randomUUID();
      }
      else {
        uuid = 'NOUUID';
      }
      localStorage.setItem('uuid', uuid);
    }
    return uuid;
  }

  function setupCountdown() {
    // Set the date we're counting down to
    const countDownDate = luxon.DateTime.fromISO("2024-06-22T11:00", { zone: "Asia/Kolkata" }).ts;

    // Update the count down every 1 second
    const x = setInterval(function () {

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
      document.getElementById("timer").innerHTML = 
        (days > 0 ? days + " day" + (days > 1 ? "s" : "") + " " : "") +
        (hours > 0 ? hours + " hour" + (hours > 1 ? "s" : "") + " " : "") +
        (minutes > 0 ? minutes + " minute" + (minutes > 1 ? "s" : "") + " " : "") +
        (seconds > 0 ? seconds + " second" + (seconds > 1 ? "s" : "") + " " : "") + " <br> Watch our livestreams below!";

      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "We're married! 🎉🎉🎉 <br> Watch our livestreams below!";
      }
    }, 1000);
  }

  function setupInputFields(){
    const showAttendingFields = ( function() {
        optionalRSVP.style.display = 'block';
        setTimeout(() => {  // Slight delay to let display change take effect
          optionalRSVP.style.opacity = 1;
        }, 10);
      });
    const showMessageField = (function() {
        messageInput.style.display = 'block';
        setTimeout(() => {
          messageInput.style.opacity = 1;
        }, 10);
      });
    const optionalRSVP = document.getElementById('optionalRSVP');
    const messageInput = document.getElementById('message');
    const attendingRadios = document.querySelectorAll('input[name="attending"]');
    const phoneInput = window.intlTelInput(document.querySelector("#phone"), {
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      autoPlaceholder: "aggressive",
      initialCountry: "auto",
      geoIpLookup: function (callback) {
        getCountryCodeFromIp(callback);  // Use the external function 
      }
    });
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
  }

  function setupRSVP() {
    const iti = intlTelInput(document.querySelector("#phone"));
    const submitButton = document.getElementById('submitButton');
    const submittingButton = document.getElementById('submittingButton');
    const submittedButton = document.getElementById('submittedButton');
    const apiBaseUrl = 'https://script.google.com/macros/s/AKfycbyHtlkiXHcHrkVokNAWpw_dRMW4WwE7MT224dQDpaFopliZBWHNeKjKoHkiDz5nFQOI-A/exec'; // Base URL without path params
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
      const attending = formData.get('attending') == null ? '' : formData.get('attending');
      const numAttending = formData.get('numAttending');
      const message = formData.get('message');
      const phone = iti.getNumber();
      const storedData = localStorage.getItem('ipData');
      let ip = '';
      let rawData = '';

      if (storedData) {
        const ipData = JSON.parse(storedData)?.ipData;
        ip = ipData?.ip;
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
        rawData,
        uuid: getUuid()
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

            const allFormElements = [...document.querySelectorAll('input, textarea')];
            allFormElements.forEach(element => element.disabled = true);
          }
        })
        .catch(error => {
          modalHeader = 'Submit Error';
          modalContent = 'Error submitting RSVP. Please check your connection and try again.';

          submitButton.style.display = '';
          submittingButton.style.display = 'none';
          submittedButton.style.display = 'none';
        }).finally(e => {
          document.getElementById('rsvp-modal-header').innerHTML = modalHeader;
          document.getElementById('rsvp-modal-body').innerHTML = modalContent;
          rsvpSubmitModal.show();
        });
    });
  }

  function setupMapLinks(){
    $(document).on('click', '.map-link', function () {
      let addrLoc = $(this).attr('data');
      let address = addrLoc === "wed" ? "St Augustine Forane Church, Ramapuram, Kerala, India" : "Michael Plaza Convention Center, Ramapuram, Kerala"
      address = encodeURIComponent(address);
      if ((navigator?.platform?.indexOf('iPhone') != -1) || (navigator?.platform?.indexOf('iPad') != -1) || (navigator?.platform?.indexOf('iPod') != -1)) {/* if we're on iOS, open in Apple Maps */
        window.open('http://maps.apple.com/?q=' + address.replace('Forane', ''));
      } else { /* else use Google */
        window.open('https://maps.google.com/maps?q=' + address);
      }
    });
  }

  function setupScrollButtons() {
    // Back to top button
    $(window).scroll(function () {
      if ($(this).scrollTop() > 200) {
        $('.back-to-top').fadeIn('slow');
      } else {
        $('.back-to-top').fadeOut('slow');
      }
    });
    $('.back-to-top').click(function () {
      $("html, body").animate({ scrollTop: 0 }, 500, 'swing', function () {
        // alert("Finished animating");
      });
      return false;
    });
  }

  function getIPInfo() {
    return new Promise((resolve, reject) => {
      const cachedData = JSON.parse(localStorage.getItem('ipData'));
      if (cachedData && cachedData.expiration && Date.now() < cachedData.expiration) {
        resolve(cachedData.ipData); // Return cached country code 
      }
      $.get("https://ipinfo.io", function (response) {
        const { ip, hostname, city, region, country, loc, org, postal, timezone } = response;
        const ipData = { ip, hostname, city, region, country, loc, org, postal, timezone, platform: navigator?.platform};
        const expiration = Date.now() + (3060 * 60 * 1000); // Cache for 1 hour

        localStorage.setItem('ipData', JSON.stringify({ ipData, expiration }));
        resolve(ipData)
      }, "jsonp");
    });
  }
  
  function getCountryCodeFromIp(callback) {
    const cachedData = JSON.parse(localStorage.getItem('ipData'));

    
    if (cachedData && cachedData.expiration && Date.now() < cachedData.expiration) {
      callback(cachedData.ipData.country); // Return cached country code 
      return;
    }

    // If no valid cached data, make the AJAX call
    $.get("https://ipinfo.io", function (response) {
      const { ip, hostname, city, region, country, loc, org, postal, timezone } = response;
      const ipData = { ip, hostname, city, region, country, loc, org, postal, timezone, platform: navigator?.platform };
      const expiration = Date.now() + (3060 * 60 * 1000); // Cache for 1 hour

      localStorage.setItem('ipData', JSON.stringify({ ipData, expiration }));
      callback(response.country);
    }, "jsonp");
  }
})(jQuery);
