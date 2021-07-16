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
            "time": "2021-06-25T10:00:00Z",
            //"time": id,
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

        // Sensor/Camera
        triples.push(quad(namedNode(sensorURI), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/sosa/Sensor')))
        triples.push(quad(namedNode(sensorURI), namedNode('http://www.w3.org/ns/sosa/observes'), namedNode(termsURI + 'uptime')))
        triples.push(quad(namedNode(sensorURI), namedNode('http://www.w3.org/ns/sosa/observes'), namedNode(termsURI + 'heavy')))
        triples.push(quad(namedNode(sensorURI), namedNode('http://www.w3.org/ns/sosa/observes'), namedNode(termsURI + 'car')))
        triples.push(quad(namedNode(sensorURI), namedNode('http://www.w3.org/ns/sosa/observes'), namedNode(termsURI + 'bike')))
        triples.push(quad(namedNode(sensorURI), namedNode('http://www.w3.org/ns/sosa/observes'), namedNode(termsURI + 'pedestrian')))

        // Feauture of Interest / Segment
        triples.push(quad(namedNode(segmentURI), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('sosa:FeatureOfInterest')))
        triples.push(quad(namedNode(segmentURI), namedNode('http://www.w3.org/ns/locn#geometry'), blankNode(observation["segment_id"])))
        triples.push(quad(blankNode(observation["segment_id"]), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/locn#Geometry')))
        triples.push(quad(blankNode(observation["segment_id"]), namedNode('http://www.opengis.net/ont/geosparql#asWKT'), literal("<http://www.opengis.net/def/crs/OGC/1.3/CRS84> " + observation["geom"], namedNode('http://www.opengis.net/ont/geosparql#wktLiteral'))))
        
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

        let nextId = (parseInt(id) + 1).toString();

        metadata.push(quad(namedNode(this.config["entrypoint"] + this.config["route"] + "/"), namedNode("https://w3id.org/tree#view"), namedNode(this.config["entrypoint"] + this.config["route"] + "/" + id)))
        metadata.push(quad(namedNode(this.config["entrypoint"] + this.config["route"] + "/" + id), namedNode("https://w3id.org/tree#relation"), blankNode(nextId)))
        metadata.push(quad(blankNode(nextId), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode("https://w3id.org/tree#GreaterThanRelation")))
        metadata.push(quad(blankNode(nextId), namedNode('https://w3id.org/tree#path'), namedNode("http://www.w3.org/ns/sosa/resultTime")))
        metadata.push(quad(blankNode(nextId), namedNode('https://w3id.org/tree#value'), literal(id, namedNode('https://www.w3.org/2001/XMLSchema#dateTime'))))
        metadata.push(quad(blankNode(nextId), namedNode('https://w3id.org/tree#node'), namedNode(this.config["entrypoint"] + this.config["route"] + "/" + nextId)))
        
        
        /* Moved to "https://telraam.net/ns/"
        // observable properties
        metadata.push(quad(namedNode(namespaceURI + "uptime"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(namespaceURI + "uptime"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("uptime")))
        metadata.push(quad(namedNode(namespaceURI + "heavy"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(namespaceURI + "heavy"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("heavy")))
        metadata.push(quad(namedNode(namespaceURI + "car"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(namespaceURI + "car"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("car")))
        metadata.push(quad(namedNode(namespaceURI + "bike"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(namespaceURI + "bike"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("bike")))
        metadata.push(quad(namedNode(namespaceURI + "pedestrian"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/sosa/ObservableProperty")))
        metadata.push(quad(namedNode(namespaceURI + "pedestrian"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("pedestrian")))
        */
        return metadata;
    }

}