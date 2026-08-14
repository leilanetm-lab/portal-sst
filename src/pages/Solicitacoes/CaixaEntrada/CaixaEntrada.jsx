import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
} from "../../../firebase/firebaseConfig";

import "./CaixaEntrada.css";

import {
    listarSolicitacoes
} from "../../../services/solicitacoesService";


function CaixaEntrada() {

    const [
        solicitacoes,
        setSolicitacoes
    ] = useState([]);


    const [
        carregando,
        setCarregando
    ] = useState(true);


    const [
        erro,
        setErro
    ] = useState("");


    const [
        numeroUT,
        setNumeroUT
    ] = useState("");


    const [
        nomeUT,
        setNomeUT
    ] = useState("");


    const [
        perfil,
        setPerfil
    ] = useState("");


    const navigate =
        useNavigate();


    /* =====================================================
       CARREGAR SOLICITAÇÕES
    ===================================================== */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuario) => {

                    if (!usuario) {

                        setSolicitacoes([]);

                        setCarregando(false);

                        return;

                    }


                    try {

                        setCarregando(true);

                        setErro("");


                        /* =================================
                           BUSCAR USUÁRIO LOGADO
                        ================================= */

                        const usuarioRef =
                            doc(
                                db,
                                "Usuarios",
                                usuario.uid
                            );


                        const usuarioDoc =
                            await getDoc(
                                usuarioRef
                            );


                        if (!usuarioDoc.exists()) {

                            throw new Error(
                                "Cadastro do usuário não encontrado."
                            );

                        }


                        const dadosUsuario =
                            usuarioDoc.data();


                        console.log(
                            "USUÁRIO LOGADO - CAIXA DE ENTRADA:",
                            dadosUsuario
                        );


                        const perfilUsuario =
                            dadosUsuario.perfil ||
                            "";


                        const utUsuario =
                            String(
                                dadosUsuario.numeroUT ||
                                ""
                            ).trim();


                        const nomeUnidade =
                            dadosUsuario.nomeUT ||
                            dadosUsuario.nome ||
                            "";


                        setPerfil(
                            perfilUsuario
                        );


                        setNumeroUT(
                            utUsuario
                        );


                        setNomeUT(
                            nomeUnidade
                        );


                        /* =================================
                           BUSCAR TODAS AS SOLICITAÇÕES
                        ================================= */

                        const todas =
                            await listarSolicitacoes();


                        console.log(
                            "TOTAL DE SOLICITAÇÕES:",
                            todas.length
                        );


                        /* =================================
                           ADMINISTRADOR
                           
                           ADMIN PODE VER TODAS
                        ================================= */

                        if (
                            perfilUsuario === "ADMIN"
                        ) {

                            console.log(
                                "USUÁRIO ADMIN - MOSTRANDO TODAS AS SOLICITAÇÕES."
                            );


                            setSolicitacoes(
                                todas
                            );


                            return;

                        }


                        /* =================================
                           USUÁRIO UT
                           
                           UT SÓ PODE VER SUA PRÓPRIA UT
                        ================================= */

                        if (
                            perfilUsuario === "UT"
                        ) {

                            if (!utUsuario) {

                                console.error(
                                    "Usuário UT não possui numeroUT."
                                );


                                setSolicitacoes([]);

                                setErro(
                                    "Sua conta não possui uma Unidade de Trabalho vinculada."
                                );

                                return;

                            }


                            console.log(
                                "===================================="
                            );

                            console.log(
                                "UT LOGADA:",
                                utUsuario
                            );

                            console.log(
                                "NOME DA UT:",
                                nomeUnidade
                            );

                            console.log(
                                "===================================="
                            );


                            /* =================================
                               FILTRO DEFINITIVO
                               
                               O CAMPO OFICIAL DA SOLICITAÇÃO
                               É item.ut
                            ================================= */

                            const minhas =
                                todas.filter(
                                    (item) => {

                                        const utSolicitacao =
                                            String(
                                                item.ut ||
                                                ""
                                            ).trim();


                                        const pertence =
                                            utSolicitacao ===
                                            utUsuario;


                                        console.log(
                                            "FILTRO SOLICITAÇÃO:",
                                            {
                                                protocolo:
                                                    item.protocolo,

                                                utSolicitacao:
                                                    utSolicitacao,

                                                utUsuario:
                                                    utUsuario,

                                                pertence:
                                                    pertence
                                            }
                                        );


                                        return pertence;

                                    }
                                );


                            console.log(
                                "===================================="
                            );

                            console.log(
                                "SOLICITAÇÕES DA UT:",
                                minhas
                            );

                            console.log(
                                "===================================="
                            );


                            setSolicitacoes(
                                minhas
                            );


                            return;

                        }


                        /* =================================
                           PERFIL NÃO IDENTIFICADO
                        ================================= */

                        console.warn(
                            "Perfil não reconhecido:",
                            perfilUsuario
                        );


                        setSolicitacoes([]);

                        setErro(
                            "Não foi possível identificar o perfil de acesso."
                        );

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao carregar caixa de entrada:",
                            erro
                        );


                        setErro(
                            "Não foi possível carregar as solicitações."
                        );

                    }

                    finally {

                        setCarregando(false);

                    }

                }
            );


        return () => {

            cancelar();

        };

    }, []);


    /* =====================================================
       NOME DA UT
    ===================================================== */

    function obterUT(item) {

        if (
            item.dadosCadastro?.nomeUT
        ) {

            return (
                item.dadosCadastro.nomeUT
            );

        }


        if (
            item.nomeUT
        ) {

            return (
                item.nomeUT
            );

        }


        if (
            item.ut
        ) {

            return (
                item.ut
            );

        }


        return "-";

    }


    /* =====================================================
       DOCUMENTOS
    ===================================================== */

    function obterDocumentos(item) {

        if (
            Array.isArray(
                item.dadosSolicitacao
                    ?.documentosGerados
            )
        ) {

            if (
                item.dadosSolicitacao
                    .documentosGerados
                    .length > 0
            ) {

                return (
                    item.dadosSolicitacao
                        .documentosGerados
                        .join(", ")
                );

            }

        }


        if (
            Array.isArray(
                item.documentosGerados
            )
        ) {

            if (
                item.documentosGerados.length > 0
            ) {

                return (
                    item.documentosGerados
                        .join(", ")
                );

            }

        }


        return "-";

    }


    /* =====================================================
       SLA
    ===================================================== */

    function calcularSLA(
        criadoEm
    ) {

        if (!criadoEm) {

            return "-";

        }


        let data;


        /* Firebase Timestamp */

        if (
            criadoEm &&
            typeof criadoEm.toDate ===
            "function"
        ) {

            data =
                criadoEm.toDate();

        }

        /* String / Date */

        else {

            data =
                new Date(
                    criadoEm
                );

        }


        if (
            isNaN(
                data.getTime()
            )
        ) {

            return "-";

        }


        const hoje =
            new Date();


        const dias =
            Math.floor(

                (
                    hoje - data
                )
                /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )

            );


        return (

            `${dias} dia${dias !== 1 ? "s" : ""}`

        );

    }


    /* =====================================================
       CARREGANDO
    ===================================================== */

    if (carregando) {

        return (

            <div className="caixaEntrada">

                <h2>

                    📥 Caixa de Entrada

                </h2>


                <p>

                    Carregando solicitações...

                </p>

            </div>

        );

    }


    /* =====================================================
       ERRO
    ===================================================== */

    if (erro) {

        return (

            <div className="caixaEntrada">

                <h2>

                    📥 Caixa de Entrada

                </h2>


                <div className="mensagem erro">

                    ❌ {erro}

                </div>

            </div>

        );

    }


    /* =====================================================
       TELA
    ===================================================== */

    return (

        <div className="caixaEntrada">


            {/* ==========================================
                CABEÇALHO
            ========================================== */}

            <div>

                <h2>

                    📥 Minhas Solicitações
                    {" "}
                    ({solicitacoes.length})

                </h2>


                {perfil === "UT" && (

                    <p>

                        Unidade de Trabalho:
                        {" "}

                        <strong>
                            {nomeUT}
                        </strong>

                        {" "}

                        (
                        {numeroUT}
                        )

                    </p>

                )}

            </div>


            {/* ==========================================
                NENHUMA SOLICITAÇÃO
            ========================================== */}

            {solicitacoes.length === 0 ? (

                <div className="mensagem">

                    Nenhuma solicitação
                    encontrada.

                </div>

            ) : (

                <table
                    className="tabelaSolicitacoes"
                >

                    <thead>

                        <tr>

                            <th>
                                Protocolo
                            </th>

                            <th>
                                UT
                            </th>

                            <th>
                                Documento
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                SLA
                            </th>

                            <th>
                                Ação
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {

                            solicitacoes.map(
                                (item) => (

                                    <tr
                                        key={
                                            item.id
                                        }
                                    >

                                        {/* PROTOCOLO */}

                                        <td>

                                            {
                                                item.protocolo
                                                ||
                                                "-"
                                            }

                                        </td>


                                        {/* UT */}

                                        <td>

                                            {
                                                obterUT(
                                                    item
                                                )
                                            }

                                        </td>


                                        {/* DOCUMENTO */}

                                        <td>

                                            {
                                                obterDocumentos(
                                                    item
                                                )
                                            }

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            {
                                                item.status
                                                ||
                                                "-"
                                            }

                                        </td>


                                        {/* SLA */}

                                        <td>

                                            {
                                                calcularSLA(
                                                    item.criadoEm
                                                )
                                            }

                                        </td>


                                        {/* AÇÃO */}

                                        <td>

                                            <button

                                                type="button"

                                                className="btnAbrir"

                                                onClick={() =>
                                                    navigate(
                                                        `/solicitacoes/${item.id}`
                                                    )
                                                }

                                            >

                                                Abrir

                                            </button>

                                        </td>

                                    </tr>

                                )

                            )

                        }

                    </tbody>

                </table>

            )}

        </div>

    );

}


export default CaixaEntrada;