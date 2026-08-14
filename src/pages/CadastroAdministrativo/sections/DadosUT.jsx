import { useEffect, useState } from "react";
import { listarUTs } from "../../../services/utService";

function DadosUT({ ut, setUt }) {

  const [uts, setUTs] = useState([]);

  useEffect(() => {

    async function carregar() {

      const lista = await listarUTs();

      setUTs(lista);

    }

    carregar();

  }, []);

  function formatarData(data) {

    if (!data) return "";

    const d = new Date(data);

    if (isNaN(d)) return data;

    return d.toLocaleDateString("pt-BR");

  }

  return (

    <div className="card">

      <h2>📌 Dados da Unidade</h2>

      <div className="campo">

        <label>Unidade de Trabalho *</label>

        <select

          value={ut?.numeroUT || ""}

          onChange={(e) => {

            const unidade = uts.find(

              item => item.numeroUT === e.target.value

            );

            setUt(unidade);

          }}

        >

          <option value="">

            Selecione...

          </option>

          {uts.map((item) => (

            <option

              key={item.numeroUT}

              value={item.numeroUT}

            >

              {item.numeroUT} - {item.nomeUT}

            </option>

          ))}

        </select>

      </div>

      {ut && (

        <>

          <div className="linha-3">

            <div className="campo">

              <label>Cliente</label>

              <input

                value={ut.cliente || ""}

                disabled

              />

            </div>

            <div className="campo">

              <label>Cidade</label>

              <input

                value={ut.cidade || ""}

                disabled

              />

            </div>

            <div className="campo">

              <label>Estado</label>

              <input

                value={ut.estado || ""}

                disabled

              />

            </div>

          </div>

          <div className="linha-3">

            <div className="campo">

              <label>Última Revisão</label>

              <input

                value={formatarData(ut.ultimaRevisao)}

                disabled

              />

            </div>

            <div className="campo">

              <label>Próxima Revisão</label>

              <input

                value={formatarData(ut.proximaRevisao)}

                disabled

              />

            </div>

            <div className="campo">

              <label>Periodicidade</label>

              <input

                value={`${ut.periodicidade || ""} meses`}

                disabled

              />

            </div>

          </div>

        </>

      )}

    </div>

  );

}

export default DadosUT;