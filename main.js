am5.ready(function() {


    var root = am5.Root.new("chartdiv");
    
    
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create wrapper container
    var container = root.container.children.push(am5.Container.new(root, {
      width: am5.percent(100),
      height: am5.percent(100),
      layout: root.verticalLayout
    }));
    
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/hierarchy/#Adding
    var series = container.children.push(am5hierarchy.ForceDirected.new(root, {
      singleBranchOnly: false,
      downDepth: 1,
      initialDepth: 2,
      valueField: "value",
      categoryField: "name",
      childDataField: "children",
      centerStrength: 0.5
    }));
    
    
    // Generate and set data
    // https://www.amcharts.com/docs/v5/charts/hierarchy/#Setting_data
    var maxLevels = 2;
    var maxNodes = 5;
    var maxValue = 100;
    
    var data = {
      name: "Root",
      children: []
    }
    
    importLocalJson("nodeFile.json");
    series.data.setAll([data]);
    series.set("selectedDataItem", series.dataItems[0]);
    
    function importLocalJson(file) {

    }
    
    
    // Make stuff animate on load
    series.appear(1000, 100);
    
    }); // end am5.ready()