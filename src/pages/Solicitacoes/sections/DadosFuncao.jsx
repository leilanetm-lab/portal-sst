import DadosFuncaoCard from "./dadosFuncao/DadosFuncaoCard";
import DadosGHE from "./dadosFuncao/DadosGHE";
import DadosColaborador from "./dadosFuncao/DadosColaborador";
import DescricaoAtividades from "./dadosFuncao/DescricaoAtividades";

function DadosFuncao({

    dadosFuncao,

    setDadosFuncao,

    setEtapa,

    permitirNovoGHE = true

}) {

    function continuar() {

        if (!dadosFuncao.funcao?.trim()) {

            alert("Informe a função.");

            return;

        }

        if (!dadosFuncao.setor?.trim()) {

            alert("Informe o setor.");

            return;

        }

        if (!dadosFuncao.tipoGHE) {

            alert("Selecione se o GHE é existente ou novo.");

            return;

        }

        if (

            dadosFuncao.tipoGHE === "existente" &&

            !dadosFuncao.identificacaoGHE?.trim()

        ) {

            alert("Informe o número do GHE.");

            return;

        }

        if (

            !dadosFuncao.emContratacao &&

            !dadosFuncao.colaborador?.trim()

        ) {

            alert("Informe o nome do colaborador ou marque 'Colaborador em contratação'.");

            return;

        }

        if (!dadosFuncao.descricaoAtividade?.trim()) {

            alert("Preencha a descrição das atividades.");

            return;

        }

        if (!dadosFuncao.descricaoLocal?.trim()) {

            alert("Preencha a descrição do local de trabalho.");

            return;

        }

        if (!permitirNovoGHE && dadosFuncao.tipoGHE === "novo") {

    alert("Para este tipo de solicitação é permitido apenas GHE existente.");

    return;

}

        setEtapa(5);

    }

    return (

        <>

            <DadosFuncaoCard

                dadosFuncao={dadosFuncao}

                setDadosFuncao={setDadosFuncao}

            />

            <DadosGHE

    dadosFuncao={dadosFuncao}

    setDadosFuncao={setDadosFuncao}

    permitirNovoGHE={permitirNovoGHE}

/>

            <DadosColaborador

                dadosFuncao={dadosFuncao}

                setDadosFuncao={setDadosFuncao}

            />

            <DescricaoAtividades

                dadosFuncao={dadosFuncao}

                setDadosFuncao={setDadosFuncao}

            />

            <div className="rodape">

                <button

                    className="cancelar"

                    onClick={() => setEtapa(3)}

                >

                    ← Voltar

                </button>

                <button

                    className="salvar"

                    onClick={continuar}

                >

                    Continuar →

                </button>

            </div>

        </>

    );

}

export default DadosFuncao;