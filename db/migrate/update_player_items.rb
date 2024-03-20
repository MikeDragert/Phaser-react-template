class PlayerItems > ActiveRecord::Migration[6.1]
    def change
        create_table :player_items do |t|
            t.integer :player_id
            t.integer :item_id
            t.string :save_id
            t.integer :container_item_id
        end
    end
end

