import { useState } from "react";

function ModalNovaFuncao({

    aberto,

    fechar,

    onEnviar

}) {

    const [funcao, setFuncao] = useState("");

    const [justificativa, setJustificativa] = useState("");

    if (!aberto) return null;

    function enviar() {

        if (!funcao.trim()) {

            alert("Informe o nome da função.");

            return;

        }

        if (!justificativa.trim()) {

            alert("Informe a justificativa.");

            return;

        }

        onEnviar({

            funcao,

            justificativa

        });

        setFuncao("");

        setJustificativa("");

        fechar();

    }

    return (

        <div className="modalOverlay">

            <div className="modalNovaFuncao">

                <h2>

                    📩 Solicitação de Nova Função

                </h2>

                <p>

                    A função informada não foi localizada na base corporativa.

                    Caso realmente seja necessária, informe abaixo a solicitação.

                </p>

                <div className="campo">

                    <label>

                        Nome da Função *

                    </label>

                    <input

                        value={funcao}

                        onChange={(e)=>setFuncao(e.target.value)}

                        placeholder="Ex.: Operador de Drone"

                    />

                </div>

                <div className="campo">

                    <label>

                        Justificativa *

                    </label>

                    <textarea

                        rows="5"

                        value={justificativa}

                        onChange={(e)=>setJustificativa(e.target.value)}

                        placeholder="Explique por que essa função precisa ser cadastrada."

                    />

                </div>

                <div className="rodape">

                    <button

                        className="cancelar"

                        onClick={fechar}

                    >

                        Cancelar

                    </button>

                    <button

                        className="salvar"

                        onClick={enviar}

                    >

                        Enviar Solicitação

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ModalNovaFuncao;