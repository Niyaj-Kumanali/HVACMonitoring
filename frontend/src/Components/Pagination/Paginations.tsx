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
                    count={pageCount}
                    page={currentPage}
                    variant="outlined"        
                    color="primary"
                    size="large" 
                    onChange={handleChangePage}
                />
            </Stack>
        </div>
    );
};

export default Paginations;
