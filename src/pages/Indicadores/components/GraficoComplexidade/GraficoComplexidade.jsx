import "./GraficoComplexidade.css";

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

function GraficoComplexidade({
    resumo = {},
    dados = {}
}) {

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
       DADOS MENSAIS
    =========================== */

    const dadosGrafico = Object.entries(dados || {})
        .map(([mes, valores]) => {

            const mesNormalizado = mes
                .toLowerCase()
                .replace(".", "")
                .trim();

            const ghe =
                Number(valores?.ghe || 0);

            const riscos =
                Number(valores?.riscos || 0);

            const indice =
                ghe === 0
                    ? 0
                    : Number(
                        (
                            riscos / ghe
                        ).toFixed(1)
                    );

            return {

                mes: mesNormalizado,

                nomeMes:
                    nomesMeses[mesNormalizado] ||
                    mes,

                ghe,

                riscos,

                indice

            };

        })
        .sort((a, b) => {

            return (
                ordemMeses.indexOf(a.mes) -
                ordemMeses.indexOf(b.mes)
            );

        });

    /* ===========================
       MÉDIA RISCOS / GHE
    =========================== */

    const mediaComplexidade =
        dadosGrafico.length === 0
            ? "0,0"
            : (

                dadosGrafico.reduce(
                    (soma, item) =>
                        soma + item.indice,
                    0
                ) / dadosGrafico.length

            ).toFixed(1).replace(".", ",");


    /* ===========================
       MAIOR COMPLEXIDADE
    =========================== */

    const maiorComplexidade =
        dadosGrafico.length === 0
            ? null
            : dadosGrafico.reduce(
                (maior, item) =>
                    item.indice > maior.indice
                        ? item
                        : maior,
                dadosGrafico[0]
            );


    /* ===========================
       MAIOR Nº DE RISCOS
    =========================== */

    const maiorRiscos =
        dadosGrafico.length === 0
            ? 0
            : Math.max(
                ...dadosGrafico.map(
                    item => item.riscos
                )
            );


    /* ===========================
       TOTAL DE GHE
    =========================== */

    const totalGHE =
        resumo.totalGHE ??
        dadosGrafico.reduce(
            (soma, item) =>
                soma + item.ghe,
            0
        );


    return (

        <div className="graficoComplexidade">

            <h2>
                🧠 Complexidade Técnica Mensal
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
                        GHE
                    =========================== */}

                    <Bar
                        dataKey="ghe"
                        fill="#1565c0"
                        name="GHE"
                        radius={[6, 6, 0, 0]}
                        barSize={24}
                    >

                        <LabelList
                            dataKey="ghe"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        RISCOS
                    =========================== */}

                    <Bar
                        dataKey="riscos"
                        fill="#ff6b00"
                        name="Riscos"
                        radius={[6, 6, 0, 0]}
                        barSize={24}
                    >

                        <LabelList
                            dataKey="riscos"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        ÍNDICE
                    =========================== */}

                    <Line
                        type="monotone"
                        dataKey="indice"
                        name="Riscos / GHE"
                        stroke="#2e7d32"
                        strokeWidth={4}
                        dot={{ r: 6 }}
                    >

                        <LabelList
                            dataKey="indice"
                            position="top"
                            offset={8}
                        />

                    </Line>

                </ComposedChart>

            </ResponsiveContainer>

            {/* ===========================
                CARDS
            =========================== */}

            <div className="complexidadeCards">

                <div className="complexidadeCard">

                    <span>
                        Média de Riscos / GHE
                    </span>

                    <strong>
                        {mediaComplexidade}
                    </strong>

                </div>

                <div className="complexidadeCard">

                    <span>
                        Maior Complexidade
                    </span>

                    <strong>
                        {maiorComplexidade
                            ? maiorComplexidade.nomeMes
                            : "-"
                        }
                    </strong>

                </div>

                <div className="complexidadeCard">

                    <span>
                        Maior Nº de Riscos
                    </span>

                    <strong>
                        {maiorRiscos}
                    </strong>

                </div>

                <div className="complexidadeCard">

                    <span>
                        Total de GHE
                    </span>

                    <strong>
                        {totalGHE}
                    </strong>

                </div>

            </div>

        </div>

    );

}

export default GraficoComplexidade;