# Telraam-Basic-LDES-Server

This is a Telraam specific implementation of the [Basic LDES server](https://github.com/TREEcg/Basic-LDES-Server)

## Requirements
You need a .env file in the root folder following this template:  
```TELRAAM_API_KEY='<YOUR_API_KEY>'```  
You can request your Telraam API token by following [this guide](https://documenter.getpostman.com/view/8210376/TWDRqyaV).

## Usage
```
git clone https://github.com/KasperZutterman/Telraam-Basic-LDES-Server.git
npm install
npm run start
```

## Active endpoints:
- http://localhost:3000/ldes-catalog/1
- http://localhost:3000/v3.0/segments/feed/1
- http://localhost:3000/v3.0/traffic-snapshot/feed/2021-06-25T10:00:00Z

## Proposed URI Strategy:
|||
|---------------------------------------|-------------------------------------------------------------------------------------|
| Wegsegment                            | https://telraam.net/ns/location/{segment_id}#segment                                |
| Observation                           | https://telraam-api.net/v3.0/traffic-snapshots/{observation_id}/{observation_type} <br> where {observation_id} = {segment_id}_{date} |
| Sensor                                | https://telraam.net/ns/location/{segment_id}#camera{sensor_id}                      |
| Core of the Linked Data Event Streams | https://telraam-api.net/ldes-catalog <br> https://telraam-api.net/v3.0/segments/feed <br> https://telraam-api.net/v3.0/segments/shape <br> https://telraam-api.net/v3.0/traffic-snapshots/feed <br> https://telraam-api.net/v3.0/traffic-snapshots/shape |
| Terms                                 | https://telraam.net/ns/                                                             |
