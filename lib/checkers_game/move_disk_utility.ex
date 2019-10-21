defmodule CheckersGame.MoveDisk do

  def move_disk(game, position) do
    if length(game.doubleKill) > 0 do
      result = shift_disk(game, Enum.at(game.doubleKill, 0))
      board = result.board
      tile = IO.inspect set_is_selected(board, Enum.at(game.doubleKill, 0), true)
      board = List.replace_at(board, tile.position, tile)
      game = Map.merge(game, %{board: board, whites: result.whites, blacks: result.blacks})
      shift_disk(game, position)
    else
      shift_disk(game, position)
    end
  end

  def shift_disk(game, position) do
    # Get the selected disk
    tile = find_selected_disk(game.board, 0)
    selectedDisk = tile.disk

    # Check if there was any enemy kill
    result = check_enemy_kill(selectedDisk, position, game)

    # Update all the values
    board = result.board
    whites = result.whites
    |> Enum.map(fn el ->
      if(tile.position == el.position) do
        Map.put(el, :position, position)
      else
        el
      end
    end)

    blacks = result.blacks
    |> Enum.map(fn el ->
      if(tile.position == el.position) do
        Map.put(el, :position, position)
      else
        el
      end
    end)

    selectedDisk = Map.put(selectedDisk, :position, position)
    tile = Map.put(tile, :disk, nil)

    # To check if the disk becomes king after move
    if selectedDisk.isKing === false do
      Map.put(selectedDisk, :isKing, is_king(selectedDisk))
    end

    new_tile = Map.put(Enum.at(board, position), :disk, selectedDisk)

    # Move the disk from current position to new Position
    board = List.replace_at(board, tile.position, tile)
    |> List.replace_at(position, new_tile)
    |> remove_highlights()
    %{
      board: board,
      whites: whites,
      blacks: blacks
    }
  end

  def is_king(disk) do
    if disk.color == "black" and disk.position <= 7 do
      true
    else
      false
    end
    if disk.color == "white" and disk.position >=56 do
      true
    else
      false
    end
  end

  # To remove highlights from all the tiles
  def remove_highlights(board) do
    Enum.map(board, fn tile ->
      Map.put(tile, :isHighlighted, false)
    end)
  end

  # To remove disk from either whites or blacks
  def remove_disk(position, deck) do
    Enum.filter(deck, fn el ->
      if el.position !== position do
        el
      end
    end)
  end

  # To find the selected disk from the entire board
  def find_selected_disk(board, position) do
    tile = Enum.at(board, position)
    if tile[:disk] !== nil and tile.disk.isSelected == true do
      set_is_selected(board, position, false)
    else
      find_selected_disk(board, position+1)
    end
  end

  # Set the selected status of disk to false
  def set_is_selected(board, position, value) do
    disk = Enum.at(board, position).disk |> Map.put(:isSelected, value)
    Map.merge(Enum.at(board, position), %{disk: disk})
  end

  # Check if there was enemy on the next tile
  def check_enemy_kill(disk, position, game) do
    # If there was enemy, kill it and update the board
    if abs(disk.position - position) > 9 do
      delta = div(disk.position - position, 2)
      deadDisk = disk.position - delta
      color = Enum.at(game.board, deadDisk).disk.color
      board = kill_enemy(game.board, deadDisk)
      if color == "white" do
        whites = remove_disk(deadDisk, game.whites)
        blacks = game.blacks
        %{
         board: board,
         whites: whites,
         blacks: blacks
        }
      else
        whites = game.whites
        blacks = remove_disk(deadDisk, game.blacks)
        %{
          board: board,
          whites: whites,
          blacks: blacks
        }
      end
    # Else return the original state of the game
    else
      game
    end
  end

  # To remove enemy disk from the board
  def kill_enemy(board, position) do
    tile = Map.merge(Enum.at(board, position), %{disk: nil})
    List.replace_at(board, position, tile)
  end

end
