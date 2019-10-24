# To create the initial state of the board
defmodule CheckersGame.InitBoard do

  def init() do
    board = createBoard(0, [])
    board = Enum.reverse(board)
    createDisks(0, 0, [], [], board)
  end

  # Creates 64 tiles with two attributes
  def createBoard(count, board) do
    if count == 64 do
      board
    else
      tile = %{
        position: count,
        isHighlighted: false
      }
      createBoard(count+1, [tile | board])
    end
  end

  # Assigns each disk to a tile and updates the tile in the board
  def createDisks(row, col, whites, blacks, board) do
    if row == 3 do
      # Return the init state of the game
      %{
        blacks: Enum.reverse(blacks),
        whites: Enum.reverse(whites),
        board: board,
        doubleKill: [],
        message: [],
        winner: nil,
        players: []
      }
    else
      if col == 8 do
        # Change the row if the columns are filled
        createDisks(row + 1, 0, whites, blacks, board)
      else
        if rem(row, 2) === 0 do
          blackDisk = %{
            color: "black",
            position: 40 + (8 * row) + col,
            isSelected: false,
            isKing: false
          }

          whiteDisk = %{
            color: "white",
            position: 1 + (8 * row) + col,
            isSelected: false,
            isKing: false
          }
          newWhiteTile = Map.merge(Enum.at(board, 1 + (8 * row) + col) , %{disk: whiteDisk})
          newBlackTile = Map.merge(Enum.at(board, 40 + (8 * row) + col), %{disk: blackDisk})
          board = List.replace_at(board, 1 + (8 * row) + col, newWhiteTile)
          board = List.replace_at(board, 40 + (8 * row) + col, newBlackTile)
          whites = [whiteDisk | whites]
          blacks = [blackDisk | blacks]
          createDisks(row, col + 2, whites, blacks, board)
        else
          blackDisk = %{
            color: "black",
            position: 41 + (8 * row) + col,
            isSelected: false,
            isKing: false
          }

          whiteDisk = %{
            color: "white",
            position: (8 * row) + col,
            isSelected: false,
            isKing: false
          }
          newWhiteTile = Map.merge(Enum.at(board, 8 * row + col), %{disk: whiteDisk})
          newBlackTile = Map.merge(Enum.at(board, 41 + 8 * row + col), %{disk: blackDisk})
          board = List.replace_at(board, (8 * row) + col, newWhiteTile)
          board = List.replace_at(board, 41 + (8 * row) + col, newBlackTile)
          whites = [whiteDisk | whites]
          blacks = [blackDisk | blacks]
          createDisks(row, col + 2, whites, blacks, board)
        end
      end
    end
  end
end
