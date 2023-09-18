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

  const pageCount = Math.ceil(memberData.length / pageSize);

  const displayedData = memberData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paginationButtons = Array.from(
    { length: pageCount },
    (_, i) => i + 1
  );

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

  useEffect(() => {
    getMembersData();
  }, []);

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
                      <input type="checkbox" className="checkbox" />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData?.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <input type="checkbox" className="checkbox" />
                      </td>
                      <td>{member?.name}</td>
                      <td>{member?.email}</td>
                      <td>{member?.role}</td>
                      <td className="action-wrapper">
                        <RiDeleteBin5Line />
                        <FiEdit />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="footer">
              <div>
                <button className="btn-delete-selected">
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
                  className={currentPage === 1 ? 'disabled' : ''}
                />
                <GrFormPrevious
                  onClick={() => {
                    if (currentPage !== 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? 'disabled' : ''}
                />
                {paginationButtons.map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      if (page !== currentPage) {
                        setCurrentPage(page);
                      }
                    }}
                    className={page === currentPage ? 'active' : ''}
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
                    currentPage === pageCount ? 'disabled' : ''
                  }
                />
                <MdKeyboardDoubleArrowRight
                  onClick={() => {
                    if (currentPage !== pageCount) {
                      setCurrentPage(pageCount);
                    }
                  }}
                  className={
                    currentPage === pageCount ? 'disabled' : ''
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
