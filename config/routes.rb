Rails.application.routes.draw do
    resources :items [:show, :index]
    resources :players [:new, :create]
    resources :achievements [:show, :index]
    resources :highscores [:new, :show]
    resources :saves [:create, :show]
    resources :player_items [:show, :index]
  end

  