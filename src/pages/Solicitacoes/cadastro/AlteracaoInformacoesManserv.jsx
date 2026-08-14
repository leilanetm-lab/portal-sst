function AlteracaoInformacoesManserv({

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

            <h2>👷 Informações da Manserv</h2>

            <p className="descricao">

                Altere apenas as informações da Manserv que sofreram alteração desde a última atualização.

            </p>

            <div className="campo">

                <label>

                    Grau de Risco da Contratada *

                </label>

                <small>

                    Informe o grau de risco da Manserv para este contrato.

                </small>

                <input

                    value={dados.grauRiscoContratada || ""}

                    onChange={(e) =>
                        alterarCampo("grauRiscoContratada", e.target.value)
                    }

                />

            </div>

            <div className="campo">

                <label>

                    Objeto do Contrato *

                </label>

                <small>

                    Descreva resumidamente o objeto do contrato.

                </small>

                <textarea

                    rows="3"

                    value={dados.objetoContrato || ""}

                    onChange={(e) =>
                        alterarCampo("objetoContrato", e.target.value)
                    }

                />

            </div>

            <div className="campo">

                <label>

                    Abrangência do Contrato *

                </label>

                <small>

                    Informe a abrangência do contrato.

                </small>

                <input

                    value={dados.abrangenciaContrato || ""}

                    onChange={(e) =>
                        alterarCampo("abrangenciaContrato", e.target.value)
                    }

                />

            </div>

            <div className="linha">

                <div className="campo">

                    <label>

                        Gestor do Contrato *

                    </label>

                    <small>

                        Nome do gestor responsável.

                    </small>

                    <input

                        value={dados.gestorContrato || ""}

                        onChange={(e) =>
                            alterarCampo("gestorContrato", e.target.value)
                        }

                    />

                </div>

                <div className="campo">

                    <label>

                        E-mail do Gestor *

                    </label>

                    <small>

                        Informe o e-mail do gestor.

                    </small>

                    <input

                        value={dados.emailGestor || ""}

                        onChange={(e) =>
                            alterarCampo("emailGestor", e.target.value)
                        }

                    />

                </div>

            </div>

            <div className="linha">

                <div className="campo">

                    <label>

                        Fiscal do Contrato *

                    </label>

                    <small>

                        Nome do fiscal responsável.

                    </small>

                    <input

                        value={dados.fiscalContrato || ""}

                        onChange={(e) =>
                            alterarCampo("fiscalContrato", e.target.value)
                        }

                    />

                </div>

                <div className="campo">

                    <label>

                        E-mail do Fiscal *

                    </label>

                    <small>

                        Informe o e-mail do fiscal.

                    </small>

                    <input

                        value={dados.emailFiscal || ""}

                        onChange={(e) =>
                            alterarCampo("emailFiscal", e.target.value)
                        }

                    />

                </div>

            </div>

            <div className="linha">

                <div className="campo">

                    <label>

                        Gerente do Contrato *

                    </label>

                    <small>

                        Nome do gerente responsável.

                    </small>

                    <input

                        value={dados.gerenteContrato || ""}

                        onChange={(e) =>
                            alterarCampo("gerenteContrato", e.target.value)
                        }

                    />

                </div>

                <div className="campo">

                    <label>

                        E-mail do Gerente *

                    </label>

                    <small>

                        Informe o e-mail do gerente.

                    </small>

                    <input

                        value={dados.emailGerente || ""}

                        onChange={(e) =>
                            alterarCampo("emailGerente", e.target.value)
                        }

                    />

                </div>

            </div>

            <div className="linha">

                <div className="campo">

                    <label>

                        Coordenador do Contrato *

                    </label>

                    <small>

                        Nome do coordenador responsável.

                    </small>

                    <input

                        value={dados.coordenadorContrato || ""}

                        onChange={(e) =>
                            alterarCampo("coordenadorContrato", e.target.value)
                        }

                    />

                </div>

                <div className="campo">

                    <label>

                        E-mail do Coordenador *

                    </label>

                    <small>

                        Informe o e-mail do coordenador.

                    </small>

                    <input

                        value={dados.emailCoordenador || ""}

                        onChange={(e) =>
                            alterarCampo("emailCoordenador", e.target.value)
                        }

                    />

                </div>

            </div>

        </div>

    );

}

export default AlteracaoInformacoesManserv;