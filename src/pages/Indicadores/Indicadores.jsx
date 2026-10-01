import { useState } from "react";

import "./Indicadores.css";

import useIndicadores from "./components/hooks/useIndicadores";

import IndicadoresHeader from "./components/IndicadoresHeader/IndicadoresHeader";
import IndicadoresCards from "./components/IndicadoresCards/IndicadoresCards";

import GraficoProducao from "./components/GraficoProducao/GraficoProducao";
import GraficoSolicitacoes from "./components/GraficoSolicitacoes/GraficoSolicitacoes";
import GraficoSLA from "./components/GraficoSLA/GraficoSLA";
import GraficoEngenharia from "./components/GraficoEngenharia/GraficoEngenharia";
import GraficoProdutividade from "./components/GraficoProdutividade/GraficoProdutividade";
import GraficoVencimentos from "./components/GraficoVencimentos/GraficoVencimentos";
import GraficoComplexidade from "./components/GraficoComplexidade/GraficoComplexidade";
import GraficoProducaoTecnica from "./components/GraficoProducaoTecnica/GraficoProducaoTecnica";
import GraficoSaving from "./components/GraficoSaving/GraficoSaving";

function Indicadores() {

    const [ano, setAno] = useState(2026);

    const [mes, setMes] = useState("");

    const [dataInicio, setDataInicio] = useState("");

    const [dataFim, setDataFim] = useState("");

    const [utSelecionada, setUtSelecionada] = useState("all");

    const [modalidadeSelecionada, setModalidadeSelecionada] = useState("all");

    const [statusSelecionado, setStatusSelecionado] = useState("all");

    const {
        cards,
        producaoMensal,
        tiposSolicitacao,
        produtividadeMensal,
        engenhariaMensal,
        vencimentos,
        graficoVencimentos,
        resumoTecnico,
        complexidadeMensal,
        graficoSLA,
        devolucoesCards,
        topMotivos,
        distribuicaoDevolucoes,
        utDetalhe,
        evolucaoMensal,
        utOptions,
        acompanhamentoPosDisponibilizacao,
        loading,
        atualizar
    } = useIndicadores(
        ano,
        mes,
        {
            dataInicio,
            dataFim,
            ut: utSelecionada,
            modalidade: modalidadeSelecionada,
            status: statusSelecionado
        }
    );

    const limparFiltros = () => {
        setDataInicio("");
        setDataFim("");
        setUtSelecionada("all");
        setModalidadeSelecionada("all");
        setStatusSelecionado("all");
        setMes("");
    };

    const filtrosGlobais = {
        ano,
        mes,
        dataInicio,
        dataFim,
        ut: utSelecionada,
        modalidade: modalidadeSelecionada,
        status: statusSelecionado
    };

    const acompanhamentoCards = acompanhamentoPosDisponibilizacao?.cards || {};
    const slaPostagemPorUT = acompanhamentoPosDisponibilizacao?.slaPostagemPorUT || [];
    const slaRetornoPorUT = acompanhamentoPosDisponibilizacao?.slaRetornoPorUT || [];
    const reprovaçõesPorUT = acompanhamentoPosDisponibilizacao?.reprovaçõesPorUT || [];
    const tabelaUTAcompanhamento = acompanhamentoPosDisponibilizacao?.tabelaUT || [];

    const maxSlaPostagem = Math.max(
        ...slaPostagemPorUT.map((ut) => Number(ut?.slaMedioPostagem || 0)),
        1
    );

    const maxSlaRetorno = Math.max(
        ...slaRetornoPorUT.map((ut) => Number(ut?.slaMedioRetorno || 0)),
        1
    );

    const maxReprovacoes = Math.max(
        ...reprovaçõesPorUT.map((ut) => Number(ut?.reprovados || 0)),
        1
    );

    const resumoStatus = [
        {
            label: "Postadas",
            value: tabelaUTAcompanhamento.reduce((total, ut) => total + Number(ut?.postados || 0), 0),
            color: "#10b981"
        },
        {
            label: "Aguardando postagem",
            value: tabelaUTAcompanhamento.reduce((total, ut) => total + Number(ut?.aguardandoPostagem || 0), 0),
            color: "#f59e0b"
        },
        {
            label: "Aguardando retorno",
            value: tabelaUTAcompanhamento.reduce((total, ut) => total + Number(ut?.aguardandoRetorno || 0), 0),
            color: "#f97316"
        },
        {
            label: "Aprovadas",
            value: tabelaUTAcompanhamento.reduce((total, ut) => total + Number(ut?.aprovados || 0), 0),
            color: "#2563eb"
        },
        {
            label: "Reprovadas",
            value: tabelaUTAcompanhamento.reduce((total, ut) => total + Number(ut?.reprovados || 0), 0),
            color: "#ef4444"
        }
    ];

    if (loading) {

        return (

            <p>
                Carregando...
            </p>

        );

    }

    return (

        <div className="indicadores">

            <IndicadoresHeader

                ano={ano}

                mes={mes}

                dataInicio={dataInicio}

                dataFim={dataFim}

                utSelecionada={utSelecionada}

                modalidadeSelecionada={modalidadeSelecionada}

                statusSelecionado={statusSelecionado}

                utOptions={utOptions || []}

                onAnoChange={setAno}

                onMesChange={setMes}

                onDataInicioChange={setDataInicio}

                onDataFimChange={setDataFim}

                onUtChange={setUtSelecionada}

                onModalidadeChange={setModalidadeSelecionada}

                onStatusChange={setStatusSelecionado}

                onLimparFiltros={limparFiltros}

                atualizar={atualizar}

            />

            <IndicadoresCards

                cards={cards}

                resumoTecnico={resumoTecnico}

            />

            <section className="blocoDevolucoes">

                <div className="devolucoesTituloWrap">

                    <div>

                        <span className="devolucoesEyebrow">Seção executiva</span>

                        <h2>Devoluções e Retrabalho</h2>

                    </div>

                    <p>
                        Acompanhamento da qualidade das solicitações de PGR
                    </p>

                </div>

                <div className="cardsDevolucoes">

                    {[
                        {
                            titulo: "Total",
                            valor: devolucoesCards?.totalSolicitacoes ?? 0,
                            icone: "📋",
                            cor: "#ff6b00"
                        },
                        {
                            titulo: "1ª análise",
                            valor: devolucoesCards?.aprovadasPrimeiraAnalise ?? 0,
                            icone: "✅",
                            cor: "#16a34a"
                        },
                        {
                            titulo: "Correção",
                            valor: devolucoesCards?.solicitacoesComCorrecao ?? 0,
                            icone: "🔁",
                            cor: "#f59e0b"
                        },
                        {
                            titulo: "2+",
                            valor: devolucoesCards?.solicitacoesCom2Mais ?? 0,
                            icone: "⚠️",
                            cor: "#ef4444"
                        },
                        {
                            titulo: "Devoluções",
                            valor: devolucoesCards?.totalDevolucoes ?? 0,
                            icone: "📉",
                            cor: "#7c3aed"
                        },
                        {
                            titulo: "Retrabalho",
                            valor: `${Number(devolucoesCards?.taxaRetrabalho || 0).toFixed(1)}%`,
                            icone: "📊",
                            cor: "#0ea5e9"
                        }
                    ].map((card, index) => (

                        <div
                            key={index}
                            className="cardIndicadorDevolucao"
                            style={{ borderTop: `4px solid ${card.cor}` }}
                        >

                            <div className="iconeCardDevolucao">
                                {card.icone}
                            </div>

                            <div className="cardIndicadorConteudo">
                                <strong>{card.valor}</strong>
                                <span>{card.titulo}</span>
                            </div>

                        </div>

                    ))}

                </div>

                <div className="devolucaoGrid devolucaoGridTop">

                    <div className="painelDevolucao painelUT">

                        <div className="painelCabecalho">
                            <h3>📊 Devoluções por UT</h3>
                        </div>

                        <div className="tabelaDevolucoes compacta">

                            <div className="linhaCabecalho">
                                <span>UT</span>
                                <span>Req.</span>
                                <span>Dev.</span>
                                <span>Retr.</span>
                            </div>

                            {(utDetalhe || []).slice(0, 8).map((ut, index) => (

                                <div key={`${ut.ut}-${index}`} className="linhaDados">
                                    <span>{ut.ut || "Não informado"}</span>
                                    <span>{ut.totalSolicitacoes}</span>
                                    <span>{ut.totalDevolucoes}</span>
                                    <span>{Number(ut.percentualRetrabalho || 0).toFixed(1)}%</span>
                                </div>

                            ))}

                        </div>

                    </div>

                    <div className="painelDevolucao painelPerfil">

                        <div className="painelCabecalho">
                            <h3>📌 Perfil de solicitações</h3>
                        </div>

                        <div className="perfilResumo">

                            <div className="perfilItem">
                                <span>1ª análise</span>
                                <strong>{devolucoesCards?.aprovadasPrimeiraAnalise ?? 0}</strong>
                            </div>

                            <div className="perfilItem">
                                <span>Correção</span>
                                <strong>{devolucoesCards?.solicitacoesComCorrecao ?? 0}</strong>
                            </div>

                            <div className="perfilItem">
                                <span>2+ correções</span>
                                <strong>{devolucoesCards?.solicitacoesCom2Mais ?? 0}</strong>
                            </div>

                            <div className="perfilItem destaque">
                                <span>Taxa de retrabalho</span>
                                <strong>{`${Number(devolucoesCards?.taxaRetrabalho || 0).toFixed(1)}%`}</strong>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="devolucaoGrid devolucaoGridBottom">

                    <div className="painelDevolucao painelMotivos">

                        <div className="painelCabecalho">
                            <h3>🏆 Top 10 motivos</h3>
                        </div>

                        <div className="listaMotivosDevolucao">

                            {(topMotivos || []).slice(0, 8).map((item, index) => (

                                <div key={`${item.motivo}-${index}`} className="itemMotivo">

                                    <div className="rankingNumero">
                                        {index + 1}
                                    </div>

                                    <div className="motivoDetalhe">
                                        <strong>{item.motivo}</strong>
                                        <span>{item.quantidade} ocorrências</span>
                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    <div className="painelDevolucao painelEvolucao">

                        <div className="painelCabecalho">
                            <h3>📈 Evolução mensal</h3>
                        </div>

                        <div className="evolucaoMensalLista">

                            {(evolucaoMensal || []).slice(0, 6).map((item) => (

                                <div key={item.mes} className="linhaEvolucao">

                                    <span>{item.mes}</span>

                                    <div className="miniBarras">

                                        <div
                                            className="miniBarra total"
                                            style={{
                                                width: `${Math.min(item.totalSolicitacoes * 12, 100)}%`
                                            }}
                                        />

                                        <div
                                            className="miniBarra devolucao"
                                            style={{
                                                width: `${Math.min(item.totalDevolucoes * 18, 100)}%`
                                            }}
                                        />

                                    </div>

                                    <small>{item.totalDevolucoes}</small>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

                <div className="painelDevolucao painelTabelaCompleta">

                    <div className="painelCabecalho">
                        <h3>📋 Desempenho por UT</h3>
                    </div>

                    <div className="tabelaDevolucoes tabelaCompleta">

                        <div className="linhaCabecalho">
                            <span>UT</span>
                            <span>Total</span>
                            <span>1ª análise</span>
                            <span>Com correção</span>
                            <span>2+</span>
                            <span>Devoluções</span>
                            <span>Retrabalho</span>
                        </div>

                        {(utDetalhe || []).map((ut, index) => (

                            <div key={`${ut.ut}-${index}`} className="linhaDados">
                                <span>{ut.ut || "Não informado"}</span>
                                <span>{ut.totalSolicitacoes}</span>
                                <span>{ut.aprovadasPrimeiraAnalise}</span>
                                <span>{ut.solicitacoesComCorrecao}</span>
                                <span>{ut.solicitacoesCom2Mais}</span>
                                <span>{ut.totalDevolucoes}</span>
                                <span>{Number(ut.percentualRetrabalho || 0).toFixed(1)}%</span>
                            </div>

                        ))}

                    </div>

                </div>

            </section>

            <section className="blocoDevolucoes postDisponibilizacaoSection">

                <div className="devolucoesTituloWrap">

                    <div>

                        <span className="devolucoesEyebrow">Seção executiva</span>

                        <h2>📌 Acompanhamento Pós-Disponibilização</h2>

                    </div>

                    <p>
                        Indicadores de pós-disponibilização dos documentos e acompanhamento do cliente.
                    </p>

                </div>

                <div className="cardsDevolucoes">

                    {[
                        {
                            titulo: "Documentos com postagem exigida",
                            valor: acompanhamentoCards?.documentosComPostagemExigida ?? 0,
                            icone: "📦",
                            cor: "#2563eb"
                        },
                        {
                            titulo: "SLA médio de postagem",
                            valor: `${Number(acompanhamentoCards?.slaMedioPostagem || 0).toFixed(1)}d`,
                            icone: "⏱️",
                            cor: "#0ea5e9"
                        },
                        {
                            titulo: "Aguardando postagem",
                            valor: acompanhamentoCards?.aguardandoPostagem ?? 0,
                            icone: "🕒",
                            cor: "#f59e0b"
                        },
                        {
                            titulo: "SLA médio de retorno",
                            valor: `${Number(acompanhamentoCards?.slaMedioRetorno || 0).toFixed(1)}d`,
                            icone: "📬",
                            cor: "#10b981"
                        },
                        {
                            titulo: "Aguardando retorno",
                            valor: acompanhamentoCards?.aguardandoRetorno ?? 0,
                            icone: "⏳",
                            cor: "#f97316"
                        },
                        {
                            titulo: "Índice de reprovação",
                            valor: `${Number(acompanhamentoCards?.indiceReprovacao || 0).toFixed(1)}%`,
                            icone: "🔴",
                            cor: "#ef4444"
                        }
                    ].map((card, index) => (

                        <div
                            key={index}
                            className="cardIndicadorDevolucao"
                            style={{ borderTop: `4px solid ${card.cor}` }}
                        >

                            <div className="iconeCardDevolucao" style={{ background: `${card.cor}12` }}>
                                {card.icone}
                            </div>

                            <div className="cardIndicadorConteudo">
                                <strong>{card.valor}</strong>
                                <span>{card.titulo}</span>
                            </div>

                        </div>

                    ))}

                </div>

                <div className="devolucaoGrid devolucaoGridCharts">

                    <div className="painelDevolucao">
                        <div className="painelCabecalho">
                            <h3>📈 SLA médio de postagem por UT</h3>
                        </div>

                        <div className="metricBarChart">
                            {(slaPostagemPorUT || []).slice(0, 8).map((ut, index) => {
                                const valor = Number(ut?.slaMedioPostagem || 0);
                                const largura = Math.max((valor / maxSlaPostagem) * 100, 8);

                                return (
                                    <div key={`${ut.ut || "nao-informado"}-${index}`} className="metricBarRow">
                                        <div className="metricBarHeader">
                                            <span>{ut.ut || "Não informado"}</span>
                                            <strong>{Number(valor).toFixed(1)} dias</strong>
                                        </div>
                                        <div className="metricBarTrack">
                                            <div className="metricBarFill metricBarFillBlue" style={{ width: `${largura}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="painelDevolucao">
                        <div className="painelCabecalho">
                            <h3>📮 SLA médio de retorno do cliente por UT</h3>
                        </div>

                        <div className="metricBarChart">
                            {(slaRetornoPorUT || []).slice(0, 8).map((ut, index) => {
                                const valor = Number(ut?.slaMedioRetorno || 0);
                                const largura = Math.max((valor / maxSlaRetorno) * 100, 8);

                                return (
                                    <div key={`${ut.ut || "nao-informado"}-${index}`} className="metricBarRow">
                                        <div className="metricBarHeader">
                                            <span>{ut.ut || "Não informado"}</span>
                                            <strong>{Number(valor).toFixed(1)} dias</strong>
                                        </div>
                                        <div className="metricBarTrack">
                                            <div className="metricBarFill metricBarFillGreen" style={{ width: `${largura}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="devolucaoGrid devolucaoGridSummary">

                    <div className="painelDevolucao">
                        <div className="painelCabecalho">
                            <h3>🔴 Reprovações por UT</h3>
                        </div>

                        <div className="metricBarChart">
                            {(reprovaçõesPorUT || []).slice(0, 8).map((ut, index) => {
                                const valor = Number(ut?.reprovados || 0);
                                const largura = Math.max((valor / maxReprovacoes) * 100, 8);

                                return (
                                    <div key={`${ut.ut || "nao-informado"}-${index}`} className="metricBarRow">
                                        <div className="metricBarHeader">
                                            <span>{ut.ut || "Não informado"}</span>
                                            <strong>{valor} · {Number(ut?.indiceReprovacao || 0).toFixed(1)}%</strong>
                                        </div>
                                        <div className="metricBarTrack">
                                            <div className="metricBarFill metricBarFillRed" style={{ width: `${largura}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="painelDevolucao painelResumoStatus">
                        <div className="painelCabecalho">
                            <h3>📊 Resumo visual</h3>
                        </div>

                        <div className="resumoStatusGrid">
                            {resumoStatus.map((item) => (
                                <div key={item.label} className="statusChip" style={{ borderColor: `${item.color}40`, background: `${item.color}12` }}>
                                    <span>{item.label}</span>
                                    <strong style={{ color: item.color }}>{item.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="painelDevolucao painelDevolucaoFull">
                    <div className="painelCabecalho">
                        <h3>📋 Acompanhamento pós-disponibilização por UT</h3>
                    </div>

                    <div className="tableScroll">
                        <table className="tabelaExecucaoCompleta">
                            <thead>
                                <tr>
                                    <th>UT</th>
                                    <th>Docs</th>
                                    <th>Postadas</th>
                                    <th>Ag. postagem</th>
                                    <th>SLA postagem</th>
                                    <th>Ag. retorno</th>
                                    <th>SLA retorno</th>
                                    <th>Reprovados</th>
                                    <th>% reprovação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(tabelaUTAcompanhamento || []).map((ut, index) => (
                                    <tr key={`${ut.ut || "nao-informado"}-${index}`}>
                                        <td>{ut.ut || "Não informado"}</td>
                                        <td>{ut.documentosComPostagem}</td>
                                        <td>{ut.postados}</td>
                                        <td>{ut.aguardandoPostagem}</td>
                                        <td>{Number(ut.slaMedioPostagem || 0).toFixed(1)}d</td>
                                        <td>{ut.aguardandoRetorno}</td>
                                        <td>{Number(ut.slaMedioRetorno || 0).toFixed(1)}d</td>
                                        <td>{ut.reprovados}</td>
                                        <td>{Number(ut.indiceReprovacao || 0).toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </section>

            <GraficoProducao

                producaoMensal={producaoMensal}

            />

            <GraficoSolicitacoes

                dados={

                    Object.entries(
                        tiposSolicitacao || {}
                    ).map(([tipo, quantidade]) => ({

                        tipo,

                        quantidade

                    }))

                }

            />

            <GraficoSLA

                dados={graficoSLA}

            />

            <GraficoEngenharia

                dados={engenhariaMensal}

            />

            <GraficoVencimentos

    dados={graficoVencimentos}

/>

            <GraficoProdutividade

                dados={produtividadeMensal}

            />

            <GraficoComplexidade
    resumo={resumoTecnico}
    dados={complexidadeMensal}
/>

            <GraficoProducaoTecnica

    resumo={resumoTecnico}

    dados={engenhariaMensal}

 />

            <GraficoSaving
                filtros={filtrosGlobais}
            />

        </div>

    );
}

export default Indicadores;