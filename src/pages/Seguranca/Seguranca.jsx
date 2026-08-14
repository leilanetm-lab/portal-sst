import { useState } from "react";

import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "firebase/auth";

import {
    auth
} from "../../firebase/firebaseConfig";

import {
    useNavigate
} from "react-router-dom";

import "./Seguranca.css";


function Seguranca() {

    const navigate =
        useNavigate();


    const [senhaAtual, setSenhaAtual] =
        useState("");

    const [novaSenha, setNovaSenha] =
        useState("");

    const [confirmarSenha, setConfirmarSenha] =
        useState("");

    const [salvando, setSalvando] =
        useState(false);


    async function alterarSenha() {

        if (!senhaAtual) {

            alert(
                "Informe sua senha atual."
            );

            return;

        }


        if (!novaSenha) {

            alert(
                "Informe a nova senha."
            );

            return;

        }


        if (novaSenha.length < 6) {

            alert(
                "A nova senha deve possuir pelo menos 6 caracteres."
            );

            return;

        }


        if (!confirmarSenha) {

            alert(
                "Confirme a nova senha."
            );

            return;

        }


        if (
            novaSenha !==
            confirmarSenha
        ) {

            alert(
                "A nova senha e a confirmação não são iguais."
            );

            return;

        }


        if (
            senhaAtual ===
            novaSenha
        ) {

            alert(
                "A nova senha deve ser diferente da senha atual."
            );

            return;

        }


        const usuario =
            auth.currentUser;


        if (!usuario) {

            alert(
                "Usuário não autenticado."
            );

            return;

        }


        try {

            setSalvando(true);


            /*
            =====================================
            REAUTENTICAR USUÁRIO
            =====================================
            */

            const credencial =
                EmailAuthProvider.credential(
                    usuario.email,
                    senhaAtual
                );


            await reauthenticateWithCredential(
                usuario,
                credencial
            );


            /*
            =====================================
            ATUALIZAR SENHA
            =====================================
            */

            await updatePassword(
                usuario,
                novaSenha
            );


            alert(
                "Senha alterada com sucesso!"
            );


            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarSenha("");


        }

        catch (erro) {

            console.error(
                "Erro ao alterar senha:",
                erro
            );


            if (
                erro.code ===
                "auth/wrong-password"
            ) {

                alert(
                    "A senha atual está incorreta."
                );

                return;

            }


            if (
                erro.code ===
                "auth/invalid-credential"
            ) {

                alert(
                    "A senha atual está incorreta."
                );

                return;

            }


            if (
                erro.code ===
                "auth/weak-password"
            ) {

                alert(
                    "A nova senha é muito fraca."
                );

                return;

            }


            alert(
                "Não foi possível alterar a senha."
            );

        }

        finally {

            setSalvando(false);

        }

    }


    return (

        <div className="segurancaPagina">


            <button

                className="btnVoltarSeguranca"

                onClick={() =>
                    navigate("/configuracoes")
                }

            >

                ← Voltar para Configurações

            </button>


            <div className="segurancaCabecalho">

                <h1>
                    🔐 Segurança
                </h1>

                <p>
                    Gerencie a senha de acesso
                    à sua conta no Portal SST.
                </p>

            </div>


            <div className="segurancaCard">


                <div className="segurancaTitulo">

                    <div className="segurancaIcone">

                        🔑

                    </div>

                    <div>

                        <h2>
                            Alterar senha
                        </h2>

                        <p>
                            Digite sua senha atual
                            e escolha uma nova senha.
                        </p>

                    </div>

                </div>


                <div className="campoSeguranca">

                    <label>
                        Senha atual *
                    </label>

                    <input

                        type="password"

                        value={senhaAtual}

                        onChange={(e) =>
                            setSenhaAtual(
                                e.target.value
                            )
                        }

                        placeholder="Digite sua senha atual"

                        disabled={salvando}

                    />

                </div>


                <div className="campoSeguranca">

                    <label>
                        Nova senha *
                    </label>

                    <input

                        type="password"

                        value={novaSenha}

                        onChange={(e) =>
                            setNovaSenha(
                                e.target.value
                            )
                        }

                        placeholder="Digite sua nova senha"

                        disabled={salvando}

                    />

                </div>


                <div className="campoSeguranca">

                    <label>
                        Confirmar nova senha *
                    </label>

                    <input

                        type="password"

                        value={confirmarSenha}

                        onChange={(e) =>
                            setConfirmarSenha(
                                e.target.value
                            )
                        }

                        placeholder="Digite novamente a nova senha"

                        disabled={salvando}

                        onKeyDown={(e) => {

                            if (
                                e.key === "Enter"
                            ) {

                                alterarSenha();

                            }

                        }}

                    />

                </div>


                <div className="dicaSenha">

                    🔒 Por segurança, sua senha
                    atual será confirmada antes
                    da alteração.

                </div>


                <div className="acoesSeguranca">

                    <button

                        className="btnCancelarSeguranca"

                        onClick={() =>
                            navigate(
                                "/configuracoes"
                            )
                        }

                        disabled={salvando}

                    >

                        Cancelar

                    </button>


                    <button

                        className="btnSalvarSenha"

                        onClick={
                            alterarSenha
                        }

                        disabled={salvando}

                    >

                        {salvando
                            ? "Alterando..."
                            : "🔐 Alterar senha"
                        }

                    </button>

                </div>


            </div>

        </div>

    );

}


export default Seguranca;