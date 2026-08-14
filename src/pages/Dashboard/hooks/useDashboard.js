import { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";

function useDashboard(){

    const [cards,setCards]=useState({});

    const [solicitacoes,setSolicitacoes]=useState([]);

    const [vencimentos,setVencimentos]=useState([]);

    const [atividades,setAtividades]=useState([]);

    const [notificacoes,setNotificacoes]=useState([]);

    const [graficoTipos,setGraficoTipos]=useState([]);
    
    const [producaoMensal,setProducaoMensal]=useState([]);

    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        carregarDashboard();

    },[]);

    async function carregarDashboard(){

        setLoading(true);

        const dados = await dashboardService.buscarDashboard();

        setCards(dados.cards);

setSolicitacoes(dados.solicitacoes);

setVencimentos(dados.vencimentos);

setAtividades(dados.atividades);

setNotificacoes(dados.notificacoes || []);

setGraficoTipos(dados.graficoTipos);

setProducaoMensal(dados.producaoMensal);

        setLoading(false);

    }

    return{

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