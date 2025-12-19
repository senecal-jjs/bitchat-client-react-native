import { Message } from "@/types/global";
import * as SQLite from "expo-sqlite";
import OutgoingMessagesRepository from "../specs/outgoing-messages-repository";
import Repository from "../specs/repository";

class SQOutgoingMessagesRepository
  implements OutgoingMessagesRepository, Repository
{
  private db: SQLite.SQLiteDatabase;

  constructor(database: SQLite.SQLiteDatabase) {
    this.db = database;
  }

  async create(message: Message): Promise<Message> {
    const statement = await this.db.prepareAsync(
      "INSERT INTO outgoing_messages (id, sender, contents, timestamp, group_id) VALUES ($id, $sender, $contents, $timestamp, $groupId)",
    );

    try {
      await statement.executeAsync({
        $id: message.id,
        $sender: message.sender,
        $contents: message.contents,
        $timestamp: message.timestamp,
        $groupId: message.groupId,
      });

      return message;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async delete(messageId: string): Promise<Message | null> {
    // First, get the message before deleting
    const getStatement = await this.db.prepareAsync(
      "SELECT * FROM outgoing_messages WHERE id = $id LIMIT 1",
    );

    try {
      const result = await getStatement.executeAsync<{
        id: string;
        sender: string;
        contents: string;
        timestamp: number;
        group_id: string;
      }>({ $id: messageId });

      const row = await result.getFirstAsync();

      if (!row) {
        return null;
      }

      const message = this.mapRowToMessage(row);

      // Now delete the message
      const deleteStatement = await this.db.prepareAsync(
        "DELETE FROM outgoing_messages WHERE id = $id",
      );

      try {
        await deleteStatement.executeAsync({ $id: messageId });
      } finally {
        await deleteStatement.finalizeAsync();
      }

      return message;
    } finally {
      await getStatement.finalizeAsync();
    }
  }

  async getAll(limit?: number): Promise<Message[]> {
    const query = limit
      ? "SELECT * FROM outgoing_messages ORDER BY timestamp ASC LIMIT $limit"
      : "SELECT * FROM outgoing_messages ORDER BY timestamp ASC";

    const statement = await this.db.prepareAsync(query);

    try {
      const result = limit
        ? await statement.executeAsync<{
            id: string;
            sender: string;
            contents: string;
            timestamp: number;
            group_id: string;
          }>({ $limit: limit })
        : await statement.executeAsync<{
            id: string;
            sender: string;
            contents: string;
            timestamp: number;
            group_id: string;
          }>();

      const rows = await result.getAllAsync();

      return rows.map((row) => this.mapRowToMessage(row));
    } finally {
      await statement.finalizeAsync();
    }
  }

  async exists(messageId: string): Promise<boolean> {
    const statement = await this.db.prepareAsync(
      "SELECT COUNT(*) as count FROM outgoing_messages WHERE id = $id",
    );

    try {
      const result = await statement.executeAsync<{ count: number }>({
        $id: messageId,
      });

      const row = await result.getFirstAsync();

      return row ? row.count > 0 : false;
    } finally {
      await statement.finalizeAsync();
    }
  }

  /**
   * Convert database row to Message object
   */
  private mapRowToMessage(row: {
    id: string;
    sender: string;
    contents: string;
    timestamp: number;
    group_id: string;
  }): Message {
    return {
      id: row.id,
      groupId: row.group_id,
      sender: row.sender,
      contents: row.contents,
      timestamp: row.timestamp,
    };
  }
}

export default SQOutgoingMessagesRepository;
