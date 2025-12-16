import { BitchatPacket } from "@/types/global";
import * as SQLite from "expo-sqlite";
import IncomingPacketsRepository from "../specs/incoming-packets-repository";
import Repository from "../specs/repository";

class SQIncomingPacketsRepository
  implements IncomingPacketsRepository, Repository
{
  private db: SQLite.SQLiteDatabase;

  constructor(database: SQLite.SQLiteDatabase) {
    this.db = database;
  }

  async create(packet: BitchatPacket): Promise<BitchatPacket> {
    const statement = await this.db.prepareAsync(
      `INSERT INTO incoming_packets (version, type, sender_id, recipient_id, timestamp, payload, signature, allowed_hops, route) 
       VALUES ($version, $type, $senderId, $recipientId, $timestamp, $payload, $signature, $allowedHops, $route)`,
    );

    try {
      await statement.executeAsync({
        $version: packet.version,
        $type: packet.type,
        $senderId: packet.senderId,
        $recipientId: packet.recipientId,
        $timestamp: packet.timestamp,
        $payload: packet.payload,
        $signature: packet.signature,
        $allowedHops: packet.allowedHops,
        $route: packet.route,
      });

      return packet;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async getAll(): Promise<BitchatPacket[]> {
    const statement = await this.db.prepareAsync(
      "SELECT * FROM incoming_packets ORDER BY created_at ASC",
    );

    try {
      const result = await statement.executeAsync<{
        version: number;
        type: number;
        sender_id: string;
        recipient_id: string;
        timestamp: number;
        payload: Uint8Array;
        signature: string | null;
        allowed_hops: number;
        route: Uint8Array;
      }>();

      const rows = await result.getAllAsync();

      return rows.map((row) => this.mapRowToPacket(row));
    } finally {
      await statement.finalizeAsync();
    }
  }

  async delete(id: number): Promise<void> {
    const statement = await this.db.prepareAsync(
      "DELETE FROM incoming_packets WHERE id = $id",
    );

    try {
      await statement.executeAsync({ $id: id });
    } finally {
      await statement.finalizeAsync();
    }
  }

  async getEarliest(): Promise<BitchatPacket | null> {
    const statement = await this.db.prepareAsync(
      "SELECT * FROM incoming_packets ORDER BY created_at ASC LIMIT 1",
    );

    try {
      const result = await statement.executeAsync<{
        version: number;
        type: number;
        sender_id: string;
        recipient_id: string;
        timestamp: number;
        payload: Uint8Array;
        signature: string | null;
        allowed_hops: number;
        route: Uint8Array;
      }>();

      const row = await result.getFirstAsync();

      if (!row) {
        return null;
      }

      return this.mapRowToPacket(row);
    } finally {
      await statement.finalizeAsync();
    }
  }

  private mapRowToPacket(row: {
    version: number;
    type: number;
    sender_id: string;
    recipient_id: string;
    timestamp: number;
    payload: Uint8Array;
    signature: string | null;
    allowed_hops: number;
    route: Uint8Array;
  }): BitchatPacket {
    return {
      version: row.version,
      type: row.type,
      senderId: row.sender_id,
      recipientId: row.recipient_id,
      timestamp: row.timestamp,
      payload: row.payload,
      signature: row.signature,
      allowedHops: row.allowed_hops,
      route: row.route,
    };
  }
}

export default SQIncomingPacketsRepository;
