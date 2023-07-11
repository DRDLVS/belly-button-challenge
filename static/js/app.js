let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Read the data 
d3.json(url).then(data => {
    console.log(data);
});

// Initializing the dashboard 
function init() {

    // Select dropdown menu using D3
    let dropdownMenu = d3.select("#selDataset");

    // Load sample names and populate the dropdown selector
    d3.json(url).then((data) => {
        
        // Extract the sample names from the data
        let names = data.names;

        // Add samples to the dropdown menu
        names.forEach((id) => {

            // Log the value of each sample name
            console.log(id);

            // Append an option element to the dropdown menu
            dropdownMenu.append("option")
                .text(id)
                .property("value", id);
        });

        // Set the first sample as the default selection
        let sample_one = names[0];

        // Log the value of the default sample
        console.log(sample_one);

        // Build the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);
    });
};

// Function that populates metadata information
function buildMetadata(sample) {

    // Retrieve the data using D3
    d3.json(url).then((data) => {

        // Extract the metadata from the data
        let metadata = data.metadata;

        // Filter the metadata based on the sample value
        let value = metadata.filter(result => result.id == sample);

        // Log the filtered metadata array
        console.log(value);

        // Get the first object from the filtered array
        let valueData = value[0];

        // Clear the existing metadata
        d3.select("#sample-metadata").html("");

        // loop through the key-value pairs of the metadata object
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key-value pairs as they are appende to the metadata panel
            console.log(key, value);

            // Append an h5 element for each key-value pair
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Creating function that builds the bar chart
function buildBarChart(sample) {

    // Retrieve the data using D3
    d3.json(url).then((data) => {

        // Extract the sample data from the data
        let sampleInfo = data.samples;

        // Filter the sample data based on the sample value
        let value = sampleInfo.filter(result => result.id == sample);

        // Retrieve the first object from the filtered array
        let valueData = value[0];

        // Extract the required data fields from the object
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data fields to the console
        console.log(otu_ids, otu_labels, sample_values);

        // Select the top ten items to display in descending order using "reverse"
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0, 10).reverse();
        let labels = otu_labels.slice(0, 10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };


        // Creating bar chart
        Plotly.newPlot("bar", [trace]);
    });
};

// Creating function that builds the bubble chart
function buildBubbleChart(sample) {

    // Retrieve the data using D3
    d3.json(url).then((data) => {

        // Extract the sample data from the data
        let sampleInfo = data.samples;

        // Filter the sample data based on the sample value
        let value = sampleInfo.filter(result => result.id == sample);

        // Retrieve the first object from the filtered array
        let valueData = value[0];

        // Extract the required data fields from the object
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data fields to the console
        console.log(otu_ids, otu_labels, sample_values);
        
        // Set up the trace for the bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
        };

        // Creating bubble chart 
        Plotly.newPlot("bubble", [trace1]);
    });
};

// Function that updates the dashboard when the sample is changed
function optionChanged(value) { 

    // Log the new sample value
    console.log(value); 

    // Functions to update dashboard
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// Call the init function
init();
