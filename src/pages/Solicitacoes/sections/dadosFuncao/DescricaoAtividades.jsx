import { useState } from "react";

function DescricaoAtividades({

    dadosFuncao,

    setDadosFuncao

}) {

    const [contadorAtividade, setContadorAtividade] = useState(

        dadosFuncao.descricaoAtividade?.length || 0

    );

    const [contadorLocal, setContadorLocal] = useState(

        dadosFuncao.descricaoLocal?.length || 0

    );

    function alterarCampo(e) {

        const { name, value } = e.target;

        setDadosFuncao({

            ...dadosFuncao,

            [name]: value

        });

    }

    return (

        <div className="card">

            <h2>

                📝 Atividades Desenvolvidas

            </h2>

            <p className="descricao">

                Descreva as atividades efetivamente executadas pelo colaborador e o local onde elas são realizadas. Essas informações serão utilizadas como base para elaboração dos documentos legais.

            </p>

            <div className="campo">

                <label>

    Descrição das Atividades <span className="obrigatorio">*</span>

</label>

                <textarea

                    rows="7"

                    maxLength={999}

                    name="descricaoAtividade"

                    value={dadosFuncao.descricaoAtividade || ""}

                    placeholder="Descreva detalhadamente as atividades executadas pelo colaborador."

                    onChange={(e)=>{

                        alterarCampo(e);

                        setContadorAtividade(e.target.value.length);

                    }}

                />

                <div className="contadorCaracteres">

                    {contadorAtividade}/999 caracteres

                </div>

            </div>

            <div className="campo">

                <label>

    Descrição do Local de Trabalho <span className="obrigatorio">*</span>

</label>

                <textarea

                    rows="4"

                    maxLength={99}

                    name="descricaoLocal"

                    value={dadosFuncao.descricaoLocal || ""}

                    placeholder="Ex.: Área administrativa, oficina, laboratório, área externa..."

                    onChange={(e)=>{

                        alterarCampo(e);

                        setContadorLocal(e.target.value.length);

                    }}

                />

                <div className="contadorCaracteres">

                    {contadorLocal}/99 caracteres

                </div>

            </div>

        </div>

    );

}

export default DescricaoAtividades;