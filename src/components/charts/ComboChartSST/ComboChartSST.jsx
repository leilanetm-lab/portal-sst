import "./ComboChartSST.css";

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

function ComboChartSST({

    titulo,

    dados,

    barra1,

    barra2,

    linha,

    linhaSecundaria,

    linhaSecundariaPontilhada = false

}){

    return(

        <div className="comboChart">

            <h2>

                {titulo}

            </h2>

            <ResponsiveContainer

                width="100%"

                height={360}

            >

                <ComposedChart
    data={dados}
    margin={{
        top: 20,
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
    padding={{
        left: 25,
        right: 25
    }}
/>

                    <YAxis
    yAxisId="left"
    allowDecimals={false}
    domain={[0, "dataMax + 2"]}
/>

                    <YAxis

                        yAxisId="right"

                        orientation="right"

                        unit="%"

                    />

                    <Tooltip/>

                    <Legend/>

                    <Bar

    yAxisId="left"

    dataKey={barra1}

    barSize={22}

    fill="#d9d9d9"

    radius={[6,6,0,0]}

>

    <LabelList

        dataKey={barra1}

        position="top"

        formatter={(v)=>v===0?"":v}

        fill="#777"

        fontSize={12}

    />

</Bar>    

                    <Bar

    yAxisId="left"

    dataKey={barra2}

    barSize={22}

    fill="#ff6b00"

    radius={[6,6,0,0]}

>

    <LabelList

        dataKey={barra2}

        position="top"

        formatter={(v)=>v===0?"":v}

        fill="#ff6b00"

        fontSize={12}

    />

</Bar>

                    <Line

    yAxisId="right"

    type="monotone"

    dataKey={linha}

    stroke="#1565c0"

    strokeWidth={3}

    dot={{r:5}}

    name={linha}

>

    <LabelList

        dataKey={linha}

        position="top"

        formatter={(v)=>v===0?"":`${v}%`}

        fill="#1565c0"

        fontSize={12}

    />

</Line>

                    {

                        linhaSecundaria && (

                            <Line

                                yAxisId="left"

                                type="monotone"

                                dataKey={linhaSecundaria}

                                stroke="#2e7d32"

                                strokeWidth={3}

                                strokeDasharray={

                                    linhaSecundariaPontilhada

                                    ?

                                    "8 6"

                                    :

                                    ""

                                }

                                dot={{r:5}}

                                name={linhaSecundaria}

                            />

                        )

                    }

                </ComposedChart>

            </ResponsiveContainer>

        </div>

    );

}

export default ComboChartSST;