import "ldrs/cardio";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-5">
      <l-cardio size="50" stroke="4" speed="2" color="maroon"></l-cardio>
    </div>
  );
};

export default Loading;
