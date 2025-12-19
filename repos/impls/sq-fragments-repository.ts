import { BitchatPacket } from "@/types/global";
import { Base64String } from "@/utils/Base64String";
import * as SQLite from "expo-sqlite";
import FragmentsRepository from "../specs/fragments-repository";
import Repository from "../specs/repository";

class SQFragmentsRepository implements FragmentsRepository, Repository {
  private db: SQLite.SQLiteDatabase;

  constructor(database: SQLite.SQLiteDatabase) {
    this.db = database;
  }

  async create(
    fragmentId: Base64String,
    position: number,
    packet: BitchatPacket,
  ): Promise<BitchatPacket> {
    const statement = await this.db.prepareAsync(
      "INSERT INTO fragments (fragment_id, position, version, type, timestamp, payload, allowed_hops) VALUES ($fragment_id, $position, $version, $type, $timestamp, $payload, $allowed_hops)",
    );

    try {
      await statement.executeAsync({
        $fragment_id: fragmentId.getValue(),
        $position: position,
        $version: packet.version,
        $type: packet.type,
        $timestamp: packet.timestamp,
        $payload: packet.payload,
        $allowed_hops: packet.allowedHops,
      });

      return packet;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async getByFragmentId(fragmentId: Base64String): Promise<BitchatPacket[]> {
    const statement = await this.db.prepareAsync(
      "SELECT * FROM fragments WHERE fragment_id = $fragment_id ORDER BY position ASC",
    );

    try {
      const result = await statement.executeAsync<{
        version: number;
        type: number;
        timestamp: number;
        payload: Uint8Array;
        allowed_hops: number;
      }>({ $fragment_id: fragmentId.getValue() });

      const rows = await result.getAllAsync();

      return rows.map((row) => ({
        version: row.version,
        type: row.type,
        timestamp: row.timestamp,
        payload: row.payload,
        allowedHops: row.allowed_hops,
      }));
    } finally {
      await statement.finalizeAsync();
    }
  }

  async getFragmentCount(fragmentId: Base64String): Promise<number> {
    const statement = await this.db.prepareAsync(
      "SELECT COUNT(*) as count FROM fragments WHERE fragment_id = $fragment_id",
    );

    try {
      const result = await statement.executeAsync<{ count: number }>({
        $fragment_id: fragmentId.getValue(),
      });

      const row = await result.getFirstAsync();

      return row ? row.count : 0;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async deleteByFragmentId(fragmentId: Base64String): Promise<void> {
    const statement = await this.db.prepareAsync(
      "DELETE FROM fragments WHERE fragment_id = $fragment_id",
    );

    try {
      await statement.executeAsync({ $fragment_id: fragmentId.getValue() });
    } finally {
      await statement.finalizeAsync();
    }
  }

  async exists(fragmentId: Base64String, position: number): Promise<boolean> {
    const statement = await this.db.prepareAsync(
      "SELECT COUNT(*) as count FROM fragments WHERE fragment_id = $fragment_id AND position = $position",
    );

    try {
      const result = await statement.executeAsync<{ count: number }>({
        $fragment_id: fragmentId.getValue(),
        $position: position,
      });

      const row = await result.getFirstAsync();

      return row ? row.count > 0 : false;
    } finally {
      await statement.finalizeAsync();
    }
  }
}

export default SQFragmentsRepository;
