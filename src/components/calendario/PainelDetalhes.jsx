function PainelDetalhes({ eventos }) {

    if (!eventos || eventos.length === 0) {

        return (

            <aside className="painelEvento">

                <h2>📌 Agenda do Dia</h2>

                <div className="nenhumEvento">

                    <p>

                        Clique em um dia do calendário.

                    </p>

                    <small>

                        Aqui serão exibidas todas as atividades.

                    </small>

                </div>

            </aside>

        );

    }

    return (

        <aside className="painelEvento">

            <h2>📌 Agenda do Dia</h2>

            <h3>{eventos[0].data}</h3>

            <p>

                <strong>

                    {eventos.length}

                </strong>{" "}

                atividade(s)

            </p>

            <hr />

            {

                eventos.map((evento,index)=>(

                    <div

                        key={index}

                        className="cardEventoDia"

                    >

                        <div

                            className="corEvento"

                            style={{

                                background:evento.cor

                            }}

                        />

                        <div className="conteudoEventoDia">

                            <strong>

                                {evento.titulo}

                            </strong>

                            <span>

                                {evento.descricao}

                            </span>

                            <small>

                                {evento.nomeUT}

                            </small>

                            <small>

                                UT: {evento.numeroUT}

                            </small>

                            {

                                evento.dataRevisao &&

                                <small>

                                    📅 Revisão: {evento.dataRevisao}

                                </small>

                            }

                            {

                                evento.diasParaVencimento !== undefined &&

                                (

                                    evento.diasParaVencimento >= 0

                                    ?

                                    <small

                                        style={{

                                            color:"#d97706",

                                            fontWeight:600

                                        }}

                                    >

                                        ⏳ Faltam {evento.diasParaVencimento} dias.

                                    </small>

                                    :

                                    <small

                                        style={{

                                            color:"#dc2626",

                                            fontWeight:600

                                        }}

                                    >

                                        🔴 Vencido há {Math.abs(evento.diasParaVencimento)} dias.

                                    </small>

                                )

                            }

                        </div>

                    </div>

                ))

            }

        </aside>

    );

}

export default PainelDetalhes;