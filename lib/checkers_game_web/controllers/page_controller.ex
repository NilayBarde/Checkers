defmodule CheckersGameWeb.PageController do
  use CheckersGameWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def game(conn, %{"name" => name}) do
    render(conn, "game.html", name: name)
  end

end
