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
