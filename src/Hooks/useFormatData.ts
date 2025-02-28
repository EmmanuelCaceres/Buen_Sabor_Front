// Función para formatear valores de propiedades complejas
export const formatValue = (value: unknown): string => {
    if(typeof value == "object"){
        console.log(value);
    }
    return "";
    // if (Array.isArray(value)) {
    //     if (value.length === 0) return "No tiene";
    //     return value.map((item) => {
    //         if (typeof item === "object" && item !== null) {
    //             // return formatComplexValue(item); // Reutiliza lógica para objetos
    //         }
    //         return String(item);
    //     }).join(", ");
    // } else if (typeof value === "boolean") {
    //     return value ? "Sí" : "No";
    // } else if (value === null || value === undefined) {
    //     return "No tiene";
    // } else if (typeof value === "object" && value !== null) {
    //     // return formatComplexValue(value); // Formatear objetos complejos
    // }
    // return String(value);
};

// Función para formatear objetos complejos de forma inteligente
// const formatComplexValue = (value: ComplexValue): string => {
//     if ('Denominación' in value) return value.Denominación || "No tiene denominación";
//     if ('nombre' in value) return value.nombre || "No tiene nombre";
//     if ('denominacion' in value) return value.denominacion || "No tiene denominación";
//     if ('url' in value) return value.url || "No tiene imagen";
//     return JSON.stringify(value, null, 2); // Si no se reconoce la propiedad, lo formateamos como JSON
// };