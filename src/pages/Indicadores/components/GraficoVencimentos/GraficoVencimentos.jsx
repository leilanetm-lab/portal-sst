import "./GraficoVencimentos.css";

import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LabelList
} from "recharts";

function GraficoVencimentos({ dados = {} }) {

    /* ===========================
       ORDEM DOS MESES
    =========================== */

    const ordemMeses = [
        "jan",
        "fev",
        "mar",
        "abr",
        "mai",
        "jun",
        "jul",
        "ago",
        "set",
        "out",
        "nov",
        "dez"
    ];

    const nomesMeses = {
        jan: "Jan",
        fev: "Fev",
        mar: "Mar",
        abr: "Abr",
        mai: "Mai",
        jun: "Jun",
        jul: "Jul",
        ago: "Ago",
        set: "Set",
        out: "Out",
        nov: "Nov",
        dez: "Dez"
    };

    /* ===========================
       TRANSFORMA OBJETO EM ARRAY
    =========================== */

    const dadosGrafico = Object.entries(dados || {})
        .map(([mes, valores]) => {

            const mesNormalizado = mes
                .toLowerCase()
                .replace(".", "")
                .trim();

            return {

                mes: mesNormalizado,

                nomeMes:
                    nomesMeses[mesNormalizado] ||
                    mes,

                proximos:
                    Number(
                        valores?.proximos || 0
                    ),

                renovados:
                    Number(
                        valores?.renovados || 0
                    ),

                vencidos:
                    Number(
                        valores?.vencidos || 0
                    )

            };

        })
        .sort((a, b) => {

            return (
                ordemMeses.indexOf(a.mes) -
                ordemMeses.indexOf(b.mes)
            );

        });

    return (

        <div className="graficoVencimentos">

            <h2>
                📅 Evolução dos Vencimentos
            </h2>

            <ResponsiveContainer
                width="100%"
                height={400}
            >

                <ComposedChart
                    data={dadosGrafico}
                    margin={{
                        top: 30,
                        right: 30,
                        left: 10,
                        bottom: 20
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="nomeMes"
                    />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    {/* ===========================
                        PRÓXIMOS
                    =========================== */}

                    <Bar
                        dataKey="proximos"
                        name="Próximos"
                        fill="#ffc107"
                        radius={[6, 6, 0, 0]}
                        barSize={28}
                    >

                        <LabelList
                            dataKey="proximos"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        RENOVADOS
                    =========================== */}

                    <Bar
                        dataKey="renovados"
                        name="Renovados"
                        fill="#2e7d32"
                        radius={[6, 6, 0, 0]}
                        barSize={28}
                    >

                        <LabelList
                            dataKey="renovados"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        VENCIDOS
                    =========================== */}

                    <Line
                        type="monotone"
                        dataKey="vencidos"
                        name="Vencidos"
                        stroke="#dc3545"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                    >

                        <LabelList
                            dataKey="vencidos"
                            position="top"
                            offset={8}
                        />

                    </Line>

                </ComposedChart>

            </ResponsiveContainer>

        </div>

    );

}

export default GraficoVencimentos;