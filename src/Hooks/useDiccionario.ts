interface Translates{
    [key:string]:string;
}

const translates:Translates={
    fechaNacimiento:"Fecha de nacimiento",
    nombre:"Nombre",
    apellido:"Apellido",
    telefono:"Teléfono",
    imagenPersona:"Imagen de persona",
    usuario:"Usuario",
    sucursal:"Sucursal",
    stockMinimo:"Stock mínimo",
    precioVenta: "Precio de venta",
    denominacion: "Denominación",
    acciones: "Acciones",
    descripcion: "Descripción",
}

const useDiccionario = (clave:string)=>{
    return translates[clave] || clave;
}

export{useDiccionario}