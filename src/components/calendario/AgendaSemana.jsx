import { useMemo } from "react";

function AgendaSemana({

    eventos,

    onSelecionarEvento

}) {

    const diasSemana = [

        "Domingo",

        "Segunda-feira",

        "Terça-feira",

        "Quarta-feira",

        "Quinta-feira",

        "Sexta-feira",

        "Sábado"

    ];

    const semana = useMemo(() => {

        const hoje = new Date();

        hoje.setHours(0,0,0,0);

        const inicio = new Date(hoje);

        inicio.setDate(

            hoje.getDate() -

            hoje.getDay()

        );

        const lista = [];

        for(let i=0;i<7;i++){

            const data = new Date(inicio);

            data.setDate(

                inicio.getDate()+i

            );

            const dataFormatada =

                data

                .toISOString()

                .split("T")[0];

            const eventosDia = eventos.filter(

                evento=>

                    evento.data===

                    dataFormatada

            );

            lista.push({

                nome:

                    diasSemana[

                        data.getDay()

                    ],

                data,

                eventos:

                    eventosDia

            });

        }

        return lista;

    },[eventos]);

    function agruparPorTipo(

        eventosDia

    ){

        const tipos=[

            "analise",

            "pgr",

            "pcmso",

            "alerta",

            "revisao"

        ];

        const grupos=[];

        tipos.forEach(tipo=>{

            const lista=

                eventosDia.filter(

                    evento=>

                        evento.tipo===tipo

                );

            if(lista.length){

                grupos.push({

                    tipo,

                    quantidade:

                        lista.length,

                    eventos:

                        lista

                });

            }

        });

        return grupos;

    }

    function tituloTipo(tipo){

        switch(tipo){

            case "analise":

                return "Análises";

            case "pgr":

                return "PGR";

            case "pcmso":

                return "PCMSO";

            case "alerta":

                return "Alertas";

            case "revisao":

                return "Revisões";

            default:

                return tipo;

        }

    }

    function corTipo(tipo){

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

        <div className="agendaSemana">

            <h2>

                📅 Agenda da Semana

            </h2>

            <div className="cardsSemana">
                            {

                semana.map((dia,index)=>{

                    const grupos=

                        agruparPorTipo(

                            dia.eventos

                        );

                    return(

                        <div

                            key={index}

                            className="cardDiaSemana"

                        >

                            <div className="cabecalhoDiaSemana">

                                <h3>

                                    {dia.nome}

                                </h3>

                                <small>

                                    {

                                        dia.data.toLocaleDateString(

                                            "pt-BR"

                                        )

                                    }

                                </small>

                            </div>

                            {

                                grupos.length===0

                                ?

                                (

                                    <div className="diaLivre">

                                        ✅ Nenhuma atividade

                                    </div>

                                )

                                :

                                (

                                    grupos.map((grupo,i)=>(

                                        <div

                                            key={i}

                                            className="atividadeSemana"

                                            onClick={()=>

                                                onSelecionarEvento(

                                                    grupo.eventos

                                                )

                                            }

                                            style={{

                                                borderLeft:

                                                `6px solid ${

                                                    corTipo(

                                                        grupo.tipo

                                                    )

                                                }`

                                            }}

                                        >

                                            <div className="atividadeTitulo">

                                                {

                                                    tituloTipo(

                                                        grupo.tipo

                                                    )

                                                }

                                            </div>

                                            <div className="atividadeQuantidade">

                                                {

                                                    grupo.quantidade

                                                }

                                                {" "}

                                                atividade(s)

                                            </div>

                                        </div>

                                    ))

                                )

                            }

                        </div>

                    );

                })

            }
                        </div>

            <div className="resumoSemana">

                <div className="cardResumoSemana">

                    <span>

                        Total de atividades

                    </span>

                    <strong>

                        {eventos.length}

                    </strong>

                </div>

                <div className="cardResumoSemana">

                    <span>

                        Dias com atividades

                    </span>

                    <strong>

                        {

                            semana.filter(

                                dia=>dia.eventos.length>0

                            ).length

                        }

                    </strong>

                </div>

            </div>

        </div>

    );

}

export default AgendaSemana;