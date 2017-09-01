# Protocol

Kokiri is available by making HTTP requests to supported endpoints. All
endpoints expect request payloads to be `application/json`.

If you are a service who has access to the request Id authored by DLCFE, please
pass it along to Kokiri as the `X-Button-Request` HTTP header.

## Responses

Successful responses will be signaled with a `<400` HTTP Status Code. `data`
will always be an object.

```json
{
  "meta": {
    "status": "ok"
  },
  "data": {}
}
```

## Errors

Errors will be be signaled with a `>=400` HTTP Status Code.  Error payloads are
standard baseweb-formatted errors:

```json
{
  "meta": {
    "status": "error"
  },
  "error": {
    "message": "An error occurred",
    "type": "errorOccurredError",
    "details": {}
  }
}
```

## Standard Baseweb Endpoints

* `GET /ping`
* `GET /health`

## App Endpoints

All `/v1/link/*` endpoints support bulk requests.

If the request body is an `Array`:

* Each element will be treated as an individual request payload.
* The response will be returned at `data.objects` and will be an array where
  each entry pairwise maps to the corresponding request entry.
* `4XX` level errors will not be reported at the HTTP level when in bulk mode.
  Instead, the failing entry will be `null` in the `data.objects` array and
  `data.warnings` will be populated with corresponding pairwise error
  objects (or `null` if that entry was successful).

If the request body is an `Object`:

* The response will be returned at `data.object` and will be an object.
* `4XX` level errors will be reported normally.

### `POST /v1/link/attributes`

Fetch meta data related to a link.  Accepts an array of links or individual link
payload.

###### Request Payload

```json
[
  {
    "publisher_id": "org-XXX",
    "url": "https://groupon.com"
  }
]
```

###### Response Payload

```json
{
  "meta": {
    "status": "ok"
  },
  "data": {
    "objects": [
      {
        "merchant_id": "org-YYY",
        "affiliate": {
          "display_name": "AffiliateNetwork",
          "hostname": "click.affiliateworld.biz",
        },
        "approved": false,
        "redirect": false,
        "ios_support": {
          "app_to_web": true,
          "app_to_app": true,
          "web_to_web": true,
          "web_to_app": true,
          "web_to_app_with_install": false
        },
        "android_support": {
          "app_to_web": true,
          "app_to_app": true,
          "web_to_web": true,
          "web_to_app": true,
          "web_to_app_with_install": false
        }
      }
    ],
    "warnings": [
      null
    ]
  }
}
```

### `POST /v1/link/app-action`

Fetch an App Action for a link.  Accepts an array of links or individual link
payload.  If a link couldn't be enhanced, the corresponding response entry will
be `null`.

###### Request Payload

```json
[
  {
    "publisher_id": "org-XXX",
    "url": "https://groupon.com",
    "platform": "ios",
    "attribution_token": "srctok-XXX"
  }
]
```

###### Response Payload

```json
{
  "meta": {
    "status": "ok"
  },
  "data": {
    "objects": [
      {
        "merchant_id": "org-YYY",
        "approved": true,
        "redirect": true,
        "app_action": {
          "app_link": "groupon:///dispatch/us?btn_ref=srctok-XXX",
          "browser_link": "https://tracking.groupon.com?btn_ref=srctok-XXX"
        },
      }
    ],
    "warnings": [
      null
    ]
  }
}
```

### `POST /v1/link/web-action`

Fetch a Web Action for a link.  Accepts an array of links or individual link
payload.  If a link couldn't be enhanced, the corresponding response entry will
be `null`.

###### Request Payload

```json
[
  {
    "publisher_id": "org-XXX",
    "url": "https://hotels.com",
    "platform": "ios",
    "attribution_token": "srctok-XXX"
  }
]
```

###### Response Payload

```json
{
  "meta": {
    "status": "ok"
  },
  "data": {
    "objects": [
      {
        "merchant_id": "org-YYY",
        "approved": true,
        "redirect": true,
        "web_action": {
          "app_link": "https://hotels.bttn.io?rffrid=pavel&btn_ref=srctok-XXX",
          "browser_link": "https://www.hotels.com?rffrid=pavel&btn_ref=srctok-XXX"
        },
      }
    ],
    "warnings": [
      null
    ]
  }
}
```

### **DEPRECATED** `POST /v1/link/universal`

Fetch a universal link for a link.  Accepts an array of links or individual link
payload.  If a link couldn't be enhanced, the corresponding response entry will
be `null`.  If `attribution_token` isn't provided, the link will statically
affiliate.

###### Request Payload

```json
[
  {
    "publisher_id": "org-XXX",
    "url": "https://groupon.com",
    "platform": "android",
    "attribution_token": null,
    "experience": { "btn_fallback_exp": "web" }
  }
]
```

###### Response Payload

```json
{
  "meta": {
    "status": "ok"
  },
  "data": {
    "objects": [
      {
        "merchant_id": "org-YYY",
        "approved": true,
        "redirect": false,
        "universal_link": "https://track.bttn.io/groupon-tracking?btn_fallback_exp=web&btn_ref=org-XXX"
      }
    ],
    "warnings": [
      null
    ]
  }
}
```

### `POST /v1/config/sdk`

Fetch the SDK config object.

###### Request Payload

```json
{
  "publisher_id": "org-XXX"
}
```

###### Response Payload

```json
{
  "meta": {
    "status": "ok"
  },
  "data": {
    "object": {
      "supported_merchants": [],
      "supported_bttnio_subdomains": [],
      "supported_affiliates": [],
    }
  }
}
```
