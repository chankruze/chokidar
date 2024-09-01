import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { client } from "~/lib/db.server";
import { createPassword, getPasswordByUserId } from "./PasswordDAO.server";

const USERS_COLLECTION = "users";

export const getUser = async (email: string) => {
  const _db = await client.db(process.env.DB_NAME);
  // find user by email
  const _user = await _db.collection(USERS_COLLECTION).findOne({
    email,
  });
  // return user
  return { ok: true, data: _user };
};

export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
};

export const createUser = async (data: CreateUserParams) => {
  const _db = await client.db(process.env.DB_NAME);
  // create new user
  try {
    const _user = await _db.collection(USERS_COLLECTION).insertOne({
      email: data.email.trim(),
      name: data.name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // create password
    await createPassword(_user.insertedId, data.password);
    // return user
    return { ok: true, data: _user.insertedId, error: null };
  } catch (error) {
    console.error(error);
    return { ok: false, data: null, error: "Unable to add new user" };
  }
};

export const deleteUser = async (userId: string) => {
  const _db = await client.db(process.env.DB_NAME);

  try {
    const deleteQuery = await _db
      .collection(USERS_COLLECTION)
      .deleteOne({ _id: new ObjectId(userId) });

    if (deleteQuery.deletedCount === 0) {
      return {
        ok: false,
        data: null,
        error: `Unable to delete user`,
      };
    }
    return {
      ok: true,
      data: { message: `User [id: ${userId.toString()}] deleted.` },
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      data: null,
      error: `Unable to delete that user.`,
    };
  }
};

export const registerUser = async (formData: FormData) => {
  // validate form data
  const schema = z
    .object({
      name: z.string().min(1, "Name must not be empty"),
      email: z.string().min(1, "Email must not be empty.").email(),
      password: z.string().min(8, "Password must be 8 characters long."),
      confirmPassword: z.string().min(8, "Password must be 8 characters long."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const _validation = schema.safeParse(Object.fromEntries(formData));
  // send error data in response
  if (!_validation.success) {
    const errors = _validation.error.flatten();
    // return validation errors
    return {
      ok: false,
      data: null,
      validationErrors: errors,
    };
  }

  const { name, email, password } = _validation.data;

  // check if the user exists in the db
  const { ok, data } = await getUser(email);

  if (ok && data) {
    return { ok: false, data: null, error: `User ${email} already exists` };
  }

  const user = await createUser({
    name,
    email,
    password,
  });

  // if user creation fails
  if (user.ok && user.data) {
    return {
      ok: true,
      data: user.data.toString(),
      error: null,
    };
  }

  return { ok: false, data: null, error: user.error };
};

export const loginUser = async (formData: FormData) => {
  const schema = z.object({
    email: z.string().min(1, "Email must not be empty.").email(),
    password: z.string().min(8, "Password must be 8 characters long."),
  });

  const _validation = schema.safeParse(Object.fromEntries(formData));
  // send error data in response
  if (!_validation.success) {
    const errors = _validation.error.flatten();
    // return validation errors
    return {
      ok: false,
      data: null,
      validationErrors: errors,
    };
  }

  const { email, password } = _validation.data;

  // check if the user exists in the db
  const { ok, data } = await getUser(email);
  // check if the user exists
  if (ok && data) {
    // fetch password form db
    const _password = await getPasswordByUserId(data._id);

    if (_password) {
      const _isValid = await bcrypt.compare(password, _password.hash);

      // if password is invalid
      if (!_isValid) {
        return {
          ok: false,
          data: null,
          error: "Wrong password. Please try again",
        };
      }

      return { ok: true, data: data._id.toString(), error: null };
    }

    return { ok: false, data: null, error: "This user don't have a password" };
  }

  return { ok: false, data: null, error: `User ${email} does not exist` };
};
