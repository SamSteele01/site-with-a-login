let userList = [
  { username: 'ssteele', password: 'rubberduck' },
  { username: 'chris', password: 'notaduck'},
  { username: 'kevin', password: 'goose'}
]

function getUser(username){
  return userList.find(function(user){
    return user.username == username;
  });
};

function getPassword(password){
  return userList.find(function(user){
    return user.password == password;
  });
};

module.exports = {
  getUser: getUser,
  getPass: getPassword,
  userList: userList
}
