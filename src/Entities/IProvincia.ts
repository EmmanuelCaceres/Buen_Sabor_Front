import IPais from "./IPais";

export default interface IProvincia{
    id:number;
    baja:boolean;
    nombre:string;
    pais:IPais
}