import { useState } from "react";

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left font-semibold py-2 px-4 rounded-t-lg transition duration-200 
          ${isOpen ? "bg-highlight_pink text-primary_maroon" : "bg-primary_maroon text-white hover:bg-highlight_pink hover:text-primary_maroon"}`}
      >
        {title}
      </button>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};

export default Collapsible;
