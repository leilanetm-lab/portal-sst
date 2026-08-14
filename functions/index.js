const {
    onCall,
    HttpsError
} = require("firebase-functions/v2/https");

const {
    initializeApp
} = require("firebase-admin/app");

const {
    getAuth
} = require("firebase-admin/auth");

const {
    getFirestore
} = require("firebase-admin/firestore");


/* =====================================================
   FIREBASE ADMIN
===================================================== */

initializeApp();


const db = getFirestore();

const auth = getAuth();


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const SENHA_PADRAO =
    "Manserv@2026";


/* =====================================================
   VALIDAR ADMINISTRADOR
===================================================== */

async function validarAdministrador(
    request
) {

    if (!request.auth) {

        throw new HttpsError(
            "unauthenticated",
            "Usuário não autenticado."
        );

    }


    const uid =
        request.auth.uid;


    const referencia =
        db
            .collection("Usuarios")
            .doc(uid);


    const documento =
        await referencia.get();


    if (!documento.exists) {

        throw new HttpsError(
            "permission-denied",
            "Usuário não encontrado."
        );

    }


    const dados =
        documento.data();


    if (
        dados.perfil !== "ADMIN"
    ) {

        throw new HttpsError(
            "permission-denied",
            "Apenas administradores podem executar esta operação."
        );

    }


    if (
        dados.ativo === false
    ) {

        throw new HttpsError(
            "permission-denied",
            "Administrador inativo."
        );

    }


    return dados;

}


/* =====================================================
   CRIAR USUÁRIO UT
===================================================== */

exports.criarUsuarioUT =
    onCall(
        async (request) => {

            await validarAdministrador(
                request
            );


            const {

                nome,

                numeroUT,

                nomeUT,

                login

            } = request.data || {};


            /* ============================
               VALIDAÇÕES
            ============================ */

            if (
                !nome ||
                !numeroUT ||
                !nomeUT ||
                !login
            ) {

                throw new HttpsError(
                    "invalid-argument",
                    "Nome, número da UT, nome da UT e login são obrigatórios."
                );

            }


            const loginLimpo =
                String(login)
                    .trim();


            const numeroUTLimpo =
                String(numeroUT)
                    .trim();


            const nomeUTLimpo =
                String(nomeUT)
                    .trim();


            /* ============================
               E-MAIL INTERNO
            ============================ */

            const email =
                `${loginLimpo}@portal-sst.local`;


            /* ============================
               VERIFICAR SE LOGIN JÁ EXISTE
            ============================ */

            try {

                await auth.getUserByEmail(
                    email
                );


                throw new HttpsError(
                    "already-exists",
                    "Já existe um usuário cadastrado com este login."
                );

            }

            catch (erro) {

                if (
                    erro.code ===
                    "functions/already-exists"
                ) {

                    throw erro;

                }


                if (
                    erro.code !==
                    "auth/user-not-found"
                ) {

                    throw new HttpsError(
                        "internal",
                        "Não foi possível verificar o login."
                    );

                }

            }


            /* ============================
               CRIAR AUTHENTICATION
            ============================ */

            let usuarioCriado;


            try {

                usuarioCriado =
                    await auth.createUser({

                        email,

                        password:
                            SENHA_PADRAO,

                        displayName:
                            nomeUTLimpo,

                        disabled:
                            false

                    });

            }

            catch (erro) {

                console.error(
                    "Erro ao criar usuário:",
                    erro
                );


                if (
                    erro.code ===
                    "auth/email-already-exists"
                ) {

                    throw new HttpsError(
                        "already-exists",
                        "Já existe um usuário com este login."
                    );

                }


                throw new HttpsError(
                    "internal",
                    "Não foi possível criar o usuário."
                );

            }


            /* ============================
               CRIAR DOCUMENTO FIRESTORE
            ============================ */

            try {

                await db
                    .collection("Usuarios")
                    .doc(usuarioCriado.uid)
                    .set({

                        login:
                            loginLimpo,

                        nome:
                            nome,

                        nomeUT:
                            nomeUTLimpo,

                        numeroUT:
                            numeroUTLimpo,

                        perfil:
                            "UT",

                        ativo:
                            true,

                        primeiroAcesso:
                            true,

                        senhaAlteradaEm:
                            null,

                        criadoEm:
                            new Date()
                                .toISOString(),

                        criadoPorUid:
                            request.auth.uid

                    });

            }

            catch (erro) {

                console.error(
                    "Erro ao criar perfil:",
                    erro
                );


                /*
                Se o Firestore falhar,
                remove a conta criada no
                Authentication para não
                deixar usuário órfão.
                */

                try {

                    await auth.deleteUser(
                        usuarioCriado.uid
                    );

                }

                catch (
                    erroExclusao
                ) {

                    console.error(
                        "Erro ao excluir usuário órfão:",
                        erroExclusao
                    );

                }


                throw new HttpsError(
                    "internal",
                    "Usuário criado parcialmente. A operação foi desfeita."
                );

            }


            /* ============================
               RETORNO
            ============================ */

            return {

                sucesso:
                    true,

                uid:
                    usuarioCriado.uid,

                login:
                    loginLimpo,

                numeroUT:
                    numeroUTLimpo,

                nomeUT:
                    nomeUTLimpo,

                primeiroAcesso:
                    true

            };

        }
    );


/* =====================================================
   REDEFINIR SENHA
===================================================== */

exports.redefinirSenhaUsuario =
    onCall(
        async (request) => {

            await validarAdministrador(
                request
            );


            const {
                uid
            } =
                request.data || {};


            if (!uid) {

                throw new HttpsError(
                    "invalid-argument",
                    "UID do usuário é obrigatório."
                );

            }


            /* ============================
               VERIFICAR USUÁRIO
            ============================ */

            let usuario;


            try {

                usuario =
                    await auth.getUser(
                        uid
                    );

            }

            catch (erro) {

                if (
                    erro.code ===
                    "auth/user-not-found"
                ) {

                    throw new HttpsError(
                        "not-found",
                        "Usuário não encontrado."
                    );

                }


                throw new HttpsError(
                    "internal",
                    "Não foi possível localizar o usuário."
                );

            }


            /* ============================
               ALTERAR SENHA
            ============================ */

            try {

                await auth.updateUser(
                    uid,
                    {

                        password:
                            SENHA_PADRAO,

                        disabled:
                            false

                    }
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao redefinir senha:",
                    erro
                );


                throw new HttpsError(
                    "internal",
                    "Não foi possível redefinir a senha."
                );

            }


            /* ============================
               FORÇAR PRIMEIRO ACESSO
            ============================ */

            await db
                .collection("Usuarios")
                .doc(uid)
                .set(

                    {

                        primeiroAcesso:
                            true,

                        senhaAlteradaEm:
                            null,

                        ativo:
                            true

                    },

                    {
                        merge:
                            true
                    }

                );


            return {

                sucesso:
                    true,

                uid,

                login:
                    usuario.email
                        ?.replace(
                            "@portal-sst.local",
                            ""
                        ),

                senhaPadrao:
                    SENHA_PADRAO

            };

        }
    );


/* =====================================================
   ATIVAR / DESATIVAR USUÁRIO
===================================================== */

exports.alterarStatusUsuario =
    onCall(
        async (request) => {

            await validarAdministrador(
                request
            );


            const {

                uid,

                ativo

            } =
                request.data || {};


            if (!uid) {

                throw new HttpsError(
                    "invalid-argument",
                    "UID do usuário é obrigatório."
                );

            }


            if (
                typeof ativo !==
                "boolean"
            ) {

                throw new HttpsError(
                    "invalid-argument",
                    "O campo ativo deve ser verdadeiro ou falso."
                );

            }


            try {

                await auth.updateUser(
                    uid,
                    {

                        disabled:
                            !ativo

                    }
                );


                await db
                    .collection("Usuarios")
                    .doc(uid)
                    .set(

                        {

                            ativo

                        },

                        {
                            merge:
                                true
                        }

                    );


            }

            catch (erro) {

                console.error(
                    "Erro ao alterar status:",
                    erro
                );


                throw new HttpsError(
                    "internal",
                    "Não foi possível alterar o status do usuário."
                );

            }


            return {

                sucesso:
                    true,

                uid,

                ativo

            };

        }
    );