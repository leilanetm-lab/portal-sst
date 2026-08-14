import "./GraficoSLA.css";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LabelList
} from "recharts";

function GraficoSLA({ dados = [] }) {

    const mediaAvaliacao =
        dados.length === 0
            ? 0
            : (
                dados.reduce(
                    (s,item)=>s+item.mediaAvaliacao,
                    0
                ) / dados.length
            ).toFixed(1);

    const mediaPGR =
        dados.length === 0
            ? 0
            : (
                dados.reduce(
                    (s,item)=>s+item.mediaPGR,
                    0
                ) / dados.length
            ).toFixed(1);

    const mediaPCMSO =
        dados.length === 0
            ? 0
            : (
                dados.reduce(
                    (s,item)=>s+item.mediaPCMSO,
                    0
                ) / dados.length
            ).toFixed(1);

    return(

        <div className="graficoSLA">

            <h2>⏱ Evolução Mensal do SLA</h2>

            <ResponsiveContainer
                width="100%"
                height={380}
            >

                <LineChart
    data={dados}
    margin={{
        top: 30,
        right: 45,
        left: 10,
        bottom: 20
    }}
>

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="mes"
                    />

                    <YAxis
                        domain={[0,100]}
                    />

                    <Tooltip/>

                    <Legend/>

                    <Line
    type="monotone"
    dataKey="avaliacao"
    name="Avaliação"
    stroke="#1565c0"
    strokeWidth={3}
    dot={{ r: 5 }}
>
    <LabelList
        position="top"
        offset={10}
        formatter={(v)=>`${v}%`}
    />
</Line>

                    <Line
    type="monotone"
    dataKey="pgr"
    name="PGR"
    stroke="#ff6b00"
    strokeWidth={3}
    strokeDasharray="8 5"
    dot={{ r: 5 }}
>
    <LabelList
        position="bottom"
        offset={12}
        formatter={(v)=>`${v}%`}
    />
</Line>

                    <Line
    type="monotone"
    dataKey="pcmso"
    name="PCMSO"
    stroke="#2e7d32"
    strokeWidth={3}
    dot={{ r: 5 }}
>
    <LabelList
        position="top"
        offset={12}
        formatter={(v)=>`${v}%`}
    />
</Line>

                </LineChart>

            </ResponsiveContainer>

            <div className="slaCards">

                <div className="slaCard">

                    <h3>Avaliação</h3>

                    <span>Meta</span>

                    <strong>4 dias</strong>

                    <small>

                        Tempo médio: {mediaAvaliacao} dias

                    </small>

                </div>

                <div className="slaCard">

                    <h3>PGR</h3>

                    <span>Meta</span>

                    <strong>7 dias</strong>

                    <small>

                        Tempo médio: {mediaPGR} dias

                    </small>

                </div>

                <div className="slaCard">

                    <h3>PCMSO</h3>

                    <span>Meta</span>

                    <strong>7 dias</strong>

                    <small>

                        Tempo médio: {mediaPCMSO} dias

                    </small>

                </div>

            </div>

        </div>

    );

}

export default GraficoSLA;