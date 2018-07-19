$(document).ready(function() {
    $('.home-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        prevArrow: $('.prev'),
        nextArrow: $('.next'),
    });

    animate();
    indicator();

    $(window).on("scroll", function() {
        animate();
        indicator();
    });

    function animate() {
        var animate = $('.animate');
        var offset = $(window).scrollTop();

        $(animate).each(function () {
            var itemOffset = $(this).offset().top - $(window).innerHeight();

            if (offset > itemOffset) {
                $(this).addClass('show');
            } else {
                $(this).removeClass('show');
            }
        });
    }

    function indicator() {
        var indicator = $('.indicator');
        var offset = $(window).scrollTop();
        var documentHeight = $(document.body).height() - $(window).innerHeight();

        indicator.css('width', ((offset * 100) / documentHeight) + '%');
    }

    $(function() {
        $("#map").googleMap({
            zoom: 15,
            overviewMapControl: true,
            streetViewControl: true,
            scrollwheel: true,
            mapTypeControl: true,
            coords: [51.58731, 4.762877]
        });
        $("#map").addMarker({
            coords: [51.58731, 4.762877], // GPS coords
            title: 'BANKEX Foundation', // Link to redirect onclick (optional)
            id: 'marker1' // Unique ID for your marker
        });
    })
});

