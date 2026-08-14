function LegendaCalendario() {

    const itens = [

        {

            cor:"#2196F3",

            texto:"Análise Técnica"

        },

        {

            cor:"#43A047",

            texto:"Elaboração PGR"

        },

        {

            cor:"#8E24AA",

            texto:"Elaboração PCMSO"

        },

        {

            cor:"#FB8C00",

            texto:"Alerta de Revisão"

        },

        {

            cor:"#E53935",

            texto:"Vencimento"

        }

    ];

    return (

        <div className="legendaCalendario">

            <h3>

                Legenda

            </h3>

            <div className="itensLegenda">

                {

                    itens.map((item,index)=>(

                        <div

                            key={index}

                            className="itemLegenda"

                        >

                            <span

                                className="corLegenda"

                                style={{

                                    background:item.cor

                                }}

                            />

                            {item.texto}

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default LegendaCalendario;