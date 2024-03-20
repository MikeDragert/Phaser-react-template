import react from 'react';
import '../styles/Item.css';

const DisplayItem = ({ items }) => {
    return (
        <div>
            {Object.values(items).map(item => (
                <div key={item.type} className='grid-item'>
                    {item.has_obtained && <p>{item.name}</p>}
                </div>
            ))}
        </div>
    );
};

        export default DisplayItem;