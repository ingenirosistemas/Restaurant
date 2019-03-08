export class Usuario {

    identificacion: string;
    primernombre: string;
    primerapellido: string;
    login: string;
    token: string;
    idSede: number;

    constructor(
        identificacion: string,
        primernombre: string,
        primerapellido: string,
        login: string,
        token: string,
        idSede: number,
    ) {
        this.identificacion = identificacion;
        this.primernombre = primernombre;
        this.primerapellido = primerapellido;
        this.login = login;
        this.token = token;
        this.idSede = idSede;
    }

}
