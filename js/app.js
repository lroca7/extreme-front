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







