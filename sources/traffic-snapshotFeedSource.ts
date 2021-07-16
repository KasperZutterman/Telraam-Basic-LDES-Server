import {Source, Page} from '@treecg/basic-ldes-server';
import type * as RDF from 'rdf-js';
import { literal, namedNode, blankNode, quad } from '@rdfjs/data-model';

require('dotenv').config()
const fetch = require('node-fetch');

export class mySource extends Source {

    protected config: object;
    
    constructor (config: object) {
        super(config);
    }

    async getPage(id: any): Promise<Page> {
        // TODO: fetch API

        let reqUrl = "https://telraam-api.net/v1/reports/traffic_snapshot"

        var myHeaders = new Headers();
        myHeaders.append("X-Api-Key", process.env.TELRAAM_API_KEY);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            //"time": "2021-06-25T10:00:00Z",
            "time": id,
            "contents": "minimal",
            "area": "full"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        let res = await this.fetchAPI(reqUrl, requestOptions);
        let triples: RDF.Quad[] = [];

        res["report"].forEach(observation => {
            triples = triples.concat(this.mapObservation(observation));
        });

        const p = new Page(triples, this.getMetadata(id));
        return p;
    }

    
    async fetchAPI(reqUrl: String, requestOptions) {
        return await fetch(reqUrl, requestOptions)
            .then(res => res.json())
    }

    mapObservation(observation: object): RDF.Quad[] {
        let triples: RDF.Quad[] = [];

        // Sensor URI: https://telraam.net/ns/location/{segment_id}#camera{sensor_id}
        let sensorURI = "https://telraam.net/ns/location/" + observation["segment_id"] + "#camera" + observation["sensor_id"];
        // Segment URI: https://telraam.net/ns/location/{segment_id}#segment
        let segmentURI = "https://telraam.net/ns/location/" + observation["segment_id"] +"#segment";
        let termsURI = "https://telraam.net/ns/";

        // observationID = {segment_id}_{date}
        let observationID = observation["segment_id"] + "_" + observation["date"];

        // Observation URI: "https://telraam-api.net/v3.0/traffic-snapshots/{observation_id}/{observation_type}"
        let observationURI = "https://telraam-api.net/v3.0/traffic-snapshots/" + observationID + "/";

        // uptime
        let uptimeURI = observationURI + "uptime";
        triples.push(quad(namedNode(uptimeURI), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/sosa/Observation')))
        triples.push(quad(namedNode(uptimeURI), namedNode('http://www.w3.org/ns/sosa/hasSimpleResult'), literal(observation["uptime"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#double'))))
        triples.push(quad(namedNode(uptimeURI), namedNode('http://www.w3.org/ns/sosa/resultTime'), literal(observation["date"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#dateTime'))))
        triples.push(quad(namedNode(uptimeURI), namedNode('http://www.w3.org/ns/sosa/observedProperty'), namedNode(termsURI + "uptime")))
        triples.push(quad(namedNode(uptimeURI), namedNode('http://www.w3.org/ns/sosa/hasFeatureOfInterest'), namedNode(segmentURI)))
        triples.push(quad(namedNode(uptimeURI), namedNode('http://www.w3.org/ns/sosa/madeBySensor'), namedNode(sensorURI)))
        
        // heavy
        let heavyURI = observationURI + "heavy";
        triples.push(quad(namedNode(heavyURI), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/sosa/Observation')))
        triples.push(quad(namedNode(heavyURI), namedNode('http://www.w3.org/ns/sosa/hasSimpleResult'),  literal(observation["heavy"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#double'))))
        triples.push(quad(namedNode(heavyURI), namedNode('http://www.w3.org/ns/sosa/resultTime'), literal(observation["date"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#dateTime'))))
        triples.push(quad(namedNode(heavyURI), namedNode('http://www.w3.org/ns/sosa/observedProperty'), namedNode(termsURI + "heavy")))
        triples.push(quad(namedNode(heavyURI), namedNode('http://www.w3.org/ns/sosa/hasFeatureOfInterest'), namedNode(segmentURI)))
        triples.push(quad(namedNode(heavyURI), namedNode('http://www.w3.org/ns/sosa/madeBySensor'), namedNode(sensorURI)))

        // car
        let carURI = observationURI + "car";
        triples.push(quad(namedNode(carURI), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/sosa/Observation')))
        triples.push(quad(namedNode(carURI), namedNode('http://www.w3.org/ns/sosa/hasSimpleResult'),  literal(observation["car"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#double'))))
        triples.push(quad(namedNode(carURI), namedNode('http://www.w3.org/ns/sosa/resultTime'), literal(observation["date"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#dateTime'))))
        triples.push(quad(namedNode(carURI), namedNode('http://www.w3.org/ns/sosa/observedProperty'), namedNode(termsURI + "car")))
        triples.push(quad(namedNode(carURI), namedNode('http://www.w3.org/ns/sosa/hasFeatureOfInterest'), namedNode(segmentURI)))
        triples.push(quad(namedNode(carURI), namedNode('http://www.w3.org/ns/sosa/madeBySensor'), namedNode(sensorURI)))

        // bike
        let bikeURI = observationURI + "bike";
        triples.push(quad(namedNode(bikeURI), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/sosa/Observation')))
        triples.push(quad(namedNode(bikeURI), namedNode('http://www.w3.org/ns/sosa/hasSimpleResult'), literal(observation["bike"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#double'))))
        triples.push(quad(namedNode(bikeURI), namedNode('http://www.w3.org/ns/sosa/resultTime'), literal(observation["date"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#dateTime'))))
        triples.push(quad(namedNode(bikeURI), namedNode('http://www.w3.org/ns/sosa/observedProperty'), namedNode(termsURI + "bike")))
        triples.push(quad(namedNode(bikeURI), namedNode('http://www.w3.org/ns/sosa/hasFeatureOfInterest'), namedNode(segmentURI)))
        triples.push(quad(namedNode(bikeURI), namedNode('http://www.w3.org/ns/sosa/madeBySensor'), namedNode(sensorURI)))

        // pedestrian
        let pedestrianURI = observationURI + "pedestrian";
        triples.push(quad(namedNode(pedestrianURI), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/sosa/Observation')))
        triples.push(quad(namedNode(pedestrianURI), namedNode('http://www.w3.org/ns/sosa/hasSimpleResult'),  literal(observation["pedestrian"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#double'))))
        triples.push(quad(namedNode(pedestrianURI), namedNode('http://www.w3.org/ns/sosa/resultTime'), literal(observation["date"].toString(), namedNode('https://www.w3.org/2001/XMLSchema#dateTime'))))
        triples.push(quad(namedNode(pedestrianURI), namedNode('http://www.w3.org/ns/sosa/observedProperty'), namedNode(termsURI + "pedestrian")))
        triples.push(quad(namedNode(pedestrianURI), namedNode('http://www.w3.org/ns/sosa/hasFeatureOfInterest'), namedNode(segmentURI)))        
        triples.push(quad(namedNode(pedestrianURI), namedNode('http://www.w3.org/ns/sosa/madeBySensor'), namedNode(sensorURI)))

        
        return triples;

        /*
        {
            "segment_id": 24948,
            "date": "2021-06-25T10:00:00.000Z",
            "period": "hourly",
            "uptime": 0.7441666667,
            "heavy": 6.718924972,
            "car": 80.6270996641,
            "bike": 30.9070548712,
            "pedestrian": 6.718924972,
            "geom": "MULTILINESTRING((4.47577215954854 51.3021139617358,4.47595551773865 51.3021950921476,4.47695639672957 51.3026379150719,4.47697279209603 51.3026451710098,4.47710697740073 51.3027045352444,4.47715948350988 51.3027277644868))",
            "timezone": "Europe/Brussels"
        }
        */
    }

    getMetadata(id: any): RDF.Quad[] {
        let metadata: RDF.Quad[] = [];

        // Observation feed: https://telraam-api.net/v3.0/traffic-snapshots/feed/{id}
        let observationFeed = "https://telraam-api.net/v3.0/traffic-snapshots/feed/";

        let idISO = (new Date(id)).toISOString();
        let nextId = new Date(id);
        //add hour to date
        nextId.setHours(nextId.getHours() + 1);

        let b = blankNode()
        metadata.push(quad(namedNode(observationFeed), namedNode("https://w3id.org/tree#view"), namedNode(observationFeed + idISO)))
        metadata.push(quad(namedNode(observationFeed + idISO), namedNode("https://w3id.org/tree#relation"), b))
        metadata.push(quad(b, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode("https://w3id.org/tree#GreaterThanRelation")))
        metadata.push(quad(b, namedNode('https://w3id.org/tree#path'), namedNode("http://www.w3.org/ns/sosa/resultTime")))
        metadata.push(quad(b, namedNode('https://w3id.org/tree#value'), literal(idISO, namedNode('https://www.w3.org/2001/XMLSchema#dateTime'))))
        metadata.push(quad(b, namedNode('https://w3id.org/tree#node'), namedNode(observationFeed + nextId.toISOString())))
        
        /* Moved to "https://telraam.net/ns/"
        // observable properties
        let termsURI = "https://telraam.net/ns/";
        metadata.push(quad(namedNode(termsURI + "uptime"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(termsURI + "uptime"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("uptime")))
        metadata.push(quad(namedNode(termsURI + "heavy"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(termsURI + "heavy"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("heavy")))
        metadata.push(quad(namedNode(termsURI + "car"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(termsURI + "car"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("car")))
        metadata.push(quad(namedNode(termsURI + "bike"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(termsURI + "bike"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("bike")))
        metadata.push(quad(namedNode(termsURI + "pedestrian"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(termsURI + "pedestrian"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("pedestrian")))
        */

        return metadata;
    }
/*
# Metadata uit Basic LDES server
<https://production.crowdscan.be/dataapi/public/ldes> <https://w3id.org/tree#member> <https://crowdscan.be/id/observation/gent/langemunt/1626246649464>.

<https://production.crowdscan.be/dataapi/public/ldes> <https://w3id.org/tree#view> <https://production.crowdscan.be/dataapi/public/ldes/2> .
<https://production.crowdscan.be/dataapi/public/ldes/2> <https://w3id.org/tree#relation> _:r2.
_:r2 a <https://w3id.org/tree#GreaterThanRelation>;
    <https://w3id.org/tree#path> <http://www.w3.org/ns/sosa/resultTime>;
    <https://w3id.org/tree#value> "2021-07-14T07:10:49.464Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>;
    <https://w3id.org/tree#node> <https://production.crowdscan.be/dataapi/public/ldes/3>.

*/
}