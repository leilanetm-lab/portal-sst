import { useState } from "react";

import {
    updatePassword
} from "firebase/auth";

import {
    doc,
    updateDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../firebase/firebaseConfig";

import "./PrimeiroAcesso.css";


function PrimeiroAcesso({ usuario, onConcluido }) {

    const [novaSenha, setNovaSenha] =
        useState("");

    const [confirmarSenha, setConfirmarSenha] =
        useState("");

    const [salvando, setSalvando] =
        useState(false);


    async function criarSenha() {

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


        if (novaSenha !== confirmarSenha) {

            alert(
                "As senhas não são iguais."
            );

            return;

        }


        const usuarioFirebase =
            auth.currentUser;


        if (!usuarioFirebase) {

            alert(
                "Usuário não autenticado."
            );

            return;

        }


        try {

            setSalvando(true);


            /*
            =================================
            ALTERA A SENHA NO FIREBASE AUTH
            =================================
            */

            await updatePassword(
                usuarioFirebase,
                novaSenha
            );


            /*
            =================================
            MARCA PRIMEIRO ACESSO COMO
            CONCLUÍDO
            =================================
            */

            await updateDoc(

                doc(
                    db,
                    "Usuarios",
                    usuarioFirebase.uid
                ),

                {
                    primeiroAcesso: false,
                    senhaAlteradaEm:
                        new Date().toISOString()
                }

            );


            alert(
                "Senha criada com sucesso!"
            );


            onConcluido();

        }

        catch (erro) {

            console.error(
                "Erro ao criar senha:",
                erro
            );


            alert(
                "Não foi possível criar sua nova senha. Tente novamente."
            );

        }

        finally {

            setSalvando(false);

        }

    }


    return (

        <div className="primeiroAcesso">

            <div className="primeiroAcessoBox">


                <div className="primeiroAcessoIcone">

                    🔐

                </div>


                <h1>

                    Primeiro acesso

                </h1>


                <p className="primeiroAcessoTexto">

                    Olá,{" "}

                    <strong>
                        {usuario?.nome || "usuário"}
                    </strong>
                    .

                </p>


                <p>

                    Para sua segurança, é necessário
                    criar uma senha pessoal antes de
                    acessar o Portal SST.

                </p>


                <div className="primeiroAcessoAviso">

                    🔒 Sua senha inicial é temporária.
                    Crie uma nova senha que somente
                    você conheça.

                </div>


                <div className="campoSenha">

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


                <div className="campoSenha">

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

                        placeholder="Digite novamente sua nova senha"

                        disabled={salvando}

                        onKeyDown={(e) => {

                            if (
                                e.key === "Enter"
                            ) {

                                criarSenha();

                            }

                        }}

                    />

                </div>


                <div className="regrasSenha">

                    <strong>
                        Recomendação de segurança:
                    </strong>

                    <span>
                        Utilize uma senha que você
                        não compartilhe com outras pessoas.
                    </span>

                </div>


                <button

                    className="btnCriarSenha"

                    onClick={criarSenha}

                    disabled={salvando}

                >

                    {salvando

                        ? "Criando senha..."

                        : "Criar minha senha"

                    }

                </button>


            </div>

        </div>

    );

}


export default PrimeiroAcesso;