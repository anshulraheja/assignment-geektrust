import './App.css';
import { useEffect, useState } from 'react';
import SearchBar from './components/SeachBar';
import Loader from './components/Loader';
import Table from './components/Table';
import Pagination from './components/Pagination';

const pageSize = 10;
const GET_MEMBER_API_URL =
  'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

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
      const response = await fetch(GET_MEMBER_API_URL);
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

  return (
    <>
      <div className="container">
        {loading ? (
          <Loader />
        ) : error ? (
          <div>Something went wrong. Please try again later.</div>
        ) : (
          <>
            <SearchBar value={searchQuery} onChange={handleSearch} />
            <div className="table-wrapper">
              <Table
                displayedData={displayedData}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                editingRow={editingRow}
                handleSelectRow={handleSelectRow}
                handleEditChange={handleEditChange}
                editedValues={editedValues}
                handleSaveClick={handleSaveClick}
                handleCancelClick={handleCancelClick}
                handleDeleteSingleRecord={handleDeleteSingleRecord}
                handleEditClick={handleEditClick}
              />
              <div className="footer">
                <div>
                  {selectedRows.length > 0 && (
                    <button
                      className="btn-delete-selected"
                      onClick={handleDeleteSelected}
                    >
                      Delete Selected
                    </button>
                  )}
                </div>
                <Pagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  displayedData={displayedData}
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
