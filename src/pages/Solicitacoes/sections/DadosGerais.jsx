import "../Solicitacoes.css";

function DadosGerais({

    adequacaoCorrecao,

    setAdequacaoCorrecao,

    setEtapa

}){

    return(

        <div className="cardFormulario">

            <h2>Dados Gerais</h2>

            <p className="subtituloRevisao">

                Descreva detalhadamente quais alterações deverão ser realizadas no documento.

            </p>

            <div className="campo">

    <label>

        Descrição da Alteração <span className="obrigatorio">*</span>

    </label>

    <textarea

        className="campoTextoGrande"

        rows={8}

        placeholder="Descreva detalhadamente a alteração solicitada.

Exemplos:
• Alteração do nome do setor;
• Atualização da planta da unidade;
• Correção de informações do documento;
• Inclusão ou exclusão de observações."

        value={adequacaoCorrecao.descricao}

        onChange={(e)=>

            setAdequacaoCorrecao({

                ...adequacaoCorrecao,

                descricao:e.target.value

            })

        }

    />

    <small>

        Quanto mais detalhes forem informados, mais precisa será a atualização da documentação.

    </small>

</div>

            <div className="acoes">

                <button

                    className="secundario"

                    onClick={()=>setEtapa(5.7)}

                >

                    Voltar

                </button>

                <button

                    className="salvar"

                    disabled={!adequacaoCorrecao.descricao.trim()}

                    onClick={()=>setEtapa(6)}

                >

                    Avançar

                </button>

            </div>

        </div>

    );

}

export default DadosGerais;