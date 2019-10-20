defmodule CheckersGame.Game do

  alias CheckersGame.InitBoard

  # Returns a new board
  def new do
    InitBoard.init()
  end


end
