ActiveRecord::Schema.define(version: 2024_03_17_000001) do
    enable_extension "plpgsql"

create_table "players", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.string "email"
    t.string "save_point"
end

create_table "player_items", force: :cascade do |t|
    t.integer "player_id"
    t.integer "item_id"
    t.string "saved_items"
end

create_table "items", force: :cascade do |t|
    t.string "name"
    t.integer "type"
end

create_table "player_achievements", force: :cascade do |t|
    t.integer "player_id"
    t.integer "achievement_id"
    t.datetime "achieved_at"
end

create_table "achievements", force: :cascade do |t|
    t.string "title"
    t.integer "points"
end

create_table "highscores", force: :cascade do |t|
    t.integer "player_id"
    t.integer "score"
    t.datetime "achieved_at"
end

add_foreign_key "player_items", "items"
add_foreign_key "player_items", "players"
add_foreign_key "player_achievements", "achievements"
add_foreign_key "player_achievements", "players"
add_foreign_key "highscores", "players"
end
