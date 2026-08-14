import { useState } from "react";

function CardRisco({

    categoria,

    risco,

    dados,

    onChange,

    onExcluir

}){

    const [expandido,setExpandido]=useState(false);

    function corCategoria(){

        switch(categoria){

            case "fisicos":
                return "#2e7d32";

            case "quimicos":
                return "#d32f2f";

            case "biologicos":
                return "#6d4c41";

            case "acidente":
                return "#1565c0";

            case "ergonomico":
                return "#ef6c00";

            default:
                return "#777";

        }

    }

    function nomeCategoria(){

        switch(categoria){

            case "fisicos":
                return "FÍSICO";

            case "quimicos":
                return "QUÍMICO";

            case "biologicos":
                return "BIOLÓGICO";

            case "acidente":
                return "ACIDENTE";

            case "ergonomico":
                return "ERGONÔMICO";

            default:
                return "";

        }

    }

    function alterar(campo,valor){

        onChange({

            ...dados,

            [campo]:valor

        });

    }

    return(

        <div className="cardRisco">

            <div
                className="cabecalhoRisco"
                style={{
                    background:`${corCategoria()}15`,
                    borderLeft:`6px solid ${corCategoria()}`
                }}
            >

                <div>

                    <span

                        className="categoriaRisco"

                        style={{

                            background:corCategoria()

                        }}

                    >

                        {nomeCategoria()}

                    </span>

                    <h3>

                        {risco}

                    </h3>

                    <p className="subtituloRisco">

                        Caracterização da exposição ocupacional

                    </p>

                </div>

                <div
                    style={{
                        textAlign:"right"
                    }}
                >

                    <small
                        style={{
                            display:"block",
                            marginBottom:"8px",
                            color:"#666",
                            fontWeight:"600"
                        }}
                    >
                        Status do cadastro
                    </small>

                    <span

                        className="statusRisco"

                        style={{

                            background:dados.valido

                                ? "#2e7d32"

                                : "#d32f2f"

                        }}

                    >

                        {

                            dados.valido

                                ? "COMPLETO"

                                : "PENDENTE"

                        }

                    </span>

                    <div

                        className="acoesCard"

                        style={{

                            marginTop:"15px"

                        }}

                    >

                        <button

                            type="button"

                            className="btnExpandir"

                            onClick={()=>

                                setExpandido(

                                    !expandido

                                )

                            }

                        >

                            {

                                expandido

                                    ? "▲ Ocultar"

                                    : "▼ Mostrar"

                            }

                        </button>

                        <button

                            type="button"

                            className="btnExcluir"

                            onClick={onExcluir}

                        >

                            🗑

                        </button>

                    </div>

                </div>

            </div>

            {

                expandido && (

                    <>
                                            <h4 className="tituloGrupo">

                            Identificação da Exposição

                        </h4>

                        <div className="linha">

                            <div className="campo">

                                <label>

                                    Fonte Geradora / Atividade

                                    <span className="obrigatorio">*</span>

                                </label>

                                <small>

                                    Descreva a atividade executada que gera a exposição ao risco ocupacional.

                                </small>

                                <textarea

                                    rows={5}

                                    maxLength={500}

                                    value={dados.atividade}

                                    onChange={(e)=>

                                        alterar(

                                            "atividade",

                                            e.target.value

                                        )

                                    }

                                />

                                <div className="contadorCaracteres">

                                    {(dados.atividade || "").length} / 500

                                </div>

                            </div>

                        </div>

                        <div className="linha">

                            <div className="campo">

                                <label>

                                    Forma de Exposição ao Agente

                                    <span className="obrigatorio">*</span>

                                </label>

                                <select

                                    value={dados.contato}

                                    onChange={(e)=>

                                        alterar(

                                            "contato",

                                            e.target.value

                                        )

                                    }

                                >

                                    <option value="">

                                        Selecione...

                                    </option>

                                    <option>

                                        Habitual

                                    </option>

                                    <option>

                                        Intermitente

                                    </option>

                                    <option>

                                        Eventual

                                    </option>

                                </select>

                            </div>

                        </div>

                        <h4 className="tituloGrupo">

                            Medidas de Controle

                        </h4>

                        <div className="linha">

                            <div className="campo">

                                <label>

                                    EPIs Utilizados

                                    <span className="obrigatorio">*</span>

                                </label>

                                <textarea

                                    rows={4}

                                    maxLength={500}

                                    value={dados.epi}

                                    onChange={(e)=>

                                        alterar(

                                            "epi",

                                            e.target.value

                                        )

                                    }

                                />

                                <div className="contadorCaracteres">

                                    {(dados.epi || "").length} / 500

                                </div>

                            </div>

                            <div className="campo">

                                <label>

                                    Certificados de Aprovação (CA)

                                    <span className="obrigatorio">*</span>

                                </label>

                                <textarea

                                    rows={4}

                                    maxLength={500}

                                    value={dados.ca}

                                    onChange={(e)=>

                                        alterar(

                                            "ca",

                                            e.target.value

                                        )

                                    }

                                />

                                <div className="contadorCaracteres">

                                    {(dados.ca || "").length} / 500

                                </div>

                            </div>

                        </div>
                                                <div className="linha">

                            <div className="campo">

                                <label>

                                    EPC Existente

                                    <span className="obrigatorio">*</span>

                                </label>

                                <input

                                    type="text"

                                    value={

                                        dados.epc==="N/A"

                                            ? ""

                                            : dados.epc

                                    }

                                    disabled={

                                        dados.epc==="N/A"

                                    }

                                    onChange={(e)=>

                                        alterar(

                                            "epc",

                                            e.target.value

                                        )

                                    }

                                    placeholder="Informe o EPC existente"

                                />

                                <div className="checkboxCampo">

                                    <input

                                        type="checkbox"

                                        checked={

                                            dados.epc==="N/A"

                                        }

                                        onChange={(e)=>

                                            alterar(

                                                "epc",

                                                e.target.checked

                                                    ? "N/A"

                                                    : ""

                                            )

                                        }

                                    />

                                    <label>

                                        Não existe EPC para este risco

                                    </label>

                                </div>

                            </div>

                        </div>


                        <h4 className="tituloGrupo">

    Medidas Administrativas

</h4>

<div className="campo">

    <label>

        Descreva as Medidas Adotadas

        <span className="obrigatorio">*</span>

    </label>

    <small>

        Informe as medidas administrativas implementadas para eliminar, reduzir ou controlar a exposição ao risco.

    </small>

                            <textarea

                                rows={5}

                                maxLength={1000}

                                value={dados.medidas}

                                onChange={(e)=>

                                    alterar(

                                        "medidas",

                                        e.target.value

                                    )

                                }

                            />

                            <div className="contadorCaracteres">

                                {(dados.medidas || "").length} / 1000

                            </div>

                        </div>

                    </>

                )

            }

        </div>

    );

}

export default CardRisco;