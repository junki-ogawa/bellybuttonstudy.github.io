

async function init() {
    const response = await fetch ("./samples.json");
    data = await response.json();
    console.log(data)

    var samples= data.samples
    metadata= data.metadata
    names= data.names

/////////DROPDOWN///////////////////
    var dropdown=document.getElementById("selDataset");

    for(var id = 0; id < names.length; id++) {
        var id_demo=names[id];
        var info= document.createElement("option");
        info.textContent=id_demo;
        info.value=id_demo;
        dropdown.appendChild(info);
    }

    var firstid= data.names[0]
    var resultArray = metadata.filter(sampleObj => sampleObj.id == firstid);
    var result= resultArray[0]

    var panel=document.getElementById("sample-metadata")
    panel.innerHTML=""
  
    for(const [key, value] of Object.entries(result)){
        var h6 = document.createElement("h6");
        panel.append(h6,`${key.toUpperCase()}: ${value}`);
    };
  
//////////////BAR//////////////////

    var otulabels = samples[0].otu_ids.map(d => `OTU ${d}`)
    .slice(0,10)
    .reverse();

    var sample_val= samples[0].sample_values
    .sort((a,b) => b - a)
    .slice(0,10)
    .reverse();

    var hovertext= samples[0].otu_labels
    .slice(0,10)
    .reverse();

    var bar_trace= {
        text: hovertext,
        orientation: 'h',
        type: 'bar',
        y: otulabels,
        x: sample_val
    }

    var bardata= [bar_trace]

    var layout = {
        yaxis: {
          autorange: true,
        },
        xaxis: {
          autorange: true,
        },
    };

    Plotly.newPlot("bar", bardata, layout);


/////////////////BUBBLE///////////
    var bubble_id = samples[0].otu_ids
    var sample_val= samples[0].sample_values
    var bublabels= samples[0].otu_labels
    
    var bubbletrace = {
        x: bubble_id,
        y: sample_val,
        text: bublabels,
        mode: 'markers',
        marker: {
            size: sample_val,
            color: bubble_id,
            colorscale: "Earth",
    }};
    
      
    var bublayout =  {
        xaxis: {
        title: 'OTU ID',
        },
        width: 1200,
        height: 600
    };
        
    var bubdata= [bubbletrace];
}

function createmetadata(id){

    metadata= data.metadata

    var resultArray = metadata.filter(sampleObj => sampleObj.id == id);
    var result= resultArray[0]

    var panel=document.getElementById("sample-metadata")
    panel.innerHTML=""

    for(const [key, value] of Object.entries(result)){
      var h6 = document.createElement("h6");
      panel.append(h6,`${key.toUpperCase()}: ${value}`);
}};

async function optionChanged(){
    var sel = document.getElementById('selDataset');
    var value = sel.options[sel.selectedIndex].value;
    console.log(value); 
    createmetadata(value);
    createplots(value);
}

function createplots(id){

    samples= data.samples
  
////match to sample////
    var chosensamplefilter= samples.filter(sampleObj => sampleObj.id == id);

    var matchsample = chosensamplefilter[0];

    //top10//
    var otulabels = matchsample.otu_ids.map(d => `OTU ${d}`)
    .slice(0,10)
    .reverse();

    var sample_val= matchsample.sample_values
    .sort((a,b) => b - a)
    .slice(0,10)
    .reverse();

    var hovertext= matchsample.otu_labels
    .slice(0,10)
    .reverse();  

    var bar_trace= {
      text: hovertext,
      orientation: 'h',
      type: 'bar',
      y: otulabels,
      x: sample_val
  }

    var bardata= [bar_trace]
    
    var layout = {
        yaxis: {
          autorange: true,
        },
        xaxis: {
          autorange: true,
        },
    };

    Plotly.newPlot("bar", bardata, layout);

    var bubble_id = matchsample.otu_ids;
    console.log(bubble_id)
    
    var bubblevalues= matchsample.sample_values;
    
    var bublabels= matchsample.otu_labels;
    
    var bubbletrace = {
      y: bubblevalues,
      x: bubble_id,
      text: bublabels,
      mode: 'markers',
      marker: {
          size: bubblevalues,
          color: bubble_id,
          colorscale: "Earth"
      }};
      
      var bublayout =  {
          xaxis: {
          title: 'OTU ID',
          },
          width: 1200,
          height: 600
      };
        
      var bubdata= [bubbletrace];

      Plotly.newPlot("bubble", bubdata, bublayout);
}
init()