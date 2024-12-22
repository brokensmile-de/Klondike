"use client"

import React from 'react';
import { Card, createDeck, isValidMove, canAddToFoundation } from '../utils/cardUtils';
import { CardPile } from './CardPile';
import { DraggableCard } from './DraggableCard';
import { Button } from "@/components/ui/button"
import { GlobalWin } from "@/lib/globalWin";

export function KlondikeSolitaire() {
  const [deck, setDeck] = React.useState<Card[]>([]);
  const [tableau, setTableau] = React.useState<Card[][]>(Array(7).fill([]));
  const [foundation, setFoundation] = React.useState<Card[][]>(Array(4).fill([]));
  const [waste, setWaste] = React.useState<Card[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    startNewGame();
  }, []);

  const checkForWin = () => {
    console.log("Checking Winning");
    const isGameWon = foundation.every(pile => pile.length === 13); 

    if (isGameWon) {
      console.log("YOU WON!!!");
      const singleton = GlobalWin.getInstance();
      singleton.setWin(true)

      buttonRef.current?.click();

    }
  };

  React.useEffect(() => {
    checkForWin();
  }, [foundation]);
  



  const instaWinCheat = () => {
    const allCards = [...deck, ...waste, ...tableau.flat()]; // Alle Karten sammeln
    const newFoundation: Card[][] = Array(4).fill(null).map(() => []);

    // Karten nach Farben und Werten sortieren
    const sortedCards = allCards.sort((a, b) => {
      // Feste Reihenfolge der Kartenwerte (Rangfolge von Ass bis König)
      const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
      // Sortierung nach Farbe (Suits)
      const suitsOrder = ['♥', '♦', '♣', '♠'];
      const suitComparison = suitsOrder.indexOf(a.suit) - suitsOrder.indexOf(b.suit);
      if (suitComparison !== 0) {
        return suitComparison; // Unterschiedliche Farben: Nach Reihenfolge sortieren
      }
    
      // Sortierung innerhalb derselben Farbe nach Rang (Rank)
      return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
    });
    // Karten in die Foundation einfügen
    sortedCards.forEach((card) => {
      const foundationIndex = ['♥', '♦', '♣', '♠'].indexOf(card.suit);
      if (foundationIndex !== -1) {
        newFoundation[foundationIndex].push({ ...card, faceUp: true }); // Karten hinzufügen und faceUp sicherstellen
      }
    });
    // Foundation aktualisieren und andere Piles leeren
    setFoundation(newFoundation);
    setTableau(Array(7).fill([])); // Tableau leeren
    setDeck([]); // Deck leeren
    setWaste([]); // Waste leeren
  }

  const startNewGame = () => {
    const newDeck = createDeck();
    const newTableau: Card[][] = Array(7).fill([]).map(() => []);
    const singleton = GlobalWin.getInstance();
    singleton.setWin(false)

    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = newDeck.pop()!;
        if (i === j) {
          card.faceUp = true;
        } else {
          card.faceUp = false;
        }
        newTableau[j].push(card);
      }
    }

    setDeck(newDeck);
    setTableau(newTableau);
    setFoundation(Array(4).fill([]));
    setWaste([]);
  };

  const drawCard = () => {
    if (deck.length === 0) {
      setDeck(waste.reverse().map(card => ({ ...card, faceUp: false })));
      setWaste([]);
    } else {
      const drawnCard = deck.pop()!;
      drawnCard.faceUp = true;
      setWaste([...waste, drawnCard]);
      setDeck([...deck]);
    }
  };

  const moveCards = (cards: Card[], fromPile: number, toPile: number, isTableau: boolean) => {
    if (isTableau) {
      const newTableau = [...tableau];
      const fromPileCards = newTableau[fromPile];
      const toPileCards = newTableau[toPile];

      if (isValidMove(cards[0], toPileCards[toPileCards.length - 1])) {
        const cardIndex = fromPileCards.findIndex(c => c.suit === cards[0].suit && c.rank === cards[0].rank);
        newTableau[fromPile] = fromPileCards.slice(0, cardIndex);
        newTableau[toPile] = [...toPileCards, ...cards];
        if (newTableau[fromPile].length > 0 && !newTableau[fromPile][newTableau[fromPile].length - 1].faceUp) {
          newTableau[fromPile][newTableau[fromPile].length - 1].faceUp = true;
        }
        setTableau(newTableau);
      }
    } else {
      const newFoundation = [...foundation];
      if (cards.length === 1 && canAddToFoundation(cards[0], newFoundation[toPile])) {
        newFoundation[toPile] = [...newFoundation[toPile], cards[0]];
        const newTableau = [...tableau];
        const fromPileCards = newTableau[fromPile];
        const cardIndex = fromPileCards.findIndex(c => c.suit === cards[0].suit && c.rank === cards[0].rank);
        newTableau[fromPile] = fromPileCards.slice(0, cardIndex);
        if (newTableau[fromPile].length > 0 && !newTableau[fromPile][newTableau[fromPile].length - 1].faceUp) {
          newTableau[fromPile][newTableau[fromPile].length - 1].faceUp = true;
        }
        setTableau(newTableau);
        setFoundation(newFoundation);
      }
    }
    checkForWin(); 
  };

  const moveFromWaste = (card: Card, toPile: number, isTableau: boolean) => {
    if (isTableau) {
      const newTableau = [...tableau];
      const toPileCards = newTableau[toPile];
      if (isValidMove(card, toPileCards[toPileCards.length - 1])) {
        newTableau[toPile] = [...toPileCards, card];
        setTableau(newTableau);
        setWaste(waste.slice(0, -1));
      }
    } else {
      const newFoundation = [...foundation];
      if (canAddToFoundation(card, newFoundation[toPile])) {
        newFoundation[toPile] = [...newFoundation[toPile], card];
        setFoundation(newFoundation);
        setWaste(waste.slice(0, -1));
      }
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card, pileIndex: number) => {
    const pile = tableau[pileIndex];
    const cardIndex = pile.findIndex(c => c.suit === card.suit && c.rank === card.rank);
    const cardsToMove = pile.slice(cardIndex);
    e.dataTransfer.setData('text/plain', JSON.stringify({ cards: cardsToMove, fromPile: pileIndex }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-600 p-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">Klondike Solitaire</h1>
        <Button onClick={startNewGame} className="mb-8 w-full">New Game</Button>

        <div className="min-h-[700px] bg-green-700 rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-7 gap-5 mb-8">
            {foundation.map((pile, index) => (
              <CardPile
                key={`foundation-${index}`}
                cards={pile}
                faceUp={true}
                isFoundation={true}
                pileIndex={index}
                onDrop={(cards, fromPile) => {
                  if (fromPile === -1) {
                    moveFromWaste(cards[0], index, false);
                  } else {
                    moveCards(cards, fromPile, index, false);
                  }
                }}
              />
            ))}
            <div className="col-span-3 flex justify-end space-x-4">
              <CardPile cards={deck} faceUp={false} onClick={drawCard} isDrawPile={true} pileIndex={-2} />
              <CardPile cards={waste} faceUp={true} isDrawPile={true} pileIndex={-1}>
                {waste.length > 0 && (
                  <DraggableCard
                    card={waste[waste.length - 1]}
                    index={0}
                    pileIndex={-1}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify({ cards: [waste[waste.length - 1]], fromPile: -1 }));
                    }}
                  />
                )}
              </CardPile>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4">
            {tableau.map((pile, index) => (
              <CardPile
                key={`tableau-${index}`}
                cards={pile}
                faceUp={true}
                pileIndex={index}
                onDrop={(cards, fromPile) => {
                  if (fromPile === -1) {
                    moveFromWaste(cards[0], index, true);
                  } else {
                    moveCards(cards, fromPile, index, true);
                  }
                }}
              >
                {pile.map((card, cardIndex) => (
                  card.faceUp && (
                    <DraggableCard
                      key={`${card.suit}-${card.rank}`}
                      card={card}
                      index={cardIndex}
                      pileIndex={index}
                      onDragStart={handleDragStart}
                    />
                  )
                ))}
              </CardPile>
            ))}
          </div>

        </div>
        <Button ref={buttonRef} onClick={instaWinCheat} className="w-0 h-0 border-0 shadow-none bg-transparent absolute top-0 left-0 m-0"></Button>
      </div>

    </div>






  );





  
}

