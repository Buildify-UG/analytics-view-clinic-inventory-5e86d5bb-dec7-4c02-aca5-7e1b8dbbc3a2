// IndexedDB for offline storage
const DB_NAME = "PharmacyDB";
const DB_VERSION = 1;

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  reorderLevel: number;
  expiryDate?: string;
  barcode?: string;
  createdAt: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt: number;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface Transaction {
  id: string;
  transactionId: string;
  customerId?: string;
  items: TransactionItem[];
  totalAmount: number;
  paymentMethod: string;
  status: "pending" | "completed" | "cancelled";
  synced: boolean;
  createdAt: number;
}

let db: IDBDatabase;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Products store
      if (!db.objectStoreNames.contains("products")) {
        const productStore = db.createObjectStore("products", { keyPath: "id" });
        productStore.createIndex("sku", "sku", { unique: true });
        productStore.createIndex("category", "category", { unique: false });
      }

      // Customers store
      if (!db.objectStoreNames.contains("customers")) {
        db.createObjectStore("customers", { keyPath: "id" });
      }

      // Transactions store
      if (!db.objectStoreNames.contains("transactions")) {
        const txStore = db.createObjectStore("transactions", { keyPath: "id" });
        txStore.createIndex("transactionId", "transactionId", { unique: true });
        txStore.createIndex("synced", "synced", { unique: false });
        txStore.createIndex("createdAt", "createdAt", { unique: false });
      }

      // Sync log
      if (!db.objectStoreNames.contains("syncLog")) {
        db.createObjectStore("syncLog", { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

// Product operations
export const addProduct = (product: Product): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["products"], "readwrite");
    const store = tx.objectStore("products");
    const request = store.add(product);
    request.onsuccess = () => resolve(request.result as string);
    request.onerror = () => reject(request.error);
  });
};

export const getProduct = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["products"], "readonly");
    const store = tx.objectStore("products");
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllProducts = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["products"], "readonly");
    const store = tx.objectStore("products");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateProduct = (product: Product): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["products"], "readwrite");
    const store = tx.objectStore("products");
    const request = store.put(product);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteProduct = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["products"], "readwrite");
    const store = tx.objectStore("products");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Customer operations
export const addCustomer = (customer: Customer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["customers"], "readwrite");
    const store = tx.objectStore("customers");
    const request = store.add(customer);
    request.onsuccess = () => resolve(request.result as string);
    request.onerror = () => reject(request.error);
  });
};

export const getAllCustomers = (): Promise<Customer[]> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["customers"], "readonly");
    const store = tx.objectStore("customers");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateCustomer = (customer: Customer): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["customers"], "readwrite");
    const store = tx.objectStore("customers");
    const request = store.put(customer);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Transaction operations
export const addTransaction = (transaction: Transaction): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["transactions"], "readwrite");
    const store = tx.objectStore("transactions");
    const request = store.add(transaction);
    request.onsuccess = () => resolve(request.result as string);
    request.onerror = () => reject(request.error);
  });
};

export const getAllTransactions = (): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["transactions"], "readonly");
    const store = tx.objectStore("transactions");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getUnsyncedTransactions = (): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["transactions"], "readonly");
    const store = tx.objectStore("transactions");
    const index = store.index("synced");
    const request = index.getAll(false);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const markTransactionSynced = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["transactions"], "readwrite");
    const store = tx.objectStore("transactions");
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const transaction = getRequest.result;
      transaction.synced = true;
      const updateRequest = store.put(transaction);
      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const getTransactionsByDateRange = (startDate: number, endDate: number): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["transactions"], "readonly");
    const store = tx.objectStore("transactions");
    const index = store.index("createdAt");
    const range = IDBKeyRange.bound(startDate, endDate);
    const request = index.getAll(range);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
