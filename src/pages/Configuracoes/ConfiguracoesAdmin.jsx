import {
    useNavigate
} from "react-router-dom";

import "./ConfiguracoesAdmin.css";


function ConfiguracoesAdmin() {

    const navigate =
        useNavigate();


    return (

        <div className="configuracoesAdminPagina">


            {/* ============================
                CABEÇALHO
            ============================ */}

            <div className="configuracoesAdminCabecalho">

                <h1>
                    ⚙️ Configurações
                </h1>

                <p>
                    Gerencie as configurações
                    administrativas do Portal SST.
                </p>

            </div>


            {/* ============================
                CARDS
            ============================ */}

            <div className="configuracoesAdminGrid">


                {/* ============================
                    MEU PERFIL
                ============================ */}

                <div
                    className="configuracaoAdminCard"
                    onClick={() =>
                        navigate("/perfil")
                    }
                >

                    <div className="configuracaoAdminIcone">
                        👤
                    </div>


                    <div className="configuracaoAdminConteudo">

                        <h2>
                            Meu Perfil
                        </h2>

                        <p>
                            Consulte seus dados pessoais,
                            perfil de acesso e informações
                            da sua conta administrativa.
                        </p>

                    </div>


                    <div className="configuracaoAdminSeta">
                        →
                    </div>

                </div>


                {/* ============================
                    SEGURANÇA
                ============================ */}

                <div
                    className="configuracaoAdminCard"
                    onClick={() =>
                        navigate("/seguranca")
                    }
                >

                    <div className="configuracaoAdminIcone">
                        🔐
                    </div>


                    <div className="configuracaoAdminConteudo">

                        <h2>
                            Segurança
                        </h2>

                        <p>
                            Gerencie sua senha e as
                            configurações de segurança
                            da sua conta.
                        </p>

                    </div>


                    <div className="configuracaoAdminSeta">
                        →
                    </div>

                </div>


                {/* ============================
                    USUÁRIOS
                ============================ */}

                <div
                    className="configuracaoAdminCard"
                    onClick={() =>
                        navigate("/usuarios")
                    }
                >

                    <div className="configuracaoAdminIcone">
                        👥
                    </div>


                    <div className="configuracaoAdminConteudo">

                        <h2>
                            Usuários
                        </h2>

                        <p>
                            Cadastre, consulte, ative,
                            desative e redefina senhas
                            dos usuários do Portal SST.
                        </p>

                    </div>


                    <div className="configuracaoAdminSeta">
                        →
                    </div>

                </div>


                {/* ============================
                    UNIDADES DE TRABALHO
                ============================ */}

                <div
                    className="configuracaoAdminCard"
                    onClick={() =>
                        navigate("/cadastro-ut")
                    }
                >

                    <div className="configuracaoAdminIcone">
                        🏢
                    </div>


                    <div className="configuracaoAdminConteudo">

                        <h2>
                            Unidades de Trabalho
                        </h2>

                        <p>
                            Consulte e gerencie as
                            Unidades de Trabalho
                            cadastradas no Portal SST.
                        </p>

                    </div>


                    <div className="configuracaoAdminSeta">
                        →
                    </div>

                </div>


                {/* ============================
                    NOTIFICAÇÕES
                ============================ */}

                <div
                    className="configuracaoAdminCard"
                    onClick={() =>
                        navigate("/notificacoes")
                    }
                >

                    <div className="configuracaoAdminIcone">
                        🔔
                    </div>


                    <div className="configuracaoAdminConteudo">

                        <h2>
                            Notificações
                        </h2>

                        <p>
                            Configure como deseja
                            receber avisos e notificações
                            do Portal SST.
                        </p>

                    </div>


                    <div className="configuracaoAdminSeta">
                        →
                    </div>

                </div>


            </div>


            {/* ============================
                AVISO ADMINISTRATIVO
            ============================ */}

            <div className="configuracoesAdminAviso">

                <div className="configuracoesAdminAvisoIcone">
                    🛡️
                </div>


                <div>

                    <strong>
                        Acesso Administrativo
                    </strong>

                    <p>
                        Você está acessando as
                        configurações administrativas
                        do Portal SST. As alterações
                        realizadas nesta área podem
                        afetar usuários e Unidades
                        de Trabalho do sistema.
                    </p>

                </div>

            </div>


        </div>

    );

}


export default ConfiguracoesAdmin;