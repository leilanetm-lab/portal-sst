import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    login
} from "../../services/authService";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../firebase/firebaseConfig";

import PrimeiroAcesso
    from "../PrimeiroAcesso/PrimeiroAcesso";

import "./Login.css";

import logoManserv
    from "../../assets/logo-manserv.png";


function Login() {

    const [
        loginUsuario,
        setLoginUsuario
    ] = useState("");


    const [
        senha,
        setSenha
    ] = useState("");


    const [
        entrando,
        setEntrando
    ] = useState(false);


    /*
    ============================
    PRIMEIRO ACESSO
    ============================
    */

    const [
        primeiroAcesso,
        setPrimeiroAcesso
    ] = useState(false);


    const [
        dadosUsuario,
        setDadosUsuario
    ] = useState(null);


    /*
    ============================
    ESQUECI MINHA SENHA
    ============================
    */

    const [
        mostrarEsqueciSenha,
        setMostrarEsqueciSenha
    ] = useState(false);


    const navigate =
        useNavigate();


    /* ============================
       ENTRAR
    ============================ */

    async function entrar() {

        if (!loginUsuario.trim()) {

            alert(
                "Informe o login."
            );

            return;

        }


        if (!senha) {

            alert(
                "Informe a senha."
            );

            return;

        }


        try {

            setEntrando(true);


            /* ============================
               AUTENTICAÇÃO FIREBASE
            ============================ */

            await login(
                loginUsuario,
                senha
            );


            /* ============================
               USUÁRIO AUTENTICADO
            ============================ */

            const usuarioFirebase =
                auth.currentUser;


            if (!usuarioFirebase) {

                throw new Error(
                    "Usuário autenticado não encontrado."
                );

            }


            console.log(
                "UID logado:",
                usuarioFirebase.uid
            );


            /* ============================
               BUSCAR PERFIL
            ============================ */

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


            if (!documento.exists()) {

                throw new Error(
                    "Usuário não possui cadastro no portal."
                );

            }


            const dados =
                documento.data();


            console.log(
                "Perfil encontrado:",
                dados
            );


            /* ============================
               GUARDAR DADOS DO USUÁRIO
            ============================ */

            setDadosUsuario(
                dados
            );


            /* ============================
               PRIMEIRO ACESSO DA UT
            ============================ */

            if (
                dados.perfil === "UT" &&
                dados.primeiroAcesso === true
            ) {

                console.log(
                    "Usuário UT em primeiro acesso."
                );


                setPrimeiroAcesso(
                    true
                );


                return;

            }


            /* ============================
               USUÁRIO UT
            ============================ */

            if (
                dados.perfil === "UT"
            ) {

                console.log(
                    "Entrando como UT"
                );


                navigate(
                    "/dashboard-ut"
                );


                return;

            }


            /* ============================
               ADMINISTRADOR
            ============================ */

            if (
                dados.perfil === "ADMIN"
            ) {

                console.log(
                    "Entrando como ADMIN"
                );


                navigate(
                    "/dashboard"
                );


                return;

            }


            /* ============================
               PERFIL INVÁLIDO
            ============================ */

            alert(
                "O usuário não possui um perfil válido."
            );

        }


        catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );


            alert(
                "Login ou senha inválidos."
            );

        }


        finally {

            setEntrando(
                false
            );

        }

    }


    /* ============================
       PRIMEIRO ACESSO
    ============================ */

    if (
        primeiroAcesso
    ) {

        return (

            <PrimeiroAcesso

                usuario={
                    dadosUsuario
                }


                onConcluido={() => {

                    setPrimeiroAcesso(
                        false
                    );


                    navigate(
                        "/dashboard-ut"
                    );

                }}

            />

        );

    }


    /* ============================
       LOGIN
    ============================ */

    return (

        <div className="login-container">


            <div className="login-box">


                <img

                    src={logoManserv}

                    alt="Manserv"

                    className="logo"

                />


                <h1>

                    Portal SST

                </h1>


                <h3>

                    Sistema de Gestão de
                    Documentos Legais

                </h3>


                {/* ============================
                    LOGIN
                ============================ */}

                <input

                    type="text"

                    placeholder="Login"

                    value={
                        loginUsuario
                    }

                    onChange={
                        (e) =>
                            setLoginUsuario(
                                e.target.value
                            )
                    }

                    disabled={
                        entrando
                    }

                />


                {/* ============================
                    SENHA
                ============================ */}

                <input

                    type="password"

                    placeholder="Senha"

                    value={
                        senha
                    }

                    onChange={
                        (e) =>
                            setSenha(
                                e.target.value
                            )
                    }

                    disabled={
                        entrando
                    }

                    onKeyDown={
                        (e) => {

                            if (
                                e.key === "Enter"
                            ) {

                                entrar();

                            }

                        }
                    }

                />


                {/* ============================
                    ENTRAR
                ============================ */}

                <button

                    type="button"

                    onClick={
                        entrar
                    }

                    disabled={
                        entrando
                    }

                >

                    {
                        entrando
                            ? "Entrando..."
                            : "Entrar"
                    }

                </button>


                {/* ============================
                    ESQUECI MINHA SENHA
                ============================ */}

                <button

                    type="button"

                    className="btnEsqueciSenha"

                    onClick={() =>
                        setMostrarEsqueciSenha(
                            true
                        )
                    }

                    disabled={
                        entrando
                    }

                >

                    Esqueci minha senha

                </button>


            </div>


            {/* =================================================
                MODAL ESQUECI MINHA SENHA
            ================================================= */}

            {
                mostrarEsqueciSenha && (

                    <div

                        className="modalOverlay"

                        onClick={() =>
                            setMostrarEsqueciSenha(
                                false
                            )
                        }

                    >

                        <div

                            className="modalEsqueciSenha"

                            onClick={(e) =>
                                e.stopPropagation()
                            }

                        >

                            <div className="iconeSenha">

                                🔐

                            </div>


                            <h2>

                                Esqueceu sua senha?

                            </h2>


                            <p>

                                Para redefinir sua senha,
                                procure o

                                {" "}

                                <strong>
                                    Administrador do Portal
                                </strong>

                                {" — "}

                                <strong>
                                    Equipe TO
                                </strong>.

                            </p>


                            <p>

                                A Equipe TO poderá
                                realizar a redefinição
                                da sua senha.

                            </p>


                            <button

                                type="button"

                                className="btnFecharModal"

                                onClick={() =>
                                    setMostrarEsqueciSenha(
                                        false
                                    )
                                }

                            >

                                Entendi

                            </button>


                        </div>

                    </div>

                )
            }


        </div>

    );

}


export default Login;