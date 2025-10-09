import { useEffect, useRef, useState } from "react";
import { fetchLocationDetails } from "./components/commonLogic.js";
import Modal from "./components/Modal";
import Header from "./components/Header";
import { v4 as uuid4 } from "uuid";
import AddLocationBtn from "./components/AddLocationBtn.jsx";
import LocationCard from "./components/Card.jsx";

const storedCards = JSON.parse(localStorage.getItem("myCards")) || [];

export default function App() {
  const modalRef = useRef(null);
  const [cards, setCards] = useState(storedCards);

  // useEffect(() => {
  //   async function fetchDetails(card) {
  //     const { zip, country } = card;
  //     const details = await fetchLocationDetails(zip, country);
  //     return details;
  //   }

  //   setCards(
  //     storedCards.map(async (eachCard) => {
  //       const data = await fetchDetails(eachCard);

  //       return {
  //         ...eachCard,
  //         details: data,
  //       };
  //     })
  //   );
  // }, []);

  const maxCards = 10;
  useEffect(() => {
    localStorage.setItem("myCards", JSON.stringify(cards));
  }, [cards]);

  function addLocation({ zip, country, details }) {
    let newCard = {
      id: uuid4(),
      zip,
      country,
      details,
      loading: false,
      error: null,
    };
    setCards((prevCards) => [newCard, ...prevCards]);
  }

  function deleteCard(card) {
    const result = window.confirm("confirm delete?");
    if (result) {
      setCards((prevCards) =>
        prevCards.filter((eachCard) => eachCard.id !== card.id)
      );
    }
  }

  async function refreshCard(card) {
    const loadingCard = {
      ...card,
      details: null,
      loading: true,
      error: null,
    };
    setCards((prevCards) =>
      prevCards.map((eachCard) =>
        card.id === eachCard.id ? loadingCard : eachCard
      )
    );

    try {
      const details = await fetchLocationDetails(card.zip, card.country);
      setCards((prevCards) =>
        prevCards.map((eachCard) =>
          card.id === eachCard.id
            ? {
                ...card,
                loading: false,
                error: null,
                details,
              }
            : eachCard
        )
      );
    } catch (err) {
      setCards((prevCards) =>
        prevCards.map((eachCard) =>
          card.id === eachCard.id
            ? {
                ...card,
                loading: false,
                details: null,
                error: err.message || "Unable to fetch weather details ",
              }
            : eachCard
        )
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-8 py-8 space-y-6 ">
        {cards.length === 0 && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <p className="mb-6 text-lg opacity-90">
              No locations yet — add one to get started.
            </p>

            <AddLocationBtn ref={modalRef} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
          {cards.map((card) => (
            <LocationCard
              key={card.id}
              card={card}
              refreshCard={refreshCard}
              deleteCard={deleteCard}
            />
          ))}
        </div>
      </main>

      {cards.length > 0 && (
        <AddLocationBtn
          ref={modalRef}
          disabled={cards.length === maxCards}
          cssClasses="fixed bottom-6 right-6  z-50 "
        />
      )}

      <Modal ref={modalRef} addLocation={addLocation} cards={cards} />
    </div>
  );
}
