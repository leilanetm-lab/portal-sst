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

import {
    marcarNotificacaoComoLida,
    marcarTodasComoLidas,
    ouvirNotificacoes
} from "../services/notificacoesService";


function Header() {

    const navigate = useNavigate();

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

    const [nomeUsuario, setNomeUsuario] =
        useState("Carregando...");

    const [perfilUsuario, setPerfilUsuario] =
        useState("");

    const [iniciais, setIniciais] =
        useState("...");

    const [saindo, setSaindo] =
        useState(false);

    const [notificacoes, setNotificacoes] =
        useState([]);

    const [painelAberto, setPainelAberto] =
        useState(false);

    useEffect(() => {

        let cancelarListener = () => {};

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    cancelarListener();

                    if (!usuarioFirebase) {

                        setNomeUsuario("Usuário");
                        setPerfilUsuario("");
                        setIniciais("US");
                        setNotificacoes([]);
                        return;

                    }

                    await carregarDadosUsuario(usuarioFirebase.uid);

                    cancelarListener =
                        ouvirNotificacoes(
                            usuarioFirebase.uid,
                            (lista) => setNotificacoes(lista)
                        );

                }
            );

        return () => {
            cancelarListener();
            cancelar();
        };

    }, []);

    useEffect(() => {

        if (!painelAberto) {
            return undefined;
        }

        const fecharPainel = (evento) => {
            if (!evento.target.closest(".areaNotificacao")) {
                setPainelAberto(false);
            }
        };

        document.addEventListener("click", fecharPainel);

        return () => {
            document.removeEventListener("click", fecharPainel);
        };

    }, [painelAberto]);

    async function carregarDadosUsuario(uid) {

        try {

            const referencia =
                doc(
                    db,
                    "Usuarios",
                    uid
                );

            const documento =
                await getDoc(referencia);

            if (!documento.exists()) {
                setNomeUsuario("Usuário");
                setPerfilUsuario("Não identificado");
                setIniciais("US");
                return;
            }

            const dados = documento.data();

            if (dados.perfil === "UT") {
                const nome = dados.nomeUT || dados.nome || "Usuário UT";
                definirUsuario(nome, "Usuário UT");
                return;
            }

            if (dados.perfil === "ADMIN") {
                const nome = dados.nome || "Administrador";
                definirUsuario(nome, "Administrador SST");
                return;
            }

            const nome = dados.nomeUT || dados.nome || "Usuário";
            definirUsuario(nome, dados.perfil || "Usuário");

        }
        catch (erro) {
            console.error("Erro ao buscar usuário:", erro);
            setNomeUsuario("Erro ao carregar");
            setPerfilUsuario("");
            setIniciais("ER");
        }

    }

    function definirUsuario(nome, perfil) {

        setNomeUsuario(nome);
        setPerfilUsuario(perfil);

        const partes =
            String(nome)
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        let iniciaisGeradas = "US";

        if (partes.length >= 2) {
            iniciaisGeradas = (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
        } else if (partes.length === 1) {
            iniciaisGeradas = partes[0].substring(0, 2).toUpperCase();
        }

        setIniciais(iniciaisGeradas);

    }

    const naoLidas =
        notificacoes.filter((notificacao) => !notificacao.lida).length;

    function formatarTempo(criadoEm) {

        if (!criadoEm) {
            return "Agora";
        }

        const data = criadoEm?.toDate ? criadoEm.toDate() : new Date(criadoEm);
        const diferenca = Date.now() - data.getTime();

        if (Number.isNaN(diferenca)) {
            return "Agora";
        }

        const minutos = Math.max(1, Math.round(diferenca / 60000));

        if (minutos < 60) {
            return `Há ${minutos} minuto${minutos === 1 ? "" : "s"}`;
        }

        const horas = Math.round(minutos / 60);

        if (horas < 24) {
            return `Há ${horas} hora${horas === 1 ? "" : "s"}`;
        }

        const dias = Math.round(horas / 24);
        return `Há ${dias} dia${dias === 1 ? "" : "s"}`;

    }

    function obterIcone(tipo) {

        const valor = String(tipo || "").toLowerCase();

        if (valor.includes("solicitacao") || valor.includes("pgr")) return "📩";
        if (valor.includes("correc") || valor.includes("devolv")) return "🔁";
        if (valor.includes("cadastro")) return "📝";
        if (valor.includes("analise") || valor.includes("alerta") || valor.includes("pendencia")) return "⚠️";

        return "🔔";

    }

    function abrirDestino(notificacao) {

        if (notificacao?.rota) {
            navigate(notificacao.rota);
            return;
        }

        if (notificacao?.solicitacaoId) {
            navigate(`/solicitacoes/${notificacao.solicitacaoId}`);
            return;
        }

        navigate("/notificacoes");

    }

    async function aoClicarNotificacao(notificacao) {

        if (notificacao?.id && !notificacao.lida) {
            await marcarNotificacaoComoLida(notificacao.id);
        }

        setPainelAberto(false);
        abrirDestino(notificacao);

    }

    async function marcarTodasLidasNoPainel() {

        if (!notificacoes.length) {
            return;
        }

        await marcarTodasComoLidas(notificacoes);

    }

    async function sairDoPortal() {

        try {

            setSaindo(true);
            await sair();
            navigate("/");

        }
        catch (erro) {

            console.error("Erro ao sair:", erro);
            alert("Não foi possível sair do portal.");
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

                <div className="areaNotificacao">

                    <button
                        className="btnNotificacao"
                        type="button"
                        onClick={() => setPainelAberto((valor) => !valor)}
                    >
                        🔔

                        {naoLidas > 0 && (
                            <span className="badgeNotificacao">
                                {naoLidas > 99 ? "99+" : naoLidas}
                            </span>
                        )}

                    </button>

                    {painelAberto && (
                        <div className="painelNotificacoes">

                            <div className="cabecalhoNotificacoes">
                                <strong>Notificações</strong>

                                {naoLidas > 0 && (
                                    <button
                                        type="button"
                                        className="btnMarcarLidas"
                                        onClick={marcarTodasLidasNoPainel}
                                    >
                                        Marcar todas como lidas
                                    </button>
                                )}
                            </div>

                            {notificacoes.length === 0 ? (
                                <div className="semNotificacoes">
                                    <div>🔔</div>
                                    <strong>Sem novas notificações</strong>
                                    <span>Você está em dia com a sua conta.</span>
                                </div>
                            ) : (
                                <div className="listaNotificacoes">
                                    {notificacoes.slice(0, 6).map((notificacao) => (
                                        <button
                                            key={notificacao.id}
                                            type="button"
                                            className={`itemNotificacao ${!notificacao.lida ? "naoLida" : ""}`}
                                            onClick={() => aoClicarNotificacao(notificacao)}
                                        >
                                            <span className="iconeNotificacao">
                                                {obterIcone(notificacao.tipo)}
                                            </span>

                                            <div className="conteudoNotificacao">
                                                <strong>{notificacao.titulo || "Notificação"}</strong>
                                                <p>{notificacao.mensagem || notificacao.descricao || "Sem descrição."}</p>
                                                <small>{formatarTempo(notificacao.criadoEm)}</small>
                                            </div>

                                            {!notificacao.lida && <span className="pontoNaoLida" />}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {notificacoes.length > 0 && (
                                <div className="cabecalhoNotificacoes cabecalhoNotificacoesInferior">
                                    <button
                                        type="button"
                                        className="btnVerTodasNotificacoes"
                                        onClick={() => {
                                            setPainelAberto(false);
                                            navigate("/notificacoes");
                                        }}
                                    >
                                        Ver todas as notificações
                                    </button>
                                </div>
                            )}

                        </div>
                    )}

                </div>

                <div className="usuarioHeader">
                    <div>
                        <strong>{nomeUsuario}</strong>
                        <small>{perfilUsuario}</small>
                    </div>

                    <div className="avatarUsuario">
                        {iniciais}
                    </div>
                </div>

                <button
                    type="button"
                    className="btnSair"
                    onClick={sairDoPortal}
                    disabled={saindo}
                >
                    {saindo ? "Saindo..." : "Sair"}
                </button>

            </div>

        </header>

    );

}

export default Header;