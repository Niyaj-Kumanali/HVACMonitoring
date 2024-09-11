import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./Pagination.css";

interface PaginationProps {
    pageCount: number;
    page: number;
    handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

const Paginations: React.FC<PaginationProps> = ({ pageCount, page, handlePageChange }) => {
    return (
        <div className="pagination">
            <Stack spacing={2} className="pagination">
                <Pagination
                    count={pageCount}
                    page={page}
                    variant="outlined"
                    color="primary"
                    size="large"
                    onChange={handlePageChange}
                />
            </Stack>
        </div>
    );
};

export default Paginations;
