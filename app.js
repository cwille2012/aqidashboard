import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import { csv as requestCsv } from 'd3-request';

const MAPBOX_TOKEN = "pk.eyJ1IjoiY3dpbGxlMjAxMiIsImEiOiJjajJxdWJyeXEwMDE5MzNydXF2cm1sbDU1In0.kCKIz6Ivh3EfNOmEfTANOA";

var socket = require('engine.io-client')('ws://ec2-18-220-229-176.us-east-2.compute.amazonaws.com:3001');

socket.on('open', function() {
    socket.on('message', function(data) {
        //console.log(data);
        var newData = String(data);
        if (newData.length > 500) {
            //first message
            newData = JSON.parse(newData);
            console.log(newData);
            var indexDataTableExists = !!document.getElementById('indexDataTable');
            if (indexDataTableExists) {
                for (var i in newData) {
                    var timeStamp = parseInt(newData[i]['_id'].toString().substr(0, 8), 16) * 1000;
                    timeStamp = new Date(timeStamp);

                    //var timeStamp = 'Todays Date';

                    var pm25 = newData[i]['data']['pm25'];
                    var pm10 = newData[i]['data']['pm10'];
                    var mq2 = newData[i]['data']['mq2'];
                    var mq3 = newData[i]['data']['mq3'];
                    var mq4 = newData[i]['data']['mq4'];
                    var mq5 = newData[i]['data']['mq5'];
                    var mq6 = newData[i]['data']['mq6'];
                    var mq7 = newData[i]['data']['mq7'];
                    var temp = newData[i]['data']['temperature'];
                    var hum = newData[i]['data']['humidity'];
                    var long = newData[i]['pos']['lon'];
                    var lat = newData[i]['pos']['lat'];

                    var particulates = Math.round(((pm25 + pm10) / 2) * 100) / 100;
                    var gasses = Math.round(((mq2 + mq3 + mq4 + mq5 + mq6 + mq7) / 6) * 100) / 100;

                    var tr = document.createElement("tr");

                    var td0 = document.createElement("td");
                    var text0 = document.createTextNode(timeStamp);
                    td0.setAttribute("id", i + '-time');
                    td0.appendChild(text0);
                    tr.appendChild(td0);

                    var td1 = document.createElement("td");
                    var text1 = document.createTextNode(String(lat) + ', ' + String(long));
                    td1.setAttribute("id", i + '-location');
                    td1.appendChild(text1);
                    tr.appendChild(td1);

                    var td2 = document.createElement("td");
                    var text2 = document.createTextNode(String(particulates));
                    td2.setAttribute("id", i + '-particulates');
                    td2.appendChild(text2);
                    tr.appendChild(td2);

                    var td3 = document.createElement("td");
                    var text3 = document.createTextNode(String(gasses));
                    td3.setAttribute("id", i + '-gasses');
                    td3.appendChild(text3);
                    tr.appendChild(td3);

                    var td4 = document.createElement("td");
                    var text4 = document.createTextNode(String(temp));
                    td4.setAttribute("id", i + '-temp');
                    td4.appendChild(text4);
                    tr.appendChild(td4);

                    var td5 = document.createElement("td");
                    var text5 = document.createTextNode(String(hum));
                    td5.setAttribute("id", i + '-temp');
                    td5.appendChild(text5);
                    tr.appendChild(td5);

                    document.getElementById('indexDataTableBody').appendChild(tr);
                }
            }

        } else {
            //update message
        }

    });
    socket.on('close', function() {});
});


const DATA_URL =
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                ...DeckGLOverlay.defaultViewport,
                width: 500,
                height: 500
            },
            data: null
        };

        requestCsv(DATA_URL, (error, response) => {
            if (!error) {
                const data = response.map(d => [Number(d.lng), Number(d.lat)]);
                this.setState({ data });
            }
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: {...this.state.viewport, ...viewport }
        });
    }

    render() {
        const { viewport, data } = this.state;

        return ( <
            MapGL {...viewport }
            mapStyle = "mapbox://styles/mapbox/dark-v9"
            onViewportChange = { this._onViewportChange.bind(this) }
            mapboxApiAccessToken = { MAPBOX_TOKEN } >
            <
            DeckGLOverlay viewport = { viewport }
            data = { data || [] }
            /> < /
            MapGL >
        );
    }
}

render( < Root / > , document.getElementById('mapHolder').appendChild(document.createElement('div')));