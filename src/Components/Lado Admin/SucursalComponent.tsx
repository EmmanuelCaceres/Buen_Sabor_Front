import ISucursalDto from "../../Entities/ISucursalDto";

export default function SucursalComponent({sucursal}:{sucursal:ISucursalDto}){
    return(
        <div className="cardEmpresa">
            {sucursal.nombre}
        </div>
    )
}