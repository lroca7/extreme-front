var COMPLAINT_PHOTO = null;

class Complaint {

    list() {

        let me = this;

        var btnAdd = $('<button class="btn btn-primary">Nuevo</button>');
        $('#wrapper-container').append(btnAdd);

        var grid = $('<div id="grid-complaint" class="grid"></div>');
        $('#wrapper-container').append(grid);

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: host + 'api/complaints',
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
                    field: "id",
                    title: "Código",
                    width: 100,
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {
                    field: "type.name",
                    title: "Tipo",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {
                    field: "subject",
                    title: "Asunto",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {
                    field: "user.email",
                    title: "Usuario",
                    filterable: {
                        cell: {
                            showOperators: false,
                            operator: "contains"
                        }
                    }
                },
                {
                    command: [
                        {
                            name: "view",
                            text: "Ver",
                            click: function (e) {
                                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                                me.viewComplaint(dataItem);

                            }
                        },
                        {
                            name: "edit",
                            text: "Editar",
                            click: function (e) {
                                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                                me.updateComplaint(dataItem);

                            }
                        },
                        {
                            name: "delete",
                            text: "Eliminar",
                            click: function (e) {
                                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                                me.deleteComplaint(dataItem);
                            }
                        }
                    ]
                }
            ]

        });



        btnAdd.click(function (params) {
            me.newComplaint();
        });


    }

    newComplaint() {

        var modal = null;

        modal = new Modal('Nuevo reclamo', 'Guardar', 'Cancelar', 'modal-lg');
        modal.newModal();

        var form = $(`<form class="form-user">
              <div class="form-group col-sm-12">
                <label for="complaint-subject">Asunto</label>
                <input id="complaint-subject" type="text" class="form-control">
              </div>     
              <div class="form-group">
                <label for="file">Image</label>
                <input type="file" id="files" name="files" />
              </div>         
            </div>
          </form>`);


        let user = new Combo2({
            container: form,
            url: 'api/users',
            displayField: 'email',
            valueField: 'id',
            labelname: 'Usuario',
            colsm: 'col-sm-4'
        });

        let type = new Combo2({
            container: form,
            url: 'api/complaint_types',
            displayField: 'name',
            valueField: 'id',
            labelname: 'Tipo',
            colsm: 'col-sm-4'
        });




        var bodyModal = modal.addContent();

        bodyModal.append(form);

        document.getElementById('files').addEventListener('change', handleFileSelect, false);

        modal.saveBtn().click(function () {

            debugger
            var data = {
                subject: $('#complaint-subject').val(),
                type: type.valueCombo(),
                user: user.valueCombo(),
                photo: COMPLAINT_PHOTO
            }



            fetch(host + 'api/complaints', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return response;
            }).then(function (response) {

                if (response.status == 200) {
                    alert('Complaint create successfully');

                    $("#grid-complaint").data("kendoGrid").dataSource.read();


                    modal.close();


                } else {
                    alert('Error: ' + response.statusText);
                }

            });

        });

    }

    viewComplaint(dataItem){

        fetch(host + 'api/complaints/' + dataItem.id)
        .then(response => response.json())
        .then(dataItem => {


            let modal = new Modal('Detalle de reclamo', 'Guardar', 'Cancelar', 'modal-lg');
            modal.newModal();

            var form = $(`<form class="form-user">
                <div class="form-group col-sm-12">
                    <label for="complaint-subject">Asunto</label>
                    <input id="complaint-subject" type="text" class="form-control">
                </div>                           
            </form>`);


            let user = new Combo2({
                container: form,
                url: 'api/users',
                displayField: 'email',
                valueField: 'id',
                labelname: 'Usuario',
                colsm: 'col-sm-4'
            });

            let type = new Combo2({
                container: form,
                url: 'api/complaint_types',
                displayField: 'name',
                valueField: 'id',
                labelname: 'Tipo',
                colsm: 'col-sm-4'
            });

            var containerPhoto = $(`<div class="complaint__photo">                       
                <img src="data:`+dataItem.photo.mimeType+`;base64, `+dataItem.photo.imageBase64+`"
                 alt="Photo Complaint" width="250px" />                
            </div>)`);

            form.append(containerPhoto);

            var bodyModal = modal.addContent();

            bodyModal.append(form);

            $('#complaint-subject').val(dataItem.subject);
            user.valueCombo(dataItem.user);
            type.valueCombo(dataItem.type);

            modal.saveBtn().click(function () {

                var data = {
                    subject: $('#complaint-subject').val(),
                    type: type.valueCombo(),
                    user: user.valueCombo(),
                }

                fetch(host + 'api/complaints/' + dataItem.id, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    return response;
                }).then(function (response) {

                    if (response.status == 200) {
                        alert('Complaint update successfully');

                        $("#grid-complaint").data("kendoGrid").dataSource.read();


                        modal.close();


                    } else {
                        alert('Error: ' + response.statusText);
                    }

                });

            });

        })
        .catch(error => console.error(error))
    }

    updateComplaint(dataItem) {

        fetch(host + 'api/complaints/' + dataItem.id)
            .then(response => response.json())
            .then(dataItem => {


                let modal = new Modal('Actualizar reclamo', 'Guardar', 'Cancelar', 'modal-lg');
                modal.newModal();

                var form = $(`<form class="form-user">
                    <div class="form-group col-sm-12">
                        <label for="complaint-subject">Asunto</label>
                        <input id="complaint-subject" type="text" class="form-control">
                    </div>           
                    </div>
                </form>`);


                let user = new Combo2({
                    container: form,
                    url: 'api/users',
                    displayField: 'email',
                    valueField: 'id',
                    labelname: 'Usuario',
                    colsm: 'col-sm-4'
                });

                let type = new Combo2({
                    container: form,
                    url: 'api/complaint_types',
                    displayField: 'name',
                    valueField: 'id',
                    labelname: 'Tipo',
                    colsm: 'col-sm-4'
                });

                var bodyModal = modal.addContent();

                bodyModal.append(form);

                $('#complaint-subject').val(dataItem.subject);
                user.valueCombo(dataItem.user);
                type.valueCombo(dataItem.type);

                modal.saveBtn().click(function () {

                    var data = {
                        subject: $('#complaint-subject').val(),
                        type: type.valueCombo(),
                        user: user.valueCombo(),
                    }

                    fetch(host + 'api/complaints/' + dataItem.id, {
                        method: 'PUT',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (response) {
                        return response;
                    }).then(function (response) {

                        if (response.status == 200) {
                            alert('Complaint update successfully');

                            $("#grid-complaint").data("kendoGrid").dataSource.read();


                            modal.close();


                        } else {
                            alert('Error: ' + response.statusText);
                        }

                    });

                });

            })
            .catch(error => console.error(error))
    }

    deleteComplaint(dataItem) {

        var modal = null;

        modal = new Modal('Eliminar reclamo', 'Eliminar', 'Cancelar', 'modal-xs');
        modal.newModal();

        var bodyModal = modal.addContent();

        bodyModal.append('<p>Deseas eliminar eliminar el registro</p>');

        modal.saveBtn().click(function () {

            fetch(host + 'api/complaints/' + dataItem.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return response;
            }).then(function (response) {

                if (response.status == 204) {
                    alert('Complaint deleted');

                    $("#grid-complaint").data("kendoGrid").dataSource.read();

                    modal.close();

                } else {
                    alert('Error: ' + response.statusText);
                }

            });

        });

        modal.canlcelBtn().click(function () {
            modal.close();
        })
    }


}

function handleFileSelect(evt) {

    var f = evt.target.files[0]; // FileList object
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            var binaryData = e.target.result;
            //Converting Binary Data to base 64
            var base64String = window.btoa(binaryData);
            //showing file converted to base64

            COMPLAINT_PHOTO = {
                name: f.name,
                mimeType: f.type,
                imageBase64: base64String
            };

        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
}
class Menu2{
    
    setMenu(container){

        var nav = $('<nav class="menu">');
        
        var ol = $('<ol></ol>');
        
        var menu1 = $('<li></li>');
        var link1 = $('<a class="link" href="#user">Usuarios</a>');
        menu1.append(link1);
        var menu2 = $('<li></li>');
        var link2 = $('<a class="link" href="#complaint">Peticiones y Reclamos</a>');
        menu2.append(link2);

        ol.append(menu1);
        ol.append(menu2);

        nav.append(ol);

        container.append(nav);

    }

}


function validation(event) {
    if(event.matches){
        
    }else{
        burgetButton.removeEventListener('click', hideShow);
    }
}
// validation(ipad);

function hideShow() {

    if(menu.classList.contains('is-active')){
        menu.classList.remove('is-active');
    }else{
        menu.classList.add('is-active');
    }
}

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


host = 'https://localhost:8000/';



function Grid(conf) {

    var grid = $('<div id="grid"></div>');

    var toolbar = $('<div class="toolbar"></div>');

    if(conf.toolbar){
      for(var i=0; i< conf.toolbar.length; i++){
        var iToolbar = conf.toolbar[i];
        var btnAction = $('<button type="button" class="btn btn-primary">'+iToolbar.title+'</button>');
        toolbar.append(btnAction);
        //btnAction.click = iToolbar.click;
      
        btnAction.click(iToolbar.click);
      }

      grid.append(toolbar);
    }

    
    conf.render.append(grid);

    var dataSource = new kendo.data.DataSource({
      transport: {
          read: {              
              url: host+conf.url,
              type: "get",
              dataType: "json"
          }
      },
      schema: {          
          total: 'total',
          data: 'data',
      },
      pageSize: 10
    }); 

    if(conf.height){
      height = conf.height;
    }else{
      height = 575;
    }


    grid.kendoGrid({
        dataSource: dataSource,
        height: height,
        filterable: {
            mode: "row"
        },
        editable: conf.editable,
        pageable: {
          refresh: true,
          pageSizes: true,
          buttonCount: 5,
          messages: {
            display: "{0}-{1} de {2}",
            itemsPerPage: "Items"
          }
        },
        columns: conf.columns
    });


    var grid_r= $("#grid").data("kendoGrid");
    
    return grid_r;

}

class Modal{

    modal= null;
    title = 'Modal';    

    constructor(title, textBtnSave, textBtnRemove, size, id="modal-app"){
      this.title = title;
      this.textBtnSave = textBtnSave || 'Save';
      this.textBtnRemove = textBtnRemove || 'Close';
      this.size = size || '';
      this.id = id;
    }

    newModal(){
      
        this.modal = $(`<div class="modal fade" id=`+this.id+` tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog `+this.size+`" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">`+this.title+`</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div id="modal-body" class="modal-body">
                
              </div>
              <div class="modal-footer">
                <button id="btn-remove" type="button" class="btn btn-outline-secondary" data-dismiss="modal">`+this.textBtnRemove+`</button>
                <button id="btn-save" type="button" class="btn btn-primary">`+this.textBtnSave+`</button>
              </div>
            </div>
          </div>
        </div>`);

        $('#wrapper-container').append(this.modal);

        this.modal.modal('show');

    }

    addContent(){

      return this.modal.modal('show').find('.modal-body');
    }
    
    addContentFooter(){

      return this.modal.modal('show').find('.modal-footer');
    }

    saveBtn(){
      return this.modal.modal('show').find('#btn-save');
    }

    canlcelBtn(){
      return this.modal.modal('show').find('#btn-remove');
    }

    close(){
      return this.modal.modal('hide');
    }

}

class Alert{

    constructor(){
      
    }

    newAlert(text, type){
      
      var alerta = $(`<div class="alert alert-fix role="alert""></div>`);

      switch (type) {
        case 'success':
            alerta.addClass('alert-success');
            alerta.append('<i class="far fa-check-circle"></i>');            
          break;
        case 'error':
            alerta.addClass('alert-danger');
            alerta.append('<i class="far fa-check-circle"></i>');
          break;
        case 'warning':
            alerta.addClass('alert-warning');
            alerta.append('<i class="far fa-check-circle"></i>');
          break;
        default:

          alerta.addClass('alert-info');
          alerta.append('<i class="far fa-check-circle"></i>');

          break;
      }

      alerta.append('<span class="alert-text">'+text+'</span>');

      $('#wrapper-main').append(alerta);

      setTimeout(function() {
        alerta.remove();
      }, 1000);


    }
}


class Combo2 {

  comboTarget = null;
  kendoComboBox = null;

  container = null;
  url = null;
  displayField = null;
  valueField = null;
  labelname = null;
  colsm = null;
  required = null;
  remote = true;
  dataSource = null;

  constructor(params) {

      this.container = params.container;
      this.url = params.url;
      this.displayField = params.displayField
      this.valueField = params.valueField;
      this.labelname = params.labelname
      this.colsm = params.colsm
      this.required = params.required;
      
      if(params.remote !== undefined){
          this.remote = params.remote;
      }else{
          this.remote = true;
      }

      this.dataSource = params.dataSource;

      this.newCombo2();
  }

  newCombo2() {

      var icombo = $('<input placeholder="Select" style="width: 100%;"/>');
      var formgroup = $('<div class="form-group"></div>');
      formgroup.append(icombo);

      if(this.remote){
          var dataSource = new kendo.data.DataSource({
              transport: {
                  read: {
                      url: host + this.url,
                      type: "get",
                      dataType: "json"
                  }
              },
              schema: {
                  // total: 'total',
                  // data: 'data'
              }
          });

      }else{
          var dataSource = this.dataSource;
      }
      

      if (this.colsm) {
          formgroup.addClass(this.colsm);
      } else {
          formgroup.addClass('col-sm-12');
      }


      if (!_.isNull(this.labelname)) {
          if (this.labelname !== undefined) {
              var label = $('<label class="label-combobox">' + this.labelname + '</label>');
              formgroup.prepend(label);


              if (this.required) {
                  icombo.attr('required', true);
                  label.append('<span class="required"> *</span>')
              }
              
          }

         

      }

      var comboBoxKendo = icombo.kendoComboBox({
          dataTextField: this.displayField,
          dataValueField: this.valueField,
          dataSource: dataSource,
          filter: "contains",
          suggest: true,
          index: 3
      });

      this.container.append(formgroup);

      this.comboTarget = comboBoxKendo;
      this.kendoComboBox = comboBoxKendo.data("kendoComboBox");;

      return comboBoxKendo;
  }

  valueCombo(value) {

      if (value === undefined) {
          var dataItem = this.kendoComboBox.dataItem();


          if (dataItem) {
              dataItem = dataItem.toJSON();
          } else {
              dataItem = [];
          }

          return dataItem;

      } else {

          if (value !== null) {
              this.kendoComboBox.value(value[this.valueField]);
          }

      }


  }

  change(fn) {
      var combo = this.comboTarget;
      var combobox = combo.data("kendoComboBox");
      combobox.bind("change", fn);

  }

}








const pathBase = window.location.href;

var Router = Backbone.Router.extend({
    routes: {
        'complaint': 'complaint',
        'user': 'user'
    },

    complaint: function () {

        $('#wrapper-container').empty();
        $('#wrapper-title').empty();
        $('#wrapper-title').append('<h4 class="subtitles">Peticiones y Reclamos</h4>');

        let g = new Complaint();
        g.list();

    },



    user: function () {


        $('#wrapper-container').empty();
        $('#wrapper-title').empty();
        $('#wrapper-title').append('<h4 class="subtitles">Usuarios</h4>');

        var g = new User();
        g.listusers();

    },





});


//'router' is an instance of the Router
var router = new Router();

//Start listening to the routes and manages the history for bookmarkable URL's
Backbone.history.start();
