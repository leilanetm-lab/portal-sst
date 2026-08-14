import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../firebase/firebaseConfig";

import "./MesaTrabalho.css";

import SolicitacoesTabs
    from "../Solicitacoes/SolicitacoesTabs/SolicitacoesTabs";

import CaixaEntrada
    from "../Solicitacoes/CaixaEntrada/CaixaEntrada";

import MinhasSolicitacoes
    from "../Solicitacoes/MinhasSolicitacoes/MinhasSolicitacoes";


function MesaTrabalho() {

    const [
        abaAtual,
        setAbaAtual
    ] = useState("entrada");


    const [
        perfil,
        setPerfil
    ] = useState("");


    const [
        carregandoPerfil,
        setCarregandoPerfil
    ] = useState(true);


    const navigate =
        useNavigate();


    /* ============================
       IDENTIFICAR USUÁRIO
    ============================ */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setPerfil("");

                        setCarregandoPerfil(false);

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

                            const dados =
                                documento.data();


                            const perfilUsuario =
                                dados.perfil || "";


                            setPerfil(
                                perfilUsuario
                            );


                            /* ============================
                               UT → MINHAS SOLICITAÇÕES
                            ============================ */

                            if (
                                perfilUsuario === "UT"
                            ) {

                                setAbaAtual(
                                    "minhas"
                                );

                            }

                        }

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao identificar perfil:",
                            erro
                        );

                    }

                    finally {

                        setCarregandoPerfil(
                            false
                        );

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

    if (carregandoPerfil) {

        return (

            <div className="mesaTrabalho">

                <p>
                    Carregando...
                </p>

            </div>

        );

    }


    return (

        <div className="mesaTrabalho">


            {/* ============================
                CABEÇALHO
            ============================ */}

            <div className="cabecalhoMesa">

                <h1>
                    📋 Mesa de Trabalho
                </h1>

                <p>
                    Central de gerenciamento das
                    solicitações de PGR, PCMSO e LTCAT.
                </p>

            </div>


            {/* ============================
                ABAS
                SOMENTE ADMIN
            ============================ */}

            <SolicitacoesTabs

                abaAtual={abaAtual}

                setAbaAtual={setAbaAtual}

            />


            {/* ============================
                ADMIN
                CAIXA DE ENTRADA
            ============================ */}

            {perfil !== "UT" &&
                abaAtual === "entrada" && (

                    <CaixaEntrada />

                )}


            {/* ============================
                UT
                MINHAS SOLICITAÇÕES
            ============================ */}

            {perfil === "UT" &&
                abaAtual === "minhas" && (

                    <CaixaEntrada />

                )}


            {/* ============================
                ADMIN
                MINHAS SOLICITAÇÕES
            ============================ */}

            {perfil !== "UT" &&
                abaAtual === "minhas" && (

                    <MinhasSolicitacoes />

                )}


            {/* ============================
                ADMIN
                NOVA SOLICITAÇÃO
            ============================ */}

            {perfil !== "UT" &&
                abaAtual === "nova" && (

                    <div className="cardMesa">

                        <h2>
                            ➕ Nova Solicitação
                        </h2>

                        <p>
                            Clique abaixo para abrir o formulário.
                        </p>

                        <button

                            className="btnNova"

                            onClick={() =>
                                navigate(
                                    "/solicitacoes/nova"
                                )
                            }

                        >

                            Abrir Formulário

                        </button>

                    </div>

                )}

        </div>

    );

}


export default MesaTrabalho;