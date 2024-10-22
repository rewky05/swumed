const ConfirmationModal = ({ branches, title, onClose }) => {
    const [branches, setBranches] = useState([{ id: 1, name: "", address: "" }]);

    const handleLessBranch = (index) => {
        if (branches.length > 1) {
          const updatedBranches = branches.filter((_, i) => i !== index);
          setBranches(updatedBranches);
        }
      };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
      </div>
    </div>
  );
};

export default ConfirmationModal;
