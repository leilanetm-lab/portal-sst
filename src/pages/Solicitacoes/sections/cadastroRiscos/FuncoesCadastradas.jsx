function FuncoesCadastradas({

    funcoes,

    onEditar,

    onExcluir

}) {

    if (funcoes.length === 0) {

        return null;

    }

    return (

        <div className="funcoes-cadastradas">

            <h3>

                📋 Funções cadastradas ({funcoes.length})

            </h3>

            {funcoes.map((funcao, index) => (

                <div
                    key={index}
                    className="card-funcao"
                >

                    <h4>

                        👷 {funcao.funcao}

                    </h4>

                    <p>

                        📍 <strong>Setor:</strong> {funcao.setor}

                    </p>

                    <p>

                        🏷 <strong>GHE:</strong> {funcao.identificacaoGHE}

                    </p>

                    <p>

    ☣ <strong>Riscos:</strong> {funcao.riscos?.length || 0}

</p>

<div className="acoes-funcao">

    <button
    type="button"
    className="btn-editar"
    onClick={() => {

        onEditar(index);

    }}
>
    ✏️ Editar
</button>

    <button
    type="button"
    className="btn-excluir"
    onClick={() => {

        console.log("Clique no botão");

        onExcluir(index);

    }}
>
    🗑 Excluir
</button>

</div>

                </div>

            ))}

        </div>

    );

}

export default FuncoesCadastradas;