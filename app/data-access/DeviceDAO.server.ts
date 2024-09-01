import { ObjectId } from "mongodb";
import { client } from "~/lib/db.server";

const DEVICES_COLLECTION = "devices";

export const getUserDevicesForListing = async (userId: string) => {
  const _db = await client.db(process.env.DB_NAME);
  return await _db
    .collection(DEVICES_COLLECTION)
    .find(
      { userId: new ObjectId(userId) },
      {
        projection: {
          name: true,
          createdAt: true,
          updatedAt: true,
        },
        sort: { updatedAt: "desc", createdAt: "desc" },
      }
    )
    .toArray();
};

export const getUserDeviceById = async (deviceId: string) => {
  const _db = await client.db(process.env.DB_NAME);
  return await _db.collection(DEVICES_COLLECTION).findOne({
    _id: new ObjectId(deviceId),
  });
};

export const countUserDevices = async (userId: string) => {
  const _db = await client.db(process.env.DB_NAME);
  return await _db
    .collection(DEVICES_COLLECTION)
    .countDocuments({ userId: new ObjectId(userId) });
};

type AddUserDeviceProps = {
  name: string;
  pin: string;
};

export const addUserDevice = async (
  userId: string,
  data: AddUserDeviceProps
) => {
  try {
    const _db = await client.db(process.env.DB_NAME);
    const _product = await _db.collection(DEVICES_COLLECTION).insertOne({
      ...data,
      userId: new ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      ok: true,
      deviceId: _product.insertedId.toString(),
    };
  } catch (error) {
    console.error(error);
    return { ok: false, error };
  }
};

export const deleteUserDevice = async (deviceId: string, userId: string) => {
  const _db = await client.db(process.env.DB_NAME);

  try {
    const deleteQuery = await _db.collection(DEVICES_COLLECTION).deleteOne({
      _id: new ObjectId(deviceId),
      userId: new ObjectId(userId),
    });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        message: `Unable to delete product.`,
      };
    }

    return {
      ok: true,
      message: `Product [id: ${deviceId.toString()}] deleted.`,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: `Unable to delete that product.`,
      error,
    };
  }
};
