import { db } from '../firebase.config';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    collection,
    writeBatch
} from 'firebase/firestore';
import { GroupData, Employee } from '../types';
import { generateId, getMostRecentPastFriday, countFridaysSince } from './helpers';

export const COLLECTION_GROUPS = 'groups';

export class FirebaseService {
    /**
     * Creates a new group or updates an existing one if it doesn't exist
     */
    static async createGroup(key: string, name: string): Promise<void> {
        const groupRef = doc(db, COLLECTION_GROUPS, key);
        const snapshot = await getDoc(groupRef);

        if (!snapshot.exists()) {
            await setDoc(groupRef, {
                key,
                name,
                employees: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
    }

    /**
     * Subscribes to group data updates
     */
    static subscribeToGroup(key: string, onUpdate: (data: GroupData | null) => void) {
        const groupRef = doc(db, COLLECTION_GROUPS, key);

        return onSnapshot(groupRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as GroupData;
                // Sort employees by order if present, or by index
                if (data.employees) {
                    data.employees.sort((a, b) => (a.order || 0) - (b.order || 0));
                }
                onUpdate(data);
            } else {
                onUpdate(null);
            }
        }, (error) => {
            console.error("Firebase subscription error:", error);
            onUpdate(null);
        });
    }

    /**
     * Updates the employee list (rotation)
     */
    static async updateEmployees(key: string, employees: Employee[]): Promise<void> {
        const groupRef = doc(db, COLLECTION_GROUPS, key);

        // Assign order to employees based on their position in the array
        const orderedEmployees = employees.map((emp, index) => ({
            ...emp,
            order: index
        }));

        await updateDoc(groupRef, {
            employees: orderedEmployees,
            updatedAt: serverTimestamp()
        });
    }

    /**
     * Migrates local storage data to Firebase
     */
    static async migrateFromLocalStorage(key: string, localData: GroupData): Promise<void> {
        const groupRef = doc(db, COLLECTION_GROUPS, key);
        const snapshot = await getDoc(groupRef);

        if (!snapshot.exists()) {
            // Create new group with local data
            const employeesWithOrder = localData.employees.map((emp, idx) => ({
                ...emp,
                order: idx
            }));

            await setDoc(groupRef, {
                key: localData.key,
                name: localData.name,
                employees: employeesWithOrder,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
    }

    /**
     * Initialises the rotation anchor for groups that don't yet have one.
     * Sets lastRotatedAt to the most recent past Friday so rotation starts
     * kicking in AFTER the next Friday passes (no retroactive rotation).
     */
    static async initializeRotation(key: string): Promise<void> {
        const groupRef = doc(db, COLLECTION_GROUPS, key);
        await updateDoc(groupRef, {
            lastRotatedAt: getMostRecentPastFriday(),
        });
    }

    /**
     * Checks if one or more Fridays have passed since the last rotation and,
     * if so, rotates the employee array and persists the new order.
     * Returns true if a rotation was performed.
     */
    static async checkAndRotate(key: string, data: GroupData): Promise<boolean> {
        if (!data.lastRotatedAt || data.employees.length < 2) return false;

        const lastRotated: Date = data.lastRotatedAt.toDate();

        const rotationsNeeded = countFridaysSince(lastRotated);
        if (rotationsNeeded === 0) return false;

        const n = rotationsNeeded % data.employees.length;
        const rotated = [
            ...data.employees.slice(n),
            ...data.employees.slice(0, n),
        ];

        const groupRef = doc(db, COLLECTION_GROUPS, key);
        await updateDoc(groupRef, {
            employees: rotated,
            lastRotatedAt: getMostRecentPastFriday(),
            updatedAt: serverTimestamp(),
        });

        return true;
    }
}
