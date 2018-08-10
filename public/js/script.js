$(document).ready(function () {

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

    /***************************************/
    /**************** CRUD *****************/
    /***************************************/

    var converter = new showdown.Converter();

    home();
    about();
    structure();
    projects();
    news();
    team();
    contact();
    alliance();
    error();

    function getContent(fileName, callback) {
        $.ajax({
                url: '/content',
                type: 'get',
                data: {
                    fileName: fileName
                },
                dataType: 'html',
                async: true,
                success: function (data) {
                    var result, options = {};

                    var prop = data.match(/---[^]*---/g)[0];

                    prop = prop.replace(/---/g, '');

                    prop.trim().split('\n').forEach(function (item) {
                        var pair = item.split(':');
                        var key = pair[0].trim();

                        if (key === 'url') {
                            options[key] = pair[1] + ':' + pair[2].trim();
                        } else {
                            options[key] = pair[1].trim();
                        }
                    });

                    result = data.replace(/---[^]*---/g, '');

                    callback({
                        result: converter.makeHtml(result),
                        options: options
                    });
                }
            }
        );
    }

    function getFolders(folder, callback) {
        $.ajax({
                url: '/static/content/' + folder,
                type: 'get',
                dataType: 'json',
                async: true,
                success: function (data) {
                    var isFile, item, i, result = [];

                    for (i = 0; i < data.length; i++) {
                        item = data[i];
                        isFile = /.md/.test(item);

                        if (isFile) {
                            result.push(item)
                        }
                    }

                    callback(result);
                }
            }
        );
    }

    function projects() {
        getFolders('projects', function (projects) {
            projects.forEach(function (item) {
                $('#projects .items .row')
                    .append('<div class="col-md-6 text-center animate" get-content="' + item + '">' +
                        '<img><div class="heading"><a target="_blank"></a></div><div class="description"></div></div>');
            });

            $('#projects [get-content]').attr('get-content', function (i, val) {
                if (val) {
                    var $element = $(this);

                    getContent('projects/' + val, function (res) {
                        $element.find('.description').html(res.result);

                        if (res.options.url) {
                            $element.find('.heading a')
                                .attr('href', res.options.url)
                                .text(res.options.title);
                        } else {
                            $element.find('.heading').html(res.options.title);
                        }

                        $element.find('img').attr('src', res.options.image);
                        $element.css('transition-delay', (i + 1) * 0.16 + 's');
                    });
                }
            })
        });
    }

    function news() {
        getFolders('news', function (news) {
            var i = 1;

            news.forEach(function (item) {
                $('#news .row:last-child')
                    .append('<div class="col-md-6 news-item" get-content="' + item + '"><a href=""><div class="wrapper">' +
                        '<div class="bg-img"></div><div class="overlay"></div><div class="text">' +
                        '<div class="content"><div class="title"></div><div class="description"></div></div>' +
                        '<div class="btn-container"><div class="btn">Read more</div></div></div></div></a></div>');

                if (i === 2) {
                    $('#news .container').append('<div class="row"></div>');
                    i = 1;
                }

                i++;
            });

            $('#news [get-content]').attr('get-content', function (i, val) {
                if (val) {
                    var $element = $(this);

                    getContent('news/' + val, function (res) {
                        $element.find('.description').html(res.result);

                        $element.find('a').attr('href', res.options.url);
                        $element.find('.title').html(res.options.title);
                        $element.find('.bg-img').css('background-image', 'url(..' + res.options.image + ')');
                    });
                }
            })
        });
    }

    function team() {
        getFolders('team', function (team) {
            var i = 1, j = 1, k = 1;

            team.forEach(function (item) {
                $('#team .row:last-child')
                    .append('<div class="col-md-4 col-sm-6 col-xs-12 animate" get-content="' + item + '"><div class="team-item">' +
                        '<div class="image"></div><div class="name"></div><div class="desc"></div><div class="line"></div>' +
                        '<div class="list"></div></div></div>');

                if (k === 1) {
                    $('#team .row:last-child').append('<div class="clearfix visible-xs"></div>');
                    k = 0;
                }

                if (i === 2) {
                    $('#team .row:last-child').append('<div class="clearfix visible-sm visible-md"></div>');
                    i = 0;
                }

                if (j === 3) {
                    $('#team .row:last-child').append('<div class="clearfix visible-lg"></div>');
                    j = 0;
                }

                i++;
                j++;
                k++;
            });

            $('#team [get-content]').attr('get-content', function (i, val) {
                if (val) {
                    var $element = $(this);

                    getContent('team/' + val, function (res) {
                        $element.find('.list').html(res.result);

                        $element.find('.name').html(res.options.title);
                        $element.find('.desc').html(res.options.description);
                        $element.find('.image').css('background-image', 'url(..' + res.options.image + ')');
                        $element.css('transition-delay', (i + 1) * 0.16 + 's');
                    });
                }
            })
        });
    }

    function home() {
        getFolders('home', function (home) {
            home.forEach(function (item) {
                $('.home-slider')
                    .append('<div class="t-table"><div class="cell"><div class="container">' +
                        '<div class="wrapper" get-content="' + item + '">' +
                        '<div class="title"></div>' +
                        '<div class="description"></div>' +
                        '</div></div></div></div>');
            });

            $('.home-slider [get-content]').attr('get-content', function (i, val) {
                if (val) {
                    var $element = $(this);

                    getContent('home/' + val, function (res) {
                        $element.find('.description').html(res.result);
                        $element.find('.title').html(res.options.title);

                        if (res.options.url) {
                            $element.append('<div><a href="' + res.options.url + '" target="_blank">Read More</a></div>');
                        }
                    });
                }
            });

            $('.home-slider').slick({
                dots: true,
                infinite: true,
                speed: 500,
                fade: true,
                cssEase: 'linear',
                prevArrow: $('.prev'),
                nextArrow: $('.next'),
            });

        });
    }

    function about() {
        $('#about-us [get-content]').attr('get-content', function (i, val) {
            if (val) {
                var $element = $(this);

                getContent(val, function (res) {
                    $element.find('.description').html(res.result);
                    $element.find('.title').html(res.options.title);
                    $element.find('.video').append('<iframe id="youtubeiframe44869237" width="100%"' +
                        'src="//' + res.options.video + '" frameborder="0" allowfullscreen="" ></iframe>');
                });
            }
        });
    }

    function structure() {
        $('#structure [get-content]').attr('get-content', function (i, val) {
            if (val) {
                var $element = $(this);

                getContent(val, function (res) {
                    $element.find('.description').html(res.result);
                    $element.find('.title').html(res.options.title);
                });
            }
        });
    }

    function contact() {
        $('#contact-us [get-content]').attr('get-content', function (i, val) {
            if (val) {
                var $element = $(this);

                getContent(val, function (res) {
                    $element.find('.address').html(res.result);
                    $element.find('.title').html(res.options.title);
                    $element.find('.email').html('<a href="mailto:' + res.options.email + '">' + res.options.email + '</a>');

                    var coords = res.options.coords.split(', ');

                    $("#map").googleMap({
                        zoom: 15,
                        overviewMapControl: true,
                        streetViewControl: true,
                        scrollwheel: true,
                        mapTypeControl: true,
                        coords: coords
                    });
                    $("#map").addMarker({
                        coords: coords, // GPS coords
                        title: 'BANKEX Foundation', // Link to redirect onclick (optional)
                        id: 'marker1' // Unique ID for your marker
                    });

                });
            }
        });
    }

    function alliance() {
        $('#alliance [get-content]').attr('get-content', function (i, val) {
            if (val) {
                var $element = $(this);

                getContent(val, function (res) {
                    $element.find('.description').html(res.result);
                    $element.find('.title').html(res.options.title);
                });
            }
        });
    }

    function error() {
        $('.error [get-content]').attr('get-content', function (i, val) {
            if (val) {
                var $element = $(this);

                getContent(val, function (res) {
                    $element.find('.description').html(res.result);
                    $element.find('.title').html(res.options.title);
                });
            }
        });
    }

});

