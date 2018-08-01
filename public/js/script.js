$(document).ready(function () {
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
    header();

    $(window).on("scroll", function () {
        animate();
        indicator();
        header();
    });

    function header() {
        var header = $('.header-logo');
        var offset = $(window).scrollTop();

        if (offset > 80) {
            $(header).addClass('active');
            $('.header-logo img').attr('src', 'images/logos/bankex-foundation-lo-black.png');
        } else {
            $(header).removeClass('active');
            $('.header-logo img').attr('src', 'images/logos/bankex-foundation-lo.png');
        }
    }

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

    $('a.page-scroll').bind('click', function (event) {
        event.preventDefault();

        var $anchor = $(this);
        var offset = $anchor.attr('data-offset') ? $anchor.attr('data-offset') : 0;

        if ($($anchor.attr('href')).length) {
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - offset
            }, 1500, 'easeInOutExpo');
        } else {
            location.replace('/' + $anchor.attr('href'));
        }
        event.preventDefault();
    });

    $('.submit').on('click', function (e) {
        var table = '<table>';
        var email = $('#form input[name="email"]');
        var company = $('#form input[name="company"]');

        $('#form input, #form select, #form textarea').each(function () {
            if (!!$(this).val())
                table += '<tr><td>' + $(this).attr('name') + ': </td><td>' + $(this).val() + '</td></tr>';
        });

        table += '</table>';

        if ($(email).val() && $(company).val()) {
            $('#form .error-box').hide();
            $('#form button.submit').attr('disabled', 'disabled');

            $.ajax({
                method: 'post',
                url: "/sendEmail",
                data: {
                    message: table,
                    email: $(email).val()
                },
                success: function () {
                    $('#form form').hide();
                    $('#form .success-box').show();
                    $('#form .submit').removeAttr('disabled');
                }
            });
        } else {
            $('#form .error-box').show();

            if (!(email).val())
                $(email).parent().addClass('error-input');

            if (!$(company).val())
                $(company).parent().addClass('error-input');
        }

       e.preventDefault();
    });
});

