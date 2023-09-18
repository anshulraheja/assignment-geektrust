import './App.css';
import { FiSearch } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import { useEffect, useState } from 'react';

const pageSize = 10;

function App() {
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const getMembersData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      );
      if (response.ok) {
        const data = await response.json();
        setMemberData(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleDeleteSingleRecord = (id) => {
    let updatedMemberData = memberData?.filter(
      (member) => member.id !== id
    );
    setMemberData(updatedMemberData);
  };
  const handleSelectRow = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  const handleDeleteSelected = () => {
    const updatedMemberData = memberData.filter(
      (member) => !selectedRows.includes(member.id)
    );
    setMemberData(updatedMemberData);
    setSelectedRows([]);
  };

  const handleEditClick = (id) => {
    setEditingRow(id);
    const member = memberData.find((m) => m.id === id);
    setEditedValues({
      ...editedValues,
      [id]: {
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });
  };

  const handleSaveClick = (id) => {
    const updatedMemberData = memberData.map((member) => {
      if (member.id === id) {
        return {
          ...member,
          ...editedValues[id],
        };
      }
      return member;
    });
    setMemberData(updatedMemberData);
    setEditingRow(null);
    setEditedValues({});
  };

  const handleCancelClick = (id) => {
    setEditedValues({});
    setEditingRow(null);
  };

  const handleEditChange = (id, field, value) => {
    setEditedValues({
      ...editedValues,
      [id]: {
        ...editedValues[id],
        [field]: value,
      },
    });
  };

  useEffect(() => {
    getMembersData();
  }, []);

  const filteredData =
    memberData &&
    memberData?.filter((member) => {
      const { name, email, role } = member;
      const query = searchQuery?.toLowerCase();
      return (
        name?.toLowerCase().includes(query) ||
        email?.toLowerCase().includes(query) ||
        role?.toLowerCase().includes(query)
      );
    });

  const pageCount = searchQuery
    ? Math.ceil(filteredData.length / pageSize)
    : Math.ceil(memberData.length / pageSize);

  const displayedData = searchQuery
    ? filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
    : memberData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

  const paginationButtons = Array.from(
    { length: pageCount },
    (_, i) => i + 1
  );

  return (
    <>
      <div className="container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Something went wrong. Please try again later.</div>
        ) : (
          <>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="search-icon">
                <FiSearch />
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr className="table-header">
                    <th>
                      <input
                        type="checkbox"
                        className="checkbox"
                        disabled={!displayedData.length}
                        checked={
                          selectedRows.length ===
                            displayedData.length &&
                          displayedData.length
                        }
                        onChange={() => {
                          if (
                            selectedRows.length ===
                            displayedData.length
                          ) {
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
                            onChange={() =>
                              handleSelectRow(member.id)
                            }
                          />
                        </td>
                        {editingRow === member.id ? (
                          <>
                            <td>
                              <input
                                type="text"
                                value={
                                  editedValues[member.id]?.name || ''
                                }
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
                                value={
                                  editedValues[member.id]?.email || ''
                                }
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
                                value={
                                  editedValues[member.id]?.role || ''
                                }
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
                                onClick={() =>
                                  handleSaveClick(member.id)
                                }
                              >
                                Save
                              </button>
                              <button
                                onClick={() =>
                                  handleCancelClick(member.id)
                                }
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
                                onClick={() =>
                                  handleEditClick(member.id)
                                }
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colspan="5">No Records</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="footer">
              <div>
                <button
                  className="btn-delete-selected"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected
                </button>
              </div>
              <div className="pagination-wrapper">
                <MdKeyboardDoubleArrowLeft
                  onClick={() => {
                    if (currentPage !== 1) {
                      setCurrentPage(1);
                    }
                  }}
                  className={
                    currentPage === 1 || !displayedData.length
                      ? 'disabled'
                      : ''
                  }
                />
                <GrFormPrevious
                  onClick={() => {
                    if (currentPage !== 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 || !displayedData.length
                      ? 'disabled'
                      : ''
                  }
                />
                {paginationButtons.map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      if (page !== currentPage) {
                        setCurrentPage(page);
                      }
                    }}
                    className={
                      page === currentPage || !displayedData.length
                        ? 'active'
                        : ''
                    }
                  >
                    {page}
                  </button>
                ))}
                <GrFormNext
                  onClick={() => {
                    if (currentPage !== pageCount) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === pageCount || !displayedData.length
                      ? 'disabled'
                      : ''
                  }
                />
                <MdKeyboardDoubleArrowRight
                  onClick={() => {
                    if (currentPage !== pageCount) {
                      setCurrentPage(pageCount);
                    }
                  }}
                  className={
                    currentPage === pageCount || !displayedData.length
                      ? 'disabled'
                      : ''
                  }
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
