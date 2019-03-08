

export class UrlUtils {


    /**
 * Función que permite recuperar un parametro de url
 *
 * @author Milton Sanchez
 * @param name
 */
    public static getParam(name) {
        const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) {
            return 0;
        }
        return results[1] || 0;
    }

    /**
     * @author Milton Sanchez
     * @param url
     */
    public static navigateURL(url: string) {
        if (url !== undefined) {
            window.location.href = url;
        }
    }

}
