class achievement < ActiveRecord::Base
    has_many :player_achievements
    has_many :players, through: :player_achievements
  end