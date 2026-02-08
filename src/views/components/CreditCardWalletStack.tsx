import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import type { CreditCard } from "../../models/entities.ts";
import { CreditCardVisual } from "./CreditCardVisual.tsx";

interface CreditCardWalletStackProps {
  cards: CreditCard[];
  spentByCard: Record<string, number>;
}

const MAX_VISIBLE = 5;
const PEEK_HEIGHT = 40;

export function CreditCardWalletStack({
  cards,
  spentByCard,
}: CreditCardWalletStackProps) {
  const visibleCards = cards.slice(0, MAX_VISIBLE);
  const remaining = cards.length - MAX_VISIBLE;

  const [order, setOrder] = useState<number[]>(() =>
    visibleCards.map((_, i) => i),
  );
  const [prevCardsLength, setPrevCardsLength] = useState(visibleCards.length);
  const [cardHeight, setCardHeight] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

  if (visibleCards.length !== prevCardsLength) {
    setPrevCardsLength(visibleCards.length);
    setOrder(visibleCards.map((_, i) => i));
  }

  useEffect(() => {
    if (!measureRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCardHeight(entry.contentRect.height);
      }
    });
    observer.observe(measureRef.current);
    return () => observer.disconnect();
  }, [visibleCards.length]);

  const handleCardClick = useCallback(
    (cardIndex: number) => {
      const pos = order.indexOf(cardIndex);
      if (pos <= 0) return;
      setOrder((prev) => {
        const next = [...prev];
        next.splice(pos, 1);
        next.unshift(cardIndex);
        return next;
      });
    },
    [order],
  );

  if (cards.length === 0) {
    return (
      <p className="text-text-muted text-sm">
        Nenhum cartão cadastrado.{" "}
        <Link to="/credit-cards" className="text-primary hover:underline">
          Cadastrar cartão
        </Link>
      </p>
    );
  }

  if (cards.length === 1) {
    const card = cards[0];
    return (
      <div className="max-w-sm">
        <CreditCardVisual
          card={card}
          spent={spentByCard[card.ID] ?? 0}
          compact
        />
      </div>
    );
  }

  const h = cardHeight > 0 ? cardHeight : 190;
  const containerHeight = h + (visibleCards.length - 1) * PEEK_HEIGHT;

  return (
    <div className="relative max-w-sm">
      <div
        className="relative transition-[height] duration-300 ease-in-out"
        style={{ height: `${containerHeight}px` }}
      >
        {visibleCards.map((card, originalIndex) => {
          const position = order.indexOf(originalIndex);
          const y = position * PEEK_HEIGHT;
          const z = visibleCards.length - position;

          return (
            <div
              key={card.ID}
              ref={originalIndex === 0 ? measureRef : undefined}
              className="absolute left-0 right-0 cursor-pointer transition-all duration-300 ease-in-out"
              style={{
                transform: `translateY(${y}px)`,
                zIndex: z,
              }}
              onClick={() => handleCardClick(originalIndex)}
            >
              <CreditCardVisual
                card={card}
                spent={spentByCard[card.ID] ?? 0}
                compact
              />
            </div>
          );
        })}
      </div>
      {remaining > 0 && (
        <p className="text-xs text-text-muted text-center mt-2">
          +{remaining} cartão{remaining > 1 ? "ões" : ""}
        </p>
      )}
    </div>
  );
}
