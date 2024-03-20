class Items > ActiveRecord::Migration[6.1]
    def change
        create_table :items do |t|
            t.string :name
            t.integer :type
            t.boolean :has_obtained
        end
    end
end