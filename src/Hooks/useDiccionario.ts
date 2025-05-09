interface Translates{
    [key:string]:string;
}

const translates:Translates={
    fechaNacimiento:"Fecha de nacimiento",
    nombre:"Nombre",
    apellido:"Apellido",
    telefono:"Teléfono",
    imagenPersona:"Imagen",
    usuario:"Usuario",
    sucursal:"Sucursal",
    stockMinimo:"Stock mínimo",
    precioVenta: "Precio de venta",
    denominacion: "Denominación",
    acciones: "Acciones",
    descripcion: "Descripción",
    id: "ID",
    stockActual: "Stock actual",
    stockMaximo: "Stock maximo",
    unidadMedida: "Unidad de medida",
    categoria: "Categoria",
    imagenes: "Imagen",
    baja: "Dado de baja", 
    precioCompra: "Precio de compra",
    esParaElaborar: "¿Es para elaborar?",
    tiempoEstimadoMinutos: "Tiempo estimado en minutos",
    articuloManufacturadoDetalles:"Ingredientes",
    imagen:"Imagen"
}

const useDiccionario = (clave:string)=>{
    return translates[clave] || clave;
}

// Hook correcto
const useDiccionarioEnum = () => {
    const translatesEnum: Translates = {
        HappyHour: "HAPPY_HOUR",
        Descuento: "PROMOCION",
    };

    return (clave: string) => translatesEnum[clave] || clave;
};


export{useDiccionario,useDiccionarioEnum}