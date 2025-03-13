import { type Collection, type Db, MongoClient } from "mongodb";
import { parse, string } from "valibot";

class Database {
  private static instance: Database;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private _radarCalculations: Collection | null = null;

  private uri: string = parse(
    string(),
    process.env.NODE_ENV === "test" ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI,
    {
      message: "MongoDB URI not defined in env",
    },
  );
  private dbName: string = parse(
    string(),
    process.env.NODE_ENV === "test" ? process.env.DB_NAME_TEST : process.env.DB_NAME,
    {
      message: "DB name not defined in env",
    },
  );

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (!this.client) {
        this.client = new MongoClient(this.uri);

        this.db = this.client.db(this.dbName);
        console.log(`Using database: ${this.dbName}`);

        // Initialise collections
        this._radarCalculations = this.db.collection("radar_calculations");

        // Handle application termination
        process.on("SIGINT", async () => {
          await this.close();
          console.log("MongoDB connection closed due to application termination");
          process.exit(0);
        });
      }
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this._radarCalculations = null;
      console.log("MongoDB connection closed");
    }
  }

  // Collection getters
  get radarCalculations(): Collection {
    if (!this._radarCalculations) {
      throw new Error("Database not initialized. Call connect() first.");
    }
    return this._radarCalculations;
  }
}

export default Database.getInstance();
