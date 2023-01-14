# Chess scenarios

- scholar's mate `#chess 1.e4,a6/Bc4,a5/Qf3,a4/Qxf7`
- en-passant `#chess 1.c2c4,a7a6/c4c5,b7b5/c5b6`
- en-passant expiration `#chess 1.c2c4,a7a6/c4c5,b7b5/h2h3,h7h6/@c5`
- two R at rank-1 (move a) `#chess ^4k//////5K/R6R 1.Rae1`
- two R at rank-1 (move h) `#chess ^4k//////5K/R6R 1.Rhe1`
- two B at file-a (move 7) `#chess ^4k/B////BK 1.B7c5`
- two B at file-a (move 3) `#chess ^4k/B////BK 1.B3c5`
- R axis-locked `#chess ^3r1k///3R///3K @Rd5`
- N locked `#chess ^//5b//3N/2KN1r @d4`
- K targets invalidated (1 blocked by P) `#chess ^4rk/////2P/3K @Kd2`
- K checked & targets invalidated (1 blocked by P) `#chess ^3r1k/////2P/3K @Kd2`
- checkmate: capturing attacker r w/ B exposes K to other attacker b `#chess ^////1b/2B/r/r3K @Bc3`
- promotion `#chess ^3k4/1P 1.b8`
- TODO: under-promotion
- checkmate `#chess ^4k3/2R5/1R 1.Rb8`
- stalemate `#chess ^K/2k/1q @Ka8`
- non-stalemate `#chess ^1K/2q 1.Ka8`
- en-passant `#chess ^/1pp///2P 1.c5,b5/b6,@c7`
- FIXME castling (ITO piece-initial DSL) `#chess ^r3k2r///////R3K2R 1.Kg1,Kc8/@g1`
- FIXME castling (ITO 0-0) `#chess ^r3k2r///////R3K2R 1.0-0,0-0-0/@g1`

## castling

- 2 valid `#chess ^r3k2r///////4K 1.e1e2,@Ke8`
- 1 invalid due to attack `#chess ^2r1k///////R3K2R @e1`
- invalid after king-move `#chess ^r3k2r///////4K 1.Ke2,Kf8/Ke1,Ke8/Ke2,@Ke8`
- generate & invalidate castling target `#chess ^2r1k//////4P/R3K @Ke1`
- invalidate castling target NOT UNDER ATTACK `#chess ^r3k//////4P/R3K 1.e3,Rd8/@e1`
- valid after attack disappears `#chess ^2r1k//////4P/R3K 1.e3,Ra8/@Ke1`

### chess.960

- K castling target collides w/ regular move `#chess.960 ^4k///////1R1K 1.Kc1`
- K castling target @ xy-rook `#chess.960 ^4k///////4K1R 1.Kg1`
- R already at its castling destination (doesn't move) `#chess.960 ^4k///////3RK 1.Ke1c1` or `#chess.960 ^3k///////3K1R 1.Kg1`
- K already at its castling destination (doesn't move) `#chess.960 ^6kr///////R1K 1.Kc1` or `#chess.960 ^3k///////6KR 1.Kg1`

## chess.3

- N targets through center `#chess.3 ^3g////3k////4N///4K @Ne4`
- B targets through center `#chess.3 ^/1f////4p/////3P2B @Bg2`
- promotion (3x) `#chess.3 ^/2p////2P/////5f 1.c8,j12,f1`

- castling ITO coords `#chess.3 ^c2g3c/4f///r2k3r/2p/////3P/R3K2R 1.e1c1,d8b8,i12f12`
- castling ITO notation `#chess.3 ^c2g3c////r2k3r/3p//////R3K2R 1.0-0-0,0-0,0-0-0/@c1`
- en-passant `#chess.3 ^/1f//2p//1p2p//2PP/5f//4P 1.e4,b5,e3/b6,i5,k9/b7,k10,e2/@Pd5`
