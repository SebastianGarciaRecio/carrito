document.getElementById("iconoCarritoImg").addEventListener("click", function () {
    let carrito = document.getElementById("carrito");
    if (carrito.style.visibility == "visible") {
        carrito.style.visibility = "hidden";
    } else {
        carrito.style.visibility = "visible";
    }
});



let divs = document.querySelectorAll('div');
let buttons = document.querySelectorAll('button');
buttons.forEach(boton => {
    boton.addEventListener("click", async function (event) {
        event.preventDefault();
        let id = parseInt(boton.getAttribute("id"));
        let carritoDiv = document.getElementById("carrito");
        try {
            let response = await fetch("/add-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ id })
            });

            let result = await response.json();

            if (result.success) {
                let lista = result.carrito;
                let productosDiv = `<div id="productos">`;
                let total = 0;
                for (let index = 0; index < lista.length; index++) {
                    let producto = lista[index];
                    let productoDiv = "<div>";
                    productoDiv += `
                    <img src="img/${producto.imagen}">
                    <h4>${producto.nombre}</h4>
                    <p id="precio">${producto.precio}$</p>
                    <p id="cantidad">${producto.cantidad}</p>
                    <button type="button" id="${producto.id}" class="btnQuitar">delete</button>`
                    productoDiv += "</div>"
                    productosDiv += productoDiv
                    total += producto.precio * producto.cantidad; 
                }
                let totalDiv = `<div><h4>Total:</h4><p id="total">${total.toFixed(2)}</p><button type="button" id="vaciar">Vaciar</button><button type="button" id="pagar">pagar</button></div>`;
                productosDiv += totalDiv;
                productosDiv += "</div>"
                carritoDiv.innerHTML = productosDiv;
                document.getElementById("pagar").addEventListener("click", function () {
                    window.location.href = "../pago.html";
                });

                let btnQuitar = document.querySelectorAll('.btnQuitar');
                btnQuitar.forEach(btn => {
                    btn.addEventListener("click", async function (event) {
                        event.preventDefault();
                        let idNew = btn.getAttribute("id");
                        try {
                            let responseNew = await fetch("/remove-product", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                credentials: "include",
                                body: JSON.stringify({ idNew })
                            });
                            
                            let resultNew = await responseNew.json();
                            console.log(resultNew)
                            
                            if (resultNew.success) {
                                let productos = document.getElementById("productos");
                                let elementos = productos.querySelectorAll("div");
                                for (let index = 0; index < elementos.length; index++) {
                                    let elemento = elementos[index];
                                    let idElemento = elemento.querySelector("button").getAttribute("id");
                                 
                                    if (idElemento == idNew) {
                                        console.log(elemento);
                                        let totalDiv = document.getElementById("total");
                                        let precio = elemento.querySelector("#precio").textContent;
                                        let total = document.querySelector("#total").textContent;
                                        total = parseFloat(total) - parseFloat(precio);
                                        console.log(total);
                                        totalDiv.textContent = total.toFixed(2);

                                        if(resultNew.cantidad == 0) {
                                            elemento.remove();
                                        }else{
                                            elemento.querySelector("#cantidad").textContent = resultNew.cantidad;
                                        }
                                        break;
                                    }
                                }
                            }

                        }catch(error){

                            console.log(error);
                        }

                            
                    });  
                });

                //bonton de eliminar todo
                let btnVaciar = document.getElementById("vaciar");
                btnVaciar.addEventListener("click", async function (event) {
                    event.preventDefault();
                    try {
                        let responseNew = await fetch("/remove-all", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include"
                        });
                            
                        let resultNew = await responseNew.json();
                        
                        if (resultNew.success) {
                            let productos = document.getElementById("productos");
                            productos.innerHTML = "<h4>No hay nada en el carrito</h4>"
                        }
                        
                    } catch (error) {
                        console.log(error);
                        //mostrar mensaje de error
                        console.log("hubo un error");
                        
                    }

                });

                

            } else {
                alert("hubo un problema");
            }
        } catch (error) {
            console.log(error);
        }

    });
});