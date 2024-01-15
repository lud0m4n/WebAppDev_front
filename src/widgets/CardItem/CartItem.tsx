import React from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

interface CartItemProps {
  item: {
    id_period: number;
    name: string;
    description: string;
    age: string;
    status: string;
    photo: string;
};
  onRemove: (removedItem: {
    id_period: number;
    name: string;
    description: string;
    age: string;
    status: string;
    photo: string;
} ) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const handleRemove = () => {
    onRemove(item);
  };

  return (
    <tr>
      <td>{item.name}</td>
      <td>
        <Button variant="danger" onClick={handleRemove}>
          Удалить
        </Button>
      </td>
    </tr>
  );
};

export default CartItem;