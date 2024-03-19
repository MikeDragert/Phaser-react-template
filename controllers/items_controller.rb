def items
    @items = Item.all
    erb :'/items/index'
    end
    