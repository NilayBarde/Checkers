defmodule CheckersGameWeb.GameChannel do
  use CheckersGameWeb, :channel

  alias CheckersGame.Game
  alias CheckersGame.BackupAgent
  alias CheckersGame.GameServer

  def join("game:" <> name, _payload, socket) do
    # Start a process for the connection
    GameServer.start(name)

    # Get the game from the backup agent or a new game.
    game = BackupAgent.get(name) || Game.new()

    # Store the game state in backup agent
    BackupAgent.put(name, game)

    # Assign the current game name to the socket
    socket = socket
    |> assign(:name, name)

    # Respond to client with a new game state
    {:ok, %{"join" => name, "state" => game}, socket}
  end

  def handle_in("get_moves", %{"position" => position}, socket) do
    # Get the name from the socket
    name = socket.assigns[:name]
    game = GameServer.get_moves(name, position)
    {:reply, {:ok, %{state: game}}, socket}
  end

  def handle_in("move_disk", %{"position" => position}, socket) do
    # Get the name from the socket
    name = socket.assigns[:name]
    game = GameServer.move_disk(name, position)
    {:reply, {:ok, %{state: game}}, socket}
  end

  def handle_in("chat_added", %{"message" => message}, socket) do
    game = Game.chat_added(socket.assigns[:game], message)
    socket = assign(socket, :game, game)
    BackupAgent.put(socket.assigns[:name], game)
    {:reply, {:ok, %{state: game, socketGame: socket.assigns[:game]}}, socket}
  end
end
