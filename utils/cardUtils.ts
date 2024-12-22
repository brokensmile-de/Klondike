export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export function createDeck(): Card[] {
  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, faceUp: false });
    }
  }

  return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function isValidMove(card: Card, targetCard: Card | null): boolean {
  if (!targetCard) return card.rank === 'K';
  
  const rankOrder: Rank[] = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];
  const cardIndex = rankOrder.indexOf(card.rank);
  const targetIndex = rankOrder.indexOf(targetCard.rank);

  return cardIndex === targetIndex + 1 && isAlternatingColor(card, targetCard);
}

function isAlternatingColor(card1: Card, card2: Card): boolean {
  const redSuits: Suit[] = ['♥', '♦'];
  return (redSuits.includes(card1.suit) && !redSuits.includes(card2.suit)) ||
         (!redSuits.includes(card1.suit) && redSuits.includes(card2.suit));
}

export function canAddToFoundation(card: Card, foundationPile: Card[]): boolean {
  if (foundationPile.length === 0) return card.rank === 'A';
  const topCard = foundationPile[foundationPile.length - 1];
  const rankOrder: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  return card.suit === topCard.suit && rankOrder.indexOf(card.rank) === rankOrder.indexOf(topCard.rank) + 1;
}

