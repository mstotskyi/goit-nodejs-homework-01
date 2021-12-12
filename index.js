const chalk = require('chalk');
const { Command } = require('commander');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require('./contacts.js');
const program = new Command();
program
  .requiredOption('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case 'list':
      const contacts = await listContacts();
      console.table(contacts);
      break;

    case 'get':
      const contactById = await getContactById(id);
      if (contactById) {
        console.log(chalk.green(`Сontact with id:${id} was found`));
        console.log(contactById);
        return;
      }
      console.log(chalk.red(`Сontact with id: '${id}' not found`));
      break;

    case 'add':
      const newContactToAdd = await addContact(name, email, phone);
      console.log(newContactToAdd);
      if (newContactToAdd === void 0) {
        console.log(chalk.red('Invalid input'));
        return;
      }
      console.log(
        chalk.green(`Сontact '${newContactToAdd.name}' successfully added`),
      );
      console.log(newContactToAdd);
      break;

    case 'remove':
      const updContacts = await removeContact(id);
      if (updContacts) {
        console.log(chalk.green(`Сontact with id: '${id}' was removed`));
        console.table(updContacts);
        return;
      }
      console.log(chalk.red(`Сontact with id: '${id}' not found`));
      break;

    default:
      console.warn(chalk.red('Unknown action type!'));
  }
};

invokeAction(argv).then(() => console.log('Operation success'));
