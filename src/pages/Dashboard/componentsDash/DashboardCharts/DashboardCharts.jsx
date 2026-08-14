import "./DashboardCharts.css";

import PieChartSST from "../../../../components/charts/PieChartSST/PieChartSST";

function DashboardCharts({

    graficoTipos

}){

    const dadosSolicitacoes = Object.entries(

        graficoTipos || {}

    ).map(([name,valor])=>({

        name,

        valor

    }));

    return(

        <div className="dashboardCharts">

            <PieChartSST

                titulo="Solicitações por Tipo"

                dados={dadosSolicitacoes}

            />

        </div>

    );

}

export default DashboardCharts;