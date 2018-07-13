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

    $(window).on("scroll", function() {
        animate();
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
});

