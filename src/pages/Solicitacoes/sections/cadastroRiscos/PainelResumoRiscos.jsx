function PainelResumoRiscos({ riscos = [] }) {

    const total = riscos.length;

    const completos = riscos.filter(
        item => item.valido
    ).length;

    const pendentes = total - completos;

    return (

        <div className="painelResumoRiscos">

            <div className="resumoCard">

                <div className="numeroResumo">

                    {total}

                </div>

                <div className="tituloResumo">

                    📋 Riscos cadastrados

                </div>

            </div>

            <div className="resumoCard completo">

                <div className="numeroResumo">

                    {completos}

                </div>

                <div className="tituloResumo">

                    🟢 Completos

                </div>

            </div>

            <div className="resumoCard pendente">

                <div className="numeroResumo">

                    {pendentes}

                </div>

                <div className="tituloResumo">

                    🔴 Pendentes

                </div>

            </div>

        </div>

    );

}

export default PainelResumoRiscos;