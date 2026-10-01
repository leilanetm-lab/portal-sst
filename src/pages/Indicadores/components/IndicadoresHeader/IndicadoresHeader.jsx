import "./IndicadoresHeader.css";

function IndicadoresHeader({
    ano,
    mes,
    dataInicio,
    dataFim,
    utSelecionada,
    modalidadeSelecionada,
    statusSelecionado,
    utOptions,
    onAnoChange,
    onMesChange,
    onDataInicioChange,
    onDataFimChange,
    onUtChange,
    onModalidadeChange,
    onStatusChange,
    onLimparFiltros,
    atualizar
}) {

    return (

        <div className="indicadoresHeader">

            <div className="indicadoresHeaderText">

                <span className="eyebrow">Painel executivo</span>

                <h1>📊 Painel Executivo</h1>

                <p>
                    Indicadores de SST — acompanhamento dos indicadores de Saúde e Segurança do Trabalho.
                </p>

            </div>

            <div className="filtrosIndicadores">

                <label className="filtroCampo">
                    <span>Período</span>
                    <select
                        value={ano}
                        onChange={(e) =>
                            onAnoChange(Number(e.target.value))
                        }
                    >

                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>

                    </select>
                </label>

                <label className="filtroCampo">
                    <span>Mês</span>
                    <select
                        value={mes}
                        onChange={(e) =>
                            onMesChange(e.target.value)
                        }
                    >

                        <option value="">Todos</option>

                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>

                    </select>
                </label>

                <label className="filtroCampo">
                    <span>Data inicial</span>
                    <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => onDataInicioChange(e.target.value)}
                        aria-label="Data inicial"
                    />
                </label>

                <label className="filtroCampo">
                    <span>Data final</span>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => onDataFimChange(e.target.value)}
                        aria-label="Data final"
                    />
                </label>

                <label className="filtroCampo">
                    <span>UT</span>
                    <select
                        value={utSelecionada}
                        onChange={(e) => onUtChange(e.target.value)}
                        aria-label="Filtro por UT"
                    >

                        <option value="all">Todas</option>

                        {(utOptions || []).map((ut) => (

                            <option key={ut} value={ut}>
                                {ut}
                            </option>

                        ))}

                    </select>
                </label>

                <label className="filtroCampo">
                    <span>Modalidade</span>
                    <select
                        value={modalidadeSelecionada}
                        onChange={(e) => onModalidadeChange(e.target.value)}
                        aria-label="Filtro por modalidade"
                    >
                        <option value="all">Todas</option>
                        <option value="PGR">PGR</option>
                        <option value="PCMSO">PCMSO</option>
                        <option value="LTCAT">LTCAT</option>
                    </select>
                </label>

                <label className="filtroCampo">
                    <span>Status</span>
                    <select
                        value={statusSelecionado}
                        onChange={(e) => onStatusChange(e.target.value)}
                        aria-label="Filtro por status"
                    >
                        <option value="all">Todos</option>
                        <option value="Em análise">Em análise</option>
                        <option value="Aguardando correção">Aguardando correção</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Devolvido">Devolvido</option>
                    </select>
                </label>

                <button
                    type="button"
                    className="botaoLimparFiltros"
                    onClick={onLimparFiltros}
                >
                    Limpar filtros
                </button>

            </div>

        </div>

    );
}

export default IndicadoresHeader;