function DadosGHE({

    dadosFuncao,

    setDadosFuncao,

    permitirNovoGHE = true

}) {

    function alterarCampo(e) {

        const { name, value } = e.target;

        if (name === "identificacaoGHE") {

            const numero = value.replace(/\D/g, "");

            setDadosFuncao({

                ...dadosFuncao,

                identificacaoGHE: numero

            });

            return;

        }

        setDadosFuncao({

            ...dadosFuncao,

            [name]: value

        });

    }

    return (

        <div className="card">

            <h2>

                🛡 Grupo Homogêneo de Exposição (GHE)

            </h2>

            <p className="descricao">

                Informe se a função pertence a um GHE já existente ou se será criado um novo GHE.

            </p>

            <div className="radioGrupo">

                <label className="radioCard">

                    <input

                        type="radio"

                        name="tipoGHE"

                        value="existente"

                        checked={dadosFuncao.tipoGHE === "existente"}

                        onChange={alterarCampo}

                    />

                    <div>

                        <strong>

                            GHE Existente

                        </strong>

                        <small>

                            Utilize quando a função já pertence a um GHE existente na unidade.

                        </small>

                    </div>

                </label>

                {

                    permitirNovoGHE && (

                        <label className="radioCard">

                            <input

                                type="radio"

                                name="tipoGHE"

                                value="novo"

                                checked={dadosFuncao.tipoGHE === "novo"}

                                onChange={alterarCampo}

                            />

                            <div>

                                <strong>

                                    Novo GHE

                                </strong>

                                <small>

                                    Utilize somente quando houver necessidade de criação de um novo GHE.

                                </small>

                            </div>

                        </label>

                    )

                }

            </div>

            {

                dadosFuncao.tipoGHE === "existente" && (

                    <div className="campo">

                        <label>

                            Número do GHE <span className="obrigatorio">*</span>

                        </label>

                        <input

                            type="text"

                            inputMode="numeric"

                            maxLength={3}

                            name="identificacaoGHE"

                            value={dadosFuncao.identificacaoGHE || ""}

                            onChange={alterarCampo}

                            placeholder="Ex.: 01"

                        />

                        <small>

                            Informe apenas o número do GHE existente na unidade.

                        </small>

                    </div>

                )

            }

            {

                permitirNovoGHE &&

                dadosFuncao.tipoGHE === "novo" && (

                    <div className="mensagem alerta">

                        ⚠ Será criado um novo GHE durante a elaboração da documentação.

                    </div>

                )

            }

        </div>

    );

}

export default DadosGHE;