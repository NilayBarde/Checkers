#### CS5610 - Web Development Project 1
# Checkers
_Group Members:_ Megharth Lakhataria, Nikhil Nikhil, Nilay Barde

## Introduction and Game Description
Our team decided to build a game of Checkers for this project. Checkers is a 
well specified game and all the rules for the game are already established. 
There are different versions of Checkers that are available (for example, 
Russian Checkers and checkers with flying kings) but we've decided to build the 
standard game of checkers, which is explained in the game description.

### Game Description 
Opposing players are at opposite ends of the board and each has either dark 
(black) pieces or light (gray) pieces. The standard board is a 8x8 grid of 
squares of alternating colors of dark and light, but the pieces only occupy the 
dark squares, which are red in our board. The 24 playing pieces are disk-shaped 
and of contrasting colors, we chose black and gray as the dark and light colors 
for the pieces. We also added a mechanism to have scores in our game. 
Conventionally, there isn't a score in a game of checkers but we thought it 
would be helpful for the users to know which player has captured more of the 
enemy pieces without counting it every time.

The player who first joins the game is considered player 1 and is assigned the 
black disks. The player who joins the game second is considered as player 2 and 
gets assigned the gray disks. Any user who joins the game after the first two 
users is considered a watcher and can only view the game being played and chat 
using the chat window. All of the messages in the chat can be viewed by anyone 
who has joined the game regardless of their role (player or watcher).

#### Rules
- The two players alternate turns and can only move their own pieces.
-  The player with the black pieces moves first and is considered as player 1.
-   A player can only move their pieces diagonally forward, toward the 
opponent's side of the game-board.
-   Each turn involves the moving of one piece, which can consist of a piece 
moving forward to a diagonally adjacent square that is unoccupied, or jumping 
forward over an occupied diagonally adjacent square, provided that the square 
beyond is also empty.
-   If a player jumps over their opponent’s piece, they have successfully 
captured that piece and it is removed from the game.
-   Each piece is initially referred to as a man, but if it reaches the 
furthest side of the board it becomes a king.
-   Men may only move forward, but kings can move diagonally forwards as well 
as backwards.
-   Multiple pieces maybe jumped by both men and kings provided that there are 
successive unoccupied squares beyond each piece that is jumped.
- A player wins by capturing all of the other player’s pieces.

## UI Design
For the user interface of our game, we decided to have an index page which 
shows all the games that have been created previously. A user can either create 
a new game by entering a game name or they can join a previously created game. 
The previously created  games are divided into active games and pending games. 
Active games are the games that already have two players and any number of 
watchers. Pending games are the games that have one player already joined and 
are waiting for the second player to join. If a user clicks on the join button 
for either active games or pending games, they are asked to enter a username to 
identify themselves with. Once the user enters the game name and username, the 
user is taken to the game lobby.

The user who joins a game channel first is considered the first player and the 
second user who joins the game next is considered the second player. All the 
users that join the game after the first two users are considered watchers. The 
design for the game lobby is fairly simple to understand for the users. We have 
the checkers game board on the left and the chat section on the right. The 
checkers game board is a standard 8x8 grid of squares of alternating colors of 
red and white. The disks are of contrasting colors, black and grey, and 
initially the disks are places at their starting position.

When a user clicks on one of the disks, the squares that the selected disk can 
move to, are highlighted in yellow. Clicking on any of the highlighted squares, 
moves the disk to the highlighted square, which is considered a move. The turn 
is now switched to the second player and then the second player makes their 
move. In a similar manner, the second player plays their turn by selecting a 
disk and then moving to one of the highlighted squares.

If there is an enemy disk positioned diagonally next to the selected disk and 
the square diagonally next to the enemy disk is empty, then that square is 
highlighted indicating that the player can capture the enemy disk and move to 
the highlighted square. Similarly, if there is a possibility of capturing two 
enemy disks in one turn, the squares diagonally next to the enemy disks are 
highlighted indicating that two of the enemy disks can be captured in one turn. 
Clicking on the highlighted square diagonally next to the second enemy disk 
will capture both the disks.

If a disk reaches the furthest row in front of it (the first row where the 
enemy disks were positioned initially), it becomes a king disk. A king disk is 
shown differently than a normal disk. The king disk has a border, for example, 
if the black disk becomes a king disk it has a white gray border and inversely 
if a gray disk becomes a king disk, it has a black border. King disks can move 
diagonally forward as well as backwards.

The chat window on the right is fairly straight forward to use as well. The 
users can type their messages in the chat input box and click on send, which 
will send their chat message to everyone who has joined the game lobby. All the 
users who have joined the game lobby can see all the messages sent in the chat 
window.

There are also three buttons under the game board, _Quit Game_, _Raise a Draw_, 
_Restart/Replay_. The _Quit Game_ button can be used to quit a game. The _raise 
a draw_ game can be used to raise a draw when the user can't make any moves. 
The _Restart/Replay_ button can be used to restart or replay the game 
during/after a game. The players are notified whenever one of these buttons is 
clicked and if the second player accepts the request for raising a draw or 
restart/replay, then the game board resets.

## UI to Server Protocol
Initially, we either need to create/join a game. When a user creates or joins a 
game, the browser/UI attempts to join a channel from the server. When the 
channel is successfully joined, the server returns the initial game state and 
the user is prompted to enter their username. After the user has entered their 
username, they are added to the game state and the checkers board is rendered 
on the user screen, along with all the disks positioned on their initial 
position.

For multiple games, there are multiple processes generated by the GenServer 
that maintain the individual games. The individual games have their own 
channels that they use to communicate with the server. 

When a user creates a game or joins a game, a message is broadcasted from the 
game channel to the index channel indicating that a new game has been created. 
The index channel returns the details about active and pending games which is 
then used to display the active and pending games on the index page.

If there's only one player that has joined a game, the user is asked to wait 
for the second player to join. After the second player joins the game, a 
message is broadcasted from the server that contains the game state with both 
the players and the game can finally begin.

When one of the players select a disk, a message is sent through the channel 
which contains the position of the disk that is selected and then the server 
computes the possible moves for the selected disk and returns a game state 
which highlights the squares where the disk can move to.

The entire game state is stored in the GenServer and whenever a player clicks 
on a highlighted square, a message is passed through the channel which contains 
the position of highlighted square and the server then returns the game state 
with the new position for the selected disk. After a player makes their move, a 
message is broadcasted to both the players which contains the updated state of 
the game and hence the updated game board is rendered for both the players. 
Once the player plays their turn, a function called _switch_turn_ is executed 
on the GenServer which switches the player turns and the second player can play 
their turn.

When a user wants to quit a game, restart/replay a game or raise a draw, a 
message is broadcasted to the second player who's playing the game. The second 
player is prompted to accept or decline the request made. If they accept the 
request, the intended task is completed.

## Data Structures on Server
The data structures on the server are used to represent the state of the 
checkers game board. The game state consists of the following:
```
Game State:
{
	blacks: Array<Disk>,
	whites: Array<Disk>,
	board: Array<Square>,
	doubleKill: Array<Integer>,
	message: Array<Message>,
	winner: String | null,
	players: Array<Player>
}
```
The _blacks_ array consists of the black disks. Each disk is represented by the 
following object:
```
Disk:
{
	color:  String,
	isKing:  Boolean,
	isSelected:  Boolean,
	position:  Integer
}
```
The _color_ attribute for the disk indicates if the disk is white (gray) or 
black. The _color_ attribute in the case of black disks is "black". The 
_isKing_ attributes indicates if the disk has become a king disk or note. Once 
a disk becomes a king disk, the _isKing_ attribute always stays true. The 
_isSelected_ attribute indicates if the user clicked/selected this disk to 
move. If this disk is selected, the possible moves for this disk are 
highlighted by highlighting the squares that this disk can move to. The 
_position_ attribute has the position of the disk on the board. The positions 
on the board are from 0 to 63 which represent the 64 (8x8) squares on the 
board. The position counter starts from the top left side of the board, in 
other words, the square on top left has the position 0 and then square next to 
it towards the right is position 1 and so on.

Similarly, the _whites_ attribute in the game state consists of all the disk 
objects for white disks. The _color_ attribute in the case of white 
(represented in the user interface as gray to differentiate it from white 
squares) disks is "white".

The _board_ attribute in the game state represents the state of the checkers 
board. It consists of _Square_ objects which represent each of the squares on 
the board. The _Square_ object is represented as follows:
```
Square:
{
	position: Integer,
	isHighlighted: Boolean,
	disk: Disk
}
```
The _position_ attribute for a square indicates the position of the square on 
the board which is an integer value between 0 and 63. The _isHighlighted_ 
boolean attribute for a square indicates if the square is highlighted or not. 
The _disk_ attribute indicates if there's a disk present at the square. If 
there is a disk at the square, the disk object will be the same as described 
earlier.

The _doubleKill_ attribute in the game state represents the possibility of a 
double kill or capturing two enemy disks in one turn. It contains positions 
where the selected disk can move to.

The _message_ attribute in the game state contains all the messages that are 
sent over chat. The Message objects is as follows:
```
Message: 
{
	user: String,
	message: String
}
```
The _user_ attribute stores the name of the user who posts the message and the 
_message_ attribute stores the message itself.

The _winner_ attribute stores the winner of the game. Initially, it is set to 
null and when the game ends and a winner is decided, it is stored in the 
_winner_ attribute.

The _players_ attribute in the game state is an array of Player objects. The 
Player object is as follows:
```
Player:
{
	name: String,
	hasTurn: Boolean
}
```
where the _name_ attribute is the name of the player and _hasTurn_ specifies if 
it's the player's turn to make a move.

## Implementation of Game Rules
The implementation of game rules was first done in the react code. Similar to 
the homework assignments, we first developed the game and game rules in react 
and then translated the code to elixir and moved it to the server.

We have created our board data structure as a one dimensional array that 
contains an integer positioned value of each square. In order to calculate the 
possible moves, we add or subtract _9_ or _7_ to calculate the possible moves. 
There are conditions set up for cases when there are overflows and enemy disks 
positioned at the diagonally adjacent squares.

If the diagonally adjacent squares are empty, they are highlighted (using the 
_isHighlighted_ boolean attribute for the squares) indicating that the user can 
move their selected disk to the highlighted square. Otherwise; if the 
diagonally adjacent squares is occupied by an enemy disk, we calculate if 
diagonally adjacent square to the enemy disk is empty or not. If it is empty, 
it is highlighted to indicate the the user can capture the enemy disk and move 
to the highlighted square. 

If there is a possibility to capture two enemy disks in one turn, then the same 
process is repeated for the updated position that we get after capturing the 
first enemy disk and the diagonally adjacent square to the second enemy disk is 
highlighted.

The game score is calculated using the length of _whites_ and _blacks_ arrays 
in the game state. We subtract the length of either of these array from 12 to 
calculate the score for each of the players.

The game ends when all of the disks for one of the players are captured.. We 
check for the game end condition by calculating the length of _whites_ and 
_blacks_ arrays in the game state. If one of them has a length of _0_ that 
means the other player has won.

## Challenges and Solutions
We faced several challenges during the development of this project. The first 
challenge was to decide on an appropriate data structure to represent the 
entire game state. We tackled this challenge by coming up with an initial data 
structure that we thought would entirely represent the game state and 
incrementally adding and making changes to it, in order to accurately represent 
the additional features we added in the game. For example, our initial game 
state did not have the players and double kill information. We later added this 
information to implement all the game rules and player turns.

Another challenge was dealing with the immutability in elixir. As the function 
parameters are immutable in elixir, it was a difficult task for us to update 
the state of the game every time the user makes a move. Everything from 
highlighting of squares, moving the disks, keeping track of players and their 
scores is being handled on the server.

Whenever there is a chance of double kill, two squares are highlighted and no 
matter which square the user clicks on, game should enforce it to be double 
kill. This was a challenge for us because we had to store the information for 
each of the squares that were highlighted and then track the exact path which 
is to be followed while capturing the two enemy disks. Also, as two disks are 
captured, we had to provide an updated state while capturing the second disk.  
  
Making everything work with GenServer was another challenge for us. We 
implemented everything using BackupAgent at first, and then wrote the code for 
GenServer. While in this process, writing functions and calls for the GenServer 
was easy, keeping a watch on the state of the game and where it was being 
updated was a difficult task and it took us a considerable amount of time to 
figure out that we had to update the state in GenServer too.