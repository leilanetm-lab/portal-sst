import { useNavigate } from "react-router-dom";

import "./Configuracoes.css";


function Configuracoes() {

    const navigate =
        useNavigate();


    return (

        <div className="configuracoesPagina">


            {/* ============================
                CABEÇALHO
            ============================ */}

            <div className="configuracoesCabecalho">

                <h1>
                    ⚙️ Configurações
                </h1>

                <p>
                    Gerencie as configurações da sua conta
                    no Portal SST.
                </p>

            </div>


            {/* ============================
                CARDS
            ============================ */}

            <div className="configuracoesGrid">


                {/* ============================
                    MEU PERFIL
                ============================ */}

                <div
                    className="configuracaoCard"
                    onClick={() =>
                        navigate("/perfil")
                    }
                >

                    <div className="configuracaoIcone">

                        👤

                    </div>


                    <div className="configuracaoConteudo">

                        <h2>
                            Meu Perfil
                        </h2>

                        <p>
                            Consulte seus dados pessoais,
                            perfil de acesso e Unidade
                            de Trabalho.
                        </p>

                    </div>


                    <div className="configuracaoSeta">

                        →

                    </div>

                </div>


                {/* ============================
                    SEGURANÇA
                ============================ */}

                <div
                    className="configuracaoCard"
                    onClick={() =>
                        navigate("/seguranca")
                    }
                >

                    <div className="configuracaoIcone">

                        🔐

                    </div>


                    <div className="configuracaoConteudo">

                        <h2>
                            Segurança
                        </h2>

                        <p>
                            Gerencie sua senha e as
                            configurações de segurança
                            da sua conta.
                        </p>

                    </div>


                    <div className="configuracaoSeta">

                        →

                    </div>

                </div>


                {/* ============================
                    NOTIFICAÇÕES
                ============================ */}

                <div
                    className="configuracaoCard"
                    onClick={() =>
                        navigate("/notificacoes")
                    }
                >

                    <div className="configuracaoIcone">

                        🔔

                    </div>


                    <div className="configuracaoConteudo">

                        <h2>
                            Notificações
                        </h2>

                        <p>
                            Configure como deseja receber
                            avisos e notificações do
                            Portal SST.
                        </p>

                    </div>


                    <div className="configuracaoSeta">

                        →

                    </div>

                </div>


            </div>


            {/* ============================
                INFORMAÇÃO DA UT
            ============================ */}

            <div className="configuracoesAviso">

                <div className="configuracoesAvisoIcone">

                    ℹ️

                </div>


                <div>

                    <strong>
                        Configurações da Unidade
                    </strong>

                    <p>
                        A Unidade de Trabalho vinculada
                        ao seu usuário é definida pelo
                        administrador do Portal SST e não
                        pode ser alterada por este perfil.
                    </p>

                </div>

            </div>


        </div>

    );

}


export default Configuracoes;