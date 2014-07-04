$(function ($) {
    var menuContent = "<div data-options=\"name:'and'\">And</div>" +
                "<div data-options=\"name:'or'\">Or</div>" +
                "<div data-options=\"name:'notand'\">Not And</div>" +
                "<div data-options=\"name:'notor'\">Not Or</div>" +
                "<div class=\"menu-sep\"></div>" +
                "<div data-options=\"name:'group'\">Add Group</div>" +
                "<div data-options=\"name:'condition'\">Add Condition</div>" +
                "<div class=\"menu-sep\"></div>" +
                "<div data-options=\"name:'remove'\">Remove</div>";

    function createGroup(target) {
        var options = $.data(target, 'expressiongroup').options;
        panel = $(target);
        var index = panel.parent().children('.expression-group').length + 1;
        panel.addClass("expression-group");
        var menubutton = $("<a></a>").text(options.type)
                                                            .appendTo(panel);

        var addButton = $("<a></a>").appendTo(panel)
                                                       .linkbutton({
                                                           plain: true,
                                                           text: '',
                                                           iconCls: 'icon-add',
                                                           onClick: function () { addNode();}
                                                       });

        var menu = $('<div></div>')
                            .attr('id', 'menu_' + index)
                            .html(menuContent).appendTo(panel);

        var nodesPanel = $('<div class="expression-nodes"></div>').appendTo(panel);

        menubutton.menubutton({ menu: '#menu_' + index });
        menu.menu({
            onClick: menuClick
        });

        var menuClick = function (item) {
            var name = item.name;
            if (name == "remove") {
                var groups = panel.parent().children('.expression-group');
                if (groups.length == 1) {
                    nodesPanel.empty();
                }
                else {
                    panel.remove();
                }
            }
            else if (name == "group") {
                var div = $("<div></div>").appendTo(panel.parent());
                div.expressionGroup({ fields: options.fields });
            }
            else {
                self.menubutton.menubutton({ 'text': item.text });
                options.type = item.text;
            }
        };

        var addNode = function (node) {
            var div = $("<div></div>").appendTo(nodesPanel);
            div.expressionnode({ fields: options.fields, node: node });
        };

        $.each(options.nodes, function (i, node) {
            addNode(node);
        });
    };

    function getData(target) {
        var options = $.data(target, 'expressiongroup').options;
        var group = {};
        group.type = options.type;
        var els = $(target).children('.expression-nodes').children('.expression-node');
        group.nodes = [];
        $.each(els, function (i, e) {
            var node = $(e).expressionnode('getData');
            group.nodes.push(node);
        });
        
        return group;
    };

    $.fn.expressiongroup = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.expressiongroup.methods[options](this, param);
        };

        options = options || {};

        return this.each(function () {
            if (!$.data(this, 'expressiongroup')) {
                $.data(this, 'expressiongroup', {
                    options: $.extend({}, $.fn.expression.defaults, options)
                });
            }
            createGroup(this);
        });
    };

    $.fn.expressiongroup.methods = {
        options: function (jq) {
            return $.data(jq[0], 'expressionGroup').options;
        },
        getData: function (jq) {
            return getData(jq[0]);
        }
    };

    $.fn.expressiongroup.defaults = {};
});

$(function ($) {
    
    function addGroup(target) {
        var options = $.data(target, 'expression').options;
        var groups = options.groups;
        var fields = options.fields;
        $.each(groups, function (i, group) {
            var op = $.extend({ fields: fields }, group);
            $("<div></div>").appendTo($(target)).expressiongroup(op);
        });
    };
    function getData(target) {
        var groups = [];
        var els = $(target).children('.expression-group');
        $.each(els, function (i, el) {
            var group = $(el).expressiongroup('getData');
            groups.push(group);
        });
        return groups;
    };

    $.fn.expression = function (options, param) {
       
        if (typeof options == 'string') {
            return $.fn.expression.methods[options](this, param);
        };

        options = options || {};

        return this.each(function () {
            if (!$.data(this, 'expression')) {
                $.data(this, 'expression', {
                    options: $.extend({}, $.fn.expression.defaults, options)
                });
            }
            addGroup(this);
        });
    };

    $.fn.expression.methods = {
        options: function (jq) {
            return $.data(jq[0], 'expression').options;
        },
        getData: function (jq) {
            return getData(jq[0]);
        }
    };

    $.fn.expression.defaults = {};
})