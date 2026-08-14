import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../../firebase/firebaseConfig";

import {
    listarSolicitacoes
} from "../../../services/solicitacoesService";

import "./MinhasSolicitacoes.css";


function MinhasSolicitacoes() {

    const [solicitacoes, setSolicitacoes] =
        useState([]);

    const [carregando, setCarregando] =
        useState(true);

    const [erro, setErro] =
        useState("");

    const [numeroUT, setNumeroUT] =
        useState("");

    const [nomeUT, setNomeUT] =
        useState("");

    const navigate =
        useNavigate();


    /* =====================================================
       CARREGAR USUÁRIO E SOLICITAÇÕES
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
                                "Usuário não encontrado."
                            );

                        }


                        const dadosUsuario =
                            usuarioDoc.data();


                        console.log(
                            "USUÁRIO LOGADO:",
                            dadosUsuario
                        );


                        /* =================================
                           GARANTIR PERFIL UT
                        ================================= */

                        if (
                            dadosUsuario.perfil !== "UT"
                        ) {

                            console.warn(
                                "Usuário não possui perfil UT."
                            );

                        }


                        /* =================================
                           NÚMERO DA UT DO USUÁRIO
                        ================================= */

                        const utUsuario =
                            String(
                                dadosUsuario.numeroUT ||
                                ""
                            ).trim();


                        const nomeUnidade =
                            dadosUsuario.nomeUT ||
                            dadosUsuario.nome ||
                            "";


                        if (!utUsuario) {

                            setErro(
                                "Sua conta não possui uma Unidade de Trabalho vinculada."
                            );

                            setSolicitacoes([]);

                            return;

                        }


                        setNumeroUT(
                            utUsuario
                        );


                        setNomeUT(
                            nomeUnidade
                        );


                        console.log(
                            "================================="
                        );

                        console.log(
                            "UT DO USUÁRIO:",
                            utUsuario
                        );

                        console.log(
                            "NOME DA UT:",
                            nomeUnidade
                        );

                        console.log(
                            "================================="
                        );


                        /* =================================
                           BUSCAR SOLICITAÇÕES
                        ================================= */

                        const todas =
                            await listarSolicitacoes();


                        console.log(
                            "TODAS AS SOLICITAÇÕES:",
                            todas
                        );


                        /* =================================
                           FILTRAR PELA UT
                           
                           REGRA:
                           
                           1. dadosCadastro.numeroUT
                              é o campo PRINCIPAL.

                           2. item.ut é utilizado apenas
                              para compatibilidade com
                              registros antigos.

                           3. criadoPorUid NÃO participa
                              do filtro.
                        ================================= */

                        const minhas =
                            todas.filter(
                                (item) => {

                                    const numeroUTSolicitacao =

                                        item.dadosCadastro
                                            ?.numeroUT

                                        ||

                                        item.ut

                                        ||

                                        "";


                                    const utSolicitacao =
                                        String(
                                            numeroUTSolicitacao
                                        ).trim();


                                    const pertence =
                                        utSolicitacao ===
                                        utUsuario;


                                    console.log(
                                        "FILTRO:",
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
                            "================================="
                        );

                        console.log(
                            "SOLICITAÇÕES DA UT:",
                            minhas
                        );

                        console.log(
                            "================================="
                        );


                        setSolicitacoes(
                            minhas
                        );

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao carregar solicitações:",
                            erro
                        );


                        setErro(
                            "Não foi possível carregar as solicitações da sua Unidade de Trabalho."
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
       SLA
    ===================================================== */

    function calcularSLA(
        criadoEm
    ) {

        if (!criadoEm) {

            return "-";

        }


        let data;


        if (
            typeof criadoEm.toDate ===
            "function"
        ) {

            data =
                criadoEm.toDate();

        }

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

                    📄 Minhas Solicitações

                </h2>


                <p>

                    Carregando suas solicitações...

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

                    📄 Minhas Solicitações

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


            <h2>

                📄 Minhas Solicitações
                {" "}
                ({solicitacoes.length})

            </h2>


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


            {solicitacoes.length === 0 ? (

                <div className="mensagem">

                    Você ainda não possui
                    solicitações cadastradas
                    para sua Unidade de Trabalho.

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

                        {solicitacoes.map(
                            (item) => (

                                <tr
                                    key={item.id}
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
                                            item.dadosCadastro
                                                ?.nomeUT
                                            ||
                                            item.nomeUT
                                            ||
                                            item.ut
                                            ||
                                            "-"
                                        }

                                    </td>


                                    {/* DOCUMENTO */}

                                    <td>

                                        {
                                            item.dadosSolicitacao
                                                ?.documentosGerados
                                                ?.length

                                            ?

                                            item.dadosSolicitacao
                                                .documentosGerados
                                                .join(", ")

                                            :

                                            item.documentosGerados
                                                ?.length

                                            ?

                                            item.documentosGerados
                                                .join(", ")

                                            :

                                            "-"
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
                        )}

                    </tbody>

                </table>

            )}

        </div>

    );

}


export default MinhasSolicitacoes;