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

  def handle_in("join_game", %{"player" => player}, socket) do
    name = socket.assigns[:name]
    game = BackupAgent.get(name)
    # Make sure only two players are playing
    if length(game[:players]) < 2 do
      # Add the first player
      if length(game[:players]) == 0 do
        # Modify the state through genserver
        GameServer.add_player(name, true, player, "black")
        game = GameServer.peek(name)
        socket = socket
        |> assign(:user, player)
        |> assign(:game, game)
        {:reply, {:ok, %{state: game}}, socket}
      # Add second player
      else
        # Modify the state through genserver
        GameServer.add_player(name, false, player, "white")
        game = GameServer.peek(name)
        socket = socket
        |> assign(:user, player)
        |> assign(:game, game)
        broadcast!(socket, "player_joined", %{state: game})
        {:reply, {:ok, %{state: game}}, socket}
      end
    else
      socket = socket
      |> assign(:user, player)
      |> assign(:game, game)

      {:reply, {:ok, %{state: game}}, socket}
    end
  end

  def handle_in("get_games", _payload, socket) do
    games = BackupAgent.all()
    broadcast!(socket, "get_games", %{games: games})
    {:reply, {:ok, %{games: games}}, socket}
  end

  def handle_in("get_moves", %{"position" => position}, socket) do
    # Get the name from the socket
    name = socket.assigns[:name]
    # Get current turn
    player = GameServer.peek(name)[:players]
    |> Enum.filter(fn player ->
      if player[:hasTurn] == true do
        player
      end
    end)
    |> Enum.at(0)

    if player.name == socket.assigns[:user] do
      game = GameServer.get_moves(name, position)
      socket = socket |> assign(:game, game)
      {:reply, {:ok, %{state: game}}, socket}
    else
      game = socket.assigns[:game]
      {:reply, {:ok, %{state: game}}, socket}
    end

  end

  def handle_in("move_disk", %{"position" => position}, socket) do
    # Get the name from the socket
    name = socket.assigns[:name]
    # Get current turn
    player = GameServer.peek(name)[:players]
    |> Enum.filter(fn player ->
      if player[:hasTurn] == true do
        player
      end
    end)
    |> Enum.at(0)

    if player.name == socket.assigns[:user] do
      GameServer.switch_turns(name)
      game = GameServer.move_disk(name, position)
      socket = socket |> assign(:game, game)
      broadcast!(socket, "update", %{state: game})
      {:reply, {:ok, %{state: game}}, socket}
    else
      game = socket.assigns[:game]
      {:reply, {:ok, %{state: game}}, socket}
    end

  end

  def handle_in("chat_added", %{"message" => message}, socket) do
    name = socket.assigns[:name]
    game = GameServer.chat_added(name, message)
    broadcast!(socket, "update", %{state: game})
    {:reply, {:ok, %{state: game}}, socket}
  end
end

