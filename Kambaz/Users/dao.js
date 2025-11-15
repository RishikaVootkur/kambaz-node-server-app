import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    db.users.push(newUser);  // ✅ Updates db.users directly!
    return newUser;
  };
  
  const findAllUsers = () => db.users;  // ✅ Return from db, not local variable
  
  const findUserById = (userId) => db.users.find((user) => user._id === userId);
  
  const findUserByUsername = (username) => db.users.find((user) => user.username === username);
  
  const findUserByCredentials = (username, password) =>
    db.users.find((user) => user.username === username && user.password === password);
  
  const updateUser = (userId, userUpdates) => {
    const user = db.users.find((u) => u._id === userId);
    if (user) {
      Object.assign(user, userUpdates);  // ✅ Mutates object directly
    }
    return user;
  };
  
  const deleteUser = (userId) => {
    db.users = db.users.filter((u) => u._id !== userId);  // ✅ Updates db.users
  };
  
  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}