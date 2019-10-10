# Checkers

###### Nikhil Nikhil
###### Nilay Barde
###### Megharth Lakhataria
&nbsp;

#### Game Description
Opposing players are at opposite ends of the board and each has either dark 
pieces or light pieces. The standard board is a 8x8 grid of squares of 
alternating colors of dark and light, but the pieces only occupy the dark 
squares. The 24 playing pieces are disk-shaped and of contrasting colors, 
usually dark and light colored.

##### Rules
- The two players alternate turns and can only move their own pieces. 
- The player with the black pieces moves first. 
- A player can only move their pieces diagonally forward, toward the 
opponent's side of the game-board.
- Each turn involves the moving of one piece, which can consist of a piece 
moving forward to a diagonally adjacent square that is unoccupied, or jumping 
forward over an occupied diagonally adjacent square, provided that the square 
beyond is also empty.
- If a player jumps over their opponent’s piece, they have successfully 
captured that piece and it is removed from the game.
- Each piece is initially referred to as a man, but if it reaches the furthest 
side of the board it becomes a king.
- Men may only move forward, but kings can move diagonally forwards as well as 
backwards.
- Multiple pieces maybe jumped by both men and kings provided that there are 
successive unoccupied squares beyond each piece that is jumped.

A player wins by either capturing all of the other player’s pieces or putting 
them into a position where they cannot move.

Checkers is a well specified game and all the rules for the game are already 
established. There are different versions of Checkers that are available (for 
example, Russian Checkers and checkers with flying kings) but we've decided to 
build the standard game of checkers which is described above.

We plan to include all of the game functionality that is available in a 
standard game of checkers. The players would be able to move their pieces in 
order to capture the opponent's pieces. Our game will enforce the rules by 
highlighting the positions/squares a player can jump their selected piece to.

We expect to encounter the following challenges:

- Coming up with a good data model to represent the state of the board, we 
would need to make sure that we only include the minimum information that's 
required to represent the state of the board.
- Animations or lack thereof for moving the pieces, we would also need to 
figure out a way to show when a piece is captured and moved out of the board.
- Handling the number of people who join the table to either play or watch the 
game.
- Coming up with a good user interface and user experience for our game, we 
would like to make sure that the users can easily navigate through the game.

