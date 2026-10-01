import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { auth } from "../../firebase/firebaseConfig";
import {
    marcarNotificacaoComoLida,
    ouvirNotificacoes
} from "../../services/notificacoesService";

import "./Notificacoes.css";

function Notificacoes() {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [notificacoes, setNotificacoes] = useState([]);
    const [filtro, setFiltro] = useState("todas");

    useEffect(() => {

        const usuario = auth.currentUser;

        if (!usuario) {
            setNotificacoes([]);
            return undefined;
        }

        const cancelar = ouvirNotificacoes(
            usuario.uid,
            (lista) => setNotificacoes(lista)
        );

        return cancelar;

    }, []);

    useEffect(() => {
        const filtroAtual = searchParams.get("filtro");

        if (filtroAtual === "nao-lidas") {
            setFiltro("nao-lidas");
            return;
        }

        if (filtroAtual === "lidas") {
            setFiltro("lidas");
            return;
        }

        setFiltro("todas");

    }, [searchParams]);

    const notificacoesFiltradas = useMemo(() => {
        if (filtro === "nao-lidas") {
            return notificacoes.filter((notificacao) => !notificacao.lida);
        }

        if (filtro === "lidas") {
            return notificacoes.filter((notificacao) => notificacao.lida);
        }

        return notificacoes;
    }, [filtro, notificacoes]);

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

        navigate("/dashboard");

    }

    async function abrirNotificacao(notificacao) {

        if (notificacao?.id && !notificacao.lida) {
            await marcarNotificacaoComoLida(notificacao.id);
        }

        abrirDestino(notificacao);

    }

    return (

        <div className="notificacoesPagina">

            <button
                className="btnVoltarNotificacoes"
                type="button"
                onClick={() => navigate(-1)}
            >
                ← Voltar
            </button>

            <div className="notificacoesCabecalho">
                <h1>🔔 Notificações</h1>
                <p>Consulte os avisos e comunicações da sua conta.</p>
            </div>

            <div className="filtrosNotificacoes">
                <button
                    type="button"
                    className={`filtroBotao ${filtro === "todas" ? "ativo" : ""}`}
                    onClick={() => {
                        setFiltro("todas");
                        setSearchParams({});
                    }}
                >
                    Todas
                </button>

                <button
                    type="button"
                    className={`filtroBotao ${filtro === "nao-lidas" ? "ativo" : ""}`}
                    onClick={() => {
                        setFiltro("nao-lidas");
                        setSearchParams({ filtro: "nao-lidas" });
                    }}
                >
                    Não lidas
                </button>

                <button
                    type="button"
                    className={`filtroBotao ${filtro === "lidas" ? "ativo" : ""}`}
                    onClick={() => {
                        setFiltro("lidas");
                        setSearchParams({ filtro: "lidas" });
                    }}
                >
                    Lidas
                </button>
            </div>

            {notificacoesFiltradas.length === 0 ? (
                <div className="notificacoesCard">
                    <div className="notificacaoVaziaIcone">🔔</div>
                    <h2>Nenhuma notificação</h2>
                    <p>
                        {filtro === "nao-lidas"
                            ? "Nenhuma notificação pendente no momento."
                            : "No momento, não existem notificações para sua conta."}
                    </p>
                </div>
            ) : (
                <div className="notificacoesLista">
                    {notificacoesFiltradas.map((notificacao) => (
                        <button
                            key={notificacao.id}
                            type="button"
                            className={`notificacaoItem ${notificacao.lida ? "lida" : "naoLida"}`}
                            onClick={() => abrirNotificacao(notificacao)}
                        >
                            <span className="notificacaoIcone">
                                {obterIcone(notificacao.tipo)}
                            </span>

                            <div className="notificacaoConteudo">
                                <div className="notificacaoTopo">
                                    <strong>{notificacao.titulo || "Notificação"}</strong>
                                    {!notificacao.lida && <span className="pontoNaoLida" />}
                                </div>
                                <p>{notificacao.mensagem || notificacao.descricao || "Sem descrição."}</p>
                                <small>{formatarTempo(notificacao.criadoEm)}</small>
                            </div>
                        </button>
                    ))}
                </div>
            )}

        </div>

    );

}

export default Notificacoes;