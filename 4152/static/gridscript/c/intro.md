# Chess intro

(based on [https://en.wikipedia.org/wiki/Chess](https://en.wikipedia.org/wiki/Chess))

## Goal

The object of the game is to checkmate the opponent's king `#chess ^4k3/2R5/1R/////4K 80.Rb8`
whereby the king is under immediate attack `@b8` (in 'check') and there is no way to remove it from attack on the next move `@e8`. There are also several ways a game can end in a draw.

## Rules

### Movement

Moving is compulsory; it is illegal to skip a turn, even when having to move is detrimental.
A player may not make any move that would put or leave the player's own king in check (see `#chess ^3r1k///3R///3K @d5`).
If the player to move has no legal move, the game is over; the result is either checkmate (a loss for the player with no legal move) if the king is in check, or stalemate (a draw) if the king is not (see `#chess ^K/2k/1q @a8`).
