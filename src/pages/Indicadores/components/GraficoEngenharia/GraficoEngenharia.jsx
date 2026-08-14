import "./GraficoEngenharia.css";

import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    Line,
    LabelList
} from "recharts";

function GraficoEngenharia({ dados = {} }) {

    /* ===========================
       CONVERTE OS DADOS DO SERVICE
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

                ghe:
                    Number(valores?.ghe || 0),

                riscos:
                    Number(valores?.riscos || 0),

                medidas:
                    Number(valores?.medidas || 0)

            };

        })
        .sort((a, b) => {

            return (
                ordemMeses.indexOf(a.mes) -
                ordemMeses.indexOf(b.mes)
            );

        });

    /* ===========================
       TOTAIS
    =========================== */

    const totalGHE = dadosGrafico.reduce(

        (soma, item) =>

            soma + item.ghe,

        0

    );

    const totalRiscos = dadosGrafico.reduce(

        (soma, item) =>

            soma + item.riscos,

        0

    );

    const totalMedidas = dadosGrafico.reduce(

        (soma, item) =>

            soma + item.medidas,

        0

    );

    const media =

        totalGHE === 0

            ? "0.0"

            : (

                totalRiscos /

                totalGHE

            ).toFixed(1);

    return (

        <div className="graficoEngenharia">

            <h2>
                👷 Evolução Mensal da Engenharia
            </h2>

            <ResponsiveContainer
                width="100%"
                height={420}
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
                        RISCOS
                    =========================== */}

                    <Bar
                        dataKey="riscos"
                        name="Riscos"
                        fill="#ff6b00"
                        radius={[6, 6, 0, 0]}
                        barSize={24}
                    >

                        <LabelList
                            dataKey="riscos"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        MEDIDAS
                    =========================== */}

                    <Bar
                        dataKey="medidas"
                        name="Medidas"
                        fill="#2e7d32"
                        radius={[6, 6, 0, 0]}
                        barSize={24}
                    >

                        <LabelList
                            dataKey="medidas"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        GHE
                    =========================== */}

                    <Line
                        type="monotone"
                        dataKey="ghe"
                        name="GHE"
                        stroke="#1565c0"
                        strokeWidth={4}
                        dot={{ r: 6 }}
                    >

                        <LabelList
                            dataKey="ghe"
                            position="top"
                            offset={8}
                        />

                    </Line>

                </ComposedChart>

            </ResponsiveContainer>

            {/* ===========================
                RESUMO
            =========================== */}

            <div className="cardsResumo">

                <div className="cardResumo">

                    <span>
                        Total GHE
                    </span>

                    <strong>
                        {totalGHE}
                    </strong>

                </div>

                <div className="cardResumo">

                    <span>
                        Total Riscos
                    </span>

                    <strong>
                        {totalRiscos}
                    </strong>

                </div>

                <div className="cardResumo">

                    <span>
                        Total Medidas
                    </span>

                    <strong>
                        {totalMedidas}
                    </strong>

                </div>

                <div className="cardResumo">

                    <span>
                        Média Riscos / GHE
                    </span>

                    <strong>
                        {media}
                    </strong>

                </div>

            </div>

        </div>

    );

}

export default GraficoEngenharia;