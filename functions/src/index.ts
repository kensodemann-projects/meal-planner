import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { convertFdcFoodItem, FoodItem } from '../../common';

const API_URL = 'https://api.nal.usda.gov/fdc/v1';

initializeApp();
setGlobalOptions({ maxInstances: 5 });

export const expandFoodItem = onDocumentCreated(
  { document: '/foods/{documentId}', secrets: ['USDA_FDC_API_KEY'] },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const { fdcId, name } = snapshot.data();
    if (!fdcId || !!name) return;

    logger.info(`Attempting to expand ${fdcId}`);

    let rawFoodItem: any;
    let foodItem: Partial<FoodItem> = { name: 'There was an error expanding this item' };
    try {
      const apiResponse = await fetch(
        `${API_URL}/food/${fdcId}?api_key=${process.env.USDA_FDC_API_KEY}&nutrients=203&nutrients=204&nutrients=205&nutrients=208&nutrients=269.3&nutrients=307`,
      );
      if (!apiResponse.ok) {
        throw new Error(`USDA FDC API returned status ${apiResponse.status}`);
      }
      rawFoodItem = await apiResponse.json();
      foodItem = convertFdcFoodItem(rawFoodItem);
    } catch (err: unknown) {
      logger.error(`error expanding fdcId: ${fdcId}`, rawFoodItem, err);
    }

    const documentId = event.params.documentId;
    const db = getFirestore();
    const docRef = db.collection('foods').doc(documentId);

    return docRef.set(foodItem, { merge: true });
  },
);
