import { useEffect, useState } from "react";

function DadosSolicitacao({

    tipoSolicitacao,

    dadosSolicitacao,

    setDadosSolicitacao,

    setEtapa

}) {

    const [motivos, setMotivos] = useState([]);

    useEffect(() => {

        switch (tipoSolicitacao) {

            case "Revisão Anual":

                setMotivos([
                    "Vencimento do documento",
                    "Atualização periódica",
                    "Solicitação do cliente",
                    "Outro"
                ]);

                break;

            case "Adendo":

                setMotivos([
                    "Inclusão de nova função",
                    "Inclusão de novo risco",
                    "Inclusão de novo setor",
                    "Outro"
                ]);

                break;

            case "Lançamento LTCAT":

                setMotivos([
                    "Lançamento de avaliações quantitativas",
                    "Atualização do LTCAT",
                    "Outro"
                ]);

                break;

            case "Adequação":

                setMotivos([
                    "Alteração de atividade",
                    "Alteração de riscos",
                    "Alteração administrativa",
                    "Outro"
                ]);

                break;

            case "Correção":

                setMotivos([
                    "Erro identificado pela UT",
                    "Erro identificado pelo cliente",
                    "Erro interno",
                    "Outro"
                ]);

                break;

            default:

                setMotivos([]);

        }

    }, [tipoSolicitacao]);

    function alterarCampo(e){

        const {name,value}=e.target;

        setDadosSolicitacao({

            ...dadosSolicitacao,

            [name]:value

        });

    }

    return(

        <div className="card">

            <h2>📄 Dados da Solicitação</h2>

            <p className="descricao">

                Informe o motivo e descreva a solicitação.

            </p>

            <div className="campo">

                <label>

                    Motivo da Solicitação *

                </label>

                <select

                    name="motivo"

                    value={dadosSolicitacao.motivo || ""}

                    onChange={alterarCampo}

                >

                    <option value="">

                        Selecione...

                    </option>

                    {motivos.map((motivo)=>(

                        <option

                            key={motivo}

                            value={motivo}

                        >

                            {motivo}

                        </option>

                    ))}

                </select>

            </div>

            <div className="campo">

                <label>

                    Descrição da Solicitação *

                </label>

                <textarea

                    rows="6"

                    maxLength={1000}

                    name="descricao"

                    value={dadosSolicitacao.descricao || ""}

                    onChange={alterarCampo}

                    placeholder="Descreva detalhadamente a necessidade da solicitação."

                />

                <small>

                    {(dadosSolicitacao.descricao || "").length}/1000 caracteres

                </small>

            </div>

            <div className="campo">

                <label>

                    Possui algum anexo?

                </label>

                <select

                    name="possuiAnexo"

                    value={dadosSolicitacao.possuiAnexo || "nao"}

                    onChange={alterarCampo}

                >

                    <option value="nao">

                        Não

                    </option>

                    <option value="sim">

                        Sim

                    </option>

                </select>

            </div>

            {dadosSolicitacao.possuiAnexo==="sim" &&(

                <div className="campo">

                    <label>

                        Selecionar Arquivo

                    </label>

                    <input

                        type="file"

                        multiple

                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"

                    />

                    <small>

                        Formatos permitidos: PDF, Word, Excel, JPG e PNG.

                    </small>

                </div>

            )}

            <div className="rodape">

                <button

                    className="cancelar"

                    onClick={()=>setEtapa(2)}

                >

                    ← Voltar

                </button>

                <button

    className="salvar"

    onClick={() => {

    if (tipoSolicitacao === "Lançamento LTCAT") {

    setEtapa(5.5);

    return;

}

if (tipoSolicitacao === "Revisão Anual") {

    setEtapa(5.6);

    return;

}

if (

    tipoSolicitacao === "Adequação" ||

    tipoSolicitacao === "Correção"

) {

    setEtapa(5.7);

    return;

}

setEtapa(4);

}}

>

    Continuar →

</button>

            </div>

        </div>

    );

}

export default DadosSolicitacao;