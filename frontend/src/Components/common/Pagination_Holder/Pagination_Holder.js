import React from "react";
import "./Pagination_Holder.css";
import { Pagination, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Pagination_Holder = ({ onPageChange, totalPages, handlePageChange }) => {
  const generatePaginationItems = () => {
    const items = [];
    const currentPage = onPageChange;

    if (totalPages <= 3) {
      // Show all pages if total pages are 3 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      // Show three pages with ellipsis logic
      if (currentPage > 1) {
        items.push(
          <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
            1
          </Pagination.Item>
        );
        if (currentPage > 2) {
          items.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }
      }

      // Show the current page
      items.push(
        <Pagination.Item key={currentPage} active>
          {currentPage}
        </Pagination.Item>
      );

      // Show the next page if it's not the last one
      if (currentPage < totalPages) {
        if (currentPage < totalPages - 1) {
          items.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }
        items.push(
          <Pagination.Item
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      }
    }

    return items;
  };

  return (
    <Col lg={12} className="mx-auto">
      <div className="mt-5">
        <Pagination className="justify-content-center main-pagination">
          <Pagination.Prev
            disabled={onPageChange === 1}
            onClick={() => handlePageChange(onPageChange - 1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="page-link-prev" />
          </Pagination.Prev>

          {generatePaginationItems()}

          <Pagination.Next
            disabled={onPageChange === totalPages}
            onClick={() => handlePageChange(onPageChange + 1)}
          >
            <FontAwesomeIcon icon={faArrowRight} className="page-link-next" />
          </Pagination.Next>
        </Pagination>
      </div>
    </Col>
  );
};

export default Pagination_Holder;
