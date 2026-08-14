import ComboChartSST from "../../../../components/charts/ComboChartSST/ComboChartSST";

function GraficoProducao({
    producaoMensal
}){

    const ordemMeses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"
    ];

    const dados = ordemMeses

        .filter(mes => producaoMensal?.[mes])

        .map(mes => ({

            mes,

            Planejado:
                producaoMensal[mes].planejado,

            Realizado:
                producaoMensal[mes].realizado,

            Aderencia:
                producaoMensal[mes].aderencia,

            Abertas:
                producaoMensal[mes].abertas

        }));

    return(

        <ComboChartSST

            titulo="📅 Planejamento x Execução"

            dados={dados}

            barra1="Planejado"

            barra2="Realizado"

            linha="Aderencia"

            linhaSecundaria="Abertas"

            linhaSecundariaPontilhada

        />

    );

}

export default GraficoProducao;