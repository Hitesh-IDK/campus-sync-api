import { hashPassword } from '../util/cryptography';
import { mongoClient } from './connection';

// Check if one adming already exists
export const checkAdminExists = async (): Promise<boolean> => {
  try {
    await mongoClient.connect();
    const admin = await mongoClient.db().collection('users').findOne({ accountType: 'admin' });

    return admin ? true : false;
  } catch (error) {
    console.error('Error checking for admin existence:', error);
    return false;
  }
};

export const createAdmin = async () => {
  if (await checkAdminExists()) {
    console.log('Admin already exists');
  } else {
    const defaultAdmin = {
      registrationId: '4VM21IS018',
      name: 'Hitesh',
      phone: 9740490947,
      email: '10hiteshparmar@gmail.com',
      accountType: 'admin',
      password: await hashPassword('admin'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await mongoClient.connect();
      await mongoClient.db().collection('users').insertOne(defaultAdmin);
      console.log('Default admin account created');
    } catch (error) {
      console.error('Error creating default admin account:', error);
    }
  }
};

createAdmin();
