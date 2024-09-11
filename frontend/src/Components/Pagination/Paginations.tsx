import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./Pagination.css";

interface PaginationProps {
    pageCount: number;  // Total number of pages
    onPageChange: (page: number) => void;  // Function to call when page changes
}

const Paginations: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
    // Use state to keep track of the current page
    const [currentPage, setCurrentPage] = useState(1);  // Default page is 1

    // Handle page change
    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        event.preventDefault();
        setCurrentPage(page);  // Update the current page in the state
        onPageChange(page);    // Notify the parent about the page change
    };

    return (
        <div className="pagination">
            <Stack spacing={2} className="pagination">
                <Pagination
                    count={pageCount}           // Total number of pages
                    page={currentPage}          // Current active page
                    variant="outlined"          // Outlined style
                    color="primary"             // Color of pagination
                    size="large"                // Size of the pagination component
                    onChange={handleChangePage} // Handle page change
                />
            </Stack>
        </div>
    );
};

export default Paginations;
