import CardTipo from "./tipoSolicitacao/CardTipo";

function TipoSolicitacao({

    tipoSolicitacao,

    setTipoSolicitacao,

    documentosGerados,

    setDocumentosGerados,

    setEtapa

}) {

    function selecionar(tipo){

        setTipoSolicitacao(tipo);

        switch(tipo){

            case "Revisão Anual":

                setDocumentosGerados([
                    "PGR",
                    "PCMSO"
                ]);

                break;

            case "Adendo":

                setDocumentosGerados([
                    "PGR",
                    "PCMSO"
                ]);

                break;

            case "Lançamento LTCAT":

                setDocumentosGerados([
                    "PGR",
                    "PCMSO"
                ]);

                break;

            case "Adequação":

            case "Correção":

                setDocumentosGerados([]);

                break;

            default:

                break;

        }

    }

    function continuar(){

        switch(tipoSolicitacao){

            case "Revisão Anual":
                setEtapa(3);
                break;

            case "Adendo":
                setEtapa(3);
                break;

            case "Lançamento LTCAT":
                setEtapa(3);
                break;

            case "Adequação":
                setEtapa(3);
                break;

            case "Correção":
                setEtapa(3);
                break;

            default:
                break;

        }

    }

    return(

        <div className="card">

            <h2>

                📋 Tipo da Solicitação

            </h2>

            <p className="descricao">

                Escolha o tipo da solicitação.

            </p>

            <div className="gridTipos">

                <CardTipo

                    titulo="🔄 Revisão Anual"

                    descricao="Atualização periódica do PGR e/ou PCMSO."

                    ajuda="Utilize quando o PGR e/ou PCMSO estiverem próximos do vencimento e for necessária a revisão periódica dos documentos para manter sua validade e conformidade legal."

                    selecionado={tipoSolicitacao==="Revisão Anual"}

                    onClick={()=>selecionar("Revisão Anual")}

                />

                <CardTipo

                    titulo="➕ Adendo"

                    descricao="Inclusão de novas funções, atividades ou riscos."

                    ajuda="Utilize quando houver necessidade de incluir uma nova função, setor, atividade ou novos riscos ocupacionais em documentos já existentes, sem necessidade de revisão completa."

                    selecionado={tipoSolicitacao==="Adendo"}

                    onClick={()=>selecionar("Adendo")}

                />

                <CardTipo

                    titulo="📑 Lançamento LTCAT"

                    descricao="Lançamento de avaliações quantitativas."

                    ajuda="Utilize quando forem realizadas avaliações quantitativas e os resultados precisarem ser lançados no LTCAT, SOC e PGR para atualização das informações técnicas da unidade."

                    selecionado={tipoSolicitacao==="Lançamento LTCAT"}

                    onClick={()=>selecionar("Lançamento LTCAT")}

                />

                <CardTipo

                    titulo="⚙️ Adequação"

                    descricao="Atualização de informações existentes."

                    ajuda="Utilize quando houver necessidade de atualizar informações existentes nos documentos devido a mudanças ocorridas na unidade, como alteração de atividades, riscos, processos, layout, setor ou dados administrativos. Não deve ser utilizada para corrigir erros."

                    selecionado={tipoSolicitacao==="Adequação"}

                    onClick={()=>selecionar("Adequação")}

                />

                <CardTipo

                    titulo="✏️ Correção"

                    descricao="Correção de informações incorretas."

                    ajuda="Utilize quando for necessário corrigir informações incorretas existentes nos documentos, identificadas pela Unidade de Trabalho, pelo cliente ou pela equipe de SST."

                    selecionado={tipoSolicitacao==="Correção"}

                    onClick={()=>selecionar("Correção")}

                />

            </div>

            {(tipoSolicitacao==="Adequação" ||
            tipoSolicitacao==="Correção") && (

                <div className="card" style={{marginTop:30}}>

                    <h3>

                        Documentos que serão alterados

                    </h3>

                    <label>

                        <input

                            type="checkbox"

                            checked={documentosGerados.includes("PGR")}

                            onChange={(e)=>{

                                if(e.target.checked){

                                    setDocumentosGerados([
                                        ...documentosGerados,
                                        "PGR"
                                    ]);

                                }else{

                                    setDocumentosGerados(

                                        documentosGerados.filter(

                                            d=>d!=="PGR"

                                        )

                                    );

                                }

                            }}

                        />

                        PGR

                    </label>

                    <br/>

                    <label>

                        <input

                            type="checkbox"

                            checked={documentosGerados.includes("PCMSO")}

                            onChange={(e)=>{

                                if(e.target.checked){

                                    setDocumentosGerados([
                                        ...documentosGerados,
                                        "PCMSO"
                                    ]);

                                }else{

                                    setDocumentosGerados(

                                        documentosGerados.filter(

                                            d=>d!=="PCMSO"

                                        )

                                    );

                                }

                            }}

                        />

                        PCMSO

                    </label>

                </div>

            )}

            <div className="rodape">

                <button

                    className="cancelar"

                    onClick={()=>setEtapa(1)}

                >

                    ← Voltar

                </button>

                <button

                    className="salvar"

                    disabled={!tipoSolicitacao}

                    onClick={continuar}

                >

                    Continuar →

                </button>

            </div>

        </div>

    );

}

export default TipoSolicitacao;