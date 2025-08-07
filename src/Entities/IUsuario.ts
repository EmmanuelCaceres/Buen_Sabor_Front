import IRol from "./IRol"

export default interface IUsuario{
    id?: number,
    baja?:boolean,
    auth0Id?:string,
    username?:string,
    email:string,
    rol?: IRol;
}