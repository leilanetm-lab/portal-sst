import "./GraficoProdutividade.css";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LabelList
} from "recharts";

function GraficoProdutividade({ dados = {} }) {

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
       TRANSFORMA OS DADOS
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

                pgr:
                    Number(
                        valores?.pgr || 0
                    ),

                pcmso:
                    Number(
                        valores?.pcmso || 0
                    ),

                solicitacoes:
                    Number(
                        valores?.solicitacoes || 0
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

        <div className="graficoProdutividade">

            <h2>
                📈 Evolução da Produção
            </h2>

            <ResponsiveContainer
                width="100%"
                height={400}
            >

                <BarChart
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
                        PGR
                    =========================== */}

                    <Bar
                        dataKey="pgr"
                        fill="#1565c0"
                        name="PGR"
                        radius={[6, 6, 0, 0]}
                        barSize={24}
                    >

                        <LabelList
                            dataKey="pgr"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        PCMSO
                    =========================== */}

                    <Bar
                        dataKey="pcmso"
                        fill="#00a152"
                        name="PCMSO"
                        radius={[6, 6, 0, 0]}
                        barSize={24}
                    >

                        <LabelList
                            dataKey="pcmso"
                            position="top"
                        />

                    </Bar>

                    {/* ===========================
                        SOLICITAÇÕES
                    =========================== */}

                    <Bar
                        dataKey="solicitacoes"
                        fill="#ff6b00"
                        name="Solicitações"
                        radius={[6, 6, 0, 0]}
                        barSize={24}
                    >

                        <LabelList
                            dataKey="solicitacoes"
                            position="top"
                        />

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default GraficoProdutividade;