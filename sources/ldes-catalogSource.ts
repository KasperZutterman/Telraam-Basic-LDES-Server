import {Source, Page} from '@treecg/basic-ldes-server';
import type * as RDF from 'rdf-js';
import { literal, namedNode, blankNode, quad } from '@rdfjs/data-model';

require('dotenv').config()

export class mySource extends Source {

    protected config: object;
    
    constructor (config: object) {
        super(config);
    }

    async getPage(id: any): Promise<Page> {

        const p = new Page([], this.getMetadata(id));
        return p;
    }

    getMetadata(id: any): RDF.Quad[] {
        let metadata: RDF.Quad[] = [];

        // DCAT validator: http://www.dcat.be/validator/
        // Catalog
        metadata.push(quad(blankNode("catalog"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/dcat#Catalog")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://purl.org/dc/terms/title"), literal("Telraam Catalog")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://purl.org/dc/terms/description"), literal("Telraam Catalog")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("Telraam Catalog")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://xmlns.com/foaf/0.1/"), namedNode("https://telraam-api.net/ldes-catalog")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://purl.org/dc/terms/publisher"), namedNode("https://telraam.net/")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://www.w3.org/ns/dcat#dataset"), namedNode("https://telraam-api.net/v3.0/segments/feed#dataset")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://www.w3.org/ns/dcat#dataset"), namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://purl.org/dc/terms/license"), namedNode("http://creativecommons.org/licenses/by-nc/4.0/")))
        metadata.push(quad(blankNode("catalog"), namedNode("http://purl.org/dc/terms/issued"), literal("2021-07-15", namedNode("http://www.w3.org/2001/XMLSchema#date"))))
        metadata.push(quad(blankNode("catalog"), namedNode("http://purl.org/dc/terms/modified"), literal("2021-07-15", namedNode("http://www.w3.org/2001/XMLSchema#date"))))

        // Publisher
        metadata.push(quad(namedNode("https://telraam.net/"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://xmlns.com/foaf/0.1/Organization")))
        metadata.push(quad(namedNode("https://telraam.net/"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"),  literal("Telraam")))

        // Dataset1 https://telraam-api.net/v3.0/segments/feed
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/dcat#dataset")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://purl.org/dc/terms/title"), literal("Telraam Segments")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("Telraam Segments")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://www.w3.org/ns/dcat#contactPoint"), namedNode("https://telraam.zendesk.com/hc/nl")))
        //metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://www.w3.org/ns/dcat#keyword"), blankNode("")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://purl.org/dc/terms/publisher"), namedNode("https://telraam.net/")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://purl.org/dc/terms/issued"), literal("2021-07-15", namedNode("http://www.w3.org/2001/XMLSchema#date"))))
        //metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://purl.org/dc/terms/modified"), literal("2021-07-15", namedNode("http://www.w3.org/2001/XMLSchema#date"))))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://purl.org/dc/terms/language"), namedNode("http://id.loc.gov/vocabulary/iso639-1/eng")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://purl.org/dc/terms/license"), namedNode("http://creativecommons.org/licenses/by-nc/4.0/")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://purl.org/dc/terms/identifier"), literal("telraam-segments")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://purl.org/dc/terms/description"), literal("Telraam Segments...")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/segments/feed#dataset"), namedNode("http://www.w3.org/ns/dcat#distribution"), blankNode("dataset1-distribution")))

        // Dataset1 Distribution https://telraam-api.net/v3.0/segments/feed
        metadata.push(quad(blankNode("dataset1-distribution"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/dcat#Distribution")))
        metadata.push(quad(blankNode("dataset1-distribution"), namedNode("http://www.w3.org/ns/dcat#accessURL"), literal("https://telraam-api.net/v3.0/segments/feed", namedNode("http://www.w3.org/2001/XMLSchema#anyURI"))))
        //metadata.push(quad(blankNode("dataset1-distribution"), namedNode("http://www.w3.org/ns/dcat#downloadURL"), literal("https://telraam-api.net/v3.0/segments/feed", namedNode("http://www.w3.org/2001/XMLSchema#anyURI"))))
        metadata.push(quad(blankNode("dataset1-distribution"), namedNode("http://purl.org/dc/terms/conformsTo"), literal("https://w3id.org/tree")))

        // Dataset2 https://telraam-api.net/v3.0/traffic-snapshots/feed
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/dcat#dataset")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://purl.org/dc/terms/title"), literal("Telraam Observations")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://www.w3.org/2000/01/rdf-schema#label"), literal("Telraam Observations")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://www.w3.org/ns/dcat#contactPoint"), namedNode("https://telraam.zendesk.com/hc/nl")))
        //metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://www.w3.org/ns/dcat#keyword"), blankNode("")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://purl.org/dc/terms/publisher"), namedNode("https://telraam.net/")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://purl.org/dc/terms/issued"), literal("2021-07-15", namedNode("http://www.w3.org/2001/XMLSchema#date"))))
        //metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://purl.org/dc/terms/modified"), literal("2021-07-15", namedNode("http://www.w3.org/2001/XMLSchema#date"))))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://purl.org/dc/terms/language"), namedNode("http://id.loc.gov/vocabulary/iso639-1/eng")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://purl.org/dc/terms/license"), namedNode("http://creativecommons.org/licenses/by-nc/4.0/")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://purl.org/dc/terms/identifier"), literal("telraam-observations")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://purl.org/dc/terms/description"), literal("Telraam Observations...")))
        metadata.push(quad(namedNode("https://telraam-api.net/v3.0/traffic-snapshots/feed#dataset"), namedNode("http://www.w3.org/ns/dcat#distribution"), blankNode("dataset2-distribution")))

        // Dataset2 Distribution https://telraam-api.net/v3.0/traffic-snapshots/feed
        metadata.push(quad(blankNode("dataset2-distribution"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://www.w3.org/ns/dcat#Distribution")))
        metadata.push(quad(blankNode("dataset2-distribution"), namedNode("http://www.w3.org/ns/dcat#accessURL"), literal("https://telraam-api.net/v3.0/traffic-snapshots/feed", namedNode("http://www.w3.org/2001/XMLSchema#anyURI"))))
        //metadata.push(quad(blankNode("dataset2-distribution"), namedNode("http://www.w3.org/ns/dcat#downloadURL"), literal("https://telraam-api.net/v3.0/traffic-snapshots/feed", namedNode("http://www.w3.org/2001/XMLSchema#anyURI"))))
        metadata.push(quad(blankNode("dataset2-distribution"), namedNode("http://purl.org/dc/terms/conformsTo"), literal("https://w3id.org/tree")))

        return metadata;
    }

}