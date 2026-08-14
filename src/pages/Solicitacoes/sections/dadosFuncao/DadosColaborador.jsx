function DadosColaborador({

    dadosFuncao,

    setDadosFuncao

}) {

    function alterarCampo(e) {

        const { name, value, type, checked } = e.target;

        setDadosFuncao({

            ...dadosFuncao,

            [name]: type === "checkbox" ? checked : value

        });

    }

    return (

        <div className="card">

            <h2>

                👤 Colaborador

            </h2>

            <p className="descricao">

                Informe o colaborador que exerce a função. Caso a vaga ainda esteja em contratação, marque a opção abaixo.

            </p>

            <div className="campo">

                <label>

                    Nome do Colaborador

                </label>

                <input

                    name="colaborador"

                    placeholder="Nome completo"

                    disabled={dadosFuncao.emContratacao}

                    value={dadosFuncao.colaborador || ""}

                    onChange={alterarCampo}

                />

            </div>

            <div className="checkboxCampo">

                <input

                    id="contratacao"

                    type="checkbox"

                    name="emContratacao"

                    checked={dadosFuncao.emContratacao || false}

                    onChange={alterarCampo}

                />

                <label htmlFor="contratacao">

                    Colaborador em contratação

                </label>

            </div>

        </div>

    );

}

export default DadosColaborador;