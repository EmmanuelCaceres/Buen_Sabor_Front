import IPais from "./IPais";

export default interface IProvincia{
    id:number;
    eliminado:boolean;
    nombre:string;
    pais:IPais
}