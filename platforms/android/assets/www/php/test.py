#!/usr/bin/env python
from porc import Client
import cgi

form = cgi.FieldStorage() # instantiate only once!

name = form.getfirst('name', 'empty')

# getlist() returns a list containing the
# values of the fields with the given name
# colors = form.getlist('color')

# Avoid script injection escaping the user input
name = cgi.escape(name)

# create a client using the default AWS US East host: https://api.orchestrate.io
client = Client('0a3581f5-263b-4d01-83fd-73b1b26245f9')

# make sure our API key works
client.ping().raise_for_status()

response = client.post('users', {
  "name": "Danaerys Targarean",
  "titles": [
    "Stormborn",
    "Khaleesi",
    "Mother of Dragons"
  ]
})
# make sure the request succeeded
response.raise_for_status()
# prints the item's generated key
print response.key
# prints the item version's ref
print response.ref

# get and update an item
# item = client.get(COLLECTION, KEY)
# item['was_modified'] = True
# client.put(item.collection, item.key, item.json, item.ref).raise_for_status()

# # asynchronously get two items
# with client.async() as c:
#     futures = [
#         c.get(COLLECTION, KEY_1),
#         c.get(COLLECTION, KEY_2)
#     ]
#     responses = [future.result() for future in futures]
#     [response.raise_for_status() for response in responses]

# # iterate through search results
# pages = client.search(COLLECTION, QUERY)
# for page in pages:
#     # prints 200
#     print page.status_code
#     # prints number of items returned by page
#     print page['count']

# # get every item in a collection
# items = client.list(COLLECTION).all()
# # prints number of items in collection
# print len(items)