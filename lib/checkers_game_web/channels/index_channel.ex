defmodule CheckersGameWeb.IndexChannel do
  use CheckersGameWeb, :channel

  alias CheckersGame.BackupAgent

  def join("index:index", _payload, socket) do
    games = BackupAgent.all()
    {:ok, %{games: games}, socket}
  end

  def handle_in("get_games", payload, socket) do
    {:reply, {:ok, %{games: payload[:games]}}, socket}
  end
end
