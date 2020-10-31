import AsyncStorage from '@react-native-community/async-storage';

import handleError from 'sync-storage/src/helpers/handleError';

type KeyType = string;

class SyncStorage {
  data: Map<string,any> = new Map();

  loading: boolean = true;

  async init(cleardata?: boolean): Promise<Array<any>> {
    if (cleardata) {
      await AsyncStorage.clear()
    }
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);
    data.forEach(this.saveItem.bind(this));
    return [...this.data];
  }

  get(key: KeyType): any {
    return this.data.get(key);
  }

  set(key: KeyType, value: any): Promise<any> {
    if (!key) return handleError('set', 'a key');

    this.data.set(key, value);
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: KeyType): Promise<any> {
    if (!key) return handleError('remove', 'a key');

    this.data.delete(key);
    return AsyncStorage.removeItem(key);
  }

  saveItem(item: Array<KeyType>) {
    let value;

    try {
      value = JSON.parse(item[1]);
    } catch (e) {
      [, value] = item;
    }

    this.data.set(item[0], value);
    this.loading = false;
  }

  getAllKeys(): Array<any> {
    return Array.from(this.data.keys());
  }
}

const syncStorage = new SyncStorage();

export default syncStorage;
