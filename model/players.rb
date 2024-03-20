class Player < ApplicationRecord
    has_many :player_items
    has_many :items, through: :player_items
    has_many :player_achievements
    has_many :achievements, through: :player_achievements
    has_many :highscores
    has_many :saves
  end
