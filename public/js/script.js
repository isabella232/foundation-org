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

    $(document).on("mousewheel", function() {
        var structure = $('#structure');
        var offsetScrollStructure = $(document).scrollTop();
        var offsetStructure = structure[0].offsetTop * 0.7;

        if (offsetScrollStructure > offsetStructure) {
            structure.find('.title').addClass('show');
            structure.find('.description').addClass('show');
        } else {
            structure.find('.title').removeClass('show');
            structure.find('.description').removeClass('show');
        }

        if (offsetScrollStructure > offsetStructure * 1.4) {
            structure.find('img').addClass('show');
        } else {
            structure.find('img').removeClass('show');
        }
    });
});

