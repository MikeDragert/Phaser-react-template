class item < ActiveRecord::Base
    has_many :player_items
    has_many :players, through: :player_items
  end