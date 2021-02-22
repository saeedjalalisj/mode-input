const user = {
  username: 's1',
  password: '1234',
  email: 'test@gmail.com',
  name: 'a',
  family: 'b',
};

const randomUsername = `testUser${Math.random()}`;

const randomUser = () => ({
  username: randomUsername,
  password: '1234',
  email: `${randomUsername}@gmail.com`,
  name: 'a',
  family: 'b',
});

export {
  user,
  randomUser
}