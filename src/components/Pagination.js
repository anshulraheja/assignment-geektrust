import React from 'react';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';

function Pagination({
  pageCount,
  currentPage,
  setCurrentPage,
  displayedData,
}) {
  const paginationButtons = Array.from(
    { length: pageCount },
    (_, i) => i + 1
  );

  return (
    <div className="pagination-wrapper">
      <MdKeyboardDoubleArrowLeft
        onClick={() => {
          if (currentPage !== 1) {
            setCurrentPage(1);
          }
        }}
        className={
          currentPage === 1 || !displayedData.length ? 'disabled' : ''
        }
      />
      <GrFormPrevious
        onClick={() => {
          if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
          }
        }}
        className={
          currentPage === 1 || !displayedData.length ? 'disabled' : ''
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
  );
}

export default Pagination;
