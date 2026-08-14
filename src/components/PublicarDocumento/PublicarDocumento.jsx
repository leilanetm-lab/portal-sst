import { useState } from "react";

import "./PublicarDocumento.css";

function PublicarDocumento({

    titulo,

    onPublicar

}) {

    const [nome, setNome] = useState("");

    const [revisao, setRevisao] = useState(1);

    const [url, setUrl] = useState("");

    const [observacao, setObservacao] = useState("");

    async function publicar() {

        if (!nome.trim()) {

            alert("Informe o nome do documento.");

            return;

        }

        if (!url.trim()) {

            alert("Informe o link do SharePoint.");

            return;

        }

        try {

            await onPublicar({

                nome,

                revisao: Number(revisao),

                url,

                observacao

            });

            alert(`${titulo} publicado com sucesso.`);

            setNome("");

            setRevisao(1);

            setUrl("");

            setObservacao("");

        }

        catch (erro) {

            console.error(erro);

            alert("Erro ao publicar documento.");

        }

    }

    return (

        <div className="uploadDocumento">

            <h3>

                📄 Publicar {titulo}

            </h3>

            <label>

                Nome do Documento

            </label>

            <input

                type="text"

                placeholder={`Ex.: ${titulo}_06.0403.003_REV01.pdf`}

                value={nome}

                onChange={(e)=>setNome(e.target.value)}

            />

            <label>

                Revisão

            </label>

            <input

                type="number"

                min={1}

                value={revisao}

                onChange={(e)=>setRevisao(e.target.value)}

            />

            <label>

                Link do SharePoint

            </label>

            <input

                type="text"

                placeholder="Cole aqui o link do documento no SharePoint"

                value={url}

                onChange={(e)=>setUrl(e.target.value)}

            />

            <label>

                Observações (opcional)

            </label>

            <textarea

                rows={4}

                placeholder="Ex.: Revisão anual, inclusão de nova função, alteração de GHE..."

                value={observacao}

                onChange={(e)=>setObservacao(e.target.value)}

            />

            <button

                type="button"

                onClick={publicar}

            >

                📤 Publicar {titulo}

            </button>

        </div>

    );

}

export default PublicarDocumento;