import "./GraficoSaving.css";

import { useEffect, useState } from "react";

import { calcularSaving } from "../services/savingService";

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


function GraficoSaving() {

    const [resumo, setResumo] = useState({

        mensal: [],

        custoInterno: 0,

        valorExterno: 0,

        savingTotal: 0,

        percentual: 0,

        documentos: 0,

        economiaMedia: 0

    });


    const [loading, setLoading] = useState(true);


    /* ===========================
       CARREGAR SAVING
    =========================== */

    useEffect(() => {

        async function carregarSaving() {

            try {

                setLoading(true);

                const dados =
                    await calcularSaving();

                setResumo(dados);

            } catch (erro) {

                console.error(
                    "Erro ao carregar Saving:",
                    erro
                );

            } finally {

                setLoading(false);

            }

        }


        carregarSaving();

    }, []);


    /* ===========================
       LOADING
    =========================== */

    if(loading) {

        return (

            <div className="graficoSaving">

                <h2>
                    💰 Evolução Mensal do Saving
                </h2>

                <p>
                    Carregando dados do Saving...
                </p>

            </div>

        );

    }


    return (

        <div className="graficoSaving">

            <h2>
                💰 Evolução Mensal do Saving
            </h2>


            <ResponsiveContainer
                width="100%"
                height={420}
            >

                <ComposedChart
                    data={resumo.mensal}
                    margin={{
                        top: 35,
                        right: 30,
                        left: 20,
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
                        yAxisId="left"
                        tickFormatter={(v) =>
                            `R$ ${(v / 1000).toFixed(0)}k`
                        }
                    />


                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        unit="%"
                    />


                    <Tooltip
    formatter={(value, name) => {

        if(
            name ===
            "Eficiência Financeira"
        ) {

            return [
                `${value}%`,
                name
            ];

        }

        return [

            `R$ ${Number(
                value
            ).toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`,

            name

        ];

    }}
/>


                    <Legend />


                    {/* ===========================
                        CUSTO INTERNO
                    =========================== */}

                    <Bar
                        yAxisId="left"
                        dataKey="interno"
                        name="Custo Interno"
                        fill="#e53935"
                        radius={[
                            6,
                            6,
                            0,
                            0
                        ]}
                        barSize={22}
                    >

                        <LabelList
                            dataKey="interno"
                            position="top"
                            formatter={(v) =>
                                `R$ ${(v / 1000).toFixed(1)}k`
                            }
                        />

                    </Bar>


                    {/* ===========================
                        VALOR MERCADO
                    =========================== */}

                    <Bar
                        yAxisId="left"
                        dataKey="externo"
                        name="Valor Mercado"
                        fill="#1976d2"
                        radius={[
                            6,
                            6,
                            0,
                            0
                        ]}
                        barSize={22}
                    >

                        <LabelList
                            dataKey="externo"
                            position="top"
                            formatter={(v) =>
                                `R$ ${(v / 1000).toFixed(1)}k`
                            }
                        />

                    </Bar>


                    {/* ===========================
                        SAVING
                    =========================== */}

                    <Bar
                        yAxisId="left"
                        dataKey="saving"
                        name="Saving"
                        fill="#2e7d32"
                        radius={[
                            6,
                            6,
                            0,
                            0
                        ]}
                        barSize={22}
                    >

                        <LabelList
                            dataKey="saving"
                            position="top"
                            formatter={(v) =>
                                `R$ ${(v / 1000).toFixed(1)}k`
                            }
                        />

                    </Bar>


                    {/* ===========================
                        EFICIÊNCIA
                    =========================== */}

                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="eficiencia"
                        name="Eficiência Financeira"
                        stroke="#ff9800"
                        strokeWidth={4}
                        dot={{
                            r: 6
                        }}
                    >

                        <LabelList
                            dataKey="eficiencia"
                            position="top"
                            offset={10}
                            formatter={(v) =>
                                `${v}%`
                            }
                        />

                    </Line>


                </ComposedChart>

            </ResponsiveContainer>


            {/* ===========================
                CARDS
            =========================== */}

            <div className="savingCards">


                <div className="savingCard">

                    <span>
                        Custo Interno
                    </span>

                    <strong>

                        R${" "}

                        {Number(
                            resumo.custoInterno
                        ).toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </strong>

                </div>


                <div className="savingCard">

                    <span>
                        Valor Mercado
                    </span>

                    <strong>

                        R${" "}

                        {Number(
                            resumo.valorExterno
                        ).toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </strong>

                </div>


                <div className="savingCard">

                    <span>
                        Saving Total
                    </span>

                    <strong>

                        R${" "}

                        {Number(
                            resumo.savingTotal
                        ).toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}

                    </strong>

                </div>


                <div className="savingCard">

                    <span>
                        Eficiência Financeira
                    </span>

                    <strong>

                        {resumo.percentual}%

                    </strong>

                </div>


            </div>


            {/* ===========================
                MEMÓRIA DE CÁLCULO
            =========================== */}

            <div className="memoriaCalculo">

                <h3>
                    📘 Memória de Cálculo
                </h3>

                <ul>

                    <li>

                        <strong>
                            Custo Interno:
                        </strong>

                        Rateio mensal de R$ 5.682,00
                        para TST Jr. (PGR) e
                        R$ 5.682,00 para Técnico
                        de Enfermagem (PCMSO),
                        proporcional ao esforço
                        relativo das solicitações.

                    </li>


                    <li>

                        <strong>
                            Complexidade:
                        </strong>

                        GERDAU, ANGLO, SAMARCO
                        e NOVO NORDISK recebem
                        multiplicador interno
                        de complexidade de 1,60.

                    </li>


                    <li>

                        <strong>
                            Valor de Mercado:
                        </strong>

                        Benchmark estimado por
                        modalidade e complexidade,
                        sem representar cotação
                        formal de fornecedor.

                    </li>


                    <li>

                        <strong>
                            Saving:
                        </strong>

                        Valor de Mercado
                        − Custo Interno.

                    </li>


                    <li>

                        <strong>
                            Eficiência Financeira:
                        </strong>

                        (Saving ÷ Valor de Mercado)
                        × 100.

                    </li>

                </ul>

            </div>


        </div>

    );

}


export default GraficoSaving;