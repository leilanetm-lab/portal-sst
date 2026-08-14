import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Layout.css";

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
} from "../firebase/firebaseConfig";

import {
    sair
} from "../services/authService";


function Header() {

    const navigate = useNavigate();


    /* ============================
       DATA
    ============================ */

    const hoje =
        new Date().toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    /* ============================
       ESTADOS
    ============================ */

    const [nomeUsuario, setNomeUsuario] =
        useState("Carregando...");

    const [perfilUsuario, setPerfilUsuario] =
        useState("");

    const [iniciais, setIniciais] =
        useState("...");

    const [saindo, setSaindo] =
        useState(false);


    /* ============================
       OBSERVAR LOGIN
    ============================ */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setNomeUsuario(
                            "Usuário"
                        );

                        setPerfilUsuario(
                            ""
                        );

                        setIniciais(
                            "US"
                        );

                        return;

                    }


                    await carregarDadosUsuario(
                        usuarioFirebase.uid
                    );

                }
            );


        return () => {

            cancelar();

        };

    }, []);


    /* ============================
       BUSCAR USUÁRIO NO FIRESTORE
    ============================ */

    async function carregarDadosUsuario(uid) {

        try {

            console.log(
                "UID logado:",
                uid
            );


            const referencia =
                doc(
                    db,
                    "Usuarios",
                    uid
                );


            const documento =
                await getDoc(
                    referencia
                );


            console.log(
                "Documento do usuário existe:",
                documento.exists()
            );


            if (!documento.exists()) {

                console.error(
                    "Não encontrei o usuário na coleção Usuarios."
                );

                setNomeUsuario(
                    "Usuário"
                );

                setPerfilUsuario(
                    "Não identificado"
                );

                setIniciais(
                    "US"
                );

                return;

            }


            const dados =
                documento.data();


            console.log(
                "Dados do usuário:",
                dados
            );


            /* ============================
               UT
            ============================ */

            if (
                dados.perfil === "UT"
            ) {

                const nome =
                    dados.nomeUT ||
                    dados.nome ||
                    "Usuário UT";


                definirUsuario(
                    nome,
                    "Usuário UT"
                );


                return;

            }


            /* ============================
               ADMIN
            ============================ */

            if (
                dados.perfil === "ADMIN"
            ) {

                const nome =
                    dados.nome ||
                    "Administrador";


                definirUsuario(
                    nome,
                    "Administrador SST"
                );


                return;

            }


            /* ============================
               PERFIL NÃO RECONHECIDO
            ============================ */

            const nome =
                dados.nomeUT ||
                dados.nome ||
                "Usuário";


            definirUsuario(
                nome,
                dados.perfil || "Usuário"
            );

        }

        catch (erro) {

            console.error(
                "Erro ao buscar usuário:",
                erro
            );

            setNomeUsuario(
                "Erro ao carregar"
            );

            setPerfilUsuario(
                ""
            );

            setIniciais(
                "ER"
            );

        }

    }


    /* ============================
       DEFINIR USUÁRIO
    ============================ */

    function definirUsuario(
        nome,
        perfil
    ) {

        setNomeUsuario(
            nome
        );

        setPerfilUsuario(
            perfil
        );


        const partes =
            String(nome)
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        let iniciaisGeradas =
            "US";


        if (
            partes.length >= 2
        ) {

            iniciaisGeradas =
                (
                    partes[0][0] +
                    partes[partes.length - 1][0]
                ).toUpperCase();

        }

        else if (
            partes.length === 1
        ) {

            iniciaisGeradas =
                partes[0]
                    .substring(0, 2)
                    .toUpperCase();

        }


        setIniciais(
            iniciaisGeradas
        );

    }


    /* ============================
       SAIR
    ============================ */

    async function sairDoPortal() {

        try {

            setSaindo(true);

            await sair();

            navigate("/");

        }

        catch (erro) {

            console.error(
                "Erro ao sair:",
                erro
            );

            alert(
                "Não foi possível sair do portal."
            );

            setSaindo(false);

        }

    }


    return (

        <header className="header">


            <div className="headerEsquerda">

                <h1>

                    Portal SST

                </h1>

                <span>

                    {hoje}

                </span>

            </div>


            <div className="headerDireita">


                {/* ============================
                    NOTIFICAÇÕES
                ============================ */}

                <button
                    className="btnNotificacao"
                    type="button"
                >

                    🔔

                    <span
                        className="badgeNotificacao"
                    >

                        0

                    </span>

                </button>


                {/* ============================
                    USUÁRIO
                ============================ */}

                <div className="usuarioHeader">

                    <div>

                        <strong>

                            {nomeUsuario}

                        </strong>

                        <small>

                            {perfilUsuario}

                        </small>

                    </div>


                    <div className="avatarUsuario">

                        {iniciais}

                    </div>

                </div>


                {/* ============================
                    SAIR
                ============================ */}

                <button

                    type="button"

                    className="btnSair"

                    onClick={
                        sairDoPortal
                    }

                    disabled={
                        saindo
                    }

                >

                    {saindo
                        ? "Saindo..."
                        : "Sair"
                    }

                </button>


            </div>

        </header>

    );

}


export default Header;