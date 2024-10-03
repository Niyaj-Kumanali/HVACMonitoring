import { useParams } from "react-router-dom"
import AddVehicle from "../Add-Vehicle/Addvehicle";

const EditVehicle = () => {
    const { vehicleid } = useParams();
    console.log(vehicleid)

    return (
        <AddVehicle/>
    )
}

export default EditVehicle