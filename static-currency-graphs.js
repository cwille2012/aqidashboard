var host = 'localhost:9600';

var filePath = 'http://' + host + '/data/currency-history.json';
console.log('File path: ' + filePath);

function graphETH(){
    getJSON(filePath, function(err, data) {
        console.log(data);
        var datasets = new Object();

        var zecData = new Array();
        var ethData = new Array();
        var ltcData = new Array();
        var xmrData = new Array();
        var xrpData = new Array();

        for (var key in data) {
            var date = data[key]['date'];
            var time = new Date(date).getTime();

            var zec = data[key]['zec'];
            var eth = data[key]['eth'];
            var ltc = data[key]['ltc'];
            var xmr = data[key]['xmr'];
            var xrp = data[key]['xrp'];

            zecData.push([time, zec]);
            ethData.push([time, eth]);
            ltcData.push([time, ltc]);
            xmrData.push([time, xmr]);
            xrpData.push([time, xrp]);

            console.log(time + " " + zec);
        }

        var zecObj = { 'data': zecData, 'label': "Zcash (ZEC)", color: 1 };
        var ethObj = { 'data': ethData, 'label': "Ethereum (ETH)", color: 2 };
        var ltcObj = { 'data': ltcData, 'label': "Litecoin (LTC)", color: 3 };
        var xmrObj = { 'data': xmrData, 'label': "Monero (XMR)", color: 4 };
        var xrpObj = { 'data': xrpData, 'label': "Ripple (XRP)", color: 5 };

        datasets.zec = zecObj;
        datasets.eth = ethObj;
        datasets.ltc = ltcObj;
        datasets.xmr = xmrObj;
        datasets.xrp = xrpObj;

        console.log('Datasets: ');
        console.log(datasets);

        //end of formatting
        //graph stuff:

        var i = 0;
        $.each(datasets, function(key, val) {
            val.color = i;
            ++i;
        });

        var choiceContainer = $("#choices");
        $.each(datasets, function(key, val) {
            if (key == 'eth'){
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            } else {
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            }
        });

        choiceContainer.find("input").click(plotAccordingToChoices);

        function plotAccordingToChoices() {

            var data = [];

            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && datasets[key]) {
                    data.push(datasets[key]);
                }
            });
            var plot = $.plot("#sensor-values-time-graph", data, {
                grid: {
                    hoverable: true,
                    clickable: true
                },
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                yaxis: {
                    min: 0
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%m/%d/%y",
                    tickSize: [24, "hour"],
                    tickFormatter: function(val, axis) {
                        var date = (new Date((val)).getMonth() + 1) + "/" + (new Date(val)).getDate() + "/" + (new Date(val)).getUTCFullYear();
                        return date;
                    }
                }
            });
        

            if (data.length > 0) {
                var overview = $.plot("#sensor-values-time-overview", data, {
                    series: {
                        lines: {
                            show: true,
                            lineWidth: 1
                        },
                        shadowSize: 0
                    },
                    xaxis: {
                        ticks: [],
                        mode: "time"
                    },
                    yaxis: {
                        ticks: [],
                        min: 0,
                        autoscaleMargin: 0.1
                    },
                    selection: {
                        mode: "x"
                    },
                    legend: {
                        show: false
                    }
                });
            }

            $("#sensor-values-time-graph").bind("plotselected", function(event, ranges) {

                $.each(plot.getXAxes(), function(_, axis) {
                    var opts = axis.options;
                    opts.min = ranges.xaxis.from;
                    opts.max = ranges.xaxis.to;
                });
                plot.setupGrid();
                plot.draw();
                plot.clearSelection();

                overview.setSelection(ranges, true);
            });

            $("#sensor-values-time-overview").bind("plotselected", function(event, ranges) {
                plot.setSelection(ranges);
            });

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80
            }).appendTo("body");

            $("#sensor-values-time-graph").bind("plothover", function(event, pos, item) {

                if (true) {
                    if (item) {
                        var x = item.datapoint[0],
                            y = item.datapoint[1].toFixed(2);

                        $("#tooltip").html(item.series.label + " on " + (new Date(x).getMonth() + 1) + "/" + (new Date(x)).getDate() + "/" + (new Date(x)).getUTCFullYear() + " was $" + y)
                            .css({ top: item.pageY + 5, left: item.pageX + 5 })
                            .fadeIn(200);
                    } else {
                        $("#tooltip").hide();
                    }
                }
            });

            $("#sensor-values-time-graph").bind("plotclick", function(event, pos, item) {
                if (item) {
                    $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
                    plot.highlight(item.series, item.datapoint);
                }
            });
        }

        plotAccordingToChoices();
    });
}

function graphLTE(){
    getJSON(filePath, function(err, data) {
        console.log(data);
        var datasets = new Object();

        var zecData = new Array();
        var ethData = new Array();
        var ltcData = new Array();
        var xmrData = new Array();
        var xrpData = new Array();

        for (var key in data) {
            var date = data[key]['date'];
            var time = new Date(date).getTime();

            var zec = data[key]['zec'];
            var eth = data[key]['eth'];
            var ltc = data[key]['ltc'];
            var xmr = data[key]['xmr'];
            var xrp = data[key]['xrp'];

            zecData.push([time, zec]);
            ethData.push([time, eth]);
            ltcData.push([time, ltc]);
            xmrData.push([time, xmr]);
            xrpData.push([time, xrp]);

            console.log(time + " " + zec);
        }

        var zecObj = { 'data': zecData, 'label': "Zcash (ZEC)", color: 1 };
        var ethObj = { 'data': ethData, 'label': "Ethereum (ETH)", color: 2 };
        var ltcObj = { 'data': ltcData, 'label': "Litecoin (LTC)", color: 3 };
        var xmrObj = { 'data': xmrData, 'label': "Monero (XMR)", color: 4 };
        var xrpObj = { 'data': xrpData, 'label': "Ripple (XRP)", color: 5 };

        datasets.zec = zecObj;
        datasets.eth = ethObj;
        datasets.ltc = ltcObj;
        datasets.xmr = xmrObj;
        datasets.xrp = xrpObj;

        console.log('Datasets: ');
        console.log(datasets);

        //end of formatting
        //graph stuff:

        var i = 0;
        $.each(datasets, function(key, val) {
            val.color = i;
            ++i;
        });

        var choiceContainer = $("#choices");
        $.each(datasets, function(key, val) {
            if (key == 'lte'){
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            } else {
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            }
        });

        choiceContainer.find("input").click(plotAccordingToChoices);

        function plotAccordingToChoices() {

            var data = [];

            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && datasets[key]) {
                    data.push(datasets[key]);
                }
            });
            var plot = $.plot("#sensor-values-time-graph", data, {
                grid: {
                    hoverable: true,
                    clickable: true
                },
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                yaxis: {
                    min: 0
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%m/%d/%y",
                    tickSize: [24, "hour"],
                    tickFormatter: function(val, axis) {
                        var date = (new Date((val)).getMonth() + 1) + "/" + (new Date(val)).getDate() + "/" + (new Date(val)).getUTCFullYear();
                        return date;
                    }
                }
            });
        

            if (data.length > 0) {
                var overview = $.plot("#sensor-values-time-overview", data, {
                    series: {
                        lines: {
                            show: true,
                            lineWidth: 1
                        },
                        shadowSize: 0
                    },
                    xaxis: {
                        ticks: [],
                        mode: "time"
                    },
                    yaxis: {
                        ticks: [],
                        min: 0,
                        autoscaleMargin: 0.1
                    },
                    selection: {
                        mode: "x"
                    },
                    legend: {
                        show: false
                    }
                });
            }

            $("#sensor-values-time-graph").bind("plotselected", function(event, ranges) {

                $.each(plot.getXAxes(), function(_, axis) {
                    var opts = axis.options;
                    opts.min = ranges.xaxis.from;
                    opts.max = ranges.xaxis.to;
                });
                plot.setupGrid();
                plot.draw();
                plot.clearSelection();

                overview.setSelection(ranges, true);
            });

            $("#sensor-values-time-overview").bind("plotselected", function(event, ranges) {
                plot.setSelection(ranges);
            });

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80
            }).appendTo("body");

            $("#sensor-values-time-graph").bind("plothover", function(event, pos, item) {

                if (true) {
                    if (item) {
                        var x = item.datapoint[0],
                            y = item.datapoint[1].toFixed(2);

                        $("#tooltip").html(item.series.label + " on " + (new Date(x).getMonth() + 1) + "/" + (new Date(x)).getDate() + "/" + (new Date(x)).getUTCFullYear() + " was $" + y)
                            .css({ top: item.pageY + 5, left: item.pageX + 5 })
                            .fadeIn(200);
                    } else {
                        $("#tooltip").hide();
                    }
                }
            });

            $("#sensor-values-time-graph").bind("plotclick", function(event, pos, item) {
                if (item) {
                    $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
                    plot.highlight(item.series, item.datapoint);
                }
            });
        }

        plotAccordingToChoices();
    });
}

function graphZEC(){
    getJSON(filePath, function(err, data) {
        console.log(data);
        var datasets = new Object();

        var zecData = new Array();
        var ethData = new Array();
        var ltcData = new Array();
        var xmrData = new Array();
        var xrpData = new Array();

        for (var key in data) {
            var date = data[key]['date'];
            var time = new Date(date).getTime();

            var zec = data[key]['zec'];
            var eth = data[key]['eth'];
            var ltc = data[key]['ltc'];
            var xmr = data[key]['xmr'];
            var xrp = data[key]['xrp'];

            zecData.push([time, zec]);
            ethData.push([time, eth]);
            ltcData.push([time, ltc]);
            xmrData.push([time, xmr]);
            xrpData.push([time, xrp]);

            console.log(time + " " + zec);
        }

        var zecObj = { 'data': zecData, 'label': "Zcash (ZEC)", color: 1 };
        var ethObj = { 'data': ethData, 'label': "Ethereum (ETH)", color: 2 };
        var ltcObj = { 'data': ltcData, 'label': "Litecoin (LTC)", color: 3 };
        var xmrObj = { 'data': xmrData, 'label': "Monero (XMR)", color: 4 };
        var xrpObj = { 'data': xrpData, 'label': "Ripple (XRP)", color: 5 };

        datasets.zec = zecObj;
        datasets.eth = ethObj;
        datasets.ltc = ltcObj;
        datasets.xmr = xmrObj;
        datasets.xrp = xrpObj;

        console.log('Datasets: ');
        console.log(datasets);

        //end of formatting
        //graph stuff:

        var i = 0;
        $.each(datasets, function(key, val) {
            val.color = i;
            ++i;
        });

        var choiceContainer = $("#choices");
        $.each(datasets, function(key, val) {
            if (key == 'zec'){
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            } else {
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            }
        });

        choiceContainer.find("input").click(plotAccordingToChoices);

        function plotAccordingToChoices() {

            var data = [];

            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && datasets[key]) {
                    data.push(datasets[key]);
                }
            });
            var plot = $.plot("#sensor-values-time-graph", data, {
                grid: {
                    hoverable: true,
                    clickable: true
                },
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                yaxis: {
                    min: 0
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%m/%d/%y",
                    tickSize: [24, "hour"],
                    tickFormatter: function(val, axis) {
                        var date = (new Date((val)).getMonth() + 1) + "/" + (new Date(val)).getDate() + "/" + (new Date(val)).getUTCFullYear();
                        return date;
                    }
                }
            });
        

            if (data.length > 0) {
                var overview = $.plot("#sensor-values-time-overview", data, {
                    series: {
                        lines: {
                            show: true,
                            lineWidth: 1
                        },
                        shadowSize: 0
                    },
                    xaxis: {
                        ticks: [],
                        mode: "time"
                    },
                    yaxis: {
                        ticks: [],
                        min: 0,
                        autoscaleMargin: 0.1
                    },
                    selection: {
                        mode: "x"
                    },
                    legend: {
                        show: false
                    }
                });
            }

            $("#sensor-values-time-graph").bind("plotselected", function(event, ranges) {

                $.each(plot.getXAxes(), function(_, axis) {
                    var opts = axis.options;
                    opts.min = ranges.xaxis.from;
                    opts.max = ranges.xaxis.to;
                });
                plot.setupGrid();
                plot.draw();
                plot.clearSelection();

                overview.setSelection(ranges, true);
            });

            $("#sensor-values-time-overview").bind("plotselected", function(event, ranges) {
                plot.setSelection(ranges);
            });

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80
            }).appendTo("body");

            $("#sensor-values-time-graph").bind("plothover", function(event, pos, item) {

                if (true) {
                    if (item) {
                        var x = item.datapoint[0],
                            y = item.datapoint[1].toFixed(2);

                        $("#tooltip").html(item.series.label + " on " + (new Date(x).getMonth() + 1) + "/" + (new Date(x)).getDate() + "/" + (new Date(x)).getUTCFullYear() + " was $" + y)
                            .css({ top: item.pageY + 5, left: item.pageX + 5 })
                            .fadeIn(200);
                    } else {
                        $("#tooltip").hide();
                    }
                }
            });

            $("#sensor-values-time-graph").bind("plotclick", function(event, pos, item) {
                if (item) {
                    $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
                    plot.highlight(item.series, item.datapoint);
                }
            });
        }

        plotAccordingToChoices();
    });
}

function graphXMR(){
    getJSON(filePath, function(err, data) {
        console.log(data);
        var datasets = new Object();

        var zecData = new Array();
        var ethData = new Array();
        var ltcData = new Array();
        var xmrData = new Array();
        var xrpData = new Array();

        for (var key in data) {
            var date = data[key]['date'];
            var time = new Date(date).getTime();

            var zec = data[key]['zec'];
            var eth = data[key]['eth'];
            var ltc = data[key]['ltc'];
            var xmr = data[key]['xmr'];
            var xrp = data[key]['xrp'];

            zecData.push([time, zec]);
            ethData.push([time, eth]);
            ltcData.push([time, ltc]);
            xmrData.push([time, xmr]);
            xrpData.push([time, xrp]);

            console.log(time + " " + zec);
        }

        var zecObj = { 'data': zecData, 'label': "Zcash (ZEC)", color: 1 };
        var ethObj = { 'data': ethData, 'label': "Ethereum (ETH)", color: 2 };
        var ltcObj = { 'data': ltcData, 'label': "Litecoin (LTC)", color: 3 };
        var xmrObj = { 'data': xmrData, 'label': "Monero (XMR)", color: 4 };
        var xrpObj = { 'data': xrpData, 'label': "Ripple (XRP)", color: 5 };

        datasets.zec = zecObj;
        datasets.eth = ethObj;
        datasets.ltc = ltcObj;
        datasets.xmr = xmrObj;
        datasets.xrp = xrpObj;

        console.log('Datasets: ');
        console.log(datasets);

        //end of formatting
        //graph stuff:

        var i = 0;
        $.each(datasets, function(key, val) {
            val.color = i;
            ++i;
        });

        var choiceContainer = $("#choices");
        $.each(datasets, function(key, val) {
            if (key == 'xmr'){
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            } else {
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            }
        });

        choiceContainer.find("input").click(plotAccordingToChoices);

        function plotAccordingToChoices() {

            var data = [];

            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && datasets[key]) {
                    data.push(datasets[key]);
                }
            });
            var plot = $.plot("#sensor-values-time-graph", data, {
                grid: {
                    hoverable: true,
                    clickable: true
                },
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                yaxis: {
                    min: 0
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%m/%d/%y",
                    tickSize: [24, "hour"],
                    tickFormatter: function(val, axis) {
                        var date = (new Date((val)).getMonth() + 1) + "/" + (new Date(val)).getDate() + "/" + (new Date(val)).getUTCFullYear();
                        return date;
                    }
                }
            });
        

            if (data.length > 0) {
                var overview = $.plot("#sensor-values-time-overview", data, {
                    series: {
                        lines: {
                            show: true,
                            lineWidth: 1
                        },
                        shadowSize: 0
                    },
                    xaxis: {
                        ticks: [],
                        mode: "time"
                    },
                    yaxis: {
                        ticks: [],
                        min: 0,
                        autoscaleMargin: 0.1
                    },
                    selection: {
                        mode: "x"
                    },
                    legend: {
                        show: false
                    }
                });
            }

            $("#sensor-values-time-graph").bind("plotselected", function(event, ranges) {

                $.each(plot.getXAxes(), function(_, axis) {
                    var opts = axis.options;
                    opts.min = ranges.xaxis.from;
                    opts.max = ranges.xaxis.to;
                });
                plot.setupGrid();
                plot.draw();
                plot.clearSelection();

                overview.setSelection(ranges, true);
            });

            $("#sensor-values-time-overview").bind("plotselected", function(event, ranges) {
                plot.setSelection(ranges);
            });

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80
            }).appendTo("body");

            $("#sensor-values-time-graph").bind("plothover", function(event, pos, item) {

                if (true) {
                    if (item) {
                        var x = item.datapoint[0],
                            y = item.datapoint[1].toFixed(2);

                        $("#tooltip").html(item.series.label + " on " + (new Date(x).getMonth() + 1) + "/" + (new Date(x)).getDate() + "/" + (new Date(x)).getUTCFullYear() + " was $" + y)
                            .css({ top: item.pageY + 5, left: item.pageX + 5 })
                            .fadeIn(200);
                    } else {
                        $("#tooltip").hide();
                    }
                }
            });

            $("#sensor-values-time-graph").bind("plotclick", function(event, pos, item) {
                if (item) {
                    $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
                    plot.highlight(item.series, item.datapoint);
                }
            });
        }

        plotAccordingToChoices();
    });
}

function graphXRP(){
    getJSON(filePath, function(err, data) {
        console.log(data);
        var datasets = new Object();

        var zecData = new Array();
        var ethData = new Array();
        var ltcData = new Array();
        var xmrData = new Array();
        var xrpData = new Array();

        for (var key in data) {
            var date = data[key]['date'];
            var time = new Date(date).getTime();

            var zec = data[key]['zec'];
            var eth = data[key]['eth'];
            var ltc = data[key]['ltc'];
            var xmr = data[key]['xmr'];
            var xrp = data[key]['xrp'];

            zecData.push([time, zec]);
            ethData.push([time, eth]);
            ltcData.push([time, ltc]);
            xmrData.push([time, xmr]);
            xrpData.push([time, xrp]);

            console.log(time + " " + zec);
        }

        var zecObj = { 'data': zecData, 'label': "Zcash (ZEC)", color: 1 };
        var ethObj = { 'data': ethData, 'label': "Ethereum (ETH)", color: 2 };
        var ltcObj = { 'data': ltcData, 'label': "Litecoin (LTC)", color: 3 };
        var xmrObj = { 'data': xmrData, 'label': "Monero (XMR)", color: 4 };
        var xrpObj = { 'data': xrpData, 'label': "Ripple (XRP)", color: 5 };

        datasets.zec = zecObj;
        datasets.eth = ethObj;
        datasets.ltc = ltcObj;
        datasets.xmr = xmrObj;
        datasets.xrp = xrpObj;

        console.log('Datasets: ');
        console.log(datasets);

        //end of formatting
        //graph stuff:

        var i = 0;
        $.each(datasets, function(key, val) {
            val.color = i;
            ++i;
        });

        var choiceContainer = $("#choices");
        $.each(datasets, function(key, val) {
            if (key == 'xrp'){
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' checked='checked' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            } else {
                choiceContainer.append("<input type='checkbox' name='" + key +
                "' id='id" + key + "'></input>" +
                "<label for='id" + key + "' style='margin: 10px;'>" +
                val.label + "</label>");
            }
        });

        choiceContainer.find("input").click(plotAccordingToChoices);

        function plotAccordingToChoices() {

            var data = [];

            choiceContainer.find("input:checked").each(function() {
                var key = $(this).attr("name");
                if (key && datasets[key]) {
                    data.push(datasets[key]);
                }
            });
            var plot = $.plot("#sensor-values-time-graph", data, {
                grid: {
                    hoverable: true,
                    clickable: true
                },
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                yaxis: {
                    min: 0
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%m/%d/%y",
                    tickSize: [24, "hour"],
                    tickFormatter: function(val, axis) {
                        var date = (new Date((val)).getMonth() + 1) + "/" + (new Date(val)).getDate() + "/" + (new Date(val)).getUTCFullYear();
                        return date;
                    }
                }
            });
        

            if (data.length > 0) {
                var overview = $.plot("#sensor-values-time-overview", data, {
                    series: {
                        lines: {
                            show: true,
                            lineWidth: 1
                        },
                        shadowSize: 0
                    },
                    xaxis: {
                        ticks: [],
                        mode: "time"
                    },
                    yaxis: {
                        ticks: [],
                        min: 0,
                        autoscaleMargin: 0.1
                    },
                    selection: {
                        mode: "x"
                    },
                    legend: {
                        show: false
                    }
                });
            }

            $("#sensor-values-time-graph").bind("plotselected", function(event, ranges) {

                $.each(plot.getXAxes(), function(_, axis) {
                    var opts = axis.options;
                    opts.min = ranges.xaxis.from;
                    opts.max = ranges.xaxis.to;
                });
                plot.setupGrid();
                plot.draw();
                plot.clearSelection();

                overview.setSelection(ranges, true);
            });

            $("#sensor-values-time-overview").bind("plotselected", function(event, ranges) {
                plot.setSelection(ranges);
            });

            $("<div id='tooltip'></div>").css({
                position: "absolute",
                display: "none",
                border: "1px solid #fdd",
                padding: "2px",
                "background-color": "#fee",
                opacity: 0.80
            }).appendTo("body");

            $("#sensor-values-time-graph").bind("plothover", function(event, pos, item) {

                if (true) {
                    if (item) {
                        var x = item.datapoint[0],
                            y = item.datapoint[1].toFixed(2);

                        $("#tooltip").html(item.series.label + " on " + (new Date(x).getMonth() + 1) + "/" + (new Date(x)).getDate() + "/" + (new Date(x)).getUTCFullYear() + " was $" + y)
                            .css({ top: item.pageY + 5, left: item.pageX + 5 })
                            .fadeIn(200);
                    } else {
                        $("#tooltip").hide();
                    }
                }
            });

            $("#sensor-values-time-graph").bind("plotclick", function(event, pos, item) {
                if (item) {
                    $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
                    plot.highlight(item.series, item.datapoint);
                }
            });
        }

        plotAccordingToChoices();
    });
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};