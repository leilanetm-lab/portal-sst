import CardRisco from "./CardRisco";

function ListaRiscos({

    riscos,

    onExcluir,

    onAtualizar

}){

    if(!riscos || riscos.length===0){

        return(

            <div className="alertaCadastro">

                Nenhum risco cadastrado.

            </div>

        );

    }

    return(

        <>

            {

                riscos.map(

                    (item,index)=>(

                        <CardRisco

                            key={`${item.categoria}-${item.risco}-${index}`}

                            categoria={item.categoria}

                            risco={item.risco}

                            dados={item}

                            onExcluir={()=>

                                onExcluir(index)

                            }

                            onChange={(dados)=>

                                onAtualizar(

                                    index,

                                    dados

                                )

                            }

                        />

                    )

                )

            }

        </>

    );

}

export default ListaRiscos;