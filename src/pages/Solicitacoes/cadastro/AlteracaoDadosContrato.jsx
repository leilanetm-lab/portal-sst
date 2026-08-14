function AlteracaoDadosContrato({

    dados,

    setDados

}) {

    function alterarCampo(campo, valor) {

        setDados({

            ...dados,

            [campo]: valor

        });

    }

    return (

        <div className="card">

            <h2>📄 Dados do Contrato</h2>

            <p className="descricao">

                Altere somente os campos que sofreram modificação desde a última atualização.

            </p>

            <div className="campo">

                <label>

                    Diretoria *

                </label>

                <small>

                    Informe a diretoria responsável pelo contrato.

                </small>

                <input

                    value={dados.diretoria || ""}

                    onChange={(e) =>
                        alterarCampo("diretoria", e.target.value)
                    }

                />

            </div>

            <div className="campo">

                <label>

                    Locais de Atuação *

                </label>

                <small>

                    Informe os locais onde o contrato é executado.

                </small>

                <input

                    value={dados.locaisAtuacao || ""}

                    onChange={(e) =>
                        alterarCampo("locaisAtuacao", e.target.value)
                    }

                />

            </div>

            <div className="campo">

                <label>

                    Endereços dos Locais de Execução *

                </label>

                <small>

                    Informe os endereços dos locais de execução do contrato.

                </small>

                <textarea

                    rows="3"

                    value={dados.enderecoExecucao || ""}

                    onChange={(e) =>
                        alterarCampo("enderecoExecucao", e.target.value)
                    }

                />

            </div>

            <div className="linha">

                <div className="campo">

                    <label>

                        Número do Contrato *

                    </label>

                    <small>

                        Informe o número do contrato.

                    </small>

                    <input

                        value={dados.numeroContrato || ""}

                        onChange={(e) =>
                            alterarCampo("numeroContrato", e.target.value)
                        }

                    />

                </div>

                <div className="campo">

                    <label>

                        Vigência *

                    </label>

                    <small>

                        Informe a vigência contratual.

                    </small>

                    <input

                        value={dados.vigenciaContrato || ""}

                        onChange={(e) =>
                            alterarCampo("vigenciaContrato", e.target.value)
                        }

                    />

                </div>

            </div>

            <div className="linha">

                <div className="campo">

                    <label>

                        Segmento *

                    </label>

                    <small>

                        Informe o segmento do contrato.

                    </small>

                    <input

                        value={dados.segmento || ""}

                        onChange={(e) =>
                            alterarCampo("segmento", e.target.value)
                        }

                    />

                </div>

                <div className="campo">

                    <label>

                        CNPJ Atualizado *

                    </label>

                    <small>

                        Informe o CNPJ atualizado.

                    </small>

                    <input

                        value={dados.cnpjAtualizado || ""}

                        onChange={(e) =>
                            alterarCampo("cnpjAtualizado", e.target.value)
                        }

                    />

                </div>

            </div>

            <div className="linha">

                <div className="campo">

                    <label>

                        Turno de Trabalho *

                    </label>

                    <small>

                        Informe o turno predominante.

                    </small>

                    <input

                        value={dados.turnoTrabalho || ""}

                        onChange={(e) =>
                            alterarCampo("turnoTrabalho", e.target.value)
                        }

                    />

                </div>

                <div className="campo">

                    <label>

                        CNAE *

                    </label>

                    <small>

                        Informe o CNAE da atividade.

                    </small>

                    <input

                        value={dados.cnae || ""}

                        onChange={(e) =>
                            alterarCampo("cnae", e.target.value)
                        }

                    />

                </div>

            </div>

        </div>

    );

}

export default AlteracaoDadosContrato;