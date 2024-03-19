class player_achievement < ActiveRecord::Base
    belongs_to :player
    belongs_to :achievement
  end