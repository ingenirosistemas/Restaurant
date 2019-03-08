import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

/***
 * function utils
 */
export class Utils {
    static arr(obj) {
        return Object.keys(obj).map(name => obj[name]);
    }
    public static get_pickadate(): any {
        return { selectMonths: true, selectYears: 15, format: 'dd/mm/yyyy', closeOnSelect: true };
    }

    public static get_pickadateDatosBasicos(): any {
        return { selectMonths: true, selectYears: 15, format: 'dd/mm/yyyy', closeOnSelect: true, max: new Date() };
    }

    public static handleError(error: any): Promise<any> {
        console.error('An error occurred', error._body);
        return Promise.reject(error._body);
    }

    /**
    * @author Milton Sanchez
    * Metodo que recibe la fecha en formato de DB para convertirla en el formato dd/MM/yyyy.
    */
    public static getStringToDate(strValue: string): string {
        const numMonth = (+strValue.substring(4, 6)) - 1;
        const dteDate = new Date(+strValue.substring(0, 4), numMonth, (+strValue.substring(6, 8)));
        if (dteDate != null) {
            return new DatePipe('es').transform(dteDate, 'dd/MM/yyyy');
        }
        return new DatePipe('es').transform(new Date(), 'dd/MM/yyyy');
    }

    /**
     * @author Milton Sanchez
     * @param f
     */
    public static string_to_date(f: string): Date {
        const ff1 = f.split('/');
        const fd = new Date(ff1[1] + '/' + ff1[0] + '/' + ff1[2]);
        return new Date(fd);

    }

    /**
     * @author Milton Sanchez
     * @param strValue
     */
    public static toInt(strValue: string): number {
        return +strValue;

    }


}

/**
 * constans values
 */
export class Constants {

    public static httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('access_token') ?
                JSON.parse(sessionStorage.getItem('access_token')) : ''}`
        })
    };

    public static httpOptionsFile = {
        headers: new HttpHeaders({
            'Accept': 'application/json',
        })
    };

    public static generateReportHeaders = {
        headers: new HttpHeaders({
            'Accept': 'application/octet-stream',
            'Content-Type': 'application/json',
            'responseType': 'arraybuffer'
        })
    };



    // Apis
    public static URL_DEMO = 'http://192.168.8.204:8080/ApiRest/webresources/persona';
    public static URL_DEMO_GUARDAR = environment.HOST + '/appth-web/rest/persona/guardar';
    public static URL_GRUPO_GENERO = environment.HOST + '/appth-web/rest/persona/getGrupoGenero';
    public static URL_CATALOGO = environment.HOST + '/appth-web/rest/catalogo/getCatalogo';
    public static URL_CATALOGO_TIPO_PERMISO = environment.HOST + '/appth-web/rest/permiso/getTipoPermisosByCategoria/';
    // public static URL_CATALOGO_CATEGORIA = environment.HOST + '/appth-web/rest/catalogo/getCatalogoTipoCategoria';
    public static URL_CONSECUTIVO_CONTRATO = environment.HOST + '/appth-web/rest/contrato/getConsecutivo/';
    public static URL_HOJADEVIDA_GUARDAR = environment.HOST + '/appth-web/rest/hojadevida';
    public static URL_HOJADEVIDA_ACTUALIZAR = environment.HOST + '/appth-web/rest/hojadevida';
    public static URL_CONTRATO_GUARDAR = environment.HOST + '/appth-web/rest/contrato';
    public static URL_EMBARAZO_ACTUAL = environment.HOST + '/appth-web/rest/embarazoActual';
    public static URL_BUSCAR_CONTRATO = environment.HOST + '/appth-web/rest/contrato/getContratoBusqueda';
    public static URL_BUSCAR_OTRO_SI = environment.HOST + '/appth-web/rest/contrato/getOtrosi/';
    public static URL_BUSCAR_CONTRATO_EDITAR = environment.HOST + '/appth-web/rest/contrato/getContratoEditar';
    public static URL_BUSCARHOJADEVIDA = environment.HOST + '/appth-web/rest/hojadevida/getHojadeVidaBusqueda';
    public static URL_HOJADEVIDA_LISTA = environment.HOST + '/appth-web/rest/hojadevida/getHojadevida';
    public static URL_GETHOJADEVIDABYID = environment.HOST + '/appth-web/rest/hojadevida/getHojadevidaById';
    public static URL_BUSCAR_LLEGADA_EDITAR = environment.HOST + '/appth-web/rest/llegadaTarde/getLlegadaTardeEditar';
    public static URL_EDITAR_LLEGADA_TARDE = environment.HOST + '/appth-web/rest/llegadaTarde';
    public static URL_LLEGADATARDE_LISTA = environment.HOST + '/appth-web/rest/llegadaTarde/getlistallegadastarde';
    public static URL_LLEGADATARDE_GUARDAR = environment.HOST + '/appth-web/rest/llegadaTarde';
    public static URL_USER = environment.HOST + '/common-web/rest/users/login';
    public static URL_BUSCAR_DINAMIZADORA_EDITAR = environment.HOST + '/appth-web/rest/embarazoActual/getEmbarazoActualEditar';
    public static URL_EDITAR_DINAMIZADORAGESTACION = environment.HOST + '/appth-web/rest/embarazoActual';
    public static URL_DINAMIZADORAGESTACION_GUARDAR = environment.HOST + '/appth-web/rest/embarazoActual';
    public static URL_DINAMIZADORAGESTACION_LISTA = environment.HOST + '/appth-web/rest/embarazoActual/getListaEmbarazoActual';
    public static URL_GETCONTRATACIONBUSQUEDA = environment.HOST + '/appth-web/rest/contrato/getContratacionBusqueda/';
    public static URL_INCAPACIDAD_GUARDAR = environment.HOST + '/appth-web/rest/incapacidad';
    public static URL_EXAMEN_GUARDAR = environment.HOST + '/appth-web/rest/examen';
    public static URL_EXAMEN_LISTA = environment.HOST + '/appth-web/rest/examen/getListaExamen';
    public static URL_INCAPACIDAD_LISTA = environment.HOST + '/appth-web/rest/incapacidad/getListaIncapacidad';
    public static URL_HOJADEVIDA_DELETE_EXPLAB = environment.HOST + '/appth-web/rest/hojadevida/delete/explab';
    public static URL_HOJADEVIDA_DELETE_ESTUDIO = environment.HOST + '/appth-web/rest/hojadevida/delete/estudio';
    public static URL_BUSCAR_EXAMEN_EDITAR = environment.HOST + '/appth-web/rest/examen/getExamenEditar';
    public static URL_BUSCAR_EXAMEN_EDIT = environment.HOST + '/appth-web/rest/examen';
    public static URL_PERMISO_TEMPORAL_GUARDAR = environment.HOST + '/appth-web/rest/permiso/guardarPermisoTemporal';
    public static URL_PERMISO_LISTA = environment.HOST + '/appth-web/rest/permiso/getListaPermiso';
    public static URL_CONTRATO_GUARDAR_NOVEDAD = environment.HOST + '/appth-web/rest/contrato/guardarNovedad';
    public static URL_CATALOGO_GET_MUNICIPIO_BY_DEPARTAMENTO = environment.HOST + '/appth-web/rest/permiso/getMpioByDepto/';
    public static URL_CATALOGO_GET_CONF_BY_MUNICIPIO = environment.HOST + '/appth-web/rest/permiso/getConfByMunicipio/';
    public static URL_PERMISO_DESPLAZAMIENTO_GUARDAR = environment.HOST + '/appth-web/rest/permiso/guardarPermisoDesplazamiento';
    public static URL_PERMISO_DELETE = environment.HOST + '/appth-web/rest/permiso/delete';
    public static URL_NOVEDADES_BUSQUEDA = environment.HOST + '/appth-web/rest/contrato/getNovedades/';
    public static URL_NOVEDADES_BUSQUEDA_EMBARAZO = environment.HOST + '/appth-web/rest/embarazoActual/getNovedades/';

    public static URL_GET_INCAPACIDAD_BY_ID = environment.HOST + '/appth-web/rest/incapacidad/getIncapacidadById';
    public static URL_HOJADEVIDA_DELETE_NOVEDAD = environment.HOST + '/appth-web/rest/contrato/delete/novedad';
    public static URL_DINAMIZADORA_DELETE_NOVEDAD = environment.HOST + '/appth-web/rest/embarazoActual/delete/novedad';

    public static URL_GET_VALIDAR_EXISTE_HOJADEVIDA = environment.HOST + '/appth-web/rest/hojadevida/validarExisteHojadevida';
    public static URL_GET_VALIDAR_EXISTE_GESTANTE = environment.HOST + '/appth-web/rest/embarazoActual/validarExisteembarazo';
    public static URL_GET_PERSONA_SUIIN_BY_IDENTIFICACION = environment.HOST + '/appth-web/rest/hojadevida/getPersonaSuiinByidentificacion';
    public static URL_GET_SOPORTES_BY_ID_HOJADEVIDA = environment.HOST + '/appth-web/rest/hojadevida/obtenerSoportes';
    public static URL_GET_ID_PADRE_BY_ID = environment.HOST + '/appth-web/rest/incapacidad/getIdPadre';
    public static URL_HOJADEVIDA_DELETE_SOPORTE = environment.HOST + '/appth-web/rest/hojadevida/delete/soporte';

    public static GENERATE_PDF_REPORT = environment.HOST + '/common-web/rest/report/pdf/';


    public static URL_ARL_LISTA = environment.HOST + '/appth-web/rest/arl/getArls';

    // Expresiones regulares
    public static CAMPO_ALFANUMERICO = '^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$';
    public static CAMPO_NUMERICO = '[0-9]{7,10}';
    public static CAMPO_NUMERO = '[0-9]{3,10}';
    public static CAMPO_SALARIO = '[0-9]{6,10}';
    public static CAMPO_TALLAC = '[0-9]{1,2}';
    public static CORREO_VALID = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
    public static TELEFONO_VALID = '[0-9]{10}';
    public static FIJO_VALID = '[0-9]{6,15}';
    public static ESPECIAL = '^[a-zA-Z0-5]*$';
    public static DIAS = '[0-9]{1,3}';
    // Configuración del editor
    public static CHECK_CONFIG = {
        fullPage: true,
        allowedContent: false,
        extraPlugins: 'divarea,pastefromword,inserthtmlfile,',
        skin: 'kama',
        forcePasteAsPlainText: true
    };

}
