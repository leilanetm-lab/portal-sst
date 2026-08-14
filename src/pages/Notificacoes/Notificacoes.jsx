import {
    useNavigate
} from "react-router-dom";

import "./Notificacoes.css";


function Notificacoes() {

    const navigate =
        useNavigate();


    return (

        <div className="notificacoesPagina">


            {/* ============================
                VOLTAR
            ============================ */}

            <button

                className="btnVoltarNotificacoes"

                onClick={() =>
                    navigate(
                        "/configuracoes"
                    )
                }

            >

                ← Voltar para Configurações

            </button>


            {/* ============================
                CABEÇALHO
            ============================ */}

            <div className="notificacoesCabecalho">

                <h1>
                    🔔 Notificações
                </h1>

                <p>
                    Consulte os avisos e
                    comunicações da sua conta.
                </p>

            </div>


            {/* ============================
                CONTEÚDO
            ============================ */}

            <div className="notificacoesCard">

                <div className="notificacaoVaziaIcone">

                    🔔

                </div>


                <h2>
                    Nenhuma notificação
                </h2>


                <p>

                    No momento, não existem
                    novas notificações para sua
                    Unidade de Trabalho.

                </p>

            </div>


        </div>

    );

}


/* ============================
   EXPORTAÇÃO
============================ */

export default Notificacoes;