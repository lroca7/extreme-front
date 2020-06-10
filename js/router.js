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
