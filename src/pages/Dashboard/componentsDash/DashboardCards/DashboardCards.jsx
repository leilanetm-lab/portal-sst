import "./DashboardCards.css";

function DashboardCards({ cards }) {

    const indicadores = [

        {

            titulo: "Solicitações",

            valor: cards?.solicitacoes ?? 0,

            descricao: "Em andamento",

            icone: "📄"

        },

        {

            titulo: "Biblioteca",

            valor: cards?.documentos ?? 0,

            descricao: "Documentos publicados",

            icone: "📚"

        },

        {

            titulo: "Vencimentos",

            valor: cards?.vencimentos ?? 0,

            descricao: "Próximos 60 dias",

            icone: "⚠️"

        },

        {

            titulo: "SLA Médio",

            valor: cards?.sla ?? "0 dias",

            descricao: "Tempo médio",

            icone: "⏱️"

        }

    ];

    return (

        <section className="dashboardCards">

            {

                indicadores.map((item,index)=>(

                    <div

                        key={index}

                        className="cardDashboard"

                    >

                        <div className="cardTopo">

                            <span className="icone">

                                {item.icone}

                            </span>

                        </div>

                        <h3>

                            {item.titulo}

                        </h3>

                        <h1>

                            {item.valor}

                        </h1>

                        <p>

                            {item.descricao}

                        </p>

                    </div>

                ))

            }

        </section>

    );

}

export default DashboardCards;