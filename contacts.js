const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const readContactsFile = async () => {
  const contacts = await fs.readFile(
    path.join(__dirname, 'db', 'contacts.json'),
    'utf8',
  );
  const result = JSON.parse(contacts);
  return result;
};

const listContacts = async () => {
  return await readContactsFile();
};

const getContactById = async contactId => {
  const contacts = await readContactsFile();
  const [result] = contacts.filter(contact => contact.id === contactId);
  return result;
};

const removeContact = async contactId => {
  const contacts = await readContactsFile();
  const [result] = contacts.filter(contact => contact.id === contactId);
  if (!result) {
    return;
  }
  const updContacts = contacts.filter(contact => contact.id !== contactId);
  await fs.writeFile(
    path.join(__dirname, 'db', 'contacts.json'),
    JSON.stringify(updContacts, null, 2),
  );

  return updContacts;
};

const addContact = async (name, email, phone) => {
  const contacts = await readContactsFile();
  const newContact = { name, email, phone, id: crypto.randomUUID() };
  contacts.push(newContact);
  await fs.writeFile(
    path.join(__dirname, 'db', 'contacts.json'),
    JSON.stringify(contacts, null, 2),
  );
  return newContact;
};

module.exports = { listContacts, getContactById, removeContact, addContact };
