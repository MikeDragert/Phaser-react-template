import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';


const items = {
    '1': {
        player_id: '1', 
        item_id: '1',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    },
    '2': {
        player_id: '1', 
        item_id: '2',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    },
    '3': {
        player_id: '1', 
        item_id: '3',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    },
    '4': {
        player_id: '1', 
        item_id: '4',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    },
    '5': {
        player_id: '1', 
        item_id: '5',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    } , 
    '6': {
        player_id: '1', 
        item_id: '6',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    },
    '7': {
        player_id: '1', 
        item_id: '7',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    },
    '8': {
        player_id: '1', 
        item_id: '8',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    },
    '9': {
        player_id: '1', 
        item_id: '9',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    },
    '10': {
        player_id: '1', 
        item_id: '10',
        save_id: '1',
        container_item_id: '1',
        location_x: '1',
        location_y: '1',
        map_id: 'tutorial'
    }};

    console.log(items);

const ItemContainer = () => { 
    const [itemsState, setItemsState] = useState(items);
    return (
        <div>
        <h2>Item Container</h2>
        <ul>
            {Object.entries(itemsState).map(([id, item]) => (
                <li key={id}>{/* Render each item here */}</li>
            ))}
        </ul>
    </div>
    );
  };


export default ItemContainer;