import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food, { IFood } from '../../components/Food';
import ModalAddFood, { INewFood } from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

const Dashboard = () => {
  const [foods, setFoods] = useState<IFood[]>([])
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const initialData = async () => {
    const response = await api.get('/foods');

    setFoods(response.data);
  }

  useEffect(() => {
    initialData()
  }, [])

  const handleAddFood = async (food: INewFood): Promise<void> => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(state => [...state, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: IFood): Promise<void> => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number): Promise<void> => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(state => !state);
  }

  const toggleEditModal = () => {
    setEditModalOpen(state => !state);
  }

  const handleEditFood = (food: IFood) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
