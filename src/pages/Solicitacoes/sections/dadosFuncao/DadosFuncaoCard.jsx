import { useState } from "react";

import AutocompleteFuncao from "../../../../components/AutocompleteFuncao";
import ModalNovaFuncao from "../../../../components/ModalNovaFuncao";

function DadosFuncaoCard({

    dadosFuncao,

    setDadosFuncao

}) {

    const [modalAberto, setModalAberto] = useState(false);

    function alterarCampo(e) {

        setDadosFuncao({

            ...dadosFuncao,

            [e.target.name]: e.target.value

        });

    }

    function selecionarFuncao(funcao) {

        setDadosFuncao({

            ...dadosFuncao,

            funcao

        });

    }

    function solicitarNovaFuncao(dados) {

        console.log("Solicitação de nova função:", dados);

        alert(
            "Solicitação enviada com sucesso!\n\nA nova função será avaliada pela equipe corporativa antes de ser cadastrada no Portal SST."
        );

        setModalAberto(false);

    }

    return (

        <div className="card">

            <h2>

                👷 Função

            </h2>

            <p className="descricao">

                Selecione a função cadastrada. Caso não encontre a função desejada, solicite seu cadastro.

            </p>

            <div className="linha">

                <div className="campo">

                    <label>

    Função <span className="obrigatorio">*</span>

</label>

                    <AutocompleteFuncao

                        value={dadosFuncao.funcao || ""}

                        onChange={selecionarFuncao}

                        abrirModal={() => setModalAberto(true)}

                    />

                </div>

                <div className="campo">

                    <label>

    Setor <span className="obrigatorio">*</span>

</label>

                    <input

                        name="setor"

                        value={dadosFuncao.setor || ""}

                        onChange={alterarCampo}

                        placeholder="Ex.: Produção, Manutenção, Limpeza..."

                    />

                </div>

            </div>

            <div className="mensagem info">

                💡 Caso a função não esteja disponível na lista, clique em
                <strong> "Solicitar nova função"</strong>.
                A solicitação será enviada para análise da equipe corporativa antes da inclusão no Portal SST.

            </div>

            <ModalNovaFuncao

                aberto={modalAberto}

                fechar={() => setModalAberto(false)}

                onEnviar={solicitarNovaFuncao}

            />

        </div>

    );

}

export default DadosFuncaoCard;