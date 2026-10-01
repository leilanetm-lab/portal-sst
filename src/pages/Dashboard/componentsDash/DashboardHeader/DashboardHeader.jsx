import { useNavigate } from "react-router-dom";
import "./DashboardHeader.css";

function DashboardHeader({

    usuario = "Leilane",

    notificacoes = [],

    atualizar,

    atualizando = false

}) {

    const navigate = useNavigate();

    const hoje = new Date();
    const hora = hoje.getHours();

    let saudacao = "Olá";

    if (hora < 12) {

        saudacao = "Bom dia";

    } else if (hora < 18) {

        saudacao = "Boa tarde";

    } else {

        saudacao = "Boa noite";

    }

    const data = hoje.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

    const totalNotificacoes = notificacoes.length;
    const naoLidas = notificacoes.filter((notificacao) => !notificacao.lida).length;

    const possuiCritica = notificacoes.some((notificacao) => {

        if (notificacao.lida) {
            return false;
        }

        const texto = `${notificacao.titulo || ""} ${notificacao.mensagem || ""}`.toLowerCase();

        return (
            notificacao.tipo === "critico" ||
            /crit|pendencia|pendências|devolv|correção|correcao|revisao|revisão|aguard/i.test(texto)
        );

    });

    function abrirNotificacoes() {
        navigate("/notificacoes");
    }

    function abrirPendenciasCriticas() {

        if (!possuiCritica) {
            return;
        }

        navigate("/notificacoes?filtro=nao-lidas");

    }

    function executarTecla(evento, funcao) {

        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            funcao();
        }

    }

    return (

        <div className="dashboardHeader">

            <div className="dashboardTitulo">

                <div>

                    <h1>

                        {saudacao}, {usuario} 👋

                    </h1>

                    <p>

                        {data}

                    </p>

                </div>

                <button
                    className="botaoAtualizar"
                    onClick={atualizar}
                    disabled={atualizando}
                >

                    {atualizando ? "Atualizando..." : "Atualizar"}

                </button>

            </div>

            <div className="dashboardResumo">

                <div
                    className={`resumoCard resumoCardAcionavel ${possuiCritica ? "resumoCardCritico" : ""}`}
                    onClick={possuiCritica ? abrirPendenciasCriticas : undefined}
                    onKeyDown={(evento) => executarTecla(evento, abrirPendenciasCriticas)}
                    role={possuiCritica ? "button" : undefined}
                    tabIndex={possuiCritica ? 0 : undefined}
                >

                    <span>

                        📌 Hoje

                    </span>

                    <small>

                        {possuiCritica
                            ? "Existem pendências críticas."
                            : "Nenhuma pendência crítica."}

                    </small>

                </div>

                <div
                    className="resumoCard resumoCardAcionavel"
                    onClick={abrirNotificacoes}
                    onKeyDown={(evento) => executarTecla(evento, abrirNotificacoes)}
                    role="button"
                    tabIndex={0}
                >

                    <span>

                        🔔 Notificações

                    </span>

                    <small>

                        {totalNotificacoes === 0
                            ? "Você não possui notificações."
                            : `Você possui ${totalNotificacoes} notificação(ões).`}

                    </small>

                    {naoLidas > 0 && (
                        <span className="badgeResumoCard">
                            {naoLidas}
                        </span>
                    )}

                </div>

                <div className="resumoCard">

                    <span>

                        📄 Portal SST

                    </span>

                    <small>

                        Bem-vindo ao Sistema de Gestão de Documentos Legais.

                    </small>

                </div>

            </div>

        </div>

    );

}

export default DashboardHeader;