# A utility to compute all possible moves for a currently selected disk

defmodule CheckersGame.ComputeMoves do

  # To calculate the possible moves of the disk
  def get_moves(game, position) do
    # remove Highlight from all tiles - get the initial board
    board = game.board |> remove_highlights()

    # Deselect all the disks
    board = Enum.map(board, fn tile ->
      if tile[:disk] do
        x = Map.put(tile.disk, :isSelected, false)
        Map.merge(tile, %{disk: x})
      else
        tile
      end
    end)

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
    result = compute_moves(position, board)
    board = result.tiles
    |> Enum.map(fn tile ->
      Map.merge(Enum.at(board, tile), %{isHighlighted: true})
    end)
    |> highlight_tiles(board)

    doubleKill = result.doubleKill
    Map.merge(game, %{board: board, doubleKill: doubleKill})
  end

  # Removes highlights from all the tiles
  def remove_highlights(board) do
    Enum.map(board, fn tile ->
      Map.put(tile, :isHighlighted, false)
    end)
  end

  # Highlights the tiles on which moves are possible
  def highlight_tiles(tiles, board) do
    if(length(tiles) > 0) do
      [tile | tail ] = tiles
      board = List.replace_at(board, tile.position, tile)
      if(length(tiles) == 1) do
        board
      else
        highlight_tiles(tail, board)
      end
    else
      board
    end
  end

  # Computes the kill moves for the current disk
  def get_jump_tiles(possibleMoves, jumpTiles, board, position) do
    if length(possibleMoves) == 0 do
      jumpTiles
    else
      tile = hd(possibleMoves)
      if Enum.at(board, tile)[:disk] !== nil do
        if(Enum.at(board, tile).disk.color !== Enum.at(board, position).disk.color) do
          delta = (tile - position)
          if tile + delta >= 0 and tile + delta <= 63 do
            if(Enum.at(board, tile+delta)[:disk] == nil) do
              if rem(tile+1, 8) !== 0 and rem(tile, 8) !== 0 do
                get_jump_tiles(tl(possibleMoves), [tile+delta | jumpTiles], board, position)
              else
                get_jump_tiles(tl(possibleMoves), jumpTiles, board, position)
              end
            else
              get_jump_tiles(tl(possibleMoves), jumpTiles, board, position)
            end
          else
            get_jump_tiles(tl(possibleMoves), jumpTiles, board, position)
          end
        else
          get_jump_tiles(tl(possibleMoves), jumpTiles, board, position)
        end
      else
        get_jump_tiles(tl(possibleMoves), jumpTiles, board, position)
      end
    end
  end

  # Behind the scenes calculations of the possible moves
  def compute_moves(position, board) do
    possibleMoves = get_possible_moves(Enum.at(board, position).disk, position)

    # Compute Kill moves
    jumpTiles = get_jump_tiles(possibleMoves, [], board, position)

    # If kill moves are available return them
    if length(jumpTiles) > 0 do
      doubleKill = check_double_kill(jumpTiles, board, position, [])
      if length(doubleKill) > 0 do
        %{
          tiles: jumpTiles ++ doubleKill,
          doubleKill: jumpTiles ++ doubleKill
        }
      else
        %{
          tiles: jumpTiles,
          doubleKill: []
        }
      end

    # If there are no kill moves available return normal moves
    else
      tiles = Enum.filter(possibleMoves, fn tile ->
        if Enum.at(board, tile)[:disk] == nil do
          tile
        end
      end)
      %{
        tiles: tiles,
        doubleKill: []
      }
    end


  end


  def check_double_kill(jumpTiles, board, position, doubleKill) do
    if length(jumpTiles) == 0 do
      doubleKill
    else
      possibleMoves = get_possible_moves(Enum.at(board, position).disk, hd(jumpTiles))
      x = get_doubleKills(possibleMoves, position, hd(jumpTiles), [], board)
      check_double_kill(tl(jumpTiles), board, position, x ++ doubleKill)
    end
  end

  def get_doubleKills(possibleMoves, position, tile, doubleKills, board) do
    if length(possibleMoves) == 0 do
      doubleKills
    else
      tempTile = hd(possibleMoves)
      if Enum.at(board, tempTile)[:disk] !== nil do
        if(Enum.at(board, tempTile).disk.color !== Enum.at(board, position).disk.color) do
          delta = 2*(tempTile - tile)
          if tile + delta >= 0 and tile + delta <= 63 do
            if(Enum.at(board, tile+delta)[:disk] == nil) do
              IO.puts tile
              if rem(tile+delta+1, 8) !== 0 and rem(tile+delta, 8) !== 0 do
                get_doubleKills(tl(possibleMoves), position, tile, [tile+delta | doubleKills], board)
              else
                get_doubleKills(tl(possibleMoves), position, tile, doubleKills, board)
              end
            else
              get_doubleKills(tl(possibleMoves), position, tile, doubleKills, board)
            end
          else
            get_doubleKills(tl(possibleMoves), position, tile, doubleKills, board)
          end
        else
          get_doubleKills(tl(possibleMoves), position, tile, doubleKills, board)
        end
      else
        get_doubleKills(tl(possibleMoves), position, tile, doubleKills, board)
      end
    end
  end

  # Returns all the legal moves
  def get_possible_moves(disk, position) do
    # Get the possible moves for the current king disk

    if disk[:isKing] == true do
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
