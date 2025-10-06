import { CardsContext } from "../context/CardsContext";
import LocationCard from "./Card";
import { useContext, useEffect, useState } from "react";

function Cards() {
  const { cards } = useContext(CardsContext);
  const noOfCardsPerPage = 10;

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(cards.length / noOfCardsPerPage));
  const start = (page - 1) * noOfCardsPerPage;
  const pageItems = cards.slice(start, start + noOfCardsPerPage);
  // when a user deletes a card on last page, page may be out of range
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
    // console.log("inside effect", page);
  }, [cards, totalPages, page]);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
        {pageItems.map((card) => (
          <LocationCard key={card.id} card={card} />
        ))}
      </div>

      {cards.length > noOfCardsPerPage && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((prevPage) => prevPage - 1)}
            className="px-3 font-semibold py-1 rounded text-black bg-gray-200 hover:bg-gray-300"
            disabled={page === 1}
          >
            Prev
          </button>
          <div className="text-lg text-white">
            Page {page} of {totalPages}
          </div>
          <button
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="px-3 font-semibold py-1 rounded text-black bg-gray-200 hover:bg-gray-300"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Cards;
