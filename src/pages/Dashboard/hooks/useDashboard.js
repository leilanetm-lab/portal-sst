import { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";
import { usuarioAtual } from "../../../services/authService";
import { ouvirNotificacoes } from "../../../services/notificacoesService";

function useDashboard() {

    const [cards, setCards] = useState({});
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [vencimentos, setVencimentos] = useState([]);
    const [atividades, setAtividades] = useState([]);
    const [notificacoes, setNotificacoes] = useState([]);
    const [graficoTipos, setGraficoTipos] = useState([]);
    const [producaoMensal, setProducaoMensal] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDashboard();
    }, []);

    useEffect(() => {
        const usuario = usuarioAtual();

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

    async function carregarDashboard() {

        setLoading(true);

        const dados = await dashboardService.buscarDashboard();

        setCards(dados.cards);
        setSolicitacoes(dados.solicitacoes);
        setVencimentos(dados.vencimentos);
        setAtividades(dados.atividades);
        setGraficoTipos(dados.graficoTipos);
        setProducaoMensal(dados.producaoMensal);

        setLoading(false);

    }

    return {
        cards,
        solicitacoes,
        vencimentos,
        atividades,
        notificacoes,
        graficoTipos,
        producaoMensal,
        loading,
        atualizar: carregarDashboard
    };

}

export default useDashboard;