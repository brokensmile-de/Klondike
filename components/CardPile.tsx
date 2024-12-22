import { Card } from '../utils/cardUtils';
import { cn } from "@/lib/utils"
import { RandomValueSingleton } from "@/lib/globalSingleton";
import { GlobalWin } from "@/lib/globalWin";
import React from 'react';

interface CardPileProps {
  cards: Card[];
  faceUp: boolean;
  onClick?: () => void;
  onDrop?: (cards: Card[], fromPile: number) => void;
  children?: React.ReactNode;
  isDrawPile?: boolean;
  isFoundation?: boolean;
  pileIndex: number;
}

export function CardPile({ cards, onClick, onDrop, children, isDrawPile, isFoundation }: CardPileProps) {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const { cards, fromPile } = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (onDrop) {
      onDrop(cards, fromPile);
    }
  };

 
  const singleton = RandomValueSingleton.getInstance(['bg-face1','bg-face2','bg-face3','bg-face4' ]);

  const renderCard = (card: Card, index: number) => {

    const isStacked = isFoundation || isDrawPile;
    return (
      <div
        key={`${card.suit}-${card.rank}`}
        className={cn(
          "absolute w-24 h-36 rounded-lg border-2 border-gray-300 select-none",
          card.faceUp ? "bg-white" : `${singleton.getRandomValue()}`,
          isStacked ? "left-0 top-0" : "left-0",
          index === cards.length - 1 && "z-10"
        )}
        style={isStacked ? { top: `${index * 0}px`, left: `${index * 0}px` } : { top: `${index * 30}px` }}
      >
        {card.faceUp && (
          <div className={cn(
            "flex items-center justify-center w-full h-full text-4xl font-bold select-none",
            card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'
          )}>
            {`${card.rank}${card.suit}`}
          </div>
        )}
      </div>
    );
  };


    const renderWinningAnimation = () => {

      const winSingleton = GlobalWin.getInstance();
     
      console.log( winSingleton.getWin());

      if( winSingleton.getWin())
      {
        const cardsToAnimate = Array.from({ length: 30 }, (_, i) => (
          <div className="win-card" key={i} style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}>
            <div className="bg-joker absolute rounded-lg w-[92px] h-[142px]"></div>
          </div>
        ));
    
        return <div className="win-animation">{cardsToAnimate}</div>;
      }
 
    };



  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
      className={cn(
        "relative w-24 h-36 rounded-lg transition-all duration-200 select-none",
        isOver && "ring-2 ring-yellow-400",
        cards.length === 0 ? "bg-green-600 border-2 border-dashed border-green-400" : "bg-transparent",
        isDrawPile && "cursor-pointer hover:ring-2 hover:ring-yellow-400 hover:shadow-lg",
        onClick && "cursor-pointer hover:shadow-lg"
      )}
    >

{renderWinningAnimation()}


      
      {/* Kartenrendering */}
      {cards.map((card, index) => renderCard(card, index))}
      {cards.length > 0 && !isFoundation && !isDrawPile && (
        <div className="absolute bottom-50 right-0 bg-white rounded-full px-2 py-1 text-xs font-bold z-20">
          {cards.length}
        </div>
      )}
      {children}
    </div>
  );
}


