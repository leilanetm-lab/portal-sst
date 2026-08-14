import { useEffect, useState } from "react";

import indicadoresService from "../services/indicadoresService";

function useIndicadores(ano, mes){

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

    const [loading,setLoading]=useState(true);

    useEffect(() => {

        carregarIndicadores();

    }, [ano, mes]);


    async function carregarIndicadores(){

        setLoading(true);

        const dados =
            await indicadoresService.buscarIndicadores(
                ano,
                mes
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

        loading,

        atualizar:carregarIndicadores

    };

}

export default useIndicadores;