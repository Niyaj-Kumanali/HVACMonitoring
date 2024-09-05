import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import "./Charts.css"
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/loginApi";
import { mongoAPI } from "../../api/MongoAPIInstance";
import { getFilteredDevices } from "../../api/deviceApi";

interface Warehouse {
    warehouse_id : string;
    warehouse_name :string;
}

const Charts = () => {

    const [selectedwarehouse, setSelectedWarehouse] = useState("");
    const [warehouse, setWarehouse] = useState<Warehouse[]>([]);

    const fetchAllWarehouses = async () => {
        try {
            const currentUser = await getCurrentUser();
            const response = await mongoAPI.get(`/warehouse/getallwarehouse/${currentUser.data.id.id}`);
            setWarehouse(response.data)

        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
        }
    };

    const handleWarehouseChange = async (e: SelectChangeEvent) => {
        const selectedValue = e.target.value;
        setSelectedWarehouse(selectedValue);

        const fdevices = await getFilteredDevices(selectedValue);
        console.log(fdevices);
    };



    useEffect(() => {
        fetchAllWarehouses()
    }, [])


    return (
        <div className="menu-data">
            <div className="charts">
                <div className="chart">
                    <h2>Charts</h2>
                    <FormControl className="form-control">
                        <InputLabel id="warehouse-label">Select Warehouse</InputLabel>
                        <Select
                            labelId="warehouse-label"
                            id="warehouse-select"
                            value={selectedwarehouse}
                            label="Select Warehouse"
                            onChange={handleWarehouseChange}
                            className="form-control-inner"
                        >
                            {
                                warehouse.map((key, index) => (
                                    <MenuItem key={index} value={key.warehouse_id}>{key.warehouse_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    )
}

export default Charts