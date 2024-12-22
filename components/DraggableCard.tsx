import React from 'react';
import { Card } from '../utils/cardUtils';
import { cn } from "@/lib/utils"

interface DraggableCardProps {
  card: Card;
  index: number;
  pileIndex: number;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, card: Card, pileIndex: number) => void;
}

export function DraggableCard({ card, index, pileIndex, onDragStart }: DraggableCardProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStart(e, card, pileIndex);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      style={{
        position: 'absolute',
        top: `${index * 30}px`,
        zIndex: index + 10,
      }}
      className={cn(
        "w-24 h-36 bg-white shadow-md rounded-lg border-2 border-gray-300 flex items-center justify-center cursor-move transition-all duration-200 select-none",
        isDragging && "shadow-lg transform scale-105"
      )}
    >
       {/* Karteninhalt */}
       <div className="relative w-full h-full p-2">
        {/* Oben links */}
        <div className={cn(
          "absolute top-1 left-1 text-s font-bold",
          card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'
        )}>
          {`${card.rank}${card.suit}`}
        </div>
        {/* Oben rechts */}
        <div className={cn(
          "absolute top-1 right-1 text-s font-bold text-right",
          card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'
        )}>
          {`${card.rank}${card.suit}`}
        </div>
        {/* Groß in der Mitte */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center text-4xl font-bold",
          card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'
        )}>
          {`${card.rank}${card.suit}`}
        </div>
        {/* Unten links */}
        <div className={cn(
          "absolute bottom-1 left-1 text-s font-bold transform rotate-180",
          card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'
        )}>
          {`${card.rank}${card.suit}`}
        </div>
        {/* Unten rechts */}
        <div className={cn(
          "absolute bottom-1 right-1 text-s font-bold text-right transform rotate-180",
          card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'
        )}>
        {`${card.rank}${card.suit}`}
        </div>
        </div>
    </div>
  );
}

