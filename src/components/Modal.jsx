import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useContext } from "react";
import { createPortal } from "react-dom";
import { FaSpinner } from "react-icons/fa6";
import { CardsContext } from "../context/CardsContext";
const API_KEY = import.meta.env.VITE_API_KEY;

const zipRegexMap = {
  in: /^\d{6}$/, // India 6 digits
  us: /^\d{5}(-\d{4})?$/, // US 5 digits or 5-4
  ca: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, // Canada
};
const initialFormState = {
  zipCode: "",
  country: "in",
  error: "",
};
const Modal = forwardRef(function Modal(_, ref) {
  const dialogRef = useRef(null);
  const zipRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const { addLocation, cards } = useContext(CardsContext);

  useImperativeHandle(ref, () => ({
    open: () => {
      setFormState(initialFormState);
      dialogRef.current.showModal();
      setTimeout(() => zipRef.current.focus(), 100);
    },
    close: () => {
      dialogRef.current.close();
    },
  }));

  async function handleSubmit(e) {
    e.preventDefault();

    const regex = zipRegexMap[formState.country];

    if (!regex.test(formState.zipCode.trim())) {
      setFormState((prevState) => ({
        ...prevState,
        error: "Invalid ZIP code,It should contain exactly six digits",
      }));
      return;
    }

    if (cards) {
      if (cards.some((card) => card.zip === formState.zipCode)) {
        setFormState((prevState) => ({
          ...prevState,
          error:
            "Weather details already exists for this zipCode, Try refreshing for updated weather. ",
        }));
        return;
      }
    }

    setSubmitting(true);
    try {
      const ZIP_CODE_URL = `http://api.openweathermap.org/geo/1.0/zip?zip=${formState.zipCode},${formState.country}&appid=${API_KEY}`;
      const zipCodeRes = await fetch(ZIP_CODE_URL);

      if (!zipCodeRes.ok) {
        throw new Error("No such zip code exists, Recheck your zip code. ");
      }

      const data = await zipCodeRes.json();
      addLocation({
        zip: formState.zipCode.trim(),
        country: formState.country,
        data,
      });
      dialogRef.current.close();
    } catch (err) {
      console.error(err);
      setFormState((prevState) => ({
        ...prevState,
        error: err.message || "Error while submitting details",
      }));
    } finally {
      setSubmitting(false);
    }
  }
  return createPortal(
    <dialog ref={dialogRef}>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50"
        onClick={() => dialogRef.current.close()}
      >
        <form
          className="rounded-xl p-6 bg-slate-900 text-white shadow-lg w-96"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold mb-4">Add a Location</h2>
          <label htmlFor="zipCode" className="block text-sm mb-1">
            Zip code:
          </label>
          <input
            id="zipCode"
            name="zipCode"
            ref={zipRef}
            value={formState.zipCode}
            onChange={(e) => {
              setFormState((prevState) => ({
                ...prevState,
                zipCode: e.target.value,
                error: "",
              }));
            }}
            type="text"
            placeholder="Enter 6-digit zip code"
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none  mb-3"
          />
          {formState.error && (
            <div className="text-red-400 text-sm mb-3">{formState.error}</div>
          )}
          <label htmlFor="country" className="block text-sm mb-1">
            Country:
          </label>
          <select
            id="country"
            name="country"
            value={formState.country}
            title="Read Only"
            disabled
            className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none  mb-4"
          >
            <option value="in">India (IN)</option>
            <option value="us">United States (US)</option>
            <option value="ca">Canada (CA)</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current.close()}
              className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500"
              disabled={submitting}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 flex items-center gap-2"
              disabled={submitting}
            >
              {submitting && <FaSpinner className="w-4 h-4 animate-spin  " />}
              Submit
            </button>
          </div>
        </form>
      </div>
    </dialog>,
    document.getElementById("modal-root")
  );
});

export default Modal;
