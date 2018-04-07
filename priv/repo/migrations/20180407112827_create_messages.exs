defmodule Dankchat.Repo.Migrations.CreateMessages do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :body, :string
      add :user_id, references(:users)

      timestamps()
    end

  end
end
