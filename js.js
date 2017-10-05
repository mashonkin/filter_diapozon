
/*фильтр слайдер шкала диапозон*/
$.filter_diapozon = {
    init: function () {
        var self=this;
        $('.filter-param .slider').each(function () {
            var attr_min = 'data-name-min=' + $(this).find('.min').attr('name');
            var attr_max = 'data-name-max=' + $(this).find('.max').attr('name');
            var attr_min_value = 'data-min=' + $(this).find('.min').attr('placeholder');
            var attr_max_value = 'data-max=' + $(this).find('.max').attr('placeholder');
            $(this).after('<div class="field-diapozon" ' + attr_min + ' ' + attr_max + ' ' + attr_min_value + ' ' + attr_max_value + '><span class="min"></span><span class="max"></span><div class="shkala"></div></div>');
            $(this).addClass('init_slider');

            self.span_update($(this).siblings('.field-diapozon'));
            self.shkala_update($(this).siblings('.field-diapozon'));
        });

        $(document).on('mousedown touchstart', '.field-diapozon', function (e) {
            var clientX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
            var procent_click = (clientX - $(this).offset().left) / $(this).width() * 100;
            var begunok_min_procent = parseFloat($(this).find('.min').css('left')) / $(this).width() * 100;
            var begunok_max_procent = parseFloat($(this).find('.max').css('left')) / $(this).width() * 100;
            var raznica_min = procent_click - begunok_min_procent;
            var raznica_max = procent_click - begunok_max_procent;
            raznica_min = raznica_min < 0 ? raznica_min * -1 : raznica_min;
            raznica_max = raznica_max < 0 ? raznica_max * -1 : raznica_max;
            if (raznica_min < raznica_max) {
                var begunok = $(this).find('.min');
            } else if (raznica_min == raznica_max) {
                if (procent_click < raznica_min) {
                    var begunok = $(this).find('.min');
                } else {
                    var begunok = $(this).find('.max');
                }
            }
            else if (raznica_min > raznica_max) {
                var begunok = $(this).find('.max');
            }
            begunok.css('left', procent_click + '%');
            window.begunok_work = begunok;
            self.input_update(begunok, 1);
            self.begunok_move(begunok);
            self.shkala_update($(this));
            return false;
        });
        $(document).on('click', '.field-diapozon span', function () {
            return false;
        });
        $(document).on('mousedown touchstart', '.field-diapozon span', function () {
            var begunok = $(this);
            window.begunok_work = begunok;
            self.begunok_move(begunok);
            return false;
        });
        $(document).on('mouseup touchend', function (e) {
            if (typeof window.begunok_work !== 'undefined') {
                $(document).off('mousemove');
                $(document).off('touchmove');
                self.input_update(window.begunok_work, 1);
                delete(window.begunok_work);
                return false;
            }
        });
    },
    begunok_move: function (begunok) {
        var self=this;
        var el_diapozon = begunok.closest('.field-diapozon');
        var left = el_diapozon.offset().left;
        var max = el_diapozon.width();
        var other_begunok = begunok.siblings('span');
        var other_begunok_procent = parseFloat(other_begunok.css('left')) / max * 100;
        var begunok_class = begunok.attr('class');
        var shkala = begunok.siblings('.shkala');
        $(document).on('mousemove touchmove', function (e) {
            var clientX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
            var left_px = clientX - left;
            var left_procent = left_px / max * 100;
            if (left_procent > other_begunok_procent && begunok_class == 'min') {
                left_procent = other_begunok_procent;
            } else if (left_procent < other_begunok_procent && begunok_class == 'max') {
                left_procent = other_begunok_procent;
            } else if (left_procent < 0) {
                left_procent = 0;
            } else if (left_procent > 100) {
                left_procent = 100;
            }
            begunok.css('left', left_procent + '%');

            self.shkala_update(el_diapozon);
            self.input_update(begunok);
        });
    },
    shkala_update: function (block) {
        var self=this;
        var selector_width = block.width();
        var min_procent = parseFloat(block.find('.min').css('left')) / selector_width * 100;
        var max_procent = parseFloat(block.find('.max').css('left')) / selector_width * 100;
        block.find('.shkala').css({'left': min_procent + '%', 'width': (max_procent - min_procent) + '%'});
    },
    span_update: function (block) {
        var diapozon_value = parseFloat(block.attr('data-max')) - parseFloat(block.attr('data-min'));
        var min = block.attr('data-min');
        var input_name_min = block.attr('data-name-min');
        var input_min = block.siblings('.slider').find('input[name="' + input_name_min + '"]').val() || block.attr('data-min');
        var input_name_max = block.attr('data-name-max');
        var input_max = block.siblings('.slider').find('input[name="' + input_name_max + '"]').val() || block.attr('data-max');
        var input_min = parseInt(input_min);
        var input_max = parseInt(input_max);
        var min_procent = (input_min - min) / diapozon_value * 100;
        var max_procent = (input_max - min) / diapozon_value * 100;
        block.find('.min').css('left', min_procent + '%');
        block.find('.max').css('left', max_procent + '%');
    },
    input_update: function (begunok, change) {
        var self=this;
        var begunok_class = begunok.attr('class');
        var block = begunok.closest('.field-diapozon');
        if (begunok_class == 'min') {
            var input_name = block.attr('data-name-min');

        } else {
            var input_name = block.attr('data-name-max');
        }
        var input = block.siblings('.slider').find('input[name="' + input_name + '"]');
        var procent = parseFloat(begunok.css('left')) / block.width();
        if (procent <= 0 || procent >= 1) {
            var value = '';
        } else {
            var diapozon_value = parseFloat(block.attr('data-max')) - parseFloat(block.attr('data-min'));
            var znachen_plus = diapozon_value * procent;
            var value = parseInt(parseFloat(block.attr('data-min')) + znachen_plus);

        }
        if (change) {
            input.val(value).change();
        } else {
            input.val(value);
        }

    }
};


$(document).ready(function () {
    $.filter_diapozon.init();
});

/*фильтр слайдер шкала диапозон*/