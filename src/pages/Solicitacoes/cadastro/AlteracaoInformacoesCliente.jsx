function AlteracaoInformacoesCliente({

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

            <h2>🏢 Informações do Cliente</h2>

            <p className="descricao">

                Altere apenas as informações do cliente que sofreram alteração desde a última atualização.

            </p>

            <div className="campo">

                <label>

                    Ramo da Atividade da Contratante *

                </label>

                <small>

                    Informe a atividade econômica principal da contratante.

                </small>

                <input

                    value={dados.ramoContratante || ""}

                    onChange={(e) =>
                        alterarCampo("ramoContratante", e.target.value)
                    }

                />

            </div>

            <div className="campo">

                <label>

                    Ramo da Atividade da UT *

                </label>

                <small>

                    Informe a atividade desenvolvida pela Unidade de Trabalho.

                </small>

                <input

                    value={dados.ramoUT || ""}

                    onChange={(e) =>
                        alterarCampo("ramoUT", e.target.value)
                    }

                />

            </div>

            <div className="campo">

                <label>

                    Endereço da Localidade *

                </label>

                <small>

                    Informe o endereço da unidade do cliente.

                </small>

                <textarea

                    rows="3"

                    value={dados.enderecoLocalidade || ""}

                    onChange={(e) =>
                        alterarCampo("enderecoLocalidade", e.target.value)
                    }

                />

            </div>

            <div className="campo">

                <label>

                    Nome da Contratante *

                </label>

                <small>

                    Informe a razão social da empresa contratante.

                </small>

                <input

                    value={dados.nomeContratante || ""}

                    onChange={(e) =>
                        alterarCampo("nomeContratante", e.target.value)
                    }

                />

            </div>

            <div className="linha">

                <div className="campo">

                    <label>

                        CNPJ do Cliente *

                    </label>

                    <small>

                        Informe o CNPJ da empresa contratante.

                    </small>

                    <input

                        value={dados.cnpjCliente || ""}

                        onChange={(e) =>
                            alterarCampo("cnpjCliente", e.target.value)
                        }

                    />

                </div>

                <div className="campo">

                    <label>

                        CNAE da Atividade *

                    </label>

                    <small>

                        Informe o CNAE da atividade da contratante.

                    </small>

                    <input

                        value={dados.cnaeCliente || ""}

                        onChange={(e) =>
                            alterarCampo("cnaeCliente", e.target.value)
                        }

                    />

                </div>

            </div>

            <div className="campo">

                <label>

                    Grau de Risco da Contratante *

                </label>

                <small>

                    Informe o grau de risco da contratante conforme o CNAE.

                </small>

                <input

                    value={dados.grauRiscoContratante || ""}

                    onChange={(e) =>
                        alterarCampo("grauRiscoContratante", e.target.value)
                    }

                />

            </div>

        </div>

    );

}

export default AlteracaoInformacoesCliente;