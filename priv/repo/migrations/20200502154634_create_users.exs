defmodule Dankchat.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :username, :string, null: false
      add :encrypted_password, :binary, null: false

      timestamps()
    end

    alter table(:messages) do
      remove :user_id, :string
      add :user_id, references(:users), null: false, index: true
    end

    create unique_index(:users, :username)
  end
end
