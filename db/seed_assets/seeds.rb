
items = [
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Larry", type: 1, has_obtained: false },
  { name: "Jump Function", type: 2, has_obtained: false },
  { name: "Size Function", type: 2, has_obtained: false },
  { name: "Loop Function", type: 2, has_obtained: false },
  { name: "Something Special Function", type: 2, has_obtained: false },
  { name: "1", type: 3, has_obtained: false },
  { name: "2", type: 3, has_obtained: false },
  { name: "3", type: 3, has_obtained: false },
  { name: "4", type: 3, has_obtained: false },
  { name: "5", type: 3, has_obtained: false },
  { name: "6", type: 3, has_obtained: false },
  { name: "7", type: 3, has_obtained: false },
  { name: "8", type: 3, has_obtained: false },
  { name: "9", type: 3, has_obtained: false },
  { name: "+", type: 4, has_obtained: false },
  { name: "*", type: 4, has_obtained: false },
  { name: "-", type: 4, has_obtained: false },
  { name: "/", type: 4, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
  { name: "coin", type: 5, has_obtained: false },
]

items.each do |item_attributes|
  Item.create!(item_attributes)
end

puts "Seed data for items has been successfully created."

players =[ { username: abcd, password_digest: 1234, email:abcd@gmail.com, save_point: null}]

players.each do |player_attributes|
  Player.create!(player_attributes)
end

puts "Seed data for players has been successfully created."