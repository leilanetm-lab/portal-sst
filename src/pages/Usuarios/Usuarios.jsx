import "./Usuarios.css";

import { useEffect, useMemo, useState } from "react";

import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";

import {
    createUserWithEmailAndPassword,
    getAuth,
    initializeAuth,
    indexedDBLocalPersistence,
    browserLocalPersistence,
    signOut
} from "firebase/auth";

import {
    initializeApp,
    getApps
} from "firebase/app";

import app, {
    db
} from "../../firebase/firebaseConfig";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const authPrincipal = getAuth(app);

/*
 * App secundário:
 * usado somente para criar usuários.
 * Assim o ADMIN continua logado no app principal.
 */
let authCadastro = null;

try {

    const nomeAppCadastro = "PortalSST-Cadastro";

    let appCadastro =
        getApps().find(
            (item) =>
                item.name === nomeAppCadastro
        );

    if (!appCadastro) {

        appCadastro =
            initializeApp(
                app.options,
                nomeAppCadastro
            );

    }

    try {

        authCadastro =
            initializeAuth(
                appCadastro,
                {
                    persistence: [
                        indexedDBLocalPersistence,
                        browserLocalPersistence
                    ]
                }
            );

    } catch {

        authCadastro =
            getAuth(appCadastro);

    }

} catch (erro) {

    console.error(
        "Erro ao inicializar Auth de cadastro:",
        erro
    );

}


/*
 * URL do Worker que possui acesso administrativo ao Firebase.
 *
 * Pode ser definida no .env:
 *
 * VITE_PORTAL_API_URL=https://SEU-WORKER.workers.dev
 *
 * Se não existir, usamos o Worker que você está usando agora.
 */
const PORTAL_API_URL =
    (
        import.meta.env.VITE_PORTAL_API_URL ||
        "https://portal-sst-admin.lelehvitorias2.workers.dev"
    ).replace(/\/$/, "");


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function transformarLogin(login) {

    const valor =
        String(login || "")
            .trim()
            .toLowerCase();

    if (!valor) {
        return "";
    }

    if (valor.includes("@")) {
        return valor;
    }

    return `${valor}@portal-sst.local`;

}


function gerarSenhaInicial() {

    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    let senha = "";

    for (let i = 0; i < 10; i++) {

        const indice =
            Math.floor(
                Math.random() *
                caracteres.length
            );

        senha += caracteres[indice];

    }

    return senha;

}


/* =========================================================
   COMPONENTE
========================================================= */

function Usuarios() {

    const [usuarios, setUsuarios] =
        useState([]);

    const [carregando, setCarregando] =
        useState(true);

    const [salvando, setSalvando] =
        useState(false);

    const [erro, setErro] =
        useState("");

    const [sucesso, setSucesso] =
        useState("");

    const [pesquisa, setPesquisa] =
        useState("");

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [usuarioSelecionado, setUsuarioSelecionado] =
        useState(null);

    const [usuarioRedefinindo, setUsuarioRedefinindo] =
        useState(null);

    const [novaSenha, setNovaSenha] =
        useState("");

    const [confirmarNovaSenha, setConfirmarNovaSenha] =
        useState("");

    const [redefinindo, setRedefinindo] =
        useState(false);


    /* =====================================================
       FORMULÁRIO
    ===================================================== */

    const [tipoUsuario, setTipoUsuario] =
        useState("UT");

    const [login, setLogin] =
        useState("");

    const [nome, setNome] =
        useState("");

    const [nomeUT, setNomeUT] =
        useState("");

    const [numeroUT, setNumeroUT] =
        useState("");

    const [senha, setSenha] =
        useState("");

    const [confirmarSenha, setConfirmarSenha] =
        useState("");

    const [gerarSenha, setGerarSenha] =
        useState(true);


    /* =====================================================
       CARREGAR USUÁRIOS
    ===================================================== */

    async function carregarUsuarios() {

        try {

            setCarregando(true);
            setErro("");

            const referencia =
                collection(
                    db,
                    "Usuarios"
                );

            const resultado =
                await getDocs(
                    referencia
                );

            const lista =
                resultado.docs.map(
                    (documento) => ({
                        uid: documento.id,
                        ...documento.data()
                    })
                );

            lista.sort(
                (a, b) =>
                    String(a.nome || "")
                        .localeCompare(
                            String(b.nome || "")
                        )
            );

            setUsuarios(lista);

        } catch (e) {

            console.error(
                "Erro ao carregar usuários:",
                e
            );

            setErro(
                "Não foi possível carregar os usuários."
            );

        } finally {

            setCarregando(false);

        }

    }


    useEffect(
        () => {
            carregarUsuarios();
        },
        []
    );


    /* =====================================================
       LIMPAR FORMULÁRIO
    ===================================================== */

    function limparFormulario() {

        setTipoUsuario("UT");
        setLogin("");
        setNome("");
        setNomeUT("");
        setNumeroUT("");
        setSenha("");
        setConfirmarSenha("");
        setGerarSenha(true);
        setErro("");
        setSucesso("");

    }


    function novoUsuario() {

        limparFormulario();
        setMostrarFormulario(true);

    }


    function cancelarFormulario() {

        limparFormulario();
        setMostrarFormulario(false);

    }


    /* =====================================================
       GERAR SENHA
    ===================================================== */

    function gerarNovaSenha() {

        const novaSenhaGerada =
            gerarSenhaInicial();

        setSenha(novaSenhaGerada);
        setConfirmarSenha(novaSenhaGerada);
        setGerarSenha(false);

    }


    /* =====================================================
       CRIAR USUÁRIO
    ===================================================== */

    async function criarUsuario(evento) {

        evento.preventDefault();

        setErro("");
        setSucesso("");

        if (!authCadastro) {

            setErro(
                "O serviço de cadastro do Firebase não foi inicializado."
            );

            return;

        }

        if (!login.trim()) {

            setErro("Informe o login.");
            return;

        }

        if (!nome.trim()) {

            setErro("Informe o nome do usuário.");
            return;

        }

        if (
            tipoUsuario === "UT" &&
            !numeroUT.trim()
        ) {

            setErro("Informe o número da UT.");
            return;

        }

        if (
            tipoUsuario === "UT" &&
            !nomeUT.trim()
        ) {

            setErro("Informe o nome da UT.");
            return;

        }

        let senhaFinal =
            senha.trim();

        if (gerarSenha) {

            senhaFinal =
                gerarSenhaInicial();

            setSenha(senhaFinal);
            setConfirmarSenha(senhaFinal);

        }

        if (senhaFinal.length < 6) {

            setErro(
                "A senha precisa ter pelo menos 6 caracteres."
            );

            return;

        }

        if (
            !gerarSenha &&
            senhaFinal !== confirmarSenha
        ) {

            setErro(
                "As senhas não conferem."
            );

            return;

        }

        try {

            setSalvando(true);

            const email =
                transformarLogin(login);

            const resultado =
                await createUserWithEmailAndPassword(
                    authCadastro,
                    email,
                    senhaFinal
                );

            const novoUsuarioFirebase =
                resultado.user;

            const referencia =
                doc(
                    db,
                    "Usuarios",
                    novoUsuarioFirebase.uid
                );

            await setDoc(
                referencia,
                {
                    uid:
                        novoUsuarioFirebase.uid,

                    login:
                        login
                            .trim()
                            .toLowerCase(),

                    email,

                    nome:
                        nome.trim(),

                    nomeUT:
                        tipoUsuario === "UT"
                            ? nomeUT.trim()
                            : "",

                    numeroUT:
                        tipoUsuario === "UT"
                            ? numeroUT.trim()
                            : "",

                    perfil:
                        tipoUsuario,

                    ativo:
                        true,

                    primeiroAcesso:
                        true,

                    senhaAlteradaEm:
                        null,

                    criadoEm:
                        serverTimestamp(),

                    criadoPor:
                        authPrincipal.currentUser?.uid ||
                        null
                }
            );

            /*
             * Muito importante:
             * o usuário criado fica autenticado apenas
             * no app secundário. Fazemos logout dele.
             */
            try {

                await signOut(
                    authCadastro
                );

            } catch (logoutErro) {

                console.warn(
                    "Não foi possível limpar a sessão de cadastro:",
                    logoutErro
                );

            }

            if (gerarSenha) {

                setSucesso(
                    `Usuário criado com sucesso. Senha inicial: ${senhaFinal}`
                );

            } else {

                setSucesso(
                    `Usuário ${nome.trim()} criado com sucesso.`
                );

            }

            limparFormulario();
            setMostrarFormulario(false);

            await carregarUsuarios();

        } catch (e) {

            console.error(
                "Erro ao criar usuário:",
                e
            );

            if (
                e?.code ===
                "auth/email-already-in-use"
            ) {

                setErro(
                    "Esse login já está cadastrado no Firebase Authentication."
                );

            } else if (
                e?.code ===
                "auth/invalid-email"
            ) {

                setErro(
                    "O login informado é inválido."
                );

            } else if (
                e?.code ===
                "auth/weak-password"
            ) {

                setErro(
                    "A senha informada é muito fraca."
                );

            } else {

                setErro(
                    e?.message ||
                    "Não foi possível criar o usuário."
                );

            }

        } finally {

            setSalvando(false);

        }

    }


    /* =====================================================
       ATIVAR / DESATIVAR
    ===================================================== */

    async function alterarStatus(usuario) {

        try {

            setErro("");
            setSucesso("");

            const novoStatus =
                usuario.ativo === false;

            await updateDoc(
                doc(
                    db,
                    "Usuarios",
                    usuario.uid
                ),
                {
                    ativo:
                        novoStatus
                }
            );

            setSucesso(
                novoStatus
                    ? "Usuário ativado."
                    : "Usuário desativado."
            );

            await carregarUsuarios();

        } catch (e) {

            console.error(e);

            setErro(
                "Não foi possível alterar o status do usuário."
            );

        }

    }


    /* =====================================================
       REDEFINIÇÃO DE SENHA
    ===================================================== */

    function abrirRedefinicao(usuario) {

        setErro("");
        setSucesso("");

        setUsuarioRedefinindo(usuario);

        const senhaGerada =
            gerarSenhaInicial();

        setNovaSenha(senhaGerada);
        setConfirmarNovaSenha(senhaGerada);

    }


    function fecharRedefinicao() {

        if (redefinindo) {
            return;
        }

        setUsuarioRedefinindo(null);
        setNovaSenha("");
        setConfirmarNovaSenha("");

    }


    function gerarSenhaRedefinicao() {

        const senhaGerada =
            gerarSenhaInicial();

        setNovaSenha(senhaGerada);
        setConfirmarNovaSenha(senhaGerada);

    }


    async function redefinirSenhaUsuario() {

        if (!usuarioRedefinindo) {
            return;
        }

        setErro("");
        setSucesso("");

        const senhaFinal =
            novaSenha.trim();

        if (senhaFinal.length < 6) {

            setErro(
                "A nova senha precisa ter pelo menos 6 caracteres."
            );

            return;
        }

        if (
            senhaFinal !==
            confirmarNovaSenha.trim()
        ) {

            setErro(
                "As novas senhas não conferem."
            );

            return;
        }

        const admin =
            authPrincipal.currentUser;

        if (!admin) {

            setErro(
                "Sua sessão de administrador expirou. Faça login novamente."
            );

            return;
        }

        try {

            setRedefinindo(true);

            /*
             * A senha de outro usuário não pode ser alterada
             * diretamente pelo navegador.
             * A solicitação é enviada ao Worker administrativo.
             */

            const token =
                await admin.getIdToken(true);

            console.log(
                "ADMIN UID:",
                admin.uid
            );

            console.log(
                "USUÁRIO DESTINO:",
                usuarioRedefinindo.uid
            );

            console.log(
                "WORKER:",
                `${PORTAL_API_URL}/admin/reset-password`
            );

            const resposta =
                await fetch(
                    `${PORTAL_API_URL}/admin/reset-password`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body:
                            JSON.stringify({
                                uid:
                                    usuarioRedefinindo.uid,

                                password:
                                    senhaFinal
                            })
                    }
                );

            /*
             * Lemos primeiro como texto para conseguir
             * enxergar a resposta real do Worker mesmo
             * quando ele não retornar JSON.
             */

            const textoResposta =
                await resposta.text();

            console.log(
                "HTTP CLOUDFLARE:",
                resposta.status
            );

            console.log(
                "RESPOSTA CLOUDFLARE:",
                textoResposta
            );

            let dados = null;

            try {

                dados =
                    textoResposta
                        ? JSON.parse(textoResposta)
                        : null;

            } catch {

                dados = null;

            }

            if (!resposta.ok) {

                const mensagem =
                    dados?.erro ||
                    dados?.error ||
                    dados?.message ||
                    textoResposta ||
                    `Erro HTTP ${resposta.status}`;

                throw new Error(
                    mensagem
                );
            }

            /*
             * O Worker alterou a senha.
             * Agora obrigamos o usuário a trocar a senha
             * no próximo acesso ao Portal SST.
             */

            await updateDoc(
                doc(
                    db,
                    "Usuarios",
                    usuarioRedefinindo.uid
                ),
                {
                    primeiroAcesso:
                        true,

                    senhaAlteradaEm:
                        null,

                    senhaRedefinidaEm:
                        serverTimestamp(),

                    senhaRedefinidaPor:
                        admin.uid
                }
            );

            setSucesso(
                `Senha de ${
                    usuarioRedefinindo.nome ||
                    usuarioRedefinindo.login ||
                    usuarioRedefinindo.email
                } redefinida com sucesso. A nova senha é: ${senhaFinal}`
            );

            setUsuarioRedefinindo(null);
            setNovaSenha("");
            setConfirmarNovaSenha("");

            await carregarUsuarios();

        } catch (e) {

            console.error(
                "Erro ao redefinir senha:",
                e
            );

            setErro(
                e?.message ||
                "Não foi possível redefinir a senha."
            );

        } finally {

            setRedefinindo(false);

        }

    }


    /* =====================================================
       USUÁRIOS FILTRADOS
    ===================================================== */

    const usuariosFiltrados =
        useMemo(
            () => {

                const termo =
                    pesquisa
                        .trim()
                        .toLowerCase();

                if (!termo) {
                    return usuarios;
                }

                return usuarios.filter(
                    (usuario) =>
                        [
                            usuario.nome,
                            usuario.login,
                            usuario.email,
                            usuario.nomeUT,
                            usuario.numeroUT,
                            usuario.perfil
                        ]
                            .map(
                                (valor) =>
                                    String(
                                        valor || ""
                                    ).toLowerCase()
                            )
                            .some(
                                (valor) =>
                                    valor.includes(
                                        termo
                                    )
                            )
                );

            },
            [
                usuarios,
                pesquisa
            ]
        );


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "0 auto"
            }}
        >

            {/* CABEÇALHO */}

            <div
                style={{
                    marginBottom: "25px"
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        fontSize: "30px"
                    }}
                >
                    👥 Usuários
                </h1>

                <p
                    style={{
                        marginTop: "8px",
                        color: "#666"
                    }}
                >
                    Gerencie os acessos das UTs e
                    administradores do Portal SST.
                </p>

            </div>


            {/* NOVO USUÁRIO */}

            <button
                type="button"
                onClick={novoUsuario}
                style={{
                    width: "100%",
                    background: "#ff6600",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14px 22px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    marginBottom: "25px"
                }}
            >
                + Novo usuário
            </button>


            {/* MENSAGENS */}

            {erro && (

                <div
                    style={{
                        background: "#fff0f0",
                        color: "#b00020",
                        border: "1px solid #ffcaca",
                        borderRadius: "8px",
                        padding: "14px",
                        marginBottom: "20px"
                    }}
                >
                    {erro}
                </div>

            )}


            {sucesso && (

                <div
                    style={{
                        background: "#effaf1",
                        color: "#16752b",
                        border: "1px solid #bce5c4",
                        borderRadius: "8px",
                        padding: "14px",
                        marginBottom: "20px",
                        fontWeight: "600"
                    }}
                >
                    {sucesso}
                </div>

            )}


            {/* FORMULÁRIO */}

            {mostrarFormulario && (

                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        padding: "25px",
                        marginBottom: "25px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.05)"
                    }}
                >

                    <h2
                        style={{
                            marginTop: 0
                        }}
                    >
                        Criar novo usuário
                    </h2>

                    <form
                        onSubmit={criarUsuario}
                    >

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(240px, 1fr))",
                                gap: "18px"
                            }}
                        >

                            {/* TIPO */}

                            <div>

                                <label>
                                    Tipo de usuário
                                </label>

                                <select
                                    value={tipoUsuario}
                                    onChange={
                                        (e) =>
                                            setTipoUsuario(
                                                e.target.value
                                            )
                                    }
                                    disabled={salvando}
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "11px",
                                        marginTop: "6px",
                                        borderRadius: "6px",
                                        border:
                                            "1px solid #ccc",
                                        background: "#fff"
                                    }}
                                >

                                    <option value="UT">
                                        UT
                                    </option>

                                    <option value="ADMIN">
                                        ADMIN
                                    </option>

                                </select>

                            </div>


                            {/* LOGIN */}

                            <div>

                                <label>
                                    Login
                                </label>

                                <input
                                    value={login}
                                    onChange={
                                        (e) =>
                                            setLogin(
                                                e.target.value
                                            )
                                    }
                                    placeholder={
                                        tipoUsuario === "ADMIN"
                                            ? "Ex.: nome@empresa.com.br"
                                            : "Ex.: 06.0403.003"
                                    }
                                    disabled={salvando}
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "11px",
                                        marginTop: "6px",
                                        borderRadius: "6px",
                                        border:
                                            "1px solid #ccc"
                                    }}
                                />

                                <small
                                    style={{
                                        color: "#777"
                                    }}
                                >
                                    {login.includes("@")
                                        ? "Será usado exatamente como e-mail."
                                        : "O sistema adicionará automaticamente @portal-sst.local."}
                                </small>

                            </div>


                            {/* NOME */}

                            <div>

                                <label>
                                    Nome do usuário
                                </label>

                                <input
                                    value={nome}
                                    onChange={
                                        (e) =>
                                            setNome(
                                                e.target.value
                                            )
                                    }
                                    placeholder={
                                        tipoUsuario === "ADMIN"
                                            ? "Ex.: Leilane Moreira"
                                            : "Ex.: SAMARCO SERVIÇOS MARIANA"
                                    }
                                    disabled={salvando}
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "11px",
                                        marginTop: "6px",
                                        borderRadius: "6px",
                                        border:
                                            "1px solid #ccc"
                                    }}
                                />

                            </div>


                            {/* NOME UT */}

                            {tipoUsuario === "UT" && (

                                <div>

                                    <label>
                                        Nome da UT
                                    </label>

                                    <input
                                        value={nomeUT}
                                        onChange={
                                            (e) =>
                                                setNomeUT(
                                                    e.target.value
                                                )
                                        }
                                        placeholder="Ex.: SAMARCO SERVIÇOS MARIANA"
                                        disabled={salvando}
                                        style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            padding: "11px",
                                            marginTop: "6px",
                                            borderRadius: "6px",
                                            border:
                                                "1px solid #ccc"
                                        }}
                                    />

                                </div>

                            )}


                            {/* NUMERO UT */}

                            {tipoUsuario === "UT" && (

                                <div>

                                    <label>
                                        Número da UT
                                    </label>

                                    <input
                                        value={numeroUT}
                                        onChange={
                                            (e) =>
                                                setNumeroUT(
                                                    e.target.value
                                                )
                                        }
                                        placeholder="Ex.: 06.0403.003"
                                        disabled={salvando}
                                        style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            padding: "11px",
                                            marginTop: "6px",
                                            borderRadius: "6px",
                                            border:
                                                "1px solid #ccc"
                                        }}
                                    />

                                </div>

                            )}


                            {/* SENHA */}

                            <div>

                                <label>
                                    Senha inicial
                                </label>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginTop: "6px"
                                    }}
                                >

                                    <input
                                        type="text"
                                        value={senha}
                                        onChange={
                                            (e) => {

                                                setSenha(
                                                    e.target.value
                                                );

                                                setGerarSenha(
                                                    false
                                                );

                                            }
                                        }
                                        placeholder="Senha inicial"
                                        disabled={salvando}
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            padding: "11px",
                                            borderRadius: "6px",
                                            border:
                                                "1px solid #ccc"
                                        }}
                                    />

                                    <button
    type="button"
    onClick={gerarNovaSenha}
    disabled={salvando}
    style={{
        padding: "0 18px",
        minWidth: "90px",
        minHeight: "44px",
        borderRadius: "7px",
        border: "none",
        backgroundColor: salvando
            ? "#cccccc"
            : "#ff6600",
        color: "#ffffff",
        cursor: salvando
            ? "not-allowed"
            : "pointer",
        fontWeight: "700",
        fontSize: "15px",
        opacity: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
    }}
>
    Gerar
</button>

                                </div>

                            </div>


                            {/* CONFIRMAÇÃO */}

                            {!gerarSenha && (

                                <div>

                                    <label>
                                        Confirmar senha
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            confirmarSenha
                                        }
                                        onChange={
                                            (e) =>
                                                setConfirmarSenha(
                                                    e.target.value
                                                )
                                        }
                                        disabled={salvando}
                                        style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            padding: "11px",
                                            marginTop: "6px",
                                            borderRadius: "6px",
                                            border:
                                                "1px solid #ccc"
                                        }}
                                    />

                                </div>

                            )}

                        </div>


                        {/* PRIMEIRO ACESSO */}

                        <div
                            style={{
                                marginTop: "20px",
                                background: "#fff8ed",
                                border:
                                    "1px solid #ffd8a8",
                                borderRadius: "8px",
                                padding: "15px"
                            }}
                        >
                            🔐{" "}
                            <strong>
                                Primeiro acesso
                            </strong>

                            <p
                                style={{
                                    margin:
                                        "8px 0 0",
                                    color: "#555"
                                }}
                            >
                                Este usuário será criado com{" "}
                                <strong>
                                    primeiroAcesso = true
                                </strong>{" "}
                                e deverá alterar a senha
                                obrigatoriamente no primeiro acesso.
                            </p>

                        </div>


                        {/* BOTÕES */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "flex-end",
                                gap: "10px",
                                marginTop: "22px"
                            }}
                        >

                            <button
    type="button"
    onClick={cancelarFormulario}
    disabled={salvando}
    style={{
        padding: "11px 22px",
        minHeight: "44px",
        borderRadius: "7px",
        border: "1px solid #999",
        backgroundColor: "#ffffff",
        color: "#222222",
        cursor: salvando
            ? "not-allowed"
            : "pointer",
        fontWeight: "600",
        fontSize: "15px",
        opacity: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
    }}
>
    Cancelar
</button>


                            <button
                                type="submit"
                                disabled={salvando}
                                style={{
                                    padding:
                                        "11px 22px",
                                    borderRadius:
                                        "7px",
                                    border: "none",
                                    background:
                                        "#ff6600",
                                    color: "#fff",
                                    fontWeight:
                                        "600",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                {salvando
                                    ? "Criando..."
                                    : "Criar usuário"}
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* PESQUISA */}

            <div
                style={{
                    marginBottom: "18px"
                }}
            >

                <input
                    value={pesquisa}
                    onChange={
                        (e) =>
                            setPesquisa(
                                e.target.value
                            )
                    }
                    placeholder="🔎 Pesquisar por nome, login, UT ou perfil..."
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "14px",
                        borderRadius: "8px",
                        border:
                            "1px solid #ccc",
                        fontSize: "15px"
                    }}
                />

            </div>


            {/* TABELA */}

            <div
                style={{
                    background: "#fff",
                    border:
                        "1px solid #ddd",
                    borderRadius: "12px",
                    overflow: "auto"
                }}
            >

                {carregando ? (

                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center"
                        }}
                    >
                        Carregando usuários...
                    </div>

                ) : usuariosFiltrados.length === 0 ? (

                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center",
                            color: "#777"
                        }}
                    >
                        Nenhum usuário encontrado.
                    </div>

                ) : (

                    <table
    style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed"
    }}
>

                        <thead>

                            <tr
                                style={{
                                    background:
                                        "#f5f5f5"
                                }}
                            >

                                <th
                                    style={{
                                        padding: "14px",
                                        textAlign: "left"
                                    }}
                                >
                                    Nome
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        textAlign: "left"
                                    }}
                                >
                                    Login
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        textAlign: "left"
                                    }}
                                >
                                    UT
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        textAlign: "left"
                                    }}
                                >
                                    Perfil
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        textAlign: "left"
                                    }}
                                >
                                    Status
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        textAlign: "left"
                                    }}
                                >
                                    Primeiro acesso
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        textAlign: "center"
                                    }}
                                >
                                    Ações
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {usuariosFiltrados.map(
                                (usuario) => (

                                    <tr
                                        key={
                                            usuario.uid
                                        }
                                        style={{
                                            borderTop:
                                                "1px solid #eee"
                                        }}
                                    >

                                        <td
                                            style={{
                                                padding:
                                                    "14px"
                                            }}
                                        >
                                            <strong>
                                                {
                                                    usuario.nome ||
                                                    "-"
                                                }
                                            </strong>
                                        </td>


                                        <td
                                            style={{
                                                padding:
                                                    "14px"
                                            }}
                                        >
                                            {
                                                usuario.login ||
                                                usuario.email ||
                                                "-"
                                            }
                                        </td>


                                        <td
                                            style={{
                                                padding:
                                                    "14px"
                                            }}
                                        >
                                            {
                                                usuario.numeroUT ||
                                                usuario.nomeUT ||
                                                "-"
                                            }
                                        </td>


                                        <td
                                            style={{
                                                padding:
                                                    "14px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display:
                                                        "inline-block",
                                                    padding:
                                                        "5px 9px",
                                                    borderRadius:
                                                        "20px",
                                                    background:
                                                        usuario.perfil ===
                                                        "ADMIN"
                                                            ? "#eee"
                                                            : "#fff0df",
                                                    fontWeight:
                                                        "600",
                                                    fontSize:
                                                        "12px"
                                                }}
                                            >
                                                {
                                                    usuario.perfil ||
                                                    "-"
                                                }
                                            </span>
                                        </td>


                                        <td
                                            style={{
                                                padding:
                                                    "14px"
                                            }}
                                        >
                                            {usuario.ativo !==
                                            false
                                                ? "🟢 Ativo"
                                                : "🔴 Inativo"}
                                        </td>


                                        <td
                                            style={{
                                                padding:
                                                    "14px"
                                            }}
                                        >
                                            {usuario.primeiroAcesso
                                                ? "⚠️ Sim"
                                                : "✅ Não"}
                                        </td>


                                        <td
                                            style={{
                                                padding:
                                                    "14px",
                                                textAlign:
                                                    "center"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap:
                                                        "7px",
                                                    justifyContent:
                                                        "center",
                                                    flexWrap:
                                                        "wrap"
                                                }}
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setUsuarioSelecionado(
                                                            usuario
                                                        )
                                                    }
                                                    style={{
                                                        padding:
                                                            "8px 12px",
                                                        border:
                                                            "1px solid #ccc",
                                                        background:
                                                            "#fff",
                                                        color:
                                                            "#222",
                                                        borderRadius:
                                                            "6px",
                                                        cursor:
                                                            "pointer",
                                                        fontWeight:
                                                            "600"
                                                    }}
                                                >
                                                    Ver
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirRedefinicao(
                                                            usuario
                                                        )
                                                    }
                                                    style={{
                                                        padding:
                                                            "8px 12px",
                                                        border:
                                                            "none",
                                                        background:
                                                            "#ff6600",
                                                        color:
                                                            "#fff",
                                                        borderRadius:
                                                            "6px",
                                                        cursor:
                                                            "pointer",
                                                        fontWeight:
                                                            "700"
                                                    }}
                                                >
                                                    🔑 Redefinir senha
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        alterarStatus(
                                                            usuario
                                                        )
                                                    }
                                                    style={{
                                                        padding:
                                                            "8px 12px",
                                                        border:
                                                            "none",
                                                        background:
                                                            usuario.ativo ===
                                                            false
                                                                ? "#198754"
                                                                : "#dc3545",
                                                        color:
                                                            "#fff",
                                                        borderRadius:
                                                            "6px",
                                                        cursor:
                                                            "pointer",
                                                        fontWeight:
                                                            "600"
                                                    }}
                                                >
                                                    {usuario.ativo ===
                                                    false
                                                        ? "Ativar"
                                                        : "Desativar"}
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =================================================
               MODAL / DETALHES
            ================================================= */}

            {usuarioSelecionado && (

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        zIndex: 9999
                    }}
                >

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "12px",
                            padding: "25px",
                            width: "100%",
                            maxWidth: "550px",
                            boxShadow:
                                "0 10px 40px rgba(0,0,0,.2)"
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center"
                            }}
                        >

                            <h2
                                style={{
                                    margin: 0
                                }}
                            >
                                Dados do usuário
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setUsuarioSelecionado(
                                        null
                                    )
                                }
                                style={{
                                    border: "none",
                                    background:
                                        "transparent",
                                    fontSize: "24px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                ×
                            </button>

                        </div>


                        <div
                            style={{
                                marginTop: "20px",
                                lineHeight: "1.9"
                            }}
                        >

                            <p>
                                <strong>Nome:</strong>{" "}
                                {
                                    usuarioSelecionado.nome ||
                                    "-"
                                }
                            </p>

                            <p>
                                <strong>Login:</strong>{" "}
                                {
                                    usuarioSelecionado.login ||
                                    "-"
                                }
                            </p>

                            <p>
                                <strong>E-mail:</strong>{" "}
                                {
                                    usuarioSelecionado.email ||
                                    transformarLogin(
                                        usuarioSelecionado.login
                                    )
                                }
                            </p>

                            <p>
                                <strong>Perfil:</strong>{" "}
                                {
                                    usuarioSelecionado.perfil ||
                                    "-"
                                }
                            </p>

                            <p>
                                <strong>Nome UT:</strong>{" "}
                                {
                                    usuarioSelecionado.nomeUT ||
                                    "-"
                                }
                            </p>

                            <p>
                                <strong>Número UT:</strong>{" "}
                                {
                                    usuarioSelecionado.numeroUT ||
                                    "-"
                                }
                            </p>

                            <p>
                                <strong>Primeiro acesso:</strong>{" "}
                                {
                                    usuarioSelecionado.primeiroAcesso
                                        ? "Sim — deverá alterar a senha"
                                        : "Não"
                                }
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {
                                    usuarioSelecionado.ativo ===
                                    false
                                        ? "Inativo"
                                        : "Ativo"
                                }
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() => {
                                const usuario =
                                    usuarioSelecionado;

                                setUsuarioSelecionado(
                                    null
                                );

                                abrirRedefinicao(
                                    usuario
                                );
                            }}
                            style={{
                                marginTop: "12px",
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                borderRadius: "7px",
                                background:
                                    "#ff6600",
                                color: "#fff",
                                fontWeight: "700",
                                cursor: "pointer"
                            }}
                        >
                            🔑 Redefinir senha deste usuário
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setUsuarioSelecionado(
                                    null
                                )
                            }
                            style={{
                                marginTop: "10px",
                                width: "100%",
                                padding: "12px",
                                border:
                                    "1px solid #ccc",
                                borderRadius: "7px",
                                background:
                                    "#fff",
                                color:
                                    "#222",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Fechar
                        </button>

                    </div>

                </div>

            )}


            {/* =================================================
               MODAL / REDEFINIÇÃO
            ================================================= */}

            {usuarioRedefinindo && (

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,0.50)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        zIndex: 10000
                    }}
                >

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "28px",
                            width: "100%",
                            maxWidth: "560px",
                            boxShadow:
                                "0 15px 50px rgba(0,0,0,.25)"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: 0,
                                marginBottom: "8px"
                            }}
                        >
                            🔑 Redefinir senha
                        </h2>

                        <p
                            style={{
                                color: "#555",
                                marginTop: 0
                            }}
                        >
                            Você está redefinindo a senha de:
                        </p>

                        <div
                            style={{
                                background:
                                    "#f7f7f7",
                                borderRadius:
                                    "8px",
                                padding:
                                    "14px",
                                marginBottom:
                                    "20px"
                            }}
                        >

                            <strong>
                                {
                                    usuarioRedefinindo.nome ||
                                    "-"
                                }
                            </strong>

                            <br />

                            Login:{" "}
                            {
                                usuarioRedefinindo.login ||
                                usuarioRedefinindo.email ||
                                "-"
                            }

                        </div>


                        <label>
                            Nova senha
                        </label>

                        <div
                            style={{
                                display:
                                    "flex",
                                gap: "8px",
                                marginTop:
                                    "6px"
                            }}
                        >

                            <input
                                type="text"
                                value={novaSenha}
                                onChange={
                                    (e) =>
                                        setNovaSenha(
                                            e.target.value
                                        )
                                }
                                disabled={
                                    redefinindo
                                }
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding:
                                        "12px",
                                    borderRadius:
                                        "7px",
                                    border:
                                        "1px solid #ccc",
                                    fontSize:
                                        "15px"
                                }}
                            />

                            <button
    type="button"
    onClick={gerarSenhaRedefinicao}
    disabled={redefinindo}
    style={{
        padding: "0 18px",
        minWidth: "90px",
        minHeight: "44px",
        borderRadius: "7px",
        border: "none",
        backgroundColor: redefinindo
            ? "#cccccc"
            : "#ff6600",
        color: "#ffffff",
        cursor: redefinindo
            ? "not-allowed"
            : "pointer",
        fontWeight: "700",
        fontSize: "15px",
        opacity: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
    }}
>
    Gerar
</button>

                        </div>


                        <label
                            style={{
                                display:
                                    "block",
                                marginTop:
                                    "15px"
                            }}
                        >
                            Confirmar nova senha
                        </label>

                        <input
                            type="text"
                            value={
                                confirmarNovaSenha
                            }
                            onChange={
                                (e) =>
                                    setConfirmarNovaSenha(
                                        e.target.value
                                    )
                            }
                            disabled={
                                redefinindo
                            }
                            style={{
                                width:
                                    "100%",
                                boxSizing:
                                    "border-box",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                borderRadius:
                                    "7px",
                                border:
                                    "1px solid #ccc",
                                fontSize:
                                    "15px"
                            }}
                        />


                        <div
                            style={{
                                marginTop:
                                    "18px",
                                padding:
                                    "14px",
                                background:
                                    "#fff8ed",
                                border:
                                    "1px solid #ffd8a8",
                                borderRadius:
                                    "8px",
                                color:
                                    "#5d4a2d"
                            }}
                        >
                            🔐 Após a redefinição,{" "}
                            <strong>
                                primeiroAcesso = true
                            </strong>
                            . O usuário será obrigado a
                            trocar essa senha no próximo login.
                        </div>


                        <div
                            style={{
                                display:
                                    "flex",
                                gap:
                                    "10px",
                                marginTop:
                                    "22px"
                            }}
                        >

                            <button
                                type="button"
                                onClick={
                                    fecharRedefinicao
                                }
                                disabled={
                                    redefinindo
                                }
                                style={{
                                    flex: 1,
                                    padding:
                                        "12px",
                                    border:
                                        "1px solid #ccc",
                                    borderRadius:
                                        "7px",
                                    background:
                                        "#fff",
                                    color:
                                        "#222",
                                    fontWeight:
                                        "600",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Cancelar
                            </button>


                            <button
                                type="button"
                                onClick={
                                    redefinirSenhaUsuario
                                }
                                disabled={
                                    redefinindo
                                }
                                style={{
                                    flex: 1,
                                    padding:
                                        "12px",
                                    border: "none",
                                    borderRadius:
                                        "7px",
                                    background:
                                        "#ff6600",
                                    color:
                                        "#fff",
                                    fontWeight:
                                        "700",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                {redefinindo
                                    ? "Redefinindo..."
                                    : "Redefinir senha"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Usuarios;