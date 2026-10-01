import { useEffect, useState } from "react";

import indicadoresService from "../services/indicadoresService";

function useIndicadores(ano, mes, filtros = {}){

    const [cards,setCards]=useState({});

    const [producaoMensal,setProducaoMensal]=useState({});

    const [tiposSolicitacao,setTiposSolicitacao]=useState({});

    const [produtividadeMensal,setProdutividadeMensal]=useState({});

    const [engenhariaMensal,setEngenhariaMensal]=useState({});

    const [vencimentos,setVencimentos]=useState([]);

    const [graficoVencimentos,setGraficoVencimentos]=useState({});

    const [resumoTecnico,setResumoTecnico]=useState({});

    const [graficoSLA,setGraficoSLA]=useState([]);

    const [complexidadeMensal,setComplexidadeMensal]=useState({});

    const [devolucoesCards,setDevolucoesCards]=useState({});

    const [topMotivos,setTopMotivos]=useState([]);

    const [distribuicaoDevolucoes,setDistribuicaoDevolucoes]=useState({});

    const [utDetalhe,setUtDetalhe]=useState([]);

    const [evolucaoMensal,setEvolucaoMensal]=useState([]);

    const [utOptions,setUtOptions]=useState([]);

    const [acompanhamentoPosDisponibilizacao,setAcompanhamentoPosDisponibilizacao]=useState({
        cards: {},
        slaPostagemPorUT: [],
        slaRetornoPorUT: [],
        reprovaçõesPorUT: [],
        tabelaUT: []
    });

    const [loading,setLoading]=useState(true);

    useEffect(() => {

        carregarIndicadores();

    }, [
        ano,
        mes,
        filtros.dataInicio,
        filtros.dataFim,
        filtros.ut,
        filtros.modalidade,
        filtros.status
    ]);


    async function carregarIndicadores(){

        setLoading(true);

        const dados =
            await indicadoresService.buscarIndicadores(
                ano,
                mes,
                filtros
            );

        setCards(
            dados.cards
        );

        setProducaoMensal(
            dados.producaoMensal
        );

        setTiposSolicitacao(
            dados.tiposSolicitacao
        );

        setProdutividadeMensal(
            dados.produtividadeMensal
        );

        setEngenhariaMensal(
            dados.engenhariaMensal
        );

        setComplexidadeMensal(
            dados.complexidadeMensal
        );

        setVencimentos(
            dados.vencimentos
        );

        setResumoTecnico(
            dados.resumoTecnico
        );

        setGraficoSLA(
            dados.graficoSLA
        );

        setGraficoVencimentos(
            dados.graficoVencimentos
        );

        setDevolucoesCards(
            dados.devolucoesCards
        );

        setTopMotivos(
            dados.topMotivos
        );

        setDistribuicaoDevolucoes(
            dados.distribuicaoDevolucoes
        );

        setUtDetalhe(
            dados.utDetalhe
        );

        setEvolucaoMensal(
            dados.evolucaoMensal
        );

        setUtOptions(
            dados.utOptions
        );

        setAcompanhamentoPosDisponibilizacao(
            dados.acompanhamentoPosDisponibilizacao || {
                cards: {},
                slaPostagemPorUT: [],
                slaRetornoPorUT: [],
                reprovaçõesPorUT: [],
                tabelaUT: []
            }
        );

        setLoading(false);

    }

    return{

        cards,

        producaoMensal,

        tiposSolicitacao,

        produtividadeMensal,

        engenhariaMensal,

        complexidadeMensal,

        vencimentos,

        graficoVencimentos,

        resumoTecnico,

        graficoSLA,

        devolucoesCards,

        topMotivos,

        distribuicaoDevolucoes,

        utDetalhe,

        evolucaoMensal,

        utOptions,

        acompanhamentoPosDisponibilizacao,

        loading,

        atualizar:carregarIndicadores

    };

}

export default useIndicadores;