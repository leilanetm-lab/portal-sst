
function FiltrosCalendario({

    eventos,

    filtroTexto,
    setFiltroTexto,

    filtroCliente,
    setFiltroCliente,

    filtroTipo,
    setFiltroTipo,

    filtroPeriodo,
    setFiltroPeriodo,

    filtroStatus,
    setFiltroStatus,

    limparFiltros

}){

    const clientes = [

        ...new Set(

            eventos

                .map(

                    evento=>evento.cliente

                )

                .filter(Boolean)

        )

    ].sort();

    return(

        <div className="filtrosCalendario">

            <div className="filtroPesquisa">

                <label>

                    Pesquisar

                </label>

                <input

                    type="text"

                    placeholder="UT, Cliente ou Protocolo..."

                    value={filtroTexto}

                    onChange={(e)=>

                        setFiltroTexto(

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="filtroCampo">

                <label>

                    Cliente

                </label>

                <select

                    value={filtroCliente}

                    onChange={(e)=>

                        setFiltroCliente(

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        Todos

                    </option>

                    {

                        clientes.map(cliente=>(

                            <option

                                key={cliente}

                                value={cliente}

                            >

                                {cliente}

                            </option>

                        ))

                    }

                </select>

            </div>

            <div className="filtroCampo">

                <label>

                    Tipo

                </label>

                <select

                    value={filtroTipo}

                    onChange={(e)=>

                        setFiltroTipo(

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        Todos

                    </option>

                    <option value="analise">

                        Análise

                    </option>

                    <option value="pgr">

                        PGR

                    </option>

                    <option value="pcmso">

                        PCMSO

                    </option>

                    <option value="alerta">

                        Alerta

                    </option>

                    <option value="revisao">

                        Revisão

                    </option>

                </select>

            </div>
                        <div className="filtroCampo">

                <label>

                    Período

                </label>

                <select

                    value={filtroPeriodo}

                    onChange={(e)=>

                        setFiltroPeriodo(

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        Todos

                    </option>

                    <option value="hoje">

                        Hoje

                    </option>

                    <option value="semana">

                        Esta Semana

                    </option>

                    <option value="mes">

                        Este Mês

                    </option>

                </select>

            </div>

            <div className="filtroCampo">

                <label>

                    Status

                </label>

                <select

                    value={filtroStatus}

                    onChange={(e)=>

                        setFiltroStatus(

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        Todos

                    </option>

                    <option value="normal">

                        Normal

                    </option>

                    <option value="alerta">

                        Em Alerta

                    </option>

                    <option value="critico">

                        Crítico

                    </option>

                    <option value="vencido">

                        Vencido

                    </option>

                </select>

            </div>

            <div className="acoesFiltros">

                <button

                    className="btnLimpar"

                    onClick={limparFiltros}

                >

                    🧹 Limpar

                </button>

                <div className="totalRegistros">

                    <span>

                        Total

                    </span>

                    <strong>

                        {eventos.length}

                    </strong>

                </div>

            </div>

        </div>

    );

}

export default FiltrosCalendario;