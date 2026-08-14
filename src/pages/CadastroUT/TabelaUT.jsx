import LinhaUT from "./LinhaUT";

function TabelaUT({
  uts,
  editarUT,
  carregarUTs,
}) {
  return (

    <div className="tabelaContainer">

      <table>

        <thead>

          <tr>
            <th>Unidade</th>
            <th>Cliente</th>
            <th>Local</th>
            <th>Próxima Revisão</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>

        </thead>

        <tbody>

          {uts.length === 0 ? (

            <tr>

              <td colSpan="6" className="sem-registro">
                Nenhuma unidade cadastrada.
              </td>

            </tr>

          ) : (

            uts.map((ut) => (

              <LinhaUT
                key={ut.id}
                ut={ut}
                editarUT={editarUT}
                carregarUTs={carregarUTs}
              />

            ))

          )}

        </tbody>

      </table>

    </div>

  );
}

export default TabelaUT;