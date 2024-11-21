import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Modal, TouchableOpacity, Image } from 'react-native';
import { inventory as initialInventory } from './vegetablesData.js';
import {db} from "../../firebaseConfig.js";
import { 

  collection, 
  onSnapshot,
} from 'firebase/firestore';

interface InventoryItem {
  id: number;
  vegetable: string;
  quantity: number;
  image: string;
}

const InventoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [availableVegetables, setAvailableVegetables] = useState<InventoryItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVegetable, setSelectedVegetable] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const vegetableCollection = collection(db, 'vegetableItems');
    const unsubscribe = onSnapshot(vegetableCollection, (snapshot) => {
      const vegetables = snapshot.docs.map((doc) => ({
        id: doc.id,
        vegetable: doc.data().name,
        quantity: 0, // Default quantity
        image: doc.data().image,
      }));
      setAvailableVegetables(vegetables);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const modifyQuantity = (id: number, delta: number) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeVegetable = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const addVegetableToInventory = () => {
    if (selectedVegetable) {
      const existingItem = inventory.find((item) => item.id === selectedVegetable.id);
      if (existingItem) {
        setInventory(
          inventory.map((item) =>
            item.id === selectedVegetable.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        const vegetableToAdd = { ...selectedVegetable, quantity };
        setInventory([...inventory, vegetableToAdd]);
      }
      setIsModalVisible(false);
      setQuantity(1);
    }
  };

  const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.vegetable}</Text>
        <Text style={styles.cardText}>Quantity: {item.quantity} kg</Text>
        <View style={styles.cardActions}>
          <Button title="-" onPress={() => modifyQuantity(item.id, -1)} />
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Button title="+" onPress={() => modifyQuantity(item.id, 1)} />
        </View>
        <Button title="Remove" onPress={() => removeVegetable(item.id)} color="red" />
      </View>
    </View>
  );

  const renderVegetableOption = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity onPress={() => setSelectedVegetable(item)}>
      <View style={styles.vegetableOption}>
        <Image source={{ uri: item.image }} style={styles.vegetableImage} />
        <Text style={styles.text}>{item.vegetable}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Inventory</Text>
      <View style={styles.buttonContainer}>
        <Button title="Add Vegetable" onPress={() => setIsModalVisible(true)} />
      </View>
      <FlatList
        data={inventory}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
          setQuantity(1);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select a Vegetable and Quantity</Text>
            {!selectedVegetable && (
              <FlatList
                data={availableVegetables}
                renderItem={renderVegetableOption}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
            {selectedVegetable && (
              <View>
                <Text style={styles.selectedVegetableText}>Selected: {selectedVegetable.vegetable}</Text>
                <View style={styles.quantityContainer}>
                  <Button title="-" onPress={() => setQuantity(Math.max(1, quantity - 1))} />
                  <Text style={styles.quantityText}>{quantity} Rs/kg</Text>
                  <Button title="+" onPress={() => setQuantity(quantity + 1)} />
                </View>
                <View style={styles.modalButtonList}>
                  <Button title="Add to Inventory" onPress={addVegetableToInventory} />
                  <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardList: {
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardInfo: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  vegetableOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  vegetableImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    height: '75%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  selectedVegetableText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalButtonList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default InventoryScreen;
