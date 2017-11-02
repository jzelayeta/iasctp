# iasctp
IASC TP UTN 2C 2017

# Adding Values

curl -X POST http://localhost:3000/store/ -H 'content-type: application/json' -d '{"key": "1","value": "Julian"}'

# Getting values

curl -X GET http://localhost:3000/store/1 -d
