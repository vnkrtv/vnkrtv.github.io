am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("chartdiv", am4plugins_wordCloud.WordCloud);
    chart.fontFamily = "Courier New";
    let series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
    series.randomness = 0.1;
    series.rotationThreshold = 0.5;
    series.data = tags;
    series.dataFields.word = "tag";
    series.dataFields.value = "count";

    series.heatRules.push({
        "target": series.labels.template,
        "property": "fill",
        "min": am4core.color("#0000CC"),
        "max": am4core.color("#CC00CC"),
        "dataField": "value"
    });

    series.labels.template.url = "https://stackoverflow.com/questions/tagged/{word}";
    series.labels.template.urlTarget = "_blank";
    series.labels.template.tooltipText = "{word}: {value}";

    let hoverState = series.labels.template.states.create("hover");
    hoverState.properties.fill = am4core.color("#FF0000");

    let subtitle = chart.titles.create();
    subtitle.text = "(click to open)";

    let title = chart.titles.create();
    title.text = "Most Popular Tags @ StackOverflow";
    title.fontSize = 20;
    title.fontWeight = "800";
});