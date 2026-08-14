function AgendaHoje({

    eventos,

    onSelecionarEvento

}){

    const hoje = new Date()

        .toISOString()

        .split("T")[0];

    const eventosHoje =

        eventos.filter(

            evento=>

                evento.data===hoje

        );

    function corTitulo(tipo){

        switch(tipo){

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

    return(

        <div className="agendaHoje">

            <h2>

                📅 Agenda de Hoje

            </h2>

            <p className="subtituloAgenda">

                {

                    new Date()

                    .toLocaleDateString(

                        "pt-BR"

                    )

                }

            </p>

            <div className="resumoHoje">

                <div className="cardResumoHoje">

                    <span>

                        Atividades

                    </span>

                    <strong>

                        {eventosHoje.length}

                    </strong>

                </div>

                <div className="cardResumoHoje">

                    <span>

                        Revisões

                    </span>

                    <strong>

                        {

                            eventosHoje.filter(

                                e=>e.tipo==="revisao"

                            ).length

                        }

                    </strong>

                </div>

                <div className="cardResumoHoje">

                    <span>

                        Alertas

                    </span>

                    <strong>

                        {

                            eventosHoje.filter(

                                e=>e.tipo==="alerta"

                            ).length

                        }

                    </strong>

                </div>

            </div>

            <div className="listaAgendaHoje">
            {

                eventosHoje.length===0

                ?

                (

                    <div className="diaLivre">

                        ✅ Nenhuma atividade programada para hoje.

                    </div>

                )

                :

                (

                    eventosHoje.map((evento,index)=>(

                        <div

                            key={index}

                            className="cardAgendaHoje"

                            onClick={()=>

                                onSelecionarEvento([evento])

                            }

                        >

                            <div

                                className="barraAgendaHoje"

                                style={{

                                    background:

                                        corTitulo(

                                            evento.tipo

                                        )

                                }}

                            />

                            <div className="conteudoAgendaHoje">

                                <strong>

                                    {evento.descricao}

                                </strong>

                                <span>

                                    {evento.nomeUT}

                                </span>

                                <small>

                                    UT: {evento.numeroUT}

                                </small>

                                {

                                    evento.protocolo &&

                                    <small>

                                        Protocolo: {evento.protocolo}

                                    </small>

                                }

                                {

                                    evento.dataRevisao &&

                                    <small>

                                        📅 Revisão: {evento.dataRevisao}

                                    </small>

                                }

                                {

                                    evento.diasParaVencimento !== undefined &&

                                    (

                                        evento.diasParaVencimento >= 0

                                        ?

                                        <small

                                            style={{

                                                color:"#d97706",

                                                fontWeight:600

                                            }}

                                        >

                                            ⏳ Faltam {evento.diasParaVencimento} dias.

                                        </small>

                                        :

                                        <small

                                            style={{

                                                color:"#dc2626",

                                                fontWeight:600

                                            }}

                                        >

                                            🔴 Documento vencido há {Math.abs(evento.diasParaVencimento)} dias.

                                        </small>

                                    )

                                }

                            </div>

                        </div>

                    ))

                )

            }

        </div>

    </div>

    );

}

export default AgendaHoje;