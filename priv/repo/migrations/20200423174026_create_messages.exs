defmodule Dankchat.Repo.Migrations.CreateMessages do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :body, :string
      add :user_id, :string

      timestamps()
    end

  end
end
