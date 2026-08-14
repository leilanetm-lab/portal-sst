import "./TimelineWorkflow.css";

function TimelineWorkflow({ etapa = 1 }) {

    const etapas = [
        "Solicitação",
        "Análise Técnica",
        "Elaboração PGR",
        "Elaboração PCMSO",
        "Concluído"
    ];

    return (

        <div className="timelineWorkflow">

            {etapas.map((nome, index) => (

                <div className="itemWorkflow" key={index}>

                    <div
                        className={`passoWorkflow ${etapa >= index + 1 ? "ativo" : ""}`}
                    >

                        <div className="iconeWorkflow">

                            {etapa > index + 1 ? "✓" : index + 1}

                        </div>

                        <span>{nome}</span>

                    </div>

                    {index < etapas.length - 1 && (

                        <div
                            className={`linhaWorkflow ${etapa > index + 1 ? "ativa" : ""}`}
                        />

                    )}

                </div>

            ))}

        </div>

    );

}

export default TimelineWorkflow;