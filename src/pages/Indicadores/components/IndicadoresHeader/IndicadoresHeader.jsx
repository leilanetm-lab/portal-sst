import "./IndicadoresHeader.css";

function IndicadoresHeader({
    ano,
    mes,
    onAnoChange,
    onMesChange,
    atualizar
}) {

    return (

        <div className="indicadoresHeader">

            <div>

                <h1>📊 Indicadores Gerenciais</h1>

                <p>
                    Acompanhe a produtividade, SLA e desempenho da Engenharia de Segurança.
                </p>

            </div>

            <div className="filtrosIndicadores">

                <select
                    value={ano}
                    onChange={(e) =>
                        onAnoChange(Number(e.target.value))
                    }
                >

                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>

                </select>

                <select
                    value={mes}
                    onChange={(e) =>
                        onMesChange(e.target.value)
                    }
                >

                    <option value="">
                        Todos os meses
                    </option>

                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>

                </select>

            </div>

        </div>

    );
}

export default IndicadoresHeader;