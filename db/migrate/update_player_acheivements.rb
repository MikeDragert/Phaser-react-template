class PlayerAchievements > ActiveRecord::Migration[6.1]
    def change
        create_table :player_achievements do |t|
            t.integer :player_id
            t.integer :achievement_id
            t.datetime :achieved_at
        end
    end
end
