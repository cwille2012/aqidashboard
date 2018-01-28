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

            //add data to table:
            var indexDataTableExists = !!document.getElementById('indexDataTable');
            if (indexDataTableExists) {
                for (var i in newData) {
                    var timeStamp = parseInt(newData[i]['_id'].toString().substr(0, 8), 16) * 1000;
                    timeStamp = new Date(timeStamp);
                    timeStamp = String(timeStamp);
                    timeStamp = timeStamp.replace(/GMT-0500/g, '');
                    timeStamp = timeStamp.replace(/EST/g, '');
                    timeStamp = timeStamp.replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "");
                    timeStamp = timeStamp.replace(/Sat/g, '');
                    timeStamp = timeStamp.replace(/Sun/g, '');
                    timeStamp = timeStamp.replace(/Mon/g, '');
                    timeStamp = timeStamp.replace(/Tue/g, '');
                    timeStamp = timeStamp.replace(/Wed/g, '');
                    timeStamp = timeStamp.replace(/Thu/g, '');
                    timeStamp = timeStamp.replace(/Fri/g, '');


                    var pm25 = parseFloat(newData[i]['data']['pm25']) * 12.05;
                    var pm10 = parseFloat(newData[i]['data']['pm10']) * 3.11;
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
                    var gasses = Math.round(((mq2 + mq3 + mq4 + mq5) / 4) * 100) / 100;

                    var tr = document.createElement("tr");

                    var td0 = document.createElement("td");
                    var text0 = document.createTextNode(timeStamp);
                    td0.setAttribute("id", i + '-time');
                    td0.appendChild(text0);
                    tr.appendChild(td0);

                    var td1 = document.createElement("td");
                    var text1 = document.createTextNode(String(pm25));
                    td1.setAttribute("id", i + '-pm25');
                    td1.appendChild(text1);
                    tr.appendChild(td1);

                    var td6 = document.createElement("td");
                    var text6 = document.createTextNode(String(pm10));
                    td6.setAttribute("id", i + '-pm10');
                    td6.appendChild(text6);
                    tr.appendChild(td6);

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
            //add data to area chart:
            var indexAreaChartExists = !!document.getElementById('myAreaChart');
            if (indexAreaChartExists) {
                var labelArray = new Array();
                var pm25Array = new Array();
                var pm10Array = new Array();
                var mq2Array = new Array();
                var mq3Array = new Array();
                var mq4Array = new Array();
                var mq5Array = new Array();
                var mq6Array = new Array();
                var mq7Array = new Array();
                for (var i in newData) {
                    var timeStamp = parseInt(newData[i]['_id'].toString().substr(0, 8), 16) * 1000;
                    timeStamp = new Date(timeStamp);
                    timeStamp = String(timeStamp);
                    timeStamp = timeStamp.replace(/GMT-0500/g, '');
                    timeStamp = timeStamp.replace(/EST/g, '');
                    timeStamp = timeStamp.replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "");
                    timeStamp = timeStamp.replace(/Sat/g, '');
                    timeStamp = timeStamp.replace(/Sun/g, '');
                    timeStamp = timeStamp.replace(/Mon/g, '');
                    timeStamp = timeStamp.replace(/Tue/g, '');
                    timeStamp = timeStamp.replace(/Wed/g, '');
                    timeStamp = timeStamp.replace(/Thu/g, '');
                    timeStamp = timeStamp.replace(/Fri/g, '');
                    timeStamp = timeStamp.replace(/Jan 28 2018 /g, '');
                    timeStamp = timeStamp.replace(/Jan 29 2018 /g, '');

                    labelArray.push(timeStamp);
                    pm25Array.push(parseInt(newData[i]['data']['pm25']));
                    pm10Array.push(parseInt(newData[i]['data']['pm10']));
                    mq2Array.push(parseInt(newData[i]['data']['mq2'])); //ozone
                    mq3Array.push(parseInt(newData[i]['data']['mq3']));
                    mq4Array.push(parseInt(newData[i]['data']['mq4']));
                    mq5Array.push(parseInt(newData[i]['data']['mq5']));
                    mq6Array.push(parseInt(newData[i]['data']['mq6']));
                    mq7Array.push(parseInt(newData[i]['data']['mq7']));

                    if (labelArray.length > 7) {
                        labelArray.shift();
                    }
                    if (pm25Array.length > 7) {
                        pm25Array.shift();
                    }
                    if (pm10Array.length > 7) {
                        pm10Array.shift();
                    }
                    if (mq2Array.length > 7) {
                        mq2Array.shift();
                    }
                    if (mq3Array.length > 7) {
                        mq3Array.shift();
                    }
                    if (mq4Array.length > 7) {
                        mq4Array.shift();
                    }
                    if (mq5Array.length > 7) {
                        mq5Array.shift();
                    }
                    if (mq6Array.length > 7) {
                        mq6Array.shift();
                    }
                    if (mq7Array.length > 7) {
                        mq7Array.shift();
                    }

                }
                console.log(labelArray);
                console.log(pm25Array);
                console.log(pm10Array);
                console.log(mq2Array);
                console.log(mq3Array);
                console.log(mq4Array);
                console.log(mq5Array);
                console.log(mq6Array);
                console.log(mq7Array);

                var ctx = document.getElementById("myAreaChart");
                var myLineChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labelArray,
                        datasets: [{
                                label: "PM25",
                                lineTension: 0.3,
                                backgroundColor: "rgba(2,117,216,0.2)",
                                borderColor: "rgba(2,117,216,1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(2,117,216,1)",
                                pointBorderColor: "rgba(255,255,255,0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                                pointHitRadius: 20,
                                pointBorderWidth: 2,
                                data: pm25Array,
                            },
                            {
                                label: "PM10",
                                lineTension: 0.3,
                                backgroundColor: "rgba(2,117,216,0.2)",
                                borderColor: "rgba(2,117,216,1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(2,117,216,1)",
                                pointBorderColor: "rgba(255,255,255,0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                                pointHitRadius: 20,
                                pointBorderWidth: 2,
                                data: pm10Array,
                            },
                            {
                                label: "MQ2",
                                lineTension: 0.3,
                                backgroundColor: "rgba(2,117,216,0.2)",
                                borderColor: "rgba(2,117,216,1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(2,117,216,1)",
                                pointBorderColor: "rgba(255,255,255,0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                                pointHitRadius: 20,
                                pointBorderWidth: 2,
                                data: mq2Array,
                            },
                            {
                                label: "MQ3",
                                lineTension: 0.3,
                                backgroundColor: "rgba(2,117,216,0.2)",
                                borderColor: "rgba(2,117,216,1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(2,117,216,1)",
                                pointBorderColor: "rgba(255,255,255,0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                                pointHitRadius: 20,
                                pointBorderWidth: 2,
                                data: mq3Array,
                            },
                            {
                                label: "MQ4",
                                lineTension: 0.3,
                                backgroundColor: "rgba(2,117,216,0.2)",
                                borderColor: "rgba(2,117,216,1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(2,117,216,1)",
                                pointBorderColor: "rgba(255,255,255,0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                                pointHitRadius: 20,
                                pointBorderWidth: 2,
                                data: mq4Array,
                            },
                            {
                                label: "MQ5",
                                lineTension: 0.3,
                                backgroundColor: "rgba(2,117,216,0.2)",
                                borderColor: "rgba(2,117,216,1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(2,117,216,1)",
                                pointBorderColor: "rgba(255,255,255,0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                                pointHitRadius: 20,
                                pointBorderWidth: 2,
                                data: mq5Array,
                            },
                            {
                                label: "MQ6",
                                lineTension: 0.3,
                                backgroundColor: "rgba(2,117,216,0.2)",
                                borderColor: "rgba(2,117,216,1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(2,117,216,1)",
                                pointBorderColor: "rgba(255,255,255,0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                                pointHitRadius: 20,
                                pointBorderWidth: 2,
                                data: mq6Array,
                            },
                            {
                                label: "MQ7",
                                lineTension: 0.3,
                                backgroundColor: "rgba(2,117,216,0.2)",
                                borderColor: "rgba(2,117,216,1)",
                                pointRadius: 5,
                                pointBackgroundColor: "rgba(2,117,216,1)",
                                pointBorderColor: "rgba(255,255,255,0.8)",
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(2,117,216,1)",
                                pointHitRadius: 20,
                                pointBorderWidth: 2,
                                data: mq7Array,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                time: {
                                    unit: 'date'
                                },
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    maxTicksLimit: 7
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    min: 0,
                                    maxTicksLimit: 5
                                },
                                gridLines: {
                                    color: "rgba(0, 0, 0, .125)",
                                }
                            }],
                        },
                        legend: {
                            display: false
                        }
                    }
                });
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