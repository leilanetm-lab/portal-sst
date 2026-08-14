import "../Solicitacoes.css";

function RevisaoAnual({

    revisaoAnual,

    setRevisaoAnual,

    setEtapa

}) {

    const possuiAlteracao = revisaoAnual.possuiAlteracao || "";

    return (

        <div className="cardFormulario">

            <h2>Revisão Anual</h2>

            <p className="subtituloRevisao">

                Como será realizada esta revisão?

            </p>

            <div className="cardsRevisao">

                <label
                    className={`cardRevisao ${possuiAlteracao === "nao" ? "selecionado" : ""}`}
                >

                    <input

                        type="radio"

                        name="possuiAlteracao"

                        value="nao"

                        checked={possuiAlteracao === "nao"}

                        onChange={(e) =>

                            setRevisaoAnual({

                                ...revisaoAnual,

                                possuiAlteracao: e.target.value

                            })

                        }

                    />

                    <div>

                        <h3>Apenas atualização da vigência</h3>

                        <p>

                            Não haverá alteração de riscos, descrição das atividades
                            ou local de trabalho.

                        </p>

                    </div>

                </label>

                <label
                    className={`cardRevisao ${possuiAlteracao === "sim" ? "selecionado" : ""}`}
                >

                    <input

                        type="radio"

                        name="possuiAlteracao"

                        value="sim"

                        checked={possuiAlteracao === "sim"}

                        onChange={(e) =>

                            setRevisaoAnual({

                                ...revisaoAnual,

                                possuiAlteracao: e.target.value

                            })

                        }

                    />

                    <div>

                        <h3>Alteração técnica</h3>

                        <p>

                            Será necessário revisar riscos, descrição das atividades
                            ou local de trabalho.

                        </p>

                    </div>

                </label>

            </div>

            <div className="acoes">

                <button

                    className="secundario"

                    onClick={() => setEtapa(3)}

                >

                    Voltar

                </button>

                <button

                    className="salvar"

                    disabled={!possuiAlteracao}

                    onClick={() =>

                        setEtapa(

                            possuiAlteracao === "sim"

                                ? 4

                                : 6

                        )

                    }

                >

                    Avançar

                </button>

            </div>

        </div>

    );

}

export default RevisaoAnual;