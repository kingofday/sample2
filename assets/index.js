var items = [
    { UserId: 1, Avatar: 'assets/me.png', FirstName: "شهروز", LastName: 'بذرافشان' }
];

var gridDataSource = new kendo.data.DataSource({
    data: items,
    schema: {
        model: {
            fields: {
                FirstName: { type: "string" },
                LastName: { type: "string" }
            }
        }
    },
    pageSize: 10,
    sort: {
        field: "FirstName",
        dir: "desc"
    }
});

const strings = {
    firstName: 'نام',
    lastName: 'نام خانوادگی',
    actions: 'عملیات',
    edit: 'ویرایش',
    avatar: 'تصویر'
};

$(document).ready(function () {

    var edit = function (e) {
        e.preventDefault();
        var form = kendo.template($("#form").html());
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        console.log(dataItem);
        dataItem.Mode = "edit";
        var wnd = $("#window").data("kendoWindow");

        wnd.content(form(dataItem));
        wnd.center().open();
    };

    var grid = $("#grid").kendoGrid({
        dataSource: gridDataSource,
        columns: [{
            field: "Avatar",
            title: strings.avatar,
            template: function (dataItem) {
                return "<img class='avatar' src='" + dataItem.Avatar + "' alt='avatar' />";
            }
        },
        {
            field: "FirstName",
            title: strings.firstName,
        }, {
            field: "LastName",
            title: strings.lastName,
        },
        {
            title: strings.actions,
            command:
            {
                text: strings.edit,
                click: edit
            }
        }]
    });

    //$("#dialog").kendoWindow({
    //    visible: false
    //});

    $("#window").kendoWindow({
        actions: ["Custom", "Maximize", "Minimize", "Close"],
        draggable: false,
        height: "300px",
        modal: true,
        pinned: false,
        position: {
            top: 100,
            right: 100
        },
        resizable: false,
        title: "مدیریت کاربر",
        width: "500px",
        visible: false
    });

    var src = null;
    var tempId = 1;
    $(document).on('change', '#uploader', function (e) {
        console.log(e.target.files[0]);
        src = URL.createObjectURL(e.target.files[0]);
        $('#show_img').attr('src', src);

    });

    $(document).on('click', '#submit', function () {
        if ($(this).data('mode') === 'edit') {
            //======================== add ========================
            let item = items.find(i => i.UserId === parseInt($('#UserId').val()));
            item.FirstName = $('#FirstName').val();
            item.LasttName = $('#LastName').val();
            item.Avatar = src ? src : item.Avatar;
        }
        else {
            //======================== edit ========================

            var newItem = {
                UserId: $('#UserId').val(),
                FirstName: $('#FirstName').val(),
                LastName: $('#LastName').val(),
                Avatar: src
            };
            items.push(newItem);
            var win = $("#window").data("kendoWindow");
            win.close();

        }
        $("#grid").data("kendoGrid").dataSource.read();
    });

    $(document).on('click', '#add', function () {
        tempId++;
        var form = kendo.template($("#form").html());
        var wnd = $("#window").data("kendoWindow");
        wnd.content(form({ Mode: 'add', UserId: tempId, Avatar: 'assets/me.png', FirstName: '', LastName: '' }));
        wnd.center().open();
    });
});