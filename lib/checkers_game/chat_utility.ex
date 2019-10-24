defmodule CheckersGame.Chat do

    def chat_added(game, message) do
        newMessages = game.message ++ [message]
        Map.merge(game, %{message: newMessages})
    end

end
