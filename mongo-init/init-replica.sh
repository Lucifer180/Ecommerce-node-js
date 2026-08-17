#!/bin/bash
# Wait for MongoDB to be ready, then initialize the replica set
mongosh --eval "
try {
  rs.status();
  print('Replica set already initialized');
} catch(e) {
  rs.initiate({
    _id: 'rs0',
    members: [{ _id: 0, host: 'mongo:27017' }]
  });
  print('Replica set initialized');
}
"
