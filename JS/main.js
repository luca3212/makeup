$.ajax({
            type:"POST", // la variable type guarda el tipo de la peticion GET,POST,..
            url:"https://lumamaquillaje.000webhostapp.com/PHP/getProductos.php", //url guarda la ruta hacia donde se hace la peticion
            data:{nombre:"pepe"}, // data recive un objeto con la informacion que se enviara al servidor
            success:function(datos){ //success es una funcion que se utiliza si el servidor retorna informacion
                console.log(datos);
            },
            //dataType: dataType // El tipo de datos esperados del servidor. Valor predeterminado: Intelligent Guess (xml, json, script, text, html).
});
//Array productos seleccionados
carroLocal = [];
//Elemento del carro (cantidad)
const nroElemenCarro = document.getElementById("mostrarnro");

/*================= Tarjeta de cada producto ==================*/
const $app = document.getElementById("divProductos");
const product = params => {
    var floatPrecio = Number.parseFloat(params.precio).toFixed(2);
    return `
    <div class="cuadro" id-producto="${params.id}">
        <div class="conte-foto">
            <div class="foto" >
                <img src="IMG/img${params.id}.jpg" alt="" onclick="agrandar(${params.id})" >
            </div>
        </div>
        <div class="datos">
            <h3>${params.nombre}</h3>
            <p>${params.descripcion}</p>
            <h2>$ ${floatPrecio}</h2>
        </div>
        <div class="botones">
            <button id="bton${params.id}" onclick="anadir(${params.id})">Añadir al carrito</button>
        </div>
    </div>
    `;
};

/*$app.innerHTML += product({ id: 1, nombre: 'Labial', descripcion: 'Rojo mate', precio: 350});*/
/*================= Carga  de los productos ==================*/
for(let i = 0; i< arrayProductos.length; i++){
    $app.innerHTML += product(arrayProductos[i]);
}

/*===================== Tarjeta lista carro ======================*/
const $listaItem = document.getElementById("ListaCarro");
const elemLista = argument =>{
    var sub = argument.precio*argument.cantidad;
    sub = Number.parseFloat(sub).toFixed(2);
    total();
    return `
    <div class="conteItem" idItemProducto="${argument.id}">
        <div class="itemLista">
            <div class="itemFoto">
                <div>
                    <img src="IMG/img${argument.id}.jpg" alt="">
                </div>
            </div>
            <div class="itemdatos">
                <div>
                    <h3>${argument.nombre}</h3>
                    <p>${argument.descripcion}</p>
                    <h2>Precio unitario: $${argument.precio}</h2>
                </div>
            </div>
            <div class="itembotones">
                <div class="btnsContador">
                    <button class="mdi mdi-minus" onclick="modCantidad(0,${argument.id})"></button>
                    <input type="text" name="contadorC" id="CantContador${argument.id}" value="${argument.cantidad}" readonly>
                    <button class="mdi mdi-plus" onclick="modCantidad(1,${argument.id})"></button>
                </div>
                <div class="BtnEliminar">
                    <button  onclick="eliminarItem(${argument.id})"><span class="mdi mdi-close-thick"></span>Eliminar</button>
                </div>
            </div>
            <div class="total">
                <h2 id="subtotal${argument.id}">$ ${sub}</h2>
            </div>
        </div>
    </div>
    `;
};

/*============== Carga de productos al carro ============*/

function total(){
    const importeTotal = document.getElementById('montoTotal');
    var contadorSubtotal;
    var sumaFinal = 0;
    for(let i = 0; i < carroLocal.length; i++){
        contadorSubtotal = carroLocal[i].precio * carroLocal[i].cantidad;
        //console.log(contadorSubtotal);
        sumaFinal += contadorSubtotal;
    }
    importeTotal.innerHTML = "$ "+Number.parseFloat(sumaFinal).toFixed(2);
}

function eliminarItem(idP){
    //elimino el id selecionado
    //let ElementoProducto = arrayProductos.filter(element => element.id == idProducto);
    carroLocal = carroLocal.filter(function(item){
        return item.id != idP;
    }); 

    console.log(carroLocal);
    //actualizo la lista con el sessionStorage
    guardarsessionStorage();
    //muestra la nueva lista
    mostrarCarro();
    //cambio el estado del bton del prodcuto eliminado
    cambioBtonActive(idP);
    //actuliazo la cantidad en el icono carro
    UpdateCantItems();

    //total de la caompra
    total();
}

function modCantidad(valor,iddato){
    const cantidadVisible = document.getElementById('CantContador'+iddato);
    const precioSubtotal =  document.getElementById("subtotal"+iddato);
    const productoSelect = carroLocal.find(element => element.id == iddato);
    console.log(productoSelect);
    console.log("esto aca es lo que filtra");

    if(productoSelect.cantidad==1 && valor==0){
        console.log("error no se puede restar");
    }else{
        if(valor==0){
            productoSelect.cantidad -= 1;
            
        }else{
            productoSelect.cantidad += 1;
        }
        //console.log("el valor de porducto es: "+ productoSelect.cantidad);
        cantidadVisible.value = productoSelect.cantidad;
        precioSubtotal.innerHTML = "$ "+Number.parseFloat(productoSelect.precio*productoSelect.cantidad).toFixed(2);
        guardarsessionStorage();
        total();
        //mostrarCarro();
    }

    /*if(valor==0 && valorCantidad==1){
        console.log("error no se puede restar");
    }else{
        if(valor==0){
            valorCantidad -= 1;
        }else{
            valorCantidad += 1;
        }
        datnro.value = valorCantidad;
        calculoSubTotal(id,valorCantidad);
    }


    var datnro = document.getElementById('CantContador'+id);
    const subTotal = document.getElementById('subtotal'+id);

    valorCantidad = Number(datnro.value);

    console.log("EStos son los valores:"+datnro.value+" dshfsd: ");*/
    
   
}

function calculoSubTotal(iditem, canti){
    const precioUnitario = carroLocal.find(element => element.id == iditem);

    console.log("valor unitario de ese producto: "+ precioUnitario.precio);
}

function anadir(idProducto){
    //encuentro el Producto y recupero el json completo
    let ElementoProducto = arrayProductos.filter(element => element.id == idProducto);
    console.log(ElementoProducto[0]);

    //cargo el json del producto en el arreglo
    //carroLocal.push(ElementoProducto[0]);

    carroLocal.push(
        {
            "id": ElementoProducto[0].id,
            "nombre": ElementoProducto[0].nombre,
            "descripcion": ElementoProducto[0].descripcion,
            "precio": ElementoProducto[0].precio,
            "cantidad": 1
        }
    );

    //guardo el arreglo en el sessionStorage
    guardarsessionStorage();

    //cambio de estado al boton del producto
    cambioBton(idProducto);
   
    //actualizo la cantidad de elementos guardados en el icono chango
    UpdateCantItems();
}


//cambia estado de botones
function cambioBton(idbton){
    //configuracion al boton (qeda inactivo despues de la accion)
    const botonD = document.getElementById('bton'+idbton);
    botonD.innerHTML = "Añadido!";
    botonD.classList.add("btonDisable");
    //botonD.style.background = "#369e5e";
    //botonD.style.color = "#fff";
    //botonD.disabled = true;
}

//cambia estado de botones
function cambioBtonActive(idbton){
    //configuracion al boton (qeda inactivo despues de la accion)
    const botonA = document.getElementById('bton'+idbton);
    
    botonA.innerHTML = "Añadir al carrito";
    botonA.classList.remove("btonDisable");
    //botonA.disabled = true;
}

//guardamos los datos en el sessionStorage
function guardarsessionStorage(){
    if('sessionStorage' in window){
        sessionStorage.setItem("ProductosGuardados", JSON.stringify(carroLocal));
        console.log("Producto Añadido al carro..sessiojnStorage");
    }else{
        alert("Error al guardar en sessionStorage");
    }
}

//recuperar datos del sessionStorge
function recuperarDatos(){
    if('sessionStorage' in window){
        return JSON.parse(sessionStorage.getItem("ProductosGuardados")) || [];
    }else{
        return [];
    }
}

//suma uno a la cantidad de elementos guardados
function UpdateCantItems(){
    nroElemenCarro.innerHTML = carroLocal.length;
}

/*============== Menu Opciones ===============*/
$(document).ready(function(){
    $('.secciones article').hide();
    $('#Productos').show(); 

    $('ul.tabs li a').click(function(){
        //$('ul.tabs li a').removeClass('active');
        //$(this).addClass('active');
        $('.secciones article').hide();
        cerrarMenuBurger();
        var activeTab = $(this).attr('href');
        $(activeTab).show();
        return false;
    });
});

/*============== Carro =====================*/
const carrito=document.getElementById("icoCarro");

carrito.addEventListener('click',()=>{
    if(carroLocal.length!=0){
        mostrarCarro();
        $('.secciones article').hide();
        $('#Carro').show();
    }else{
        console.log("no hay productos en el carro para mostrar");
    }
  
});

function mostrarCarro(){
    datossessionStorage = recuperarDatos();

    console.log(datossessionStorage.length);
    console.log("datos arriba");

    $listaItem.innerHTML = "";
    for(let i = 0; i< datossessionStorage.length; i++){
        $listaItem.innerHTML += elemLista(datossessionStorage[i]);
    }


    /*
    $listaItem.innerHTML = "";
    datossessionStorage.map((dataP) => {
       console.log(dataP);
       $listaItem.innerHTML += elemLista(dataP);
    });
    */
   
}




//Sincronizacion de datos del array(carroLocal) y el SessionStorage
window.onload = function () {
    datosLocalStorage = recuperarDatos();

    datosLocalStorage.map((tareaG) => {
        //addLista(tareaG);
        carroLocal.push(tareaG);
    });
    nroElemenCarro.innerHTML = carroLocal.length;
    for(let i=0; i<carroLocal.length;i++){
        cambioBton(carroLocal[i].id);
    }
};


/*============== Menu mobiles ===============*/
const navburger = document.getElementById("divBurger");
const navmenu = document.getElementById("menuPrincipal");
const navcruz = document.getElementById("close");

//Abrir
if(navburger){
    navburger.addEventListener('click', () =>{
        navmenu.classList.add("mostrarmenu");
        navburger.classList.add("disable"); 
    });
}

//Cerrar
if(navcruz){
    navcruz.addEventListener('click',()=>{
        navmenu.classList.remove("mostrarmenu");
        navburger.classList.remove("disable");
    });
}

//Cerramos el menu para celulares
function cerrarMenuBurger(){
    var ancho =$(window).width();
    if (ancho < 830) {
        navmenu.classList.remove("mostrarmenu");
        navburger.classList.remove("disable");
    }
}
