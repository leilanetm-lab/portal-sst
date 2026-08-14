import "../Solicitacoes.css";

function LancamentoLTCAT({

    lancamentoLTCAT,

    setLancamentoLTCAT,

    setEtapa

}) {

    const tipoLancamento = lancamentoLTCAT.tipoLancamento || "";

    const gheAtual = lancamentoLTCAT.gheAtual || "";

    const ghes = lancamentoLTCAT.ghes || [];

    const adicionarGHE = () => {

        const numero = gheAtual.trim();

        if (!numero) return;

        const ghe = `GHE-${numero.padStart(2, "0")}`;

        if (ghes.includes(ghe)) return;

        setLancamentoLTCAT({

            ...lancamentoLTCAT,

            gheAtual: "",

            ghes: [...ghes, ghe]

        });

    };

    return (

        <div className="cardFormulario">

            <h2>Lançamento de LTCAT</h2>

            <p>
                Informe onde as medições quantitativas serão lançadas.
            </p>

            <div className="campo">

                <label>
                    As medições quantitativas serão lançadas em:
                </label>

                <div className="radioGrupo">

                    <label className="radioOpcao">

                        <input
                            type="radio"
                            name="tipoLancamento"
                            value="todos"
                            checked={tipoLancamento === "todos"}
                            onChange={(e) =>
                                setLancamentoLTCAT({
                                    ...lancamentoLTCAT,
                                    tipoLancamento: e.target.value
                                })
                            }
                        />

                        Todos os GHEs

                    </label>

                    <label className="radioOpcao">

                        <input
                            type="radio"
                            name="tipoLancamento"
                            value="especificos"
                            checked={tipoLancamento === "especificos"}
                            onChange={(e) =>
                                setLancamentoLTCAT({
                                    ...lancamentoLTCAT,
                                    tipoLancamento: e.target.value
                                })
                            }
                        />

                        GHEs específicos

                    </label>

                </div>

            </div>

            {

                tipoLancamento === "especificos" && (

                    <div className="campo">

                        <label>
                            Número do GHE
                        </label>

                        <div className="linhaGHE">

                            <input

                                type="number"

                                min="1"

                                placeholder="Ex.: 01"

                                value={gheAtual}

                                onChange={(e) =>
                                    setLancamentoLTCAT({
                                        ...lancamentoLTCAT,
                                        gheAtual: e.target.value
                                    })
                                }

                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {

                                        e.preventDefault();

                                        adicionarGHE();

                                    }

                                }}

                            />

                            <button

                                type="button"

                                className="btnAdicionarGHE"

                                onClick={adicionarGHE}

                            >

                                + Adicionar

                            </button>

                        </div>

                        {

                            ghes.length > 0 && (

                                <>

                                    <label className="tituloListaGHE">

                                        GHEs adicionados

                                    </label>

                                    <div className="listaGHE">

                                        {

                                            ghes.map((ghe, index) => (

                                                <div

                                                    key={index}

                                                    className="chipGHE"

                                                >

                                                    <span>{ghe}</span>

                                                    <button

                                                        type="button"

                                                        className="btnRemoverGHE"

                                                        onClick={() =>

                                                            setLancamentoLTCAT({

                                                                ...lancamentoLTCAT,

                                                                ghes: ghes.filter((_, i) => i !== index)

                                                            })

                                                        }

                                                    >

                                                        ×

                                                    </button>

                                                </div>

                                            ))

                                        }

                                    </div>

                                </>

                            )

                        }

                    </div>

                )

            }

            <div className="acoes">

                <button

                    className="secundario"

                    onClick={() => setEtapa(3)}

                >

                    Voltar

                </button>

                <button

                    className="salvar"

                    onClick={() => setEtapa(6)}

                >

                    Avançar

                </button>

            </div>

        </div>

    );

}

export default LancamentoLTCAT;