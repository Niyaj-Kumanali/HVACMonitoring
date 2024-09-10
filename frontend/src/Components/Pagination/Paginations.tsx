import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./Pagination.css"


const Paginations = () => {
    return (
        <div className="pagination">
            <Stack spacing={2} className="pagination">
                <Pagination count={10} variant="outlined" color="primary" size="large" />
            </Stack>
        </div>
    )
}

export default Paginations