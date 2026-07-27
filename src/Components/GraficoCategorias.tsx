import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ICategoriaDistribucion } from "../Functions/Services/EstadisticaService";

const COLORS = [
    '#4e73df', // Azul corporativo
    '#1cc88a', // Verde éxito
    '#36b9cc', // Celeste / Cian
    '#f6c23e', // Amarillo / Alerta
    '#e74a3b'  // Rojo / Peligro
];

export default function GraficoCategorias({
  data,
}: {
  data: ICategoriaDistribucion[];
}) {
  return (
    <div
      className="card p-4 shadow-sm h-100"
      style={{ borderRadius: "15px", backgroundColor: "#fff" }}
    >
      <h4 className="mb-4" style={{ color: "#2c3e50", fontWeight: 600 }}>
        Top 5 Ventas por Categoría
      </h4>
      <div
        style={{ width: "100%", height: 300 }}
        className="d-flex justify-content-center align-items-center"
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90} // Mantenemos el radio exterior
              fill="#8884d8"
              dataKey="cantidad"
              nameKey="categoria"
              label // Mantiene los numeritos afuera indicando la cantidad
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, "Unidades"]} />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
