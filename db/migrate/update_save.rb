class Save > ActiveRecord::[6.1]
    def change
        create_table :saves do |t|
            t.integer :player_id
            t.integer :save_point
            t.boolean :current_save   
            t.datetime :created_at
        end
    end
end
