function EventoCalendario({

    evento,

    onClick

}) {

    function corEvento() {

        switch (evento.tipo) {

            case "analise":

                return "#2196F3";

            case "pgr":

                return "#43A047";

            case "pcmso":

                return "#8E24AA";

            case "alerta":

                return "#FB8C00";

            case "revisao":

                return "#E53935";

            default:

                return "#607D8B";

        }

    }

    return (

        <div

            className="eventoCalendario"

            style={{

                background:corEvento()

            }}

            onClick={onClick}

        >

            {evento.titulo}

        </div>

    );

}

export default EventoCalendario;