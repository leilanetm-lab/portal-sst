import "./GraficoProducaoTecnica.css";

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

function GraficoProducaoTecnica({
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

            const riscos =
                Number(valores?.riscos || 0);

            const horas =
                Number(
                    (
                        riscos * 7 / 60
                    ).toFixed(1)
                );

            return {

                mes: mesNormalizado,

                nomeMes:
                    nomesMeses[mesNormalizado] ||
                    mes,

                riscos,

                horas

            };

        })
        .sort((a, b) => {

            return (
                ordemMeses.indexOf(a.mes) -
                ordemMeses.indexOf(b.mes)
            );

        });

    /* ===========================
       TOTAL DE RISCOS
    =========================== */

    const totalRiscos =
        dadosGrafico.reduce(

            (soma, item) =>
                soma + item.riscos,

            0

        );


    /* ===========================
       HORAS TÉCNICAS
    =========================== */

    const horasTecnicas =
        Number(

            (
                totalRiscos * 7 / 60

            ).toFixed(1)

        );


    /* ===========================
       MÉDIA POR DOCUMENTO
    =========================== */

    const totalDocumentos =
        resumo.totalDocumentos || 0;

    const mediaPorDocumento =
    totalDocumentos === 0
        ? 0
        : Number(
            (
                (
                    totalRiscos * 7 +
                    totalDocumentos * 30
                ) /
                60 /
                totalDocumentos
            ).toFixed(1)
        );


    return (

        <div className="graficoTecnico">

            <h2>
                🕒 Produção Técnica da Engenharia
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
                        fill="#ff6b00"
                        name="Riscos Tratados"
                        radius={[6, 6, 0, 0]}
                        barSize={28}
                    >

                        <LabelList
                            dataKey="riscos"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        HORAS TÉCNICAS
                    =========================== */}

                    <Line
                        type="monotone"
                        dataKey="horas"
                        stroke="#1565c0"
                        strokeWidth={4}
                        name="Horas Técnicas"
                        dot={{ r: 6 }}
                    >

                        <LabelList
                            dataKey="horas"
                            position="top"
                            offset={8}
                        />

                    </Line>

                </ComposedChart>

            </ResponsiveContainer>

            {/* ===========================
                CARDS
            =========================== */}

            <div className="cardsTecnicos">

                <div className="cardTecnico">

                    <span>
                        Total de Riscos
                    </span>

                    <strong>
                        {totalRiscos.toLocaleString(
                            "pt-BR"
                        )}
                    </strong>

                </div>

                <div className="cardTecnico">

                    <span>
                        Horas Técnicas
                    </span>

                    <strong>
                        {horasTecnicas} h
                    </strong>

                </div>

                <div className="cardTecnico">

                    <span>
                        Média por Documento
                    </span>

                    <strong>
                        {mediaPorDocumento} h
                    </strong>

                </div>

                <div className="cardTecnico">

                    <span>
                        Tempo por Risco
                    </span>

                    <strong>
                        7 min
                    </strong>

                </div>

            </div>

        </div>

    );

}

export default GraficoProducaoTecnica;