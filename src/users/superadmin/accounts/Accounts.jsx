import { useUserContext } from "../../context/UserContext";
import CreateAccount from "./CreateAccount";

const Accounts = () => {
  const { user } = useUserContext();

  return (
    <div>
      {user?.role === "superadmin" && <CreateAccount />}
    </div>
  );
};

export default Accounts;
