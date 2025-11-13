    import * as SQLite from "expo-sqlite";

    const DB_NAME = "bitchat.db"; 
    let db: SQLite.SQLiteDatabase | null = null;

    export async function getDB(): Promise<SQLite.SQLiteDatabase> {
      if (!db) {
        db = await SQLite.openDatabaseAsync(DB_NAME);
        // run migrations here if needed
        // await migrateDbIfNeeded(db); 
      }
      return db;
    }