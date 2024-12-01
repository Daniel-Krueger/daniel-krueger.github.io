---
title: "BC OData transactional $batch requests limitation"
categories:
  - CC LS
  - Business Central
tags:
  - Business Central
  - REST
excerpt:
    "If this would only be true in all cases: Transactional $batch requests are useful in scenarios where a single business operation spans multiple requests, because they prevent adverse effects if parts of the operation fail."
---

# Overview  
I recently had the requirement to create multiple records in BC so far so easy. After creating a simple request to create on record it was only a little search until I stumbled about [Using OData transactional $batch requests](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/webservices/use-odata-batch). 

> Transactional $batch requests are useful in scenarios where a single business operation spans multiple requests, **because they prevent adverse effects if parts of the operation fail**. Also, they can improve performance by reducing the number of requests the client needs to do when errors occur.

This was exactly the improvement I was looking for. Little did I know what kind of pitfalls there are, at least in 25.*

# When they work fine
As long as the error is caused by the `business logic layer` everything is fine. 
You get an error in the response, and everything is rolled back as expected.

What do I mean with `business logic layer`:
- Errors caused due to field properties, for example the value should be greater 0
- AL Code


# When they don't work
Since I was new to the world of `$batch` processing in BC I ran into two limitations with my first two test cases.
1. Assigning a string to an integer property
2. Creating two records with the same primary key

Both tests failed utterly and even in different ways.

## Invalid JSON
I thought this would be the easiest way to test the transactional batch processing. 
1. One request with a valid JSON
2. Second request with an invalid JSON, assign a string to an integer property.

Expectation:
1. Processing is aborted, with the faulty request
2. I get an error for the failed request 
3. Everything is rolled back

Actual result:
1. ✅ Processing is aborted, with the faulty request 
2. ✅ I get an error for the failed request 
3. ❌ Everything is rolled back 

Instead of rolling back everything, the first request was processed and committed to the database. 

![Executing a $batch transaction with a faulty second request.](/assets/images/posts/2024-12-01-BC-OData-transactional-batch-requests-limitations/2024-12-01-21-36-06.png)

## Duplicate key
This was the second case I tested, after the first one failed.
1. One request 
2. Second request with the same primary key values

Expectation:
1. Processing is aborted, with the faulty request
2. I get an error for the failed request 
3. Everything is rolled back

Actual result:
1. ❌ Processing is aborted, with the faulty request 
2. ❌ I get an error for the failed request 
3. ✅ Everything is rolled back 

This is also a very `interesting` behavior. The `$batch` request returns with a success status code, both requests have a success status code, but the data was not committed to the database. 

![Result of a $batch transaction with two requests sharing the same key ](/assets/images/posts/2024-12-01-BC-OData-transactional-batch-requests-limitations/2024-12-01-21-40-57.png)


If there's another request in the `$batch` then we get the error from the previous request. But this is only true, if the following requests targets the same table. If the request would target another table, we won't get the error.
![Result of the $batch transaction with three requests ](/assets/images/posts/2024-12-01-BC-OData-transactional-batch-requests-limitations/2024-12-01-21-44-16.png)


# Resolution / workaround
## Invalid JSON
There's no workaround for this. Let's just hope, that your dynamic generated JSON Body fails already on the first request.

## Duplicate key
Add a get request after each post/patch request. This is surely not the way I would like to implement it, but in a dynamic generated JSON Body there's no other way.
![Workaround to verify that there wasn't a duplicate key issue.](/assets/images/posts/2024-12-01-BC-OData-transactional-batch-requests-limitations/2024-12-01-21-49-20.png)


# From single to $batch request
## Single endpoint example

- Endpoint: `/api/CosmoConsult/xyz/v2.0/apiDrawingDimensions?company=XYZ`<br/>
- Method: `Post`
- Body:
  ```json
  {
    "drawingNo": "000-DKR2",
    "expectedValue": "expected value 1",        
    "version": 17,
    "ITP": "ABC",
    "no": "Some number 1"
  }
  ```
## $batch example
Single endpoint example


- Endpoint options: 
  - `/api/v2.0/$batch`
  - `/api/CosmoConsult/xyz/v2.0/$batch`

- Method: `Post`
- Body:
  ```json
  {
    "requests": [
      {
        "method": "POST",
        "id": "Operation-1",
        "url": "apiDrawingDimensions?company=XYZ",
        "headers": {
          "Content-Type": "application/json",
          "prefer": "return-no-content"
        },
        "body": {
          "drawingNo": "000-DKR2",
          "expectedValue": "expected value 1",        
          "version": 17,
          "ITP": "ABC",
          "no": "Some number 1"
        }
      },
      {
        "method": "Get",
        "id": "Operation-1-Get",
        "url": "apiDrawingDimensions?company=XYZ&$top=1",
        "headers": {
          "Content-Type": "application/json",
          "prefer": "return-no-content"
        }
      },
    ]
  }
  ```
