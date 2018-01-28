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
                var sumGasses = 0;
                var sumPm25 = 0;
                var sumPm10 = 0;
                var sumAqi = 0;
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


                    var pm25 = Math.round(parseFloat(newData[i]['data']['pm25']) * 11.50 * 100) / 100;
                    var pm10 = Math.round(parseFloat(newData[i]['data']['pm10']) * 2.41 * 100) / 100;
                    var mq2 = newData[i]['data']['mq2'];
                    var mq3 = newData[i]['data']['mq3'];
                    var mq4 = newData[i]['data']['mq4'];
                    var mq5 = newData[i]['data']['mq5'];
                    var temp = newData[i]['data']['temperature'];
                    var hum = newData[i]['data']['humidity'];
                    //var long = newData[i]['pos']['lon'];
                    //var lat = newData[i]['pos']['lat'];

                    //var particulates = Math.round(((pm25 + pm10) / 2) * 100) / 100;
                    var gasses = Math.round(((mq2 + mq3 + mq4 + mq5) / 4) * 100) / 100;

                    var aqi = pm10;
                    if (pm25 > aqi) {
                        aqi = pm25;
                    }
                    if (gasses > aqi) {
                        aqi = gasses;
                    }

                    sumGasses += gasses;
                    sumPm10 += pm10;
                    sumPm25 += pm25;
                    sumAqi += aqi;

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
                    var text2 = document.createTextNode(String(gasses));
                    td2.setAttribute("id", i + '-particulates');
                    td2.appendChild(text2);
                    tr.appendChild(td2);

                    var td4 = document.createElement("td");
                    var text4 = document.createTextNode(String(aqi));
                    td4.setAttribute("id", i + '-aqi');
                    td4.appendChild(text4);
                    tr.appendChild(td4);

                    document.getElementById('indexDataTableBody').appendChild(tr);
                }
                var avgGasses = sumGasses / i;
                var avgPm10 = sumPm10 / i;
                var avgPm25 = sumPm25 / i;
                var avgAqi = sumAqi / i;
                console.log('Average Gasses: ' + avgGasses);
                console.log('Average PM10: ' + avgPm10);
                console.log('Average PM25: ' + avgPm25);
                console.log('Average AQI: ' + avgAqi);

                if (!!document.getElementById('averagePm25')) {
                    document.getElementById('averagePm25').innerHTML = avgPm25;
                }
                if (!!document.getElementById('averagePm10')) {
                    document.getElementById('averagePm10').innerHTML = avgPm10;
                }
                if (!!document.getElementById('averageOzone')) {
                    document.getElementById('averageOzone').innerHTML = avgGasses;
                }

            }
            //add data to area chart:
            var indexAreaChartExists = !!document.getElementById('myAreaChart');
            if (indexAreaChartExists) {
                var labelArray = new Array();
                var pm25Array = new Array();
                var pm10Array = new Array();
                var gasArray = new Array();
                var aqiArray = new Array();

                for (var i in newData) {
                    var timeStampShort = parseInt(newData[i]['_id'].toString().substr(0, 8), 16) * 1000;
                    timeStampShort = new Date(timeStampShort);
                    timeStampShort = String(timeStampShort);
                    timeStampShort = timeStampShort.replace(/GMT-0500/g, '');
                    timeStampShort = timeStampShort.replace(/EST/g, '');
                    timeStampShort = timeStampShort.replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "");
                    timeStampShort = timeStampShort.replace(/Sat/g, '');
                    timeStampShort = timeStampShort.replace(/Sun/g, '');
                    timeStampShort = timeStampShort.replace(/Mon/g, '');
                    timeStampShort = timeStampShort.replace(/Tue/g, '');
                    timeStampShort = timeStampShort.replace(/Wed/g, '');
                    timeStampShort = timeStampShort.replace(/Thu/g, '');
                    timeStampShort = timeStampShort.replace(/Fri/g, '');
                    timeStampShort = timeStampShort.replace(/Jan 28 2018 /g, '');
                    timeStampShort = timeStampShort.replace(/Jan 29 2018 /g, '');

                    var mq2 = newData[i]['data']['mq2'];
                    var mq3 = newData[i]['data']['mq3'];
                    var mq4 = newData[i]['data']['mq4'];
                    var mq5 = newData[i]['data']['mq5'];

                    labelArray.push(timeStampShort);
                    pm25Array.push(Math.round(parseFloat(newData[i]['data']['pm25']) * 11.50 * 100) / 100);

                    var pm10Val = Math.round(parseFloat(newData[i]['data']['pm10']) * 2.41 * 100) / 100;
                    if (pm10Val > 21) {
                        pm10Val = Math.round((pm10Val - 10.00) * 100) / 100;
                    }

                    var aqi = pm10Val;
                    if ((Math.round(parseFloat(newData[i]['data']['pm25']) * 11.50 * 100) / 100) > aqi) {
                        aqi = (Math.round(parseFloat(newData[i]['data']['pm25']) * 11.50 * 100) / 100);
                    }
                    if ((Math.round(((mq2 + mq3 + mq4 + mq5) / 4) * 100) / 100) > aqi) {
                        aqi = (Math.round(((mq2 + mq3 + mq4 + mq5) / 4) * 100) / 100);
                    }

                    aqiArray.push(aqi);

                    pm10Array.push(pm10Val);
                    gasArray.push(Math.round(((mq2 + mq3 + mq4 + mq5) / 4) * 100) / 100);

                    if (labelArray.length > 7) {
                        labelArray.shift();
                    }
                    if (pm25Array.length > 7) {
                        pm25Array.shift();
                    }
                    if (pm10Array.length > 7) {
                        pm10Array.shift();
                    }
                    if (gasArray.length > 7) {
                        gasArray.shift();
                    }
                    if (aqiArray.length > 7) {
                        aqiArray.shift();
                    }

                }
                console.log(labelArray);
                console.log(pm25Array);
                console.log(pm10Array);
                console.log(gasArray);
                console.log(aqiArray);


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
                                label: "Ozone",
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
                                data: gasArray,
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
                var indexBarChartExists = !!document.getElementById('myBarChart');
                if (indexBarChartExists) {

                    var ctx = document.getElementById("myBarChart");
                    var myLineChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labelArray,
                            datasets: [{
                                label: "Overall AQI",
                                backgroundColor: "#28a745",
                                borderColor: "#28a745",
                                data: aqiArray,
                            }],
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
                                        maxTicksLimit: 6
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        maxTicksLimit: 5
                                    },
                                    gridLines: {
                                        display: true
                                    }
                                }],
                            },
                            legend: {
                                display: false
                            }
                        }
                    });
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