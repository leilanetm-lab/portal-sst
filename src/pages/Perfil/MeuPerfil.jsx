import { useEffect, useState } from "react";

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

import {
    listarUTs
} from "../../services/utService";

import "./MeuPerfil.css";


function MeuPerfil() {

    const [usuario, setUsuario] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    /* ============================
       CARREGAR PERFIL
    ============================ */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setLoading(false);

                        return;

                    }


                    try {

                        /* ============================
                           USUÁRIO
                        ============================ */

                        const referenciaUsuario =
                            doc(
                                db,
                                "Usuarios",
                                usuarioFirebase.uid
                            );


                        const documentoUsuario =
                            await getDoc(
                                referenciaUsuario
                            );


                        if (!documentoUsuario.exists()) {

                            setLoading(false);

                            return;

                        }


                        const dadosUsuario =
                            documentoUsuario.data();


                        /* ============================
                           BUSCAR UT
                        ============================ */

                        let dadosUT = {};


                        if (
                            dadosUsuario.numeroUT
                        ) {

                            try {

                                const listaUTs =
                                    await listarUTs();


                                const utEncontrada =
                                    listaUTs.find(
                                        (ut) =>
                                            String(
                                                ut.numeroUT
                                            ) ===
                                            String(
                                                dadosUsuario.numeroUT
                                            )
                                    );


                                if (utEncontrada) {

                                    dadosUT =
                                        utEncontrada;

                                }

                            }

                            catch (erroUT) {

                                console.error(
                                    "Erro ao buscar UT:",
                                    erroUT
                                );

                            }

                        }


                        /* ============================
                           PERFIL COMPLETO
                        ============================ */

                        setUsuario({

                            uid:
                                usuarioFirebase.uid,

                            email:
                                usuarioFirebase.email ||
                                dadosUsuario.email ||
                                "",

                            ...dadosUT,

                            ...dadosUsuario

                        });

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao carregar perfil:",
                            erro
                        );

                    }

                    finally {

                        setLoading(false);

                    }

                }
            );


        return () => cancelar();

    }, []);


    /* ============================
       CARREGANDO
    ============================ */

    if (loading) {

        return (

            <div className="meuPerfil">

                <div className="perfilLoading">

                    Carregando perfil...

                </div>

            </div>

        );

    }


    /* ============================
       ERRO
    ============================ */

    if (!usuario) {

        return (

            <div className="meuPerfil">

                <div className="perfilErro">

                    Não foi possível carregar
                    os dados do usuário.

                </div>

            </div>

        );

    }


    return (

        <div className="meuPerfil">


            {/* ============================
                CABEÇALHO
            ============================ */}

            <div className="perfilCabecalho">

                <div>

                    <h1>
                        👤 Meu Perfil
                    </h1>

                    <p>
                        Consulte seus dados pessoais,
                        perfil de acesso e informações
                        da sua Unidade de Trabalho.
                    </p>

                </div>

            </div>


            {/* ============================
                DADOS DO USUÁRIO
            ============================ */}

            <div className="perfilCard">

                <div className="perfilTitulo">

                    <span className="perfilIcone">
                        👤
                    </span>

                    <div>

                        <h2>
                            Dados do Usuário
                        </h2>

                        <p>
                            Informações da sua conta
                            no Portal SST.
                        </p>

                    </div>

                </div>


                <div className="perfilGrid">


                    <div className="perfilCampo">

                        <span>
                            Nome
                        </span>

                        <strong>
                            {usuario.nome ||
                                "Não informado"}
                        </strong>

                    </div>


                    <div className="perfilCampo">

                        <span>
                            Login
                        </span>

                        <strong>
                            {usuario.login ||
                                usuario.email ||
                                "Não informado"}
                        </strong>

                    </div>


                    <div className="perfilCampo">

                        <span>
                            Perfil
                        </span>

                        <strong>

                            {usuario.perfil === "UT"
                                ? "Usuário UT"
                                : usuario.perfil === "ADMIN"
                                    ? "Administrador SST"
                                    : usuario.perfil ||
                                      "Não informado"
                            }

                        </strong>

                    </div>


                </div>

            </div>


            {/* ============================
                MINHA UNIDADE
            ============================ */}

            <div className="perfilCard">

                <div className="perfilTitulo">

                    <span className="perfilIcone">
                        🏢
                    </span>

                    <div>

                        <h2>
                            Minha Unidade de Trabalho
                        </h2>

                        <p>
                            Unidade vinculada ao seu acesso.
                        </p>

                    </div>

                </div>


                <div className="perfilGrid">


                    <div className="perfilCampo perfilCampoGrande">

                        <span>
                            Unidade
                        </span>

                        <strong>
                            {usuario.nomeUT ||
                                "Não informado"}
                        </strong>

                    </div>


                    <div className="perfilCampo">

                        <span>
                            Número da UT
                        </span>

                        <strong>
                            {usuario.numeroUT ||
                                "Não informado"}
                        </strong>

                    </div>


                    <div className="perfilCampo">

                        <span>
                            Cliente
                        </span>

                        <strong>
                            {usuario.cliente ||
                                "Não informado"}
                        </strong>

                    </div>


                    <div className="perfilCampo">

                        <span>
                            Cidade
                        </span>

                        <strong>
                            {usuario.cidade ||
                                "Não informado"}
                        </strong>

                    </div>


                    <div className="perfilCampo">

                        <span>
                            Estado
                        </span>

                        <strong>
                            {usuario.estado ||
                                "Não informado"}
                        </strong>

                    </div>


                </div>


                <div className="perfilAviso">

                    🔒 A Unidade de Trabalho vinculada
                    ao seu usuário é definida pelo
                    administrador e não pode ser
                    alterada por este perfil.

                </div>

            </div>


        </div>

    );

}


export default MeuPerfil;