defmodule CheckersGame.Chat do

    def chat_added(game, message, user) do
        newMessages = game.message ++ [%{user: user, message: message}]
        Map.merge(game, %{message: newMessages})
    end

end
