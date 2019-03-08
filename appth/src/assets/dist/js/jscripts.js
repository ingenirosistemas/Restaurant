

$(document).ready(function () {


    /*
     * @autor: 
     * @fecha: 
     * @descripción: Funcion JQUERY que se encarga de quitar caracteres vacíos a los lados y transformar el texto de todos los TEXTAREA, INPUT TEXT
     * 
     *
        * Fecha: 
        * Autor: 
        * Modificación: 1. Agrego la funcionalidad de cambiar el texto a mayúsculas
        *
     */
    $("textarea, :text").blur(function (event) {
        //Remover espacios al inicio y al final
        $(this).val($(this).val().trim());

        //Cambiar el texto a mayúsculas
        //Si el control contiene la class="omitirMayusculas" no se transforma su texto a mayúsculas. Por ejemplo Login, Password
        if ($(this).attr("class") != null && $(this).attr("class").indexOf("omitirMayusculas") == -1) {
            $(this).val($(this).val().toUpperCase());
        }
    });


   


});
