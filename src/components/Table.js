import { RiDeleteBin5Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';

const Table = (props) => {
  const {
    displayedData,
    selectedRows,
    handleSelectRow,
    handleEditChange,
    editedValues,
    handleSaveClick,
    handleCancelClick,
    handleDeleteSingleRecord,
    handleEditClick,
    setSelectedRows,
    editingRow,
  } = props;
  return (
    <table className="table">
      <thead>
        <tr className="table-header">
          <th>
            <input
              type="checkbox"
              className="checkbox"
              disabled={!displayedData.length}
              checked={
                selectedRows.length === displayedData.length &&
                displayedData.length
              }
              onChange={() => {
                if (selectedRows.length === displayedData.length) {
                  setSelectedRows([]);
                } else {
                  setSelectedRows(
                    displayedData.map((member) => member.id)
                  );
                }
              }}
            />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {displayedData.length > 0 ? (
          displayedData?.map((member) => (
            <tr key={member.id}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedRows.includes(member.id)}
                  onChange={() => handleSelectRow(member.id)}
                />
              </td>
              {editingRow === member.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editedValues[member.id]?.name || ''}
                      onChange={(e) =>
                        handleEditChange(
                          member.id,
                          'name',
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedValues[member.id]?.email || ''}
                      onChange={(e) =>
                        handleEditChange(
                          member.id,
                          'email',
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedValues[member.id]?.role || ''}
                      onChange={(e) =>
                        handleEditChange(
                          member.id,
                          'role',
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="action-wrapper">
                    <button
                      onClick={() => handleSaveClick(member.id)}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancelClick(member.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{member?.name}</td>
                  <td>{member?.email}</td>
                  <td>{member?.role}</td>
                  <td className="action-wrapper">
                    <RiDeleteBin5Line
                      onClick={() =>
                        handleDeleteSingleRecord(member?.id)
                      }
                    />
                    <FiEdit
                      onClick={() => handleEditClick(member.id)}
                    />
                  </td>
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No Records</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
