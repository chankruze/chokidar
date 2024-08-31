import bcrypt from "bcryptjs";
import type { ObjectId } from "mongodb";
import { client } from "~/lib/db.server";

const PASSWORDS_COLLECTION = "passwords";

export const getPassword = async (id: ObjectId) => {
  const _db = await client.db(process.env.NEWRUP_DB);
  return await _db.collection(PASSWORDS_COLLECTION).findOne({
    _id: id,
  });
};

export const getPasswordByUserId = async (userId: ObjectId) => {
  const _db = await client.db(process.env.NEWRUP_DB);
  return await _db.collection(PASSWORDS_COLLECTION).findOne({
    userId,
  });
};

export const createPassword = async (userId: ObjectId, password: string) => {
  const _db = await client.db(process.env.DB_NAME);
  // hash the password
  const hash = await bcrypt.hash(password, 12);
  try {
    // Insert the hashed password into the "passwords" collection
    await _db.collection(PASSWORDS_COLLECTION).insertOne({
      hash,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // ok
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Unable to create a password" };
  }
};

export const updatePassword = async (userId: ObjectId, password: string) => {
  const _db = await client.db(process.env.DB_NAME);
  try {
    // hash the password
    const hash = await bcrypt.hash(password, 12);
    // update the password
    await _db
      .collection(PASSWORDS_COLLECTION)
      .updateOne({ userId }, { $set: { hash } });
    // return ok
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Unable to update the password" };
  }
};
