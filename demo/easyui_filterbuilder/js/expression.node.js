$(function () {
    var index = 0;
    var nodeOptions = [{text:'等于',name:'equals'},
                                {text:'不等',name:'notequals'},
                                {text:'大于',name:'greatthan'},
                                { text: '大于等于', name: 'greatthanequals' },
                                {text:'小于',name:'lessthan'},
                                {text:'小于等于',name:'lessthanequals'},
                                {text:'在...之间',name:'between'},
                                { text: '不在...之间', name: 'notbetween' },
                                {text:'包含',name:'contains'},
                                {text:'不包含',name:'notcontains'},
                                {text:'以...开始',name:'startWith'},
                                {text:'以...结尾',name:'endWith'},
                                {text:'相似',name:'like'},
                                {text:'不相似',name:'notlike'},
                                {text:'为空',name:'empty'},
                                {text:'不为空',name:'notempty'}];

    function findField(fields,name)
    {
        var result = null;
        $.each(fields, function (i, row) {
            if (row.name == name)
                result = row;
        });
        return result;
    }

    function node(target) {
        options = $.data(target, 'expressionnode').options;
        target = $(target);
        target.addClass('expression-node');
        var fieldMenuButton = $("<a></a>").appendTo(target);
        var optionMenuButton = $("<a></a>").appendTo(target);
        var editorDiv = $("<span></span>").appendTo(target);
        var btn = $("<a></a>")
                .appendTo(target)
                .linkbutton({
                    plain: true,
                    text: '',
                    iconCls: 'icon-remove',
                    onClick: function () { target.remove(); }
                });

        var fields = options.fields;
        var fieldMenu = $("<div></div>").attr('id', "field_menu_" + index).appendTo(target);
        var opMenu = $("<div></div>").attr('id', "field_menu2_" + index).appendTo(target);

        if( options.node == null)
            options.node = { field: fields[0],value:null };
        options.node.op = nodeOptions[0];
        var editor = createEditor(options, editorDiv);
        options.editor = editor;
        options.ed.setValue(editor, options.node.value);

        fieldMenu.buildmenu({
            data: fields,
            onClick: function (item) {
                options.node = { field: findField(options.fields, item.id) };
                options.node.op = nodeOptions[0];
                fieldMenuButton.menubutton({
                    text: options.node.field.text,
                });
            }
        });
        opMenu.buildmenu({
            data: nodeOptions,
            onClick: function (item) {
                options.node.op = { text: item.text, name: item.name };
                optionMenuButton.menubutton({
                    text: options.node.op.text,
                });
            }
        });

        optionMenuButton.menubutton({
            text: options.node.op.text,
            menu: "#field_menu2_"  + index
        });

        fieldMenuButton.menubutton({
            text: options.node.field.text,
            menu: '#field_menu_' + index
        });
        index = index + 1;
        return target;
    };

    function createEditor(options, target) {
        var editor = getEditor(options.field);
        options.ed = editor;
        return editor.init(target, null);
    };

    function getEditor(field) {
        var editors = $.fn.datagrid.defaults.editors;
        return editors.text;
    };

    $.fn.expressionnode = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.expressionnode.methods[options](this, param);
        };
        options = options || {};
        return this.each(function () {
            if (!$.data(this, 'expressionnode')) {
                $.data(this, 'expressionnode', {
                    options: $.extend({}, $.fn.expressionnode.defaults, options)
                });
            }
            node(this, options);
        });
    };

    function getData(target) {
        var op = $.data(target, 'expressionnode').options;
        var node = $.extend({}, op.node);
        node.value = op.ed.getValue(op.editor);
        return node;
    };

    $.fn.expressionnode.defaults = {
        data: []
    };

    $.fn.expressionnode.methods = {
        options: function (jq) {
            return $.data(jq[0], 'expressionnode').options;
        },
        getData: function (jq) {
            return getData(jq[0]);
        }
    };

})