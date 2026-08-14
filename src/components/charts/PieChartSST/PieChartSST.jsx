import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from "recharts";

import { pieColors } from "../ChartTheme";
import "./PieChartSST.css";

function PieChartSST({ titulo, dados }) {

    const total = dados.reduce((soma, item) => soma + item.valor, 0);

    const CustomTooltip = ({ active, payload }) => {

        if (!active || !payload?.length) return null;

        const item = payload[0];
        const percentual = ((item.value / total) * 100).toFixed(1);

        return (
            <div className="tooltipChart">
                <strong>{item.name}</strong>
                <br />
                {item.value} solicitações
                <br />
                {percentual}%
            </div>
        );

    };

    return (

        <div className="pieChartCard">

            <div className="pieChartHeader">

                <h2>📊 {titulo}</h2>

                <span>Total: {total} solicitações</span>

            </div>

            <div className="pieBody">

                <div className="pieWrapper">

                    <ResponsiveContainer width="100%" height={360}>

                        <PieChart>

                            <Pie

                                data={dados}

                                dataKey="valor"

                                nameKey="name"

                                cx="50%"

                                cy="50%"

                                outerRadius={135}

                            >

                                {

                                    dados.map((item, index) => (

                                        <Cell

                                            key={index}

                                            fill={pieColors[index % pieColors.length]}

                                        />

                                    ))

                                }

                            </Pie>

                            <Tooltip content={<CustomTooltip />} />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                <div className="pieLegenda">

                    {

                        dados.map((item, index) => {

                            const percentual = ((item.valor / total) * 100).toFixed(0);

                            return (

                                <div
                                    key={index}
                                    className="linhaLegenda"
                                >

                                    <div className="legendaNome">

                                        <span

                                            className="bolinha"

                                            style={{
                                                background: pieColors[index]
                                            }}

                                        />

                                        {item.name}

                                    </div>

                                    <strong>

                                        {item.valor} ({percentual}%)

                                    </strong>

                                </div>

                            );

                        })

                    }

                </div>

            </div>

        </div>

    );

}

export default PieChartSST;