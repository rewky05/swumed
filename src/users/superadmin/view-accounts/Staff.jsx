import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

import { FaSortUp, FaSortDown } from "react-icons/fa";
import { FaSortAlphaUp, FaSortAlphaDown } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

const Staff = ({ role, title }) => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting state
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchHospitalAndBranchNames = async (
    hospitalId,
    clinicId,
    branchId
  ) => {
    try {
      const db = getDatabase();
      const branchRef = hospitalId
        ? ref(db, `hospitals/${hospitalId}/branch/${branchId}/name`)
        : clinicId
        ? ref(db, `clinics/${clinicId}/branch/${branchId}/name`)
        : null;

      const namePromise = clinicId
        ? ref(db, `clinics/${clinicId}/name`)
        : hospitalId
        ? ref(db, `hospitals/${hospitalId}/name`)
        : Promise.resolve("Unknown");

      const branchNamePromise = branchRef
        ? new Promise((resolve) => {
            onValue(branchRef, (snapshot) => {
              resolve(snapshot.val() || "Unknown");
            });
          })
        : Promise.resolve("Unknown");

      const hospitalName = await new Promise((resolve) => {
        onValue(namePromise, (snapshot) => {
          resolve(snapshot.val() || "Unknown");
        });
      });

      const branchName = await branchNamePromise;

      return {
        hospitalName: hospitalName || "Unknown",
        branchName: branchName || "Unknown",
      };
    } catch (error) {
      console.error("Error fetching hospital and branch names:", error);
      return { hospitalName: "Error", branchName: "Error" };
    }
  };

  const fetchStaffMembers = () => {
    const db = getDatabase();
    const staffRef = ref(db, "staff");

    onValue(staffRef, async (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched staff data:", data);
      if (data) {
        const staffList = await Promise.all(
          Object.keys(data)
            .filter((key) => data[key].role === role)
            .map(async (key) => {
              const { hospital_id, clinic_id, branch_id } = data[key];
              const { hospitalName, branchName } =
                await fetchHospitalAndBranchNames(
                  hospital_id || null,
                  clinic_id || null,
                  branch_id
                );
              return {
                id: key,
                ...data[key],
                hospitalName,
                branchName,
              };
            })
        );
        setStaffMembers(staffList);
      } else {
        console.error("No data found at staff node.");
      }
    });
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const handleViewStaffDetails = (staff) => {
    setSelectedStaff(staff);
  };

  const filteredStaff = staffMembers.filter((staff) => {
    const staffFirstName = staff.firstName?.toLowerCase() || "";
    const staffLastName = staff.lastName?.toLowerCase() || "";
    const staffEmail = staff.account?.email?.toLowerCase() || "";
    const branchName = staff.branchName?.toLowerCase() || "";
    const facilityName = staff.hospitalName?.toLowerCase() || "";

    const searchLower = searchTerm.toLowerCase();

    return (
      staffFirstName.includes(searchLower) ||
      staffLastName.includes(searchLower) ||
      staffEmail.includes(searchLower) ||
      branchName.includes(searchLower) ||
      facilityName.includes(searchLower)
    );
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const sortedStaff = filteredStaff.sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    if (sortOrder === "asc") {
      return nameA > nameB ? 1 : -1;
    } else {
      return nameA < nameB ? 1 : -1;
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = sortedStaff.slice(indexOfFirstItem, indexOfLastItem);

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredStaff.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold p-1">{title}</h2>
        </div>

        <div className="flex items-center gap-x-4">
          <div className="flex w-[406px] items-center">
            <div className="relative justify-end w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 w-full rounded-md p-2 mb-4 text-sm"
              />
              <span className="absolute right-3 top-[35%] transform -translate-y-1/2">
                <IoIosSearch size={20} className="text-gray-400" />
              </span>
            </div>
          </div>
          <div className="mb-[10px]">
            <button onClick={handleSortOrderChange} className="text-xl">
              {sortOrder === "asc" ? <FaSortAlphaUp /> : <FaSortAlphaDown />}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto border rounded-xl overflow-hidden">
          <table className="w-full text-left text-[#171A1F] text-sm">
            <thead>
              <tr className="border-b bg-[#FAFAFB] text-[#565E6C] font-medium p-4">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Facility</th>
                <th className="p-4">Branch</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => {
                  return (
                    <tr key={staff.id} className="border-b">
                      <td className="p-4">
                        {staff.firstName + " " + staff.lastName || "N/A"}
                      </td>
                      <td className="p-4">{staff.account.email}</td>
                      <td className="p-4">{staff.hospitalName}</td>
                      <td className="p-4">{staff.branchName}</td>
                      <td className="p-4 text-center flex justify-center items-center">
                        <button
                          onClick={() => handleViewStaffDetails(staff)}
                          className="action-button"
                        >
                          View
                        </button>
                        <button className="action-button">Edit</button>
                        <button className="discharge-button">Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-2">
                    No {title} found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const InfodeskStaff = () => (
  <Staff role="Information Desk Staff" title="InfoDesk Staff" />
);
export const Philhealth = () => (
  <Staff role="Philhealth Staff" title="Philhealth Staff" />
);
