import "./IndicadoresCards.css";

function IndicadoresCards({
    cards,
    resumoTecnico
}) {

    const lista = [

        {
            titulo: "Solicitações",
            valor: cards?.solicitacoes || 0,
            icone: "📋",
            cor: "#ff6b00"
        },

        {
            titulo: "PGR",
            valor: cards?.pgr || 0,
            icone: "📘",
            cor: "#1565c0"
        },

        {
            titulo: "PCMSO",
            valor: cards?.pcmso || 0,
            icone: "🩺",
            cor: "#00a152"
        },

        {
            titulo: "GHE",
            valor: resumoTecnico?.totalGHE || 0,
            icone: "👷",
            cor: "#7b1fa2"
        },

        {
            titulo: "Riscos",
            valor: resumoTecnico?.totalRiscos || 0,
            icone: "⚠️",
            cor: "#ef6c00"
        },

        {
            titulo: "SLA",
            valor: `${cards?.sla || 0} dias`,
            icone: "⏱️",
            cor: "#00897b"
        },

        {
            titulo: "Horas Técnicas",
            valor: `${resumoTecnico?.horasEstimadas || 0} h`,
            icone: "📈",
            cor: "#3949ab"
        },

        {
            titulo: "UT",
            valor: cards?.ut || 0,
            icone: "🏭",
            cor: "#6d4c41"
        }

    ];

    return (

        <div className="indicadoresCards">

            {lista.map((card, index) => (

                <div
                    key={index}
                    className="cardIndicador"
                    style={{
                        borderTop:
                            `5px solid ${card.cor}`
                    }}
                >

                    <div className="iconeCard">
                        {card.icone}
                    </div>

                    <h2>
                        {card.valor}
                    </h2>

                    <span>
                        {card.titulo}
                    </span>

                </div>

            ))}

        </div>

    );
}

export default IndicadoresCards;