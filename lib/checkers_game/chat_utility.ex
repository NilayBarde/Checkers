defmodule CheckersGame.Chat do

    def chat_added(game, message) do
        newMessages = game.message ++ [message]
        %{
            board: game.board,
            whites: game.whites,
            blacks: game.blacks,
            doubleKill: game.doubleKill,
            message: newMessages
        }
    end

end