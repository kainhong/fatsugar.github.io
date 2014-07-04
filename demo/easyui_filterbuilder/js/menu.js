$(function($)
{ 
    function bulidMenu(target, opt) {
        target = $(target);

        target.menu(opt); //返回menu对象
        $.each(opt.data, function (i, row) {
            target.menu('appendItem', {
                id: row.name,
                name:row.name,
                text:row.text
            });
        });
    }

    $.fn.buildmenu = function (options, params) {
        options = options || {};
        return this.each(function () {
            if (!$.data(this, 'bulidMenu')) {
                $.data(this, 'bulidMenu', {
                    options: $.extend({}, $.fn.buildmenu.defaults, options)
                });
            }
            bulidMenu(this,options);
        });
    };

    $.fn.buildmenu.defaults = {
        data:[]
    };
});
 