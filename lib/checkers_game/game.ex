defmodule CheckersGame.Game do

  alias CheckersGame.InitBoard
  alias CheckersGame.ComputeMoves
  alias CheckersGame.MoveDisk
  alias CheckersGame.Chat

  # Returns a new board
  def new do
    InitBoard.init()
  end

  # Gets the possible moves and highlights tiles
  def get_moves(game, position) do
    ComputeMoves.get_moves(game, position)
  end

  def move_disk(game, position) do
    MoveDisk.move_disk(game, position)
  end

  def chat_added(game, message) do
    Chat.chat_added(game, message)
  end

end
