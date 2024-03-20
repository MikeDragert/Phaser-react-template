class highscores > ActiveRecord::[6.1]
    def change
        create_table :highscores do |t|
            t.integer :player_id
            t.integer :score
            t.datetime :achieved_at
        end
    end
end
