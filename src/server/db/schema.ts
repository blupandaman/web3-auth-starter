import { index, pgTableCreator, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `web3_auth_starter_${name}`,
);

export const users = createTable(
  "users",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    address: varchar("address", { length: 42 }),
  },
  (table) => ({
    addressIndex: index("usersAddress_idx").on(table.address),
  }),
);
