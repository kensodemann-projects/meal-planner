import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { convertFdcFoodItem } from '../../common';

const API_URL = 'https://api.nal.usda.gov/fdc/v1';

initializeApp();
setGlobalOptions({ maxInstances: 5 });

const performFoodItemExpansion = async (fdcId: number, documentId: string) => {
  const apiResponse = await fetch(
    `${API_URL}/food/${fdcId}?api_key=${process.env.USDA_FDC_API_KEY}&nutrients=203&nutrients=204&nutrients=205&nutrients=208&nutrients=269.3&nutrients=307`,
  );
  if (!apiResponse.ok) {
    throw new Error(`USDA FDC API returned status ${apiResponse.status}`);
  }
  const rawFoodItem = await apiResponse.json();
  const foodItem = convertFdcFoodItem(rawFoodItem);

  const db = getFirestore();
  const docRef = db.collection('foods').doc(documentId);
  await docRef.set(foodItem, { merge: true });
};

const removeFoodItem = async (documentId: string) => {
  const db = getFirestore();
  const docRef = db.collection('foods').doc(documentId);
  await docRef.delete();
};

export const expandFoodItem = onDocumentCreated(
  { document: '/foods/{documentId}', secrets: ['USDA_FDC_API_KEY'] },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const { fdcId, name } = snapshot.data();
    if (!fdcId || !!name) return;

    logger.info(`Attempting to expand ${fdcId}`);

    try {
      await performFoodItemExpansion(fdcId, event.params.documentId);
    } catch (err: unknown) {
      logger.error(`error expanding fdcId: ${fdcId}`, err);
      await removeFoodItem(event.params.documentId);
    }
  },
);
