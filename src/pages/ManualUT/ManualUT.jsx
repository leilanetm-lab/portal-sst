import "./ManualUT.css";


function ManualUT() {

    return (

        <div className="manualUTPagina">


            {/* =========================================
                CABEÇALHO
            ========================================= */}

            <div className="manualUTCabecalho">

                <div className="manualUTTitulo">

                    <span className="manualUTIconeTitulo">
                        📖
                    </span>

                    <div>

                        <h1>
                            Manual do Portal SST
                        </h1>

                        <p>
                            Guia de utilização para usuários da
                            Unidade de Trabalho — UT
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================
                INTRODUÇÃO
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    01
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        Sobre o Portal SST
                    </h2>

                    <p>
                        O Portal SST é o ambiente utilizado pela
                        Unidade de Trabalho para realizar e
                        acompanhar solicitações relacionadas à
                        Segurança e Saúde do Trabalho.
                    </p>

                    <p>
                        Por meio do Portal, a UT poderá cadastrar
                        solicitações, informar funções e riscos,
                        acompanhar demandas e consultar documentos
                        disponibilizados para sua unidade.
                    </p>

                </div>

            </section>


            {/* =========================================
                PRIMEIRO ACESSO
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    02
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        🔐 Primeiro acesso
                    </h2>

                    <p>
                        O usuário deverá acessar o Portal SST
                        utilizando as credenciais fornecidas para
                        sua conta.
                    </p>

                    <div className="manualUTAviso">

                        <strong>
                            ⚠️ Importante
                        </strong>

                        <p>
                            No primeiro acesso, a alteração da senha
                            é obrigatória quando solicitada pelo
                            sistema. Após realizar a alteração,
                            o usuário poderá utilizar normalmente
                            o Portal SST.
                        </p>

                    </div>

                    <div className="manualUTPassos">

                        <div className="manualUTPasso">

                            <span>
                                1
                            </span>

                            <p>
                                Informe seu login e senha.
                            </p>

                        </div>

                        <div className="manualUTPasso">

                            <span>
                                2
                            </span>

                            <p>
                                Caso seja solicitado, altere sua
                                senha.
                            </p>

                        </div>

                        <div className="manualUTPasso">

                            <span>
                                3
                            </span>

                            <p>
                                Após a alteração, continue para
                                o Portal.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                MENU
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    03
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        🧭 Conhecendo o menu da UT
                    </h2>

                    <p>
                        O usuário com perfil UT possui acesso às
                        seguintes funcionalidades:
                    </p>

                    <div className="manualUTGrid">

                        <div className="manualUTCard">

                            <span>🏠</span>

                            <div>

                                <strong>
                                    Início
                                </strong>

                                <p>
                                    Acesso ao Dashboard da Unidade
                                    de Trabalho.
                                </p>

                            </div>

                        </div>


                        <div className="manualUTCard">

                            <span>➕</span>

                            <div>

                                <strong>
                                    Nova Solicitação
                                </strong>

                                <p>
                                    Inicia uma nova solicitação.
                                </p>

                            </div>

                        </div>


                        <div className="manualUTCard">

                            <span>📋</span>

                            <div>

                                <strong>
                                    Minhas Solicitações
                                </strong>

                                <p>
                                    Consulta e acompanhamento
                                    das solicitações.
                                </p>

                            </div>

                        </div>


                        <div className="manualUTCard">

                            <span>📚</span>

                            <div>

                                <strong>
                                    Minha Biblioteca
                                </strong>

                                <p>
                                    Consulta aos documentos
                                    disponíveis para a UT.
                                </p>

                            </div>

                        </div>


                        <div className="manualUTCard">

                            <span>⚙️</span>

                            <div>

                                <strong>
                                    Configurações
                                </strong>

                                <p>
                                    Perfil, segurança e
                                    notificações da conta.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                NOVA SOLICITAÇÃO
            ========================================= */}

            <section className="manualUTSecao manualUTSecaoDestaque">

                <div className="manualUTNumero">
                    04
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        ➕ Nova Solicitação
                    </h2>

                    <p>
                        A opção <strong>Nova Solicitação</strong>
                        é utilizada para iniciar uma nova demanda
                        no Portal SST.
                    </p>

                    <div className="manualUTAviso">

                        <strong>
                            💡 Atenção ao preenchimento
                        </strong>

                        <p>
                            Preencha as informações com atenção.
                            Antes de avançar, confira os dados
                            informados na etapa atual.
                        </p>

                    </div>

                </div>

            </section>


            {/* =========================================
                CADASTRO ADMINISTRATIVO
            ========================================= */}

            <section className="manualUTSubsecao">

                <h2>
                    📝 Cadastro Administrativo
                </h2>

                <p>
                    O Cadastro Administrativo contém as
                    informações necessárias para caracterizar
                    a Unidade de Trabalho.
                </p>

                <div className="manualUTRegra">

                    <div className="manualUTRegraTitulo">
                        PRIMEIRA SOLICITAÇÃO
                    </div>

                    <p>
                        Na primeira solicitação da UT,
                        o preenchimento do
                        <strong>
                            {" "}Cadastro Administrativo é obrigatório.
                        </strong>
                    </p>

                </div>


                <h3>
                    Nas próximas solicitações
                </h3>

                <p>
                    Nas solicitações seguintes, o Portal irá
                    perguntar se é necessário alterar alguma
                    informação do Cadastro Administrativo.
                </p>


                <div className="manualUTSimNao">

                    <div className="manualUTOpcao">

                        <div className="manualUTOpcaoSim">
                            SIM
                        </div>

                        <p>
                            Se houver alguma alteração, selecione
                            <strong> Sim </strong>
                            e altere somente a informação que
                            precisa ser modificada.
                        </p>

                    </div>


                    <div className="manualUTOpcao">

                        <div className="manualUTOpcaoNao">
                            NÃO
                        </div>

                        <p>
                            Se nenhuma informação precisar ser
                            alterada, selecione
                            <strong> Não </strong>
                            e siga normalmente para a próxima etapa.
                        </p>

                    </div>

                </div>

            </section>


            {/* =========================================
                TIPOS DE SOLICITAÇÃO
            ========================================= */}

            <section className="manualUTSubsecao">

                <h2>
                    📋 Tipos de Solicitação
                </h2>

                <p>
                    Ao iniciar uma solicitação, selecione o tipo
                    que corresponde à necessidade da Unidade
                    de Trabalho.
                </p>


                <div className="manualUTTipos">


                    <div className="manualUTTipoCard">

                        <div className="manualUTTipoIcone">
                            ↩️
                        </div>

                        <div>

                            <h3>
                                Revisão Anual
                            </h3>

                            <p>
                                Utilizada para a atualização
                                periódica do PGR e/ou PCMSO.
                            </p>

                        </div>

                    </div>


                    <div className="manualUTTipoCard">

                        <div className="manualUTTipoIcone">
                            ➕
                        </div>

                        <div>

                            <h3>
                                Adendo
                            </h3>

                            <p>
                                Utilizada quando houver necessidade
                                de inclusão de novas funções,
                                atividades ou riscos.
                            </p>

                        </div>

                    </div>


                    <div className="manualUTTipoCard">

                        <div className="manualUTTipoIcone">
                            📄
                        </div>

                        <div>

                            <h3>
                                Lançamento LTCAT
                            </h3>

                            <p>
                                Utilizada para o lançamento de
                                avaliações quantitativas.
                            </p>

                        </div>

                    </div>


                    <div className="manualUTTipoCard">

                        <div className="manualUTTipoIcone">
                            ⚙️
                        </div>

                        <div>

                            <h3>
                                Adequação
                            </h3>

                            <p>
                                Utilizada para atualização ou
                                adequação de informações existentes.
                            </p>

                        </div>

                    </div>


                    <div className="manualUTTipoCard">

                        <div className="manualUTTipoIcone">
                            ✏️
                        </div>

                        <div>

                            <h3>
                                Correção
                            </h3>

                            <p>
                                Utilizada para corrigir informações
                                que foram cadastradas incorretamente.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                FUNÇÃO
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    05
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        👷 Cadastro da Função
                    </h2>

                    <p>
                        Depois das etapas iniciais da solicitação,
                        será necessário cadastrar as funções
                        relacionadas à demanda.
                    </p>

                    <div className="manualUTAviso">

                        <strong>
                            ⚠️ Regra importante
                        </strong>

                        <p>
                            Sempre finalize uma função completamente,
                            incluindo seus riscos, antes de iniciar
                            o cadastro da próxima função.
                        </p>

                    </div>


                    <h3>
                        Informações da função
                    </h3>


                    <div className="manualUTLista">

                        <div>
                            <span>1</span>
                            <p>
                                Digite o nome completo da
                                <strong> função</strong>.
                            </p>
                        </div>

                        <div>
                            <span>2</span>
                            <p>
                                Informe o
                                <strong> setor</strong>.
                            </p>
                        </div>

                        <div>
                            <span>3</span>
                            <p>
                                Informe se o
                                <strong> GHE é novo ou existente</strong>.
                            </p>
                        </div>

                        <div>
                            <span>4</span>
                            <p>
                                Se o GHE for existente,
                                informe o
                                <strong> número do GHE</strong>.
                            </p>
                        </div>

                        <div>
                            <span>5</span>
                            <p>
                                Preencha a
                                <strong> descrição da atividade</strong>.
                            </p>
                        </div>

                        <div>
                            <span>6</span>
                            <p>
                                Preencha a
                                <strong> descrição do local</strong>.
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                RISCOS
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    06
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        ⚠️ Cadastro dos Riscos
                    </h2>

                    <p>
                        Depois de preencher os dados da função,
                        devem ser cadastrados todos os riscos
                        relacionados àquela função.
                    </p>


                    <div className="manualUTFluxo">

                        <div className="manualUTFluxoItem">

                            <span>1</span>

                            <strong>
                                Categoria
                            </strong>

                            <p>
                                Selecione a categoria do risco.
                            </p>

                        </div>


                        <div className="manualUTFluxoSeta">
                            →
                        </div>


                        <div className="manualUTFluxoItem">

                            <span>2</span>

                            <strong>
                                Risco
                            </strong>

                            <p>
                                Selecione o risco correspondente.
                            </p>

                        </div>


                        <div className="manualUTFluxoSeta">
                            →
                        </div>


                        <div className="manualUTFluxoItem">

                            <span>3</span>

                            <strong>
                                Adicionar risco
                            </strong>

                            <p>
                                Clique no botão para inserir o risco.
                            </p>

                        </div>

                    </div>


                    <div className="manualUTPassosRisco">

                        <div className="manualUTPassoRisco">

                            <span>
                                1
                            </span>

                            <p>
                                Após adicionar o risco, preencha
                                <strong>
                                    {" "}todos os dados solicitados.
                                </strong>
                            </p>

                        </div>


                        <div className="manualUTPassoRisco">

                            <span>
                                2
                            </span>

                            <p>
                                Se precisar adicionar outro risco,
                                repita o processo desde a
                                <strong> Categoria</strong>.
                            </p>

                        </div>


                        <div className="manualUTPassoRisco">

                            <span>
                                3
                            </span>

                            <p>
                                Selecione a nova categoria,
                                depois o risco, clique em
                                <strong> Adicionar risco</strong>
                                e preencha os dados.
                            </p>

                        </div>

                    </div>


                    <div className="manualUTAviso">

                        <strong>
                            ⚠️ Não deixe riscos incompletos
                        </strong>

                        <p>
                            Todos os campos solicitados para cada
                            risco devem ser preenchidos antes de
                            avançar para outra função.
                        </p>

                    </div>

                </div>

            </section>


            {/* =========================================
                NOVA FUNÇÃO
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    07
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        ➕ Adicionar uma nova função
                    </h2>

                    <p>
                        Depois de finalizar completamente uma
                        função e todos os seus riscos, utilize
                        o botão
                        <strong> Adicionar nova função</strong>.
                    </p>


                    <div className="manualUTFluxoVertical">

                        <div>
                            <span>01</span>
                            <p>
                                Clique em
                                <strong> Adicionar nova função</strong>.
                            </p>
                        </div>

                        <div>
                            <span>02</span>
                            <p>
                                Digite a nova função e informe
                                o setor.
                            </p>
                        </div>

                        <div>
                            <span>03</span>
                            <p>
                                Informe se o GHE é novo ou
                                existente. Se existente,
                                informe o número.
                            </p>
                        </div>

                        <div>
                            <span>04</span>
                            <p>
                                Preencha a descrição da atividade
                                e a descrição do local.
                            </p>
                        </div>

                        <div>
                            <span>05</span>
                            <p>
                                Cadastre todos os riscos dessa
                                nova função.
                            </p>
                        </div>

                        <div>
                            <span>06</span>
                            <p>
                                Finalize completamente a função
                                antes de adicionar outra.
                            </p>
                        </div>

                    </div>


                    <div className="manualUTAviso manualUTAvisoImportante">

                        <strong>
                            🚨 ATENÇÃO AO BOTÃO CONTINUAR
                        </strong>

                        <p>
                            Clique em <strong>Continuar</strong>
                            somente depois de finalizar
                            <strong> todas as funções e todos
                            os riscos</strong> da solicitação.
                        </p>

                    </div>

                </div>

            </section>


            {/* =========================================
                CHECKLIST
            ========================================= */}

            <section className="manualUTSecao manualUTSecaoChecklist">

                <div className="manualUTNumero">
                    08
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        ✅ Checklist antes de continuar
                    </h2>

                    <p>
                        Antes de clicar em <strong>Continuar</strong>,
                        confira:
                    </p>


                    <div className="manualUTChecklist">

                        <label>
                            <span>✓</span>
                            Tipo de solicitação correto.
                        </label>

                        <label>
                            <span>✓</span>
                            Cadastro Administrativo preenchido,
                            quando obrigatório.
                        </label>

                        <label>
                            <span>✓</span>
                            Função preenchida.
                        </label>

                        <label>
                            <span>✓</span>
                            Setor informado.
                        </label>

                        <label>
                            <span>✓</span>
                            GHE identificado como novo ou existente.
                        </label>

                        <label>
                            <span>✓</span>
                            Número do GHE informado quando aplicável.
                        </label>

                        <label>
                            <span>✓</span>
                            Descrição da atividade preenchida.
                        </label>

                        <label>
                            <span>✓</span>
                            Descrição do local preenchida.
                        </label>

                        <label>
                            <span>✓</span>
                            Todos os riscos adicionados.
                        </label>

                        <label>
                            <span>✓</span>
                            Todos os dados de cada risco preenchidos.
                        </label>

                        <label>
                            <span>✓</span>
                            Todas as funções necessárias cadastradas.
                        </label>

                        <label>
                            <span>✓</span>
                            Todos os riscos de todas as funções finalizados.
                        </label>

                    </div>

                </div>

            </section>


            {/* =========================================
                MINHAS SOLICITAÇÕES
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    09
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        📋 Minhas Solicitações
                    </h2>

                    <p>
                        Após o envio, utilize
                        <strong> Minhas Solicitações</strong>
                        para consultar e acompanhar as demandas
                        realizadas pela Unidade de Trabalho.
                    </p>


                    <div className="manualUTPassos">

                        <div className="manualUTPasso">

                            <span>1</span>

                            <p>
                                Clique em
                                <strong> Minhas Solicitações</strong>.
                            </p>

                        </div>

                        <div className="manualUTPasso">

                            <span>2</span>

                            <p>
                                Localize a solicitação desejada.
                            </p>

                        </div>

                        <div className="manualUTPasso">

                            <span>3</span>

                            <p>
                                Consulte os detalhes e o andamento
                                da solicitação.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                BIBLIOTECA
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    10
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        📚 Minha Biblioteca
                    </h2>

                    <p>
                        A Biblioteca permite consultar os
                        documentos disponibilizados para a
                        Unidade de Trabalho.
                    </p>

                    <div className="manualUTPassos">

                        <div className="manualUTPasso">

                            <span>1</span>

                            <p>
                                Clique em
                                <strong> Minha Biblioteca</strong>.
                            </p>

                        </div>

                        <div className="manualUTPasso">

                            <span>2</span>

                            <p>
                                Localize o documento desejado.
                            </p>

                        </div>

                        <div className="manualUTPasso">

                            <span>3</span>

                            <p>
                                Abra o documento para consulta,
                                quando disponível.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                CONFIGURAÇÕES
            ========================================= */}

            <section className="manualUTSecao">

                <div className="manualUTNumero">
                    11
                </div>

                <div className="manualUTConteudo">

                    <h2>
                        ⚙️ Configurações
                    </h2>

                    <p>
                        A área de Configurações permite
                        administrar as informações relacionadas
                        à própria conta.
                    </p>


                    <div className="manualUTGrid">

                        <div className="manualUTCard">

                            <span>👤</span>

                            <div>

                                <strong>
                                    Meu Perfil
                                </strong>

                                <p>
                                    Consulte seus dados pessoais,
                                    perfil de acesso e Unidade
                                    de Trabalho vinculada.
                                </p>

                            </div>

                        </div>


                        <div className="manualUTCard">

                            <span>🔐</span>

                            <div>

                                <strong>
                                    Segurança
                                </strong>

                                <p>
                                    Gerencie sua senha e as
                                    configurações de segurança.
                                </p>

                            </div>

                        </div>


                        <div className="manualUTCard">

                            <span>🔔</span>

                            <div>

                                <strong>
                                    Notificações
                                </strong>

                                <p>
                                    Configure como deseja receber
                                    avisos e notificações.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="manualUTAviso">

                        <strong>
                            ℹ️ Unidade de Trabalho
                        </strong>

                        <p>
                            A Unidade de Trabalho vinculada ao
                            usuário é definida pelo administrador
                            do Portal SST e não pode ser alterada
                            pelo perfil UT.
                        </p>

                    </div>

                </div>

            </section>


            {/* =========================================
                RESUMO FINAL
            ========================================= */}

            <section className="manualUTFinal">

                <div className="manualUTFinalIcone">
                    🛡️
                </div>

                <h2>
                    Pronto!
                </h2>

                <p>
                    Agora você conhece as principais
                    funcionalidades do Portal SST para
                    o perfil UT.
                </p>

                <p>
                    Em caso de dúvidas sobre o preenchimento
                    de uma solicitação, consulte este manual
                    antes de avançar.
                </p>

            </section>


        </div>

    );

}


export default ManualUT;