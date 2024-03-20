class Achievement < ApplicationRecord
    has_many :player_achievements
    has_many :players, through: :player_achievements
  end