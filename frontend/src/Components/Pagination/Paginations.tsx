import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./Pagination.css";

interface PaginationProps {
    pageCount: number;
    onPageChange: (page: number) => void;
}

const Paginations: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        event.preventDefault();
        setCurrentPage(page);
        onPageChange(page);
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
