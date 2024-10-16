import { useParams } from "react-router-dom"; 
import { InfodeskStaff, Philhealth } from "./Staff";

const StaffManagement = () => {
  const { role } = useParams();

  return (
    <div>
      {role === "infodesk" ? <InfodeskStaff /> : <Philhealth />}
    </div>
  );
};

export default StaffManagement;
