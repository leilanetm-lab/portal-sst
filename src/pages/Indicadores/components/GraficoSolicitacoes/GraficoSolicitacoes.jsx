import "./GraficoSolicitacoes.css";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    LabelList
} from "recharts";

function GraficoSolicitacoes({ dados }) {

    return (

        <div className="graficoCard">

            <h2>📋 Solicitações por Tipo</h2>

            <ResponsiveContainer
                width="100%"
                height={340}
            >

                <BarChart
                    data={dados}
                    layout="vertical"
                    margin={{
                        top: 20,
                        left: 60,
                        right: 30,
                        bottom: 20
                    }}
                >

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis
                        type="number"
                        allowDecimals={false}
                    />

                    <YAxis
                        type="category"
                        dataKey="tipo"
                        width={170}
                    />

                    <Tooltip/>

                    <Bar
                        dataKey="quantidade"
                        fill="#ff6b00"
                        radius={[0,8,8,0]}
                    >

                        <LabelList
                            dataKey="quantidade"
                            position="right"
                        />

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default GraficoSolicitacoes;