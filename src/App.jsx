import { useEffect, useRef, useState } from "react";
import { saveOrUpdateLocWeather } from "./components/commonLogic.js";
import Cards from "./components/Cards";
import Modal from "./components/Modal";
import Header from "./components/Header";
import { CardsContext } from "./context/CardsContext.js";

const storedCards = JSON.parse(localStorage.getItem("myCards")) || [];

export default function App() {
  const modalRef = useRef(null);
  const [cards, setCards] = useState(storedCards);
  useEffect(() => {
    localStorage.setItem("myCards", JSON.stringify(cards));
  }, [cards]);

  function addLocation({ zip, country, data }) {
    saveOrUpdateLocWeather({ zip, country, data, setCards });
  }

  function deleteCard(card) {
    const result = window.confirm("confirm delete?");
    if (result) {
      setCards((prevCards) =>
        prevCards.filter((eachCard) => eachCard.id !== card.id)
      );
    }
  }

  function refreshCard(card) {
    const { zip, country, data } = card;
    saveOrUpdateLocWeather({
      zip,
      country,
      data,
      existingCard: card,
      setCards,
    });
  }
  const contextValue = {
    cards,
    addLocation,
    refreshCard,
    deleteCard,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <CardsContext.Provider value={contextValue}>
        <main className="max-w-6xl mx-auto px-8 py-8 space-y-6 ">
          {cards.length === 0 && (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
              <p className="mb-6 text-lg opacity-90">
                No locations yet — add one to get started.
              </p>

              <button
                onClick={() => modalRef.current.open()}
                className=" text-white font-semibold   px-4 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 focus:outline-none  cursor-pointer  shadow-lg"
              >
                Add Location
              </button>
            </div>
          )}

          <Cards />
        </main>

        {cards.length > 0 && (
          <button
            onClick={() => modalRef.current.open()}
            className="fixed text-white font-semibold bottom-6 right-6 z-50 px-4 py-3 rounded-lg cursor-pointer bg-amber-600 hover:bg-amber-500 focus:outline-none   shadow-lg "
            title="Add Location"
            aria-label="Add Location"
          >
            Add Location
          </button>
        )}

        <Modal ref={modalRef} />
      </CardsContext.Provider>
    </div>
  );
}
