import { useMemo, useState } from "react";
import EventoCalendario from "./EventoCalendario";

function CalendarioMensal({

    eventos,

    onSelecionarEvento

}) {

    const hoje = new Date();

    const [mes, setMes] = useState(

        hoje.getMonth()

    );

    const [ano, setAno] = useState(

        hoje.getFullYear()

    );

    const diasSemana=[

        "Dom",

        "Seg",

        "Ter",

        "Qua",

        "Qui",

        "Sex",

        "Sáb"

    ];

    const meses=[

        "Janeiro",

        "Fevereiro",

        "Março",

        "Abril",

        "Maio",

        "Junho",

        "Julho",

        "Agosto",

        "Setembro",

        "Outubro",

        "Novembro",

        "Dezembro"

    ];

    function voltarMes(){

        if(mes===0){

            setMes(11);

            setAno(ano-1);

        }else{

            setMes(mes-1);

        }

    }

    function avancarMes(){

        if(mes===11){

            setMes(0);

            setAno(ano+1);

        }else{

            setMes(mes+1);

        }

    }

    function voltarHoje(){

        const data=new Date();

        setMes(

            data.getMonth()

        );

        setAno(

            data.getFullYear()

        );

    }

    const dias = useMemo(()=>{

        const primeiroDiaMes=new Date(

            ano,

            mes,

            1

        );

        const ultimoDiaMes=new Date(

            ano,

            mes+1,

            0

        );

        const primeiroDiaSemana=

            primeiroDiaMes.getDay();

        const ultimoDia=

            ultimoDiaMes.getDate();

        const ultimoMesAnterior=

            new Date(

                ano,

                mes,

                0

            ).getDate();

        const calendario=[];

        for(

            let i=primeiroDiaSemana-1;

            i>=0;

            i--

        ){

            calendario.push({

                dia:

                    ultimoMesAnterior-i,

                outroMes:true,

                data:new Date(

                    ano,

                    mes-1,

                    ultimoMesAnterior-i

                )

            });

        }

        for(

            let dia=1;

            dia<=ultimoDia;

            dia++

        ){

            calendario.push({

                dia,

                outroMes:false,

                data:new Date(

                    ano,

                    mes,

                    dia

                )

            });

        }

        while(

            calendario.length<42

        ){

            const proximo=

                calendario.length-

                (

                    primeiroDiaSemana+

                    ultimoDia

                )+1;

            calendario.push({

                dia:proximo,

                outroMes:true,

                data:new Date(

                    ano,

                    mes+1,

                    proximo

                )

            });

        }

        return calendario;

    },[mes,ano]);

    function eventosDia(data){

        const dataFormatada=

            data

            .toISOString()

            .split("T")[0];

        return eventos.filter(

            evento=>

                evento.data===

                dataFormatada

        );

    }

    function resumirEventos(

        eventosDoDia

    ){

        const resumo=[];

        const tipos=[

            "analise",

            "pgr",

            "pcmso",

            "alerta",

            "revisao"

        ];

        tipos.forEach(tipo=>{

            const lista=

                eventosDoDia.filter(

                    e=>e.tipo===tipo

                );

            if(

                lista.length>0

            ){

                resumo.push({

                    tipo,

                    quantidade:

                        lista.length,

                    eventos:

                        lista

                });

            }

        });

        return resumo;

    }
        return (

        <div className="calendario">

            <div className="cabecalhoMes">

                <div className="botoesMes">

                    <button onClick={voltarMes}>◀</button>

                    <button onClick={voltarHoje}>Hoje</button>

                    <button onClick={avancarMes}>▶</button>

                </div>

                <h2>

                    {meses[mes]} {ano}

                </h2>

            </div>

            <div className="gradeCalendario">

                {

                    diasSemana.map((dia)=>(

                        <div

                            key={dia}

                            className="tituloDia"

                        >

                            {dia}

                        </div>

                    ))

                }

                {

                    dias.map((item,index)=>{

                        const eventosDoDia=

                            eventosDia(item.data);

                        const resumo=

                            resumirEventos(

                                eventosDoDia

                            );

                        const ehHoje=

                            item.data.toDateString()===

                            hoje.toDateString();

                            const totalEventos = eventosDoDia.length;

const possuiAlerta =
    eventosDoDia.some(
        e => e.tipo === "alerta"
    );

const possuiRevisao =
    eventosDoDia.some(
        e => e.tipo === "revisao"
    );

                        return(

                            <div

                                key={index}

                                className={

                                    `celulaDia ${

                                        item.outroMes

                                        ?

                                        "outroMes"

                                        :

                                        ""

                                    }`

                                }

                                onClick={()=>{

                                    if(

                                        eventosDoDia.length>0

                                    ){

                                        onSelecionarEvento(

                                            eventosDoDia

                                        );

                                    }

                                }}

                            >

                                <div className="topoDia">

    <div

        className={

            ehHoje

            ?

            "numeroDia hoje"

            :

            "numeroDia"

        }

    >

        {item.dia}

    </div>

    {

        totalEventos > 0 &&

        (

            <div

                className={

                    `badgeQuantidade

                    ${

                        possuiRevisao

                        ?

                        "critico"

                        :

                        possuiAlerta

                        ?

                        "alerta"

                        :

                        ""

                    }`

                }

            >

                {totalEventos}

            </div>

        )

    }

</div>

                                {

                                    resumo.map((grupo,i)=>(

                                        <EventoCalendario

                                            key={i}

                                            evento={{

                                                titulo:

                                                `${grupo.quantidade} ${

                                                    grupo.tipo==="analise"

                                                    ?

                                                    "Análise"

                                                    :

                                                    grupo.tipo==="pgr"

                                                    ?

                                                    "PGR"

                                                    :

                                                    grupo.tipo==="pcmso"

                                                    ?

                                                    "PCMSO"

                                                    :

                                                    grupo.tipo==="alerta"

                                                    ?

                                                    "Alerta"

                                                    :

                                                    "Revisão"

                                                }`,

                                                tipo:

                                                grupo.tipo

                                            }}

                                            onClick={()=>

                                                onSelecionarEvento(

                                                    grupo.eventos

                                                )

                                            }

                                        />

                                    ))

                                }

                            </div>

                        );

                    })

                }

            </div>

        </div>

    );

}

export default CalendarioMensal;