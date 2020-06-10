class User {

  listusers() {


    var me = this;
    var btnAdd = $('<button class="btn btn-primary">Nuevo Usuario</button>');
    $('#wrapper-container').append(btnAdd);

    var grid = $('<div id="grid-user" class="grid"></div>');
    $('#wrapper-container').append(grid);

    var dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: host + 'api/users',
          type: "get",
          dataType: "json"
        }
      },
      schema: {
        // total: 'total',
        // data: 'data',
      },
      // pageSize: 10
    });

    grid.kendoGrid({
      dataSource: dataSource,
      height: 550,
      filterable: true,
      sortable: true,
      //pageable: true,
      pageable: {
        refresh: true,
        pageSizes: true,
        buttonCount: 5,
        messages: {
          display: "{0}-{1} de {2}",
          itemsPerPage: "Items"
        }
      },
      columns: [
        {
          field: "username",
          title: "Name",
          filterable: {
            cell: {
              showOperators: false,
              operator: "contains"
            }
          }
        },
        {
          field: "email",
          title: "Email",
        },
        {
          command: [
            {
              name: "view",
              text: "Editar",
              click: function (e) {
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                me.updateUser(dataItem)
              }
            },
            {
              name: "delete",
              text: "Eliminar",
              click: function (e) {
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));


              }
            }
          ]
        }
      ]

    });



    btnAdd.click(function (params) {
      me.newuser();
    });


  }

  newuser() {

    var modal = null;

    modal = new Modal('Nuevo usuario', 'Guardar', 'Cancelar', 'modal-lg');
    modal.newModal();

    var form = $(`<form class="form-user">
          <div class="form-group col-sm-12">
            <label for="user-name">Name</label>
            <input id="user-name" type="text" class="form-control">
          </div>
          <div class="form-group col-sm-12">
            <label for="user-email">Email</label>
            <input id="user-email" type="text" class="form-control">
          </div>
          <div class="form-group col-sm-12">
          <label for="user-password">Contraseña</label>
          <input id="user-password" type="text" class="form-control">
        </div>
      </form>`);

    var bodyModal = modal.addContent();

    bodyModal.append(form);

    modal.saveBtn().click(function () {

      var data = {
        username: $('#user-name').val(),
        email: $('#user-email').val(),
        password: $('#user-password').val()
      }



      fetch(host + 'api/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        return response;
      }).then(function (response) {

        if (response.status == 200) {
          alert('User create successfully');

          $("#grid-user").data("kendoGrid").dataSource.read();


          modal.close();


        } else {
          alert('Error: ' + response.statusText);
        }

      });

    });

  }

  updateUser(dataItem) {

    var modal = null;

    modal = new Modal('Actualizar usaurip', 'Guardar', 'Cancelar', 'modal-lg');
    modal.newModal();

    var form = $(`<form class="form-user">
          <div class="form-group col-sm-12">
            <label for="user-name">Name</label>
            <input id="user-name" type="text" class="form-control">
          </div>
          <div class="form-group col-sm-12">
            <label for="user-email">Email</label>
            <input id="user-email" type="text" class="form-control">
          </div>
          <div class="form-group col-sm-12">
          <label for="user-password">Contraseña</label>
          <input id="user-password" type="text" class="form-control">
        </div>
      </form>`);

    var bodyModal = modal.addContent();

    bodyModal.append(form);


    $('#user-name').val(dataItem.username);
    $('#user-email').val(dataItem.email);


    modal.saveBtn().click(function () {

      var data = {
        username: $('#user-name').val(),
        email: $('#user-email').val(),
        password: $('#user-password').val()
      }

      fetch(host + 'api/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        return response;
      }).then(function (response) {

        if (response.status == 200) {
          alert('User update successfully');

          $("#grid-user").data("kendoGrid").dataSource.read();


          modal.close();


        } else {
          alert('Error: ' + response.statusText);
        }

      });

    });

  }

}

