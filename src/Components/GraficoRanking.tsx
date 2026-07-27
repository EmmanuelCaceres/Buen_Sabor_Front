import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { IRankingProducto } from '../Functions/Services/EstadisticaService';

interface GraficoProps {
    data: IRankingProducto[];
}

// Colores copados para las barras del gráfico
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function GraficoRanking({ data }: GraficoProps) {
    return (
        <div className="card p-4 shadow-sm" style={{ borderRadius: '15px', backgroundColor: '#fff' }}>
            <h4 className="mb-4" style={{ color: '#2c3e50', fontWeight: 600 }}>
                Top 5 Productos Más Vendidos
            </h4>
            <div style={{ width: '100%', height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis 
                            dataKey="denominacion"
                            interval={0}
                            angle={-15} textAnchor="end"
                            tick={{ fill: '#6c757d', fontSize: 12 }}
                            axisLine={{ stroke: '#dee2e6' }}
                        />
                        <YAxis 
                            tick={{ fill: '#6c757d', fontSize: 12 }}
                            axisLine={{ stroke: '#dee2e6' }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6' }}
                            itemStyle={{ color: '#2c3e50', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="cantidad" radius={[8, 8, 0, 0]} maxBarSize={60}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}