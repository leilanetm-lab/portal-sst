import "../Solicitacoes.css";

function AdequacaoCorrecao({

    adequacaoCorrecao,

    setAdequacaoCorrecao,

    setEtapa

}){

    const tipoAlteracao = adequacaoCorrecao.tipoAlteracao || "";

    return(

        <div className="cardFormulario">

            <h2>

                Adequação / Correção

            </h2>

            <p className="subtituloRevisao">

                O que será alterado nesta solicitação?

            </p>

            <div className="cardsRevisao">

                <label className={`cardRevisao ${tipoAlteracao==="administrativo" ? "selecionado" : ""}`}>

                    <input

                        type="radio"

                        value="administrativo"

                        checked={tipoAlteracao==="administrativo"}

                        onChange={(e)=>

                            setAdequacaoCorrecao({

                                ...adequacaoCorrecao,

                                tipoAlteracao:e.target.value

                            })

                        }

                    />

                    <div>

                        <h3>Dados Administrativos</h3>

                        <p>

                            Apenas correção ou adequação dos dados administrativos da unidade.

                        </p>

                    </div>

                </label>

                <label className={`cardRevisao ${tipoAlteracao==="tecnica" ? "selecionado" : ""}`}>

                    <input

                        type="radio"

                        value="tecnica"

                        checked={tipoAlteracao==="tecnica"}

                        onChange={(e)=>

                            setAdequacaoCorrecao({

                                ...adequacaoCorrecao,

                                tipoAlteracao:e.target.value

                            })

                        }

                    />

                    <div>

                        <h3>Alteração Técnica</h3>

                        <p>

                            Alteração de função, riscos, atividades ou local de trabalho.

                        </p>

                    </div>

                </label>

                <label className={`cardRevisao ${tipoAlteracao==="geral" ? "selecionado" : ""}`}>

                    <input

                        type="radio"

                        value="geral"

                        checked={tipoAlteracao==="geral"}

                        onChange={(e)=>

                            setAdequacaoCorrecao({

                                ...adequacaoCorrecao,

                                tipoAlteracao:e.target.value

                            })

                        }

                    />

                    <div>

                        <h3>Dados Gerais</h3>

                        <p>

                            Alterações gerais do documento que não envolvem dados administrativos nem conteúdo técnico.

                        </p>

                    </div>

                </label>

            </div>

            <div className="acoes">

                <button

                    className="secundario"

                    onClick={()=>setEtapa(3)}

                >

                    Voltar

                </button>

                <button

                    className="salvar"

                    disabled={!tipoAlteracao}

                    onClick={()=>{

                        if(tipoAlteracao==="administrativo"){

                            setEtapa(6);

                            return;

                        }

                        if(tipoAlteracao==="tecnica"){

                            setEtapa(4);

                            return;

                        }

                        setEtapa(5.8);

                    }}

                >

                    Avançar

                </button>

            </div>

        </div>

    );

}

export default AdequacaoCorrecao;