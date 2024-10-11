import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
// import ViewModal from "../../modals/branch/View";
// import UpdateModal from "../../modals/branch/Update";
// import DeleteModal from "../../modals/branch/Delete";
import Collapsible from "./Collapsible"; 
import BranchDetails from "./BranchDetails"; 

const FacilityList = ({ facilityType, title }) => {
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [currentModal, setCurrentModal] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const facilityRef = ref(db, facilityType);

    const unsubscribe = onValue(facilityRef, (snapshot) => {
      setLoading(true);
      const facilityData = snapshot.exists()
        ? Object.entries(snapshot.val()).map(([key, value]) => ({
            id: key,
            name: value.name,
            branches: value.branch,
          }))
        : [];
      setFacilities(facilityData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [facilityType]);

  const handleView = (branch) => {
    setSelectedBranch(branch);
    setCurrentModal("view");
  };

  const handleEdit = (facilityId, branchId, branch) => {
    setSelectedBranch(branch);
    setCurrentModal("edit");
  };

  const handleDelete = (facilityId, branchId) => {
    setSelectedBranch({ id: branchId });
    setCurrentModal("delete");
  };

  // const closeModal = () => {
  //   setSelectedBranch(null);
  //   setCurrentModal(null);
  // };

  if (loading) {
    return <div>Loading {title}...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">{title}</h2>
      {facilities.map((facility) => (
          <div key={facility.id}>
            <Collapsible title={facility.name}>
              <div className="flex gap-4">
                {Object.entries(facility.branches).map(([branchId, branch]) => (
                  <BranchDetails
                    key={branchId}
                    branchName={branch.name}
                    branch={branch}
                    facilityId={facility.id}
                    facilityType={facilityType}
                    onEditClick={() => handleEdit(facility.id, branchId, branch)}
                    onViewClick={() => handleView(branch)}
                    onDeleteClick={() => handleDelete(facility.id, branchId)}
                  />
                ))}
              </div>
            </Collapsible>
          </div>
        ))}
      
      {/* {currentModal === "view" && (
        <ViewModal branch={selectedBranch} onClose={closeModal} />
      )}
      {currentModal === "edit" && (
        <UpdateModal
          facilityId={facility.id}
          branchId={selectedBranch?.id}
          branch={selectedBranch}
          onClose={closeModal}
        />
      )}
      {currentModal === "delete" && (
        <DeleteModal
          facilityId={facilityType} 
          branchId={selectedBranch?.id}
          onClose={closeModal}
        />
      )} */}
    </div>
  );
};

export default FacilityList;
