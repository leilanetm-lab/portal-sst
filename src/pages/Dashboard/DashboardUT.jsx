import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../firebase/firebaseConfig";

import { useNavigate } from "react-router-dom";

import "./DashboardUT.css";


function DashboardUT() {

    const navigate = useNavigate();


    const [
        usuario,
        setUsuario
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    /* ============================
       CARREGAR USUÁRIO LOGADO
    ============================ */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setUsuario(null);

                        setLoading(false);

                        return;

                    }


                    try {

                        const referencia =
                            doc(
                                db,
                                "Usuarios",
                                usuarioFirebase.uid
                            );


                        const documento =
                            await getDoc(
                                referencia
                            );


                        if (
                            documento.exists()
                        ) {

                            setUsuario(
                                documento.data()
                            );

                        }

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao carregar usuário da UT:",
                            erro
                        );

                    }

                    finally {

                        setLoading(false);

                    }

                }
            );


        return () => {

            cancelar();

        };

    }, []);


    /* ============================
       CARREGANDO
    ============================ */

    if (loading) {

        return (

            <div className="dashboardUT">

                <div className="dashboardUTLoading">

                    Carregando...

                </div>

            </div>

        );

    }


    /* ============================
       DADOS DA UT
    ============================ */

    const nomeUT =
        usuario?.nomeUT ||
        usuario?.nome ||
        "Unidade";


    const numeroUT =
        usuario?.numeroUT ||
        "";


    /* ============================
       SAUDAÇÃO
    ============================ */

    const hora =
        new Date().getHours();


    let saudacao = "Olá";


    if (hora < 12) {

        saudacao = "Bom dia";

    }

    else if (hora < 18) {

        saudacao = "Boa tarde";

    }

    else {

        saudacao = "Boa noite";

    }


    /* ============================
       NAVEGAÇÃO DOS CARDS
    ============================ */

    function abrirNovaSolicitacao() {

        navigate(
            "/solicitacoes/nova"
        );

    }


    function abrirMinhasSolicitacoes() {

        navigate(
            "/solicitacoes"
        );

    }


    function abrirBiblioteca() {

        navigate(
            "/biblioteca"
        );

    }


    function abrirNotificacoes() {

        /*
        A tela específica de notificações
        ainda não foi criada.

        Por enquanto direcionamos para
        Minhas Solicitações, onde a UT
        consegue acompanhar pendências
        e status.
        */

        navigate(
            "/solicitacoes"
        );

    }


    /* ============================
       CARD CLICÁVEL
    ============================ */

    function executarCard(
        funcao
    ) {

        funcao();

    }


    return (

        <div className="dashboardUT">


            {/* ============================
                CABEÇALHO
            ============================ */}

            <div className="dashboardUTTopo">

                <div>

                    <h1>

                        {saudacao},{" "}

                        {nomeUT} 👋

                    </h1>


                    <p>

                        Acompanhe as solicitações
                        e documentos da sua Unidade
                        de Trabalho.

                    </p>

                </div>


                <div className="identificacaoUT">

                    <span>

                        UT

                    </span>


                    <strong>

                        {numeroUT}

                    </strong>

                </div>

            </div>


            {/* ============================
                CARDS
            ============================ */}

            <div className="dashboardUTCards">


                {/* ============================
                    NOVA SOLICITAÇÃO
                ============================ */}

                <div

                    className="dashboardUTCard"

                    role="button"

                    tabIndex={0}

                    onClick={
                        abrirNovaSolicitacao
                    }

                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter" ||
                            e.key === " "
                        ) {

                            executarCard(
                                abrirNovaSolicitacao
                            );

                        }

                    }}

                >

                    <div className="iconeCard">

                        ➕

                    </div>


                    <div>

                        <strong>

                            Nova Solicitação

                        </strong>


                        <span>

                            Abra uma nova solicitação
                            para a Engenharia.

                        </span>

                    </div>

                </div>


                {/* ============================
                    MINHAS SOLICITAÇÕES
                ============================ */}

                <div

                    className="dashboardUTCard"

                    role="button"

                    tabIndex={0}

                    onClick={
                        abrirMinhasSolicitacoes
                    }

                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter" ||
                            e.key === " "
                        ) {

                            executarCard(
                                abrirMinhasSolicitacoes
                            );

                        }

                    }}

                >

                    <div className="iconeCard">

                        📋

                    </div>


                    <div>

                        <strong>

                            Minhas Solicitações

                        </strong>


                        <span>

                            Acompanhe o andamento
                            das suas solicitações.

                        </span>

                    </div>

                </div>


                {/* ============================
                    BIBLIOTECA
                ============================ */}

                <div

                    className="dashboardUTCard"

                    role="button"

                    tabIndex={0}

                    onClick={
                        abrirBiblioteca
                    }

                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter" ||
                            e.key === " "
                        ) {

                            executarCard(
                                abrirBiblioteca
                            );

                        }

                    }}

                >

                    <div className="iconeCard">

                        📚

                    </div>


                    <div>

                        <strong>

                            Minha Biblioteca

                        </strong>


                        <span>

                            Consulte os documentos
                            publicados para sua UT.

                        </span>

                    </div>

                </div>


                {/* ============================
                    NOTIFICAÇÕES
                ============================ */}

                <div

                    className="dashboardUTCard"

                    role="button"

                    tabIndex={0}

                    onClick={
                        abrirNotificacoes
                    }

                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter" ||
                            e.key === " "
                        ) {

                            executarCard(
                                abrirNotificacoes
                            );

                        }

                    }}

                >

                    <div className="iconeCard">

                        🔔

                    </div>


                    <div>

                        <strong>

                            Notificações

                        </strong>


                        <span>

                            Veja avisos e pendências
                            da sua unidade.

                        </span>

                    </div>

                </div>


            </div>


            {/* ============================
                INFORMAÇÕES DA UT
            ============================ */}

            <div className="dashboardUTInfo">

                <h2>

                    📌 Unidade de Trabalho

                </h2>


                <div className="dashboardUTInfoGrid">


                    <div>

                        <span>

                            Unidade

                        </span>


                        <strong>

                            {nomeUT}

                        </strong>

                    </div>


                    <div>

                        <span>

                            Número da UT

                        </span>


                        <strong>

                            {numeroUT}

                        </strong>

                    </div>


                    <div>

                        <span>

                            Perfil

                        </span>


                        <strong>

                            Usuário UT

                        </strong>

                    </div>


                </div>

            </div>


        </div>

    );

}


export default DashboardUT;