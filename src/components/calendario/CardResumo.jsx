function CardResumo({

    titulo,

    valor,

    cor

}) {

    return (

        <div

            className="cardResumo"

            style={{

                borderTop:`5px solid ${cor}`

            }}

        >

            <div className="cardTitulo">

                {titulo}

            </div>

            <div className="cardValor">

                {valor}

            </div>

        </div>

    );

}

export default CardResumo;