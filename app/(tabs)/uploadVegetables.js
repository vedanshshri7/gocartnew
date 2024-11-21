import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { inventory } from './vegetablesData';

// Vendor data structure
const vendorData = {
  id: "654",
  name: "Ramu",
  ContactNo: "1122334455",
  latitude: 22.8,
  longitude: 75.95,
  vegetables: inventory.map((veg) => ({
    id: veg.id,
    name: veg.vegetable,
    image: veg.image,
    price: "0", // Default price, update if needed
    unit: "kg", // Default unit
  })),
};

// Function to upload vendor and vegetable data to Firebase
const uploadVendorDataToFirebase = async () => {
  try {
    // Reference the Firestore collection
    const vendorCollection = collection(db, 'test');

    // Add vendor data to Firestore
    await addDoc(vendorCollection, vendorData);
    console.log(`Vendor data uploaded successfully: ${vendorData.name}`);
  } catch (error) {
    console.error('Error uploading vendor data:', error);
  }
};

// Call the function
uploadVendorDataToFirebase();
