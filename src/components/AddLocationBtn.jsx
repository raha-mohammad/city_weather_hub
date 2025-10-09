const AddLocationBtn = function AddLocationBtn({
  cssClasses = "",
  disabled = false,
  openModal,
}) {
  function handleClick() {
    if (disabled) {
      alert(
        "You can have a maximum of 10 locations on screen. Please delete an existing location before adding a new one"
      );
      return;
    }
    openModal();
  }

  return (
    <button
      onClick={handleClick}
      className={` text-white font-semibold  px-4 py-3 rounded-lg cursor-pointer bg-amber-600 hover:bg-amber-500 focus:outline-none shadow-lg ${cssClasses}`}
    >
      Add Location
    </button>
  );
};

export default AddLocationBtn;
