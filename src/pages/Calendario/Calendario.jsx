import { useEffect, useMemo, useState } from "react";

import "./Calendario.css";

import { listarEventosCalendario } from "../../services/calendarioService";

import CalendarioMensal from "../../components/calendario/CalendarioMensal";
import AgendaSemana from "../../components/calendario/AgendaSemana";
import AgendaHoje from "../../components/calendario/AgendaHoje";
import PainelDetalhes from "../../components/calendario/PainelDetalhes";
import FiltrosCalendario from "../../components/calendario/FiltrosCalendario";
import CardResumo from "../../components/calendario/CardResumo";
import LegendaCalendario from "../../components/calendario/LegendaCalendario";

function Calendario(){

    const [eventos,setEventos]=useState([]);

    const [eventoSelecionado,setEventoSelecionado]=useState([]);

    const [filtroTexto,setFiltroTexto]=useState("");

    const [filtroCliente,setFiltroCliente]=useState("");

    const [filtroTipo,setFiltroTipo]=useState("");

    const [filtroPeriodo,setFiltroPeriodo]=useState("");

    const [filtroStatus,setFiltroStatus]=useState("");

    useEffect(()=>{

        carregar();

    },[]);

    async function carregar(){

        const lista=

            await listarEventosCalendario();

        setEventos(lista);

    }

    function limparFiltros(){

        setFiltroTexto("");

        setFiltroCliente("");

        setFiltroTipo("");

        setFiltroPeriodo("");

        setFiltroStatus("");

    }

    const eventosFiltrados=useMemo(()=>{

        let lista=[...eventos];

        if(filtroTexto){

            const texto=filtroTexto.toLowerCase();

            lista=lista.filter(evento=>

                (evento.numeroUT||"")

                    .toLowerCase()

                    .includes(texto)

                ||

                (evento.nomeUT||"")

                    .toLowerCase()

                    .includes(texto)

                ||

                (evento.protocolo||"")

                    .toLowerCase()

                    .includes(texto)

                ||

                (evento.cliente||"")

                    .toLowerCase()

                    .includes(texto)

            );

        }

        if(filtroCliente){

            lista=lista.filter(

                e=>e.cliente===filtroCliente

            );

        }

        if(filtroTipo){

            lista=lista.filter(

                e=>e.tipo===filtroTipo

            );

        }

        if(filtroStatus){

            lista=lista.filter(

                e=>e.status===filtroStatus

            );

        }

        if(filtroPeriodo){

            const hoje=new Date();

            hoje.setHours(0,0,0,0);

            lista=lista.filter(evento=>{

                const data=new Date(evento.data);

                data.setHours(0,0,0,0);

                switch(filtroPeriodo){

                    case "hoje":

                        return(

                            data.getTime()===

                            hoje.getTime()

                        );

                    case "semana":{

                        const inicio=

                            new Date(hoje);

                        inicio.setDate(

                            hoje.getDate()-

                            hoje.getDay()

                        );

                        const fim=

                            new Date(inicio);

                        fim.setDate(

                            inicio.getDate()+6

                        );

                        return(

                            data>=inicio &&

                            data<=fim

                        );

                    }

                    case "mes":

                        return(

                            data.getMonth()===

                            hoje.getMonth()

                            &&

                            data.getFullYear()===

                            hoje.getFullYear()

                        );

                    default:

                        return true;

                }

            });

        }

        return lista;

    },[

        eventos,

        filtroTexto,

        filtroCliente,

        filtroTipo,

        filtroPeriodo,

        filtroStatus

    ]);

    const quantidadeAlertas=

        eventosFiltrados.filter(

            e=>e.tipo==="alerta"

        ).length;

    const quantidadeRevisoes=

        eventosFiltrados.filter(

            e=>e.tipo==="revisao"

        ).length;

    return(

        <div className="paginaCalendario">

            <div className="cabecalhoCalendarioPagina">

                <div>

                    <h1>

                        📅 Calendário SST

                    </h1>

                    <p>

                        Planejamento da equipe e vencimentos documentais

                    </p>

                </div>

            </div>

            <FiltrosCalendario

                eventos={eventos}

                filtroTexto={filtroTexto}
                setFiltroTexto={setFiltroTexto}

                filtroCliente={filtroCliente}
                setFiltroCliente={setFiltroCliente}

                filtroTipo={filtroTipo}
                setFiltroTipo={setFiltroTipo}

                filtroPeriodo={filtroPeriodo}
                setFiltroPeriodo={setFiltroPeriodo}

                filtroStatus={filtroStatus}
                setFiltroStatus={setFiltroStatus}

                limparFiltros={limparFiltros}

            />

            <div className="cardsResumo">

                <CardResumo

                    titulo="Atividades"

                    valor={eventosFiltrados.length}

                    cor="#23395d"

                />

                <CardResumo

                    titulo="Alertas"

                    valor={quantidadeAlertas}

                    cor="#ff9800"

                />

                <CardResumo

                    titulo="Revisões"

                    valor={quantidadeRevisoes}

                    cor="#d32f2f"

                />

            </div>
                        <div className="conteudoCalendario">

                <div className="areaCalendario">

                    {

                        filtroPeriodo === "semana"

                        ?

                        (

                            <AgendaSemana

                                eventos={eventosFiltrados}

                                onSelecionarEvento={setEventoSelecionado}

                            />

                        )

                        :

                        filtroPeriodo === "hoje"

                        ?

                        (

                            <AgendaHoje

                                eventos={eventosFiltrados}

                                onSelecionarEvento={setEventoSelecionado}

                            />

                        )

                        :

                        (

                            <CalendarioMensal

                                eventos={eventosFiltrados}

                                onSelecionarEvento={setEventoSelecionado}

                            />

                        )

                    }

                </div>

                <PainelDetalhes

                    eventos={eventoSelecionado}

                />

            </div>

            <LegendaCalendario />

        </div>

    );

}

export default Calendario;