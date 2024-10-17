import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import ViewModal from "../../modals/branch/View";
import UpdateModal from "../../modals/branch/Update";
import DeleteModal from "../../modals/branch/Delete";
import Loading from "../../Loading";

const FacilityList = ({ facilityType, title }) => {
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
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

  const handleView = (facilityId, branch) => {
    setSelectedBranch(branch);
    setSelectedFacilityId(facilityId);
    setCurrentModal("view");
  };

  const handleEdit = (facilityId, branchId, branch) => {
    setSelectedBranch(branch);
    setSelectedFacilityId(facilityId);
    setCurrentModal("edit");
  };

  const handleDelete = (facilityId, branchId, branch) => {
    const branchToDelete = facilities.find(
      (facility) => facility.id === facilityId
    )?.branches[branchId];

    if (branchToDelete) {
      setSelectedBranch(branchToDelete);
      setCurrentModal("delete");
    }
  };

  // const closeModal = () => {
  //   setSelectedBranch(null);
  //   setCurrentModal(null);
  // };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold p-1">{title}</h2>
      </div>
      <div className="overflow-x-auto overflow-y-auto border rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-sm text-[#171A1F]">
          <thead>
            <tr className="border-b bg-[#FAFAFB] text-[#565E6C] font-medium p-4">
              <th className="p-4">Facility</th>
              <th className="p-4">Branch</th>
              <th className="p-4">Address</th>
              <th className="p-4">Staff</th>
              <th className="p-4">Patients</th>
              <th className="p-4">Doctors</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {facilities.length > 0 ? (
              facilities.map((facility) =>
                Object.entries(facility.branches).map(([branchId, branch]) => {
                  const doctors = Object.entries(branch.doctors || {}).filter(
                    ([doctorId]) => typeof doctorId === "string"
                  );

                  let patientCount = 0;

                  doctors.forEach(([doctorId, doctorInfo]) => {
                    if (typeof doctorInfo === "object" && doctorInfo.patients) {
                      patientCount += Object.keys(doctorInfo.patients).length;
                    }
                  });

                  return (
                    <tr key={branchId} className="border-b">
                      <td className="p-4">{facility.name}</td>
                      <td className="p-4">{branch.name}</td>
                      <td className="p-4">{branch.address}</td>
                      <td className="p-4">
                        {branch.staff ? Object.keys(branch.staff).length : 0}
                      </td>
                      <td className="p-4">{patientCount}</td>
                      <td className="p-4">{doctors.length}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleView(facility.id, branch)}
                          className="action-button"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            handleEdit(facility.id, branchId, branch)
                          }
                          className="action-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(facility.id, branchId, branch)
                          }
                          className="action-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No facilities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {currentModal === "view" && (
        <ViewModal
          branch={selectedBranch}
          facilityType={facilityType}
          facilityId={selectedFacilityId}
          onClose={() => setCurrentModal(null)}
        />
      )}

      {currentModal === "edit" && (
        <UpdateModal
          facilityType={facilityType}
          facilityId={selectedFacilityId}
          branchID={selectedBranch.id}
          branch={selectedBranch}
          onClose={() => setCurrentModal(null)}
        />
      )}

      {currentModal === "delete" && (
        <DeleteModal
          facilityType={facilityType}
          facilityId={selectedFacilityId}
          branchID={selectedBranch.id}
          branch={selectedBranch}
          onClose={() => setCurrentModal(null)}
        />
      )}
    </div>
  );
};

export default FacilityList;
