import { useState } from "react";

import "./Indicadores.css";

import useIndicadores from "./components/hooks/useIndicadores";

import IndicadoresHeader from "./components/IndicadoresHeader/IndicadoresHeader";
import IndicadoresCards from "./components/IndicadoresCards/IndicadoresCards";

import GraficoProducao from "./components/GraficoProducao/GraficoProducao";
import GraficoSolicitacoes from "./components/GraficoSolicitacoes/GraficoSolicitacoes";
import GraficoSLA from "./components/GraficoSLA/GraficoSLA";
import GraficoEngenharia from "./components/GraficoEngenharia/GraficoEngenharia";
import GraficoProdutividade from "./components/GraficoProdutividade/GraficoProdutividade";
import GraficoVencimentos from "./components/GraficoVencimentos/GraficoVencimentos";
import GraficoComplexidade from "./components/GraficoComplexidade/GraficoComplexidade";
import GraficoProducaoTecnica from "./components/GraficoProducaoTecnica/GraficoProducaoTecnica";
import GraficoSaving from "./components/GraficoSaving/GraficoSaving";

function Indicadores() {

    const [ano, setAno] = useState(2026);

    const [mes, setMes] = useState("");

    const {
    cards,
    producaoMensal,
    tiposSolicitacao,
    produtividadeMensal,
    engenhariaMensal,
    vencimentos,
    graficoVencimentos,
    resumoTecnico,
    complexidadeMensal,
    graficoSLA,
    loading,
    atualizar
} = useIndicadores(
    ano,
    mes
);

    if (loading) {

        return (

            <p>
                Carregando...
            </p>

        );

    }

    return (

        <div className="indicadores">

            <IndicadoresHeader

                ano={ano}

                mes={mes}

                onAnoChange={setAno}

                onMesChange={setMes}

                atualizar={atualizar}

            />

            <IndicadoresCards

                cards={cards}

                resumoTecnico={resumoTecnico}

            />

            <GraficoProducao

                producaoMensal={producaoMensal}

            />

            <GraficoSolicitacoes

                dados={

                    Object.entries(
                        tiposSolicitacao || {}
                    ).map(([tipo, quantidade]) => ({

                        tipo,

                        quantidade

                    }))

                }

            />

            <GraficoSLA

                dados={graficoSLA}

            />

            <GraficoEngenharia

                dados={engenhariaMensal}

            />

            <GraficoVencimentos

    dados={graficoVencimentos}

/>

            <GraficoProdutividade

                dados={produtividadeMensal}

            />

            <GraficoComplexidade
    resumo={resumoTecnico}
    dados={complexidadeMensal}
/>

            <GraficoProducaoTecnica

    resumo={resumoTecnico}

    dados={engenhariaMensal}

 />

            <GraficoSaving />

        </div>

    );
}

export default Indicadores;