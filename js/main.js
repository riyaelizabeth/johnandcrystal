(function ($) {
    "use strict";

    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });

    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Scroll to Bottom
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scroll-to-bottom').fadeOut('slow');
        } else {
            $('.scroll-to-bottom').fadeIn('slow');
        }
    });

    // RSVP
    $(document).ready(function () {
        const apiBaseUrl = 'https://script.google.com/macros/s/AKfycbxK0KNeoZLzf1NQrHUT312jHs15Y3NQmV8ppVbH8yobZQroeK8tVFttrdmtqEz6AeNYjQ/exec'; // Base URL without path params
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

    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
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


    // Gallery carousel
    $(".gallery-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1500,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            },
            1200:{
                items:5
            }
        }
    });
    
})(jQuery);

