# A utility to compute all possible moves for a currently selected disk

defmodule CheckersGame.ComputeMoves do

  # To calculate the possible moves of the disk
  def get_moves(game, position) do
    # remove Highlight from all tiles - get the initial board
    board = game.board |> remove_highlights()

    # select clicked disk
    board = Enum.map(board, fn tile ->
      if tile.position == position do
        x = Map.put(tile.disk, :isSelected, true)
        Map.merge(tile, %{disk: x})
      else
        tile
      end
    end)

    # Compute the moves for the selected disk
    board = compute_moves(position, board)
    |> Enum.map(fn tile ->
      Map.merge(Enum.at(board, tile), %{isHighlighted: true})
    end)
    |> highlight_tiles(board)

    # set doublekill to empty
    Map.merge(game, %{board: board, doubleKill: []})
  end

  # Removes highlights from all the tiles
  def remove_highlights(board) do
    Enum.map(board, fn tile ->
      Map.put(tile, :isHighlighted, false)
    end)
  end

  # Highlights the tiles on which moves are possible
  def highlight_tiles(tiles, board) do
    [tile | tail ] = tiles
    board = List.replace_at(board, tile.position, tile)
    if(length(tiles) == 1) do
      board
    else
      highlight_tiles(tail, board)
    end
  end

  # Behind the scenes calculations of the possible moves
  def compute_moves(position, board) do
    possibleMoves = get_possible_moves(Enum.at(board, position).disk, position)

    # Compute Kill moves
    jumpTiles = Enum.filter(possibleMoves, fn tile ->
      if Enum.at(board, tile)[:disk] do
        if(Enum.at(board, tile).disk.color !== Enum.at(board, tile).disk.color) do
          # Add the logic
          "enemy ahead"
        end
      end
    end)

    # If kill moves are available return them
    if length(jumpTiles) > 0 do
      jumpTiles

    # If there are no kill moves available return normal moves
    else
      Enum.filter(possibleMoves, fn tile ->
        if Enum.at(board, tile)[:disk] == nil do
          tile
        end
      end)
    end


  end


  # Returns all the legal moves
  def get_possible_moves(disk, position) do
    # Get the possible moves for the current king disk

    if disk["isKing"] do
      # For black king disk
      if disk.color == "black" do
        [position - 7, position - 9, position + 9, position + 7]
        |> check_legal_moves_king(position)
      # For white king disk
      else
        [position + 7, position + 9, position - 9, position - 7]
        |> check_legal_moves_king(position)
      end

    # get the possible moves for the current disk
    else
      if disk.color == "black" do
        [position-7, position-9]
        |> check_legal_moves_normal(position, "black")
      else
        [position+7, position+9]
        |> check_legal_moves_normal(position, "white")
      end

    end
  end

  # To check the legality of a move for king disk
  def check_legal_moves_king(moves, position) do
    # To ensure that it return only position from the next row
    Enum.filter(moves, fn el ->
      allowedRow = div(position - rem(position, 8), 8) - 1
      lowerBound = allowedRow * 8
      upperBound = allowedRow*8 + 7
      lowerBoundBottom = (allowedRow + 2) * 8
      upperBoundBottom = (allowedRow + 2) * 8 + 7
      if ((el >= lowerBound and el <= upperBound) or (el >= lowerBoundBottom and el <= upperBoundBottom)) and el >= 0 and el <= 63 do
        el
      end
    end)
  end

  # To check the legality of a move for normal disk
  def check_legal_moves_normal(moves, position, color) do
    Enum.filter(moves, fn el ->
      if color == "black" do
        allowedRow = div(position - rem(position, 8), 8) - 1
        lowerBound = allowedRow * 8
        upperBound = allowedRow*8 + 7
        if el >= lowerBound and el <= upperBound and el >= 0 and el <= 63 do
            el
        end
      else
        allowedRow = div(position - rem(position, 8), 8) + 1
        lowerBound = allowedRow * 8
        upperBound = allowedRow*8 + 7
        if el >= lowerBound and el <= upperBound and el >= 0 and el <= 63 do
            el
        end
      end
    end)
  end

end
