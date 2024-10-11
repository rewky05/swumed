
const View = ({ branch, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Branch Details</h2>
        <p><strong>Branch Name:</strong> {branch.name}</p>
        <p><strong>Address:</strong> {branch.address}</p>
        <p><strong>Staff Members:</strong> {branch.staff ? Object.keys(branch.staff).length : 0}</p>
        <p><strong>Patients:</strong> {branch.patients ? Object.keys(branch.patients).length : 0}</p>
        <p><strong>Doctors:</strong> {branch.doctors ? Object.keys(branch.doctors).length : 0}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-primary_maroon text-white py-2 px-4 rounded hover:bg-highlight_pink"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default View;
