import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IIngresos } from '../Functions/Services/EstadisticaService'; // Ajustá la ruta si hace falta

export default function GraficoIngresos({ data }: { data: IIngresos[] }) {
    return (
        <div className="card p-4 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#fff' }}>
            {/* Título modificado con el año como Badge de Bootstrap */}
            <div className="d-flex align-items-center mb-4">
                <h4 className="m-0" style={{ color: '#2c3e50', fontWeight: 600 }}>
                    Evolución de Ingresos
                </h4>
                <span className="badge bg-primary-subtle text-primary ms-2 px-2.5 py-1" style={{ fontSize: '0.85rem', borderRadius: '6px' }}>
                    Año 2026
                </span>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="periodo" tick={{ fill: '#6c757d', fontSize: 12 }} interval={0}
                            angle={-15} textAnchor="end"/>
                        <YAxis tick={{ fill: '#6c757d', fontSize: 12 }} unit="$" />
                        <Tooltip formatter={(value) => [`$${value}`, 'Ingresos']} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="ingresos" 
                            stroke="#4e73df" 
                            strokeWidth={3} 
                            activeDot={{ r: 8 }} 
                            name="Ventas"
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}