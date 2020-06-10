var COMPLAINT_PHOTO = null;

class Complaint {

    list() {

        let me = this;

        
        var btnAdd = $('<button class="btn btn-primary">Nuevo</button>');
        $('#wrapper-container').append(btnAdd);

        var containerBtnReport = $('<div class="container__btns--report"></div>');
        $('#wrapper-container').append(containerBtnReport);

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

        var btnExcel = $('<button class="btn btn-success">Excel</button>');
        containerBtnReport.append(btnExcel);
        var btnCsv = $('<button class="btn btn-info">Csv</button>');
        containerBtnReport.append(btnCsv);
        var btnPdf = $('<button class="btn btn-danger">Pdf</button>');
        containerBtnReport.append(btnPdf);

        btnExcel.click(function () {
            window.location.href = host + 'complaints/xls';            
        });

        btnPdf.click(function () {
            window.open(host + 'complaints/pdf', '_blank');
        });

        btnCsv.click(function () {
            window.open(host + 'complaints/csv', '_blank');
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