// Función para formatear valores de propiedades complejas
export const formatValue = (value: unknown): string => {
    if(typeof value == "object"){
        console.log(value);
    }
    return "";
};

// Función para formatear objetos complejos de forma inteligente
// const formatComplexValue = (value: ComplexValue): string => {
//     if ('Denominación' in value) return value.Denominación || "No tiene denominación";
//     if ('nombre' in value) return value.nombre || "No tiene nombre";
//     if ('denominacion' in value) return value.denominacion || "No tiene denominación";
//     if ('url' in value) return value.url || "No tiene imagen";
//     return JSON.stringify(value, null, 2); // Si no se reconoce la propiedad, lo formateamos como JSON
// };