defmodule CheckersGameWeb.GameChannel do
  use CheckersGameWeb, :channel

  alias CheckersGame.Game
  alias CheckersGame.BackupAgent

  def join("game:" <> name, _payload, socket) do
    game = BackupAgent.get(name) || Game.new()
    BackupAgent.put(name, game)
    socket = socket
    |> assign(:game, game)
    |> assign(:name, name)
    {:ok, %{"join" => name, "state" => game}, socket}
  end

  def handle_in("get_moves", %{"position" => position}, socket) do
    game = Game.get_moves(socket.assigns[:game], position)
    socket = assign(socket, :game, game)
    BackupAgent.put(socket.assigns[:name], game)
    {:reply, {:ok, %{state: game}}, socket}
  end

  def handle_in("move_disk", %{"position" => position}, socket) do
    game = Game.move_disk(socket.assigns[:game], position)
    socket = assign(socket, :game, game)
    BackupAgent.put(socket.assigns[:name], game)
    {:reply, {:ok, %{state: game, socketGame: socket.assigns[:game]}}, socket}
  end
end
