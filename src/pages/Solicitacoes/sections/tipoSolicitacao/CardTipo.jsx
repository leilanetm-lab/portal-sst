import "./TipoSolicitacao.css";

function CardTipo({

    titulo,

    descricao,

    ajuda,

    selecionado,

    onClick

}) {

    return (

        <div

            className={`cardTipo ${selecionado ? "ativo" : ""}`}

            onClick={onClick}

        >

            <div className="tituloCard">

                <h3>{titulo}</h3>

                <span
                    className="tooltip"

                    onClick={(e)=>e.stopPropagation()}
                >

                    ⓘ

                    <span className="tooltipText">

                        {ajuda}

                    </span>

                </span>

            </div>

            <p>{descricao}</p>

        </div>

    );

}

export default CardTipo;